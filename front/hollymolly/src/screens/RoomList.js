import React, { useState, useEffect, useRef } from 'react';
import Room from '../components/Room';
import RoomSearchBar from '../components/RoomSearchBar';
import RoomGrid from '../components/RoomGrid';
import axios from 'axios';
import styled from 'styled-components';
import Filter from '../components/Filter';
import ModalBase from '../components/ModalBase';
import Header from '../components/Header.js';
import { useHistory } from 'react-router';

import api from '../api/api';

// import Child from '../components/Child';
import RefreshVerification from '../server/RefreshVerification';

// 이미지
import leftArrowBtn from '../assets/leftArrowBtn.png';
import rightArrowBtn from '../assets/rightArrowBtn.png';

// 리덕스 & 로딩
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';

let total_room_cnt = 0; // 룸 리스트 총 방의 갯수

//RefreshVerification.verification();

const RoomList = (props) => {

    const history = useHistory();

    // 리덕스에 저장된 값
    const baseURL = useSelector((state) => state.socket.base_url);

    const [emptyRoomsLength, setEmptyRoomsLength] = useState('');
    const [createRoomData, setCreateRoomData] = useState('');
    
    let roomData = {
        type: '',
        data: ''
    }

    const [changeRoomData, setChangeRoomData] = useState([roomData]);
    const [isSocket, setIsSocket] = useState(false);

    // 현재 슬라이드 개수
    const [currentSlide, setCurrentSlide] = useState(0);
    // 전체 슬라이드 개수 
    const [totalSlide, setTotalSlide] = useState(0);
    // API 요청 시 받은 슬라이드 개수
    const TOTAL_SLIDES = useRef(0);

    // 방 전체 리스트
    const [rooms, setRooms] = useState(null);
    // Filter 선택값 결과 배열 list
    const [result, setResult] = useState([]);

    const getResult = (result) => {
        setResult(result);
    };

    const resultArray = result.sort();

    //토큰 검사
    let verify = RefreshVerification.verification()
    //console.log('토큰 유효한지 검사 t/f 값 : ' + verify);
    let data, save_token;

    if (verify === true) {
        data = sessionStorage.getItem('token');
        save_token = JSON.parse(data) && JSON.parse(data).access_token;
    }

    useEffect(() => {
        // 룸 리스트 조회
        roomListCheck();
    }, [currentSlide, resultArray]);

    useEffect(() => {
        props.socket.on('connect', () => {
            //console.log("room list");
        });

        //방 생성 시, 마지막 페이지에 방 추가
        props.socket.on('create room', (data) => {
           // console.log('create room');

            let socketRoomData = {
                type: 'create_room',
                data: data
            }

            setChangeRoomData(socketRoomData);
            setIsSocket(!isSocket);

            //setCreateRoomData(data);
        });

        // 방 삭제 - 대기방 삭제
        props.socket.on('delete room', (data) => {
           // console.log('delete room');

            let socketRoomData = {
                type: 'delete_room',
                data: data
            }

            setChangeRoomData(socketRoomData);
            setIsSocket(!isSocket);
        });

        //방 정보 수정  - 특정 대기방에서 대기방 정보 수정 시
        props.socket.on('edit room', (data) => {
          //  console.log('edit room');

            let socketRoomData = {
                type: 'edit_room',
                data: data
            }

            setChangeRoomData(socketRoomData);
            setIsSocket(!isSocket);
        });

        // 방 멤버 변동 - 특정 대기방 사용자 입장/퇴장 시
        props.socket.on('change member count', (data) => {
           // console.log('change member count');

            let socketRoomData = {
                type: 'change_member_count',
                data: data
            }

            setChangeRoomData(socketRoomData);
            setIsSocket(!isSocket);
        });

        //방 상태 변동 - 특정 대기방 게임이 시작할 때
        props.socket.on('change game status', (data) => {
           // console.log('change game status');

            let socketRoomData = {
                type: 'change_game_status',
                data: data
            }

            setChangeRoomData(socketRoomData);
            setIsSocket(!isSocket);
        });
    }, []);

    // 다음 페이지 이동
    const nextPage = () => {
        if (currentSlide >= totalSlide) {
            // 더 이상 넘어갈 슬라이드가 없으면 슬라이드를 초기화합니다.
            setCurrentSlide(0);
        } else {
            setCurrentSlide(currentSlide + 1);
        }
    };

    // 이전 페이지 이동
    const prevPage = () => {
        if (currentSlide === 0) {
            setCurrentSlide(totalSlide);
        } else {
            setCurrentSlide(currentSlide - 1);
        }
    };

    // 페이지별 룸 리스트 조회
    const roomListCheckPage = async (currentPage) => {
        currentPage = currentSlide + 1;
        var restURL = baseURL + 'room?page=' + currentPage;
        restURL = filterUrl(restURL, resultArray);

        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };

        axios
            .get(restURL, reqHeaders)
            .then(function (response) {
              //  console.log(response.data);
                total_room_cnt = response.data.total_room_cnt;
                if (total_room_cnt % 6 === 0) {
                    TOTAL_SLIDES.current = total_room_cnt / 6 - 1;
                    setTotalSlide(TOTAL_SLIDES.current);
                } else {
                    TOTAL_SLIDES.current = Math.floor(total_room_cnt / 6);
                    setTotalSlide(TOTAL_SLIDES.current);
                }
                setRooms(response.data.room_list);
                setEmptyRoomsLength(6 - response.data.room_list.length); // empty room list length
            })
            .catch(function (error) {
                //alert(error.response.data.message);
            });
    };

    const roomListCheck = async () => {
        const currentPage = currentSlide + 1;

        var restURL = '/room?page=' + currentPage;

        restURL = filterUrl(restURL, resultArray);

        const res = await api.getRoomList(restURL);

        total_room_cnt = res.total_room_cnt;
        if (total_room_cnt % 6 === 0) {
            TOTAL_SLIDES.current = total_room_cnt / 6 - 1;
            setTotalSlide(TOTAL_SLIDES.current);
        } else {
            TOTAL_SLIDES.current = Math.floor(total_room_cnt / 6);
            setTotalSlide(TOTAL_SLIDES.current);
        }

        if(res.room_list !== undefined)
            setRooms(res.room_list);

        let room_len = 0;
        
        if(res.room_list.length === undefined)
            room_len = 0;
        else
            room_len = res.room_list.length;

        setEmptyRoomsLength(6 - room_len); // empty room list length
    }; 

    useEffect(() => {   
        // 룸 리스트 조회
        roomListCheck();
    }, [currentSlide, resultArray]);

    // 방 생성, 삭제, 정보 수정, 멤버 변동, 상태 변동 시 사용자에게 보이는 방 정보 수정
    if (isSocket === true) {
        if(changeRoomData.type === 'create_room'){
            // 마지막 페이지 및 6개 미만이면 현재 페이지 다시 조회
            if(currentSlide === totalSlide && rooms.length !== 6){ 
                roomListCheckPage(currentSlide);
            }else{ // 마지막 페이지 아니면 전체 페이지 1개 추가(현재 페이지 + 1) 및 현재 페이지 조회
                setTotalSlide(currentSlide+1);
                roomListCheckPage(currentSlide);
            } 
        }else if(changeRoomData.type === 'delete_room'){
            let changeRooms = rooms.filter(x => x.room_idx !== parseInt(changeRoomData.data.room_idx));

            // 현재 페이지에 삭제할 방 있다면 삭제 후 다시 조회 
            if(changeRooms){
                setRooms(changeRooms);
                roomListCheckPage(currentSlide);
            }else{ // 현재 페이지 아니라면 총 갯수에서 하나 삭제 후 전체 슬라이드 갯수 다시 계산
                total_room_cnt -= 1;
                if (total_room_cnt % 6 === 0) {
                    TOTAL_SLIDES.current = total_room_cnt / 6 - 1;
                    setTotalSlide(TOTAL_SLIDES.current);
                } else {
                    TOTAL_SLIDES.current = Math.floor(total_room_cnt / 6);
                    setTotalSlide(TOTAL_SLIDES.current);
                }
                setTotalSlide(TOTAL_SLIDES.current)
            }
        }else if(changeRoomData.type === 'edit_room'){
            // 현재 페이지에 방 정보가 수정된 방 있다면 수정
            for(let i = 0; i < rooms.length; i++){
                if(rooms[i].room_idx === parseInt(changeRoomData.data.room_idx)){
                    rooms[i].room_name = changeRoomData.data.room_name
                    rooms[i].room_mode = changeRoomData.data.room_mode;
                    rooms[i].room_start_member_cnt = changeRoomData.data.room_start_member_cnt;
                }
            }
        }else if(changeRoomData.type === 'change_member_count'){
            // 현재 페이지에 멤버 변동이 있는 방 있다면 수정
            for(let i = 0; i < rooms.length; i++){
                if(rooms[i].room_idx === parseInt(changeRoomData.data.room_idx)){
                    rooms[i].room_current_member_cnt = changeRoomData.data.room_member_count
                }
            }
        }else if(changeRoomData.type === 'change_game_status'){
            // 현재 페이지에 방 상태가 수정된 방 있다면 수정
            for(let i = 0; i < rooms.length; i++){
                if(rooms[i].room_idx === parseInt(changeRoomData.data.room_idx)){
                    rooms[i].room_status = changeRoomData.data.room_status
                }
            }
        }
        setIsSocket(false);
    }

    function filterUrl(exitedUrl, resultArray) {
        if (resultArray.includes(6)) {
            // 대기중
            exitedUrl += '&is_waiting=true';
        } else if (!resultArray.includes(6)) {
            // 게임중
            exitedUrl += '&is_waiting=false';
        }
        if (resultArray.includes(1)) {
            // 난이도 easy
            exitedUrl += '&room_mode=easy';
        }
        if (resultArray.includes(2)) {
            // 난이도 hard
            exitedUrl += '&room_mode=hard';
        }
        if (resultArray.includes(3)) {
            // 인원 4명
            exitedUrl += '&room_start_member_cnt=4';
        }
        if (resultArray.includes(4)) {
            // 인원 5명
            exitedUrl += '&room_start_member_cnt=5';
        }
        if (resultArray.includes(5)) {
            // 인원 6명
            exitedUrl += '&room_start_member_cnt=6';
        }
        return exitedUrl;
    }

    // 빈방 채우기
    function emptyRoomList() {
        if (emptyRoomsLength !== 6) {
            let forArray = [];
            for (let i = 0; i < emptyRoomsLength; i++) {
                forArray.push(<Room empty="true" />);
            }
            return forArray;
        } else {
            return <EmptyText>😲 방이 없습니다. 생성해보세요😲</EmptyText>;
        }
    }

    // 랜덤 입장을 위한 필터 리스트 - 모드
    function modeFilterList() {
        let modeFilterArray = [];
        let easy = resultArray.includes(1);
        let hard = resultArray.includes(2);

        if (easy) {
            modeFilterArray.push('easy');
        }

        if (hard) {
            modeFilterArray.push('hard');
        }

        return modeFilterArray;
    }

    // 랜덤 입장을 위한 필터 리스트 - 인원
    function personFilterList() {
        let personFilterArray = [];
        let fourPeople = resultArray.includes(3);
        let fivePeople = resultArray.includes(4);
        let sixPeople = resultArray.includes(5);

        if (fourPeople) {
            personFilterArray.push('4');
        }

        if (fivePeople) {
            personFilterArray.push('5');
        }

        if (sixPeople) {
            personFilterArray.push('6');
        }

        return personFilterArray;
    }

    const randomEntry = async () => {
        let modeFilterArray = modeFilterList();
        let personFilterArray = personFilterList();

       // console.log(modeFilterArray);
       // console.log(personFilterArray);
        const reqURL = baseURL + 'room/random'; //parameter : 방 타입
        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };

        axios
            .post(
                reqURL,
                {
                    room_mode: modeFilterArray,
                    room_start_member_cnt: personFilterArray,
                },
                reqHeaders
            )
            .then(function (response) {
              //  console.log(response.data);
                // 대기실로 이동
                history.push({
                    pathname: '/waitingroom/' + response.data.room_idx,
                });
            })
            .catch(function (error) {
                //alert(error.response.data.message);
            });
    };

    return (
        <React.Fragment>
            <Background>
                {props.socket ? (
                    <div>
                        <Header goMain tutorial />
                        <Container>
                            <RoomGrid flexDirection="column" padding="20px" width="1020px" height="620px" bg="#DAD4F6">
                                {/* 검색바 & 버튼 div*/}
                                <RoomGrid is_flex_space width="980px" height="110px" bg="#DAD4F6" border="1px solid #DAD4F6">
                                    <div style={styles.grid}>
                                        <RoomSearchBar socket={props.socket} />
                                    </div>
                                    <div
                                        style={{
                                            flexDirection: 'column',
                                            width: '220px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {/* 방만들기 모달 */}
                                        <ModalBase />
                                        <br />
                                        <Button onClick={randomEntry}>랜덤 입장</Button>
                                    </div>
                                </RoomGrid>

                                {/* 방 & 필터 div*/}
                                <RoomGrid is_flex_space width="980px" height="460px" bg="#DAD4F6" border="1px solid #DAD4F6">
                                    {/* 왼쪽 화살표 div*/}
                                    <PrevBtn onClick={prevPage} />
                                    {/* 방 리스트 슬라이더 div*/}
                                    <div style={styles.sliderContainer}>
                                        <div style={styles.roomListContainer}>
                                            {rooms &&
                                                rooms.map((values) => {
                                                    return values.room_status === 'waiting' ? (
                                                        <Room
                                                            socket={props.socket}
                                                            room_idx={values.room_idx}
                                                            room_name={values.room_name}
                                                            room_current_member={values.room_current_member_cnt}
                                                            room_start_member={values.room_start_member_cnt}
                                                            room_mode={values.room_mode}
                                                            room_status={values.room_status}
                                                            disabled="false"
                                                            textStroke="true"
                                                            cursor="true"
                                                        />
                                                    ) : (
                                                        <Room
                                                            socket={props.socket}
                                                            room_idx={values.room_idx}
                                                            room_name={values.room_name}
                                                            room_current_member={values.room_current_member_cnt}
                                                            room_start_member={values.room_start_member_cnt}
                                                            room_mode={values.room_mode}
                                                            room_status={values.room_status}
                                                            disabled="true"
                                                            textStroke="true"
                                                            cursor="false"
                                                        />
                                                    );
                                                })}
                                            {createRoomData && (
                                                <Room
                                                    socket={props.socket}
                                                    borderRadius
                                                    room_idx={createRoomData.room_idx}
                                                    room_name={createRoomData.room_name}
                                                    room_current_member={createRoomData.room_current_member_cnt}
                                                    room_start_member={createRoomData.room_start_member_cnt}
                                                    room_mode={createRoomData.room_mode}
                                                    room_status={createRoomData.room_status}
                                                    disabled="false"
                                                    textStroke="true"
                                                    cursor="true"
                                                />
                                            )}
                                            {emptyRoomList()}
                                        </div>
                                    </div>
                                    {/* 오른쪽 화살표 div*/}
                                    <NextBtn onClick={nextPage} />
                                    {/* 필터 div*/}
                                    <Filter result={result} getResult={getResult} />
                                </RoomGrid>
                                {
                                    totalSlide < 0 ?
                                     null
                                     :
                                     <div style={styles.pageContainer}>
                                         {currentSlide + 1} / {totalSlide + 1}
                                     </div>
                                }
                            </RoomGrid>
                        </Container>
                    </div>
                ) : (
                    <Loading />
                )}
            </Background>
        </React.Fragment>
    );
};

const Container = styled.div`
    width: 1020px;
    height: 620px;
    // border: 1px solid #000;
    background-color: red;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    border-bottom-left-radius: 1.5rem;
    border-bottom-right-radius: 1.5rem;
`;

const Background = styled.div`
    background-color: #180928;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;
const NextBtn = styled.div`
    width: 40px;
    height: 40px;
    background-size: contain;
    background-image: url(${rightArrowBtn});

    &:hover {
        cursor: grab;
    }
`;

const PrevBtn = styled.div`
    width: 40px;
    height: 40px;
    background-size: contain;
    background-image: url(${leftArrowBtn});

    &:hover {
        cursor: grab;
    }
`;

const Button = styled.button`
    background: white;
    color: palevioletred;
    width: 130px;
    height: 40px;
    font-size: 1em;
    font-weight: bolder;
    margin: 0px 0px 15px 0px;
    padding: 0.25px 1px;
    border: 2px solid palevioletred;
    border-radius: 15px;

    &:hover {
        background: palevioletred;
        color: white;
        border: white;
        cursor: grab;
    }
`;

const EmptyText = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flexdirection: column;
    width: 680px;
    height: 410px;
    font-size: 20px;
`;

export default RoomList;

const styles = {
    grid: {
        width: '220px',
        height: '110px',
        background: '#DAD4F6',
        marginLeft: '42px',
    },
    roomListContainer: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexDirection: 'column',
        width: '680px',
        height: '410px',
        flexFlow: 'row wrap',
    },
    sliderContainer: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexDirection: 'column',
        width: '680px',
        height: '410px',
        overflow: 'hidden',
    },
    pageContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '770px',
        height: '15px',
        color: '#ffffff',
        fontSize: '20px',
    },
};