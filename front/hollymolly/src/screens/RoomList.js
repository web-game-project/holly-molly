import React, { useState, useEffect, useRef } from 'react';
import Room from '../components/Room';
import RoomSearchBar from '../components/RoomSearchBar';
import RoomGrid from '../components/RoomGrid';
import axios from 'axios';
import styled from 'styled-components';
import Filter from '../components/Filter';
import ModalBase from '../components/ModalBase';
// import Child from '../components/Child';

// 이미지
import leftArrowBtn from '../assets/leftArrowBtn.png';
import rightArrowBtn from '../assets/rightArrowBtn.png';

// 소켓
import { io } from 'socket.io-client';

let total_room_cnt = 0;

// 연결 실패 시,
const socket = io('http://3.17.55.178:3002/', {
    // 프론트가 서버와 동일한 도메인에서 제공되지 않는 경우 서버의 URL 전달 필요
    auth: {
        // 1번 토큰
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6MSwidXNlcl9uYW1lIjoi7YWM7Iqk7Yq4IiwiaWF0IjoxNjMyODMzMDE3fQ.a_6lMSENV4ss6bKvPw9QvydhyIBdr07GsZhFCW-JdrY',
    },
});

const RoomList = () => {
    const [emptyRoomsLength, setEmptyRoomsLength] = useState('');

    // 방 전체 리스트
    const [rooms, setRooms] = useState();
    // Filter 선택값 결과 배열 list
    const [result, setResult] = useState([]);

    const getResult = (result) => {
        setResult(result);
    };

    const resultArray = result.sort();

    useEffect(() => {
        socket.on('error', () => {
            setTimeout(() => {
                socket.connect();
                console.log(socket);
            }, 1000);
        });

        // 연결 해제 시 임의 지연 기다린 다음 다시 연결 시도
        socket.on('disconnect', (reason) => {
            if (reason === 'io server disconnect') {
                // the disconnection was initiated by the server, you need to reconnect manually
                socket.connect();
            }
            // else the socket will automatically try to reconnect
        });
        //}
    });

    // 페이지 슬라이드
    let TOTAL_SLIDES = Math.floor(total_room_cnt / 7); // 한 페이지 당 6개 방을 가지고 있으므로, 즉, 전체 페이지 개수 =  전체 방의 개수 / 6

    const [currentSlide, setCurrentSlide] = useState(0);

    // 다음 페이지 이동
    const nextPage = () => {
        if (currentSlide >= TOTAL_SLIDES) {
            // 더 이상 넘어갈 슬라이드가 없으면 슬라이드를 초기화합니다.
            setCurrentSlide(0);
        } else {
            setCurrentSlide(currentSlide + 1);
        }
    };

    // 이전 페이지 이동
    const prevPage = () => {
        if (currentSlide === 0) {
            setCurrentSlide(TOTAL_SLIDES);
        } else {
            setCurrentSlide(currentSlide - 1);
        }
    };

    // 방 리스트 조회 => get 방식으로 데이터 요청
    useEffect(() => {
        const roomListCheck = async () => {
            const currentPage = currentSlide + 1;
            var restURL = 'http://3.17.55.178:3002/room?page=' + currentPage;
            restURL = filterUrl(restURL, resultArray);

            const reqHeaders = {
                headers: {
                    //1번 토큰
                    authorization:
                        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6MSwidXNlcl9uYW1lIjoi7YWM7Iqk7Yq4IiwiaWF0IjoxNjMyODMzMDE3fQ.a_6lMSENV4ss6bKvPw9QvydhyIBdr07GsZhFCW-JdrY',
                },
            };

            axios
                .get(restURL, reqHeaders)
                .then(function (response) {
                    total_room_cnt = response.data.total_room_cnt;
                    setRooms(response.data);
                    setEmptyRoomsLength(6 - response.data.room_list.length); // empty room list length 
                })
                .catch(function (error) {
                    console.log(error.data);
                });
        };
        roomListCheck();
    }, [currentSlide, resultArray]);

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
          forArray.push(
            <Room
              empty = "true"
            />
          );
        }
        return forArray;
      } else {
        return <EmptyText>😲 해당 필터에 맞는 방이 없습니다.😲</EmptyText>;
      }
    }
    

    return (
        <React.Fragment>
            <RoomGrid flexDirection="column" padding="20px" width="1020px" height="620px" bg="#DAD4F6">
                {/* 검색바 & 버튼 div*/}
                <RoomGrid is_flex_space width="980px" height="110px" bg="#DAD4F6" border="1px solid #DAD4F6">
                    <div style={styles.grid}>
                        <RoomSearchBar />
                    </div>
                    {/* 버튼 div*/}
                    <div
                        style={{ flexDirection: 'column', width: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {/* 방만들기 모달 */}
                        <ModalBase />
                        <br />
                        <Button>랜덤 입장</Button>
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
                                rooms.room_list.map((values) => {
                                    return values.room_status == 'waiting' ? (
                                        <Room
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
                               {emptyRoomList()}
                        </div>
                    </div>
                    {/* 오른쪽 화살표 div*/}
                    <NextBtn onClick={nextPage} />
                    {/* 필터 div*/}
                    <Filter result={result} getResult={getResult} />
                </RoomGrid>
            </RoomGrid>
        </React.Fragment>
    );
};

const NextBtn = styled.div`
    width: 40px;
    height: 40px;
    background-size: contain;
    background-image: url(${rightArrowBtn});
`;

const PrevBtn = styled.div`
    width: 40px;
    height: 40px;
    background-size: contain;
    background-image: url(${leftArrowBtn});
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
    }
`;

const EmptyText = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flexDirection: column;
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
};
