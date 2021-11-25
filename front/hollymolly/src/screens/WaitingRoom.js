import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { io } from 'socket.io-client';
import style from '../styles/styles.js';
import exit from '../assets/exit.png';

import UserCard from '../components/UserCard';

import UserTable from '../components/UserTable.js';
import ModalSetting from '../components/ModalSetting.js';

import Chatting from '../components/Chatting.js';

//import { useLocation } from 'react-router';
import RefreshVerification from '../server/RefreshVerification.js';
import { useHistory, useLocation } from 'react-router';
import colors from '../styles/styles.js';

const BaseURL = 'http://3.17.55.178:3002';

//RefreshVerification.verification();

// local storage에 있는지 확인
let data = localStorage.getItem('token');
let save_token = JSON.parse(data) && JSON.parse(data).access_token;
let save_refresh_token = JSON.parse(data) && JSON.parse(data).refresh_token;
let save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;
let save_user_name = JSON.parse(data) && JSON.parse(data).user_name;

console.log('내 인덱스 : ' + save_user_idx);

// room_idx 변수
let room_idx = 0;

//1번 토큰 사용
const socket = io(BaseURL, {
    auth: {
        token: save_token,
    },
});

// 연결 성공 시 시작
socket.on('connect', () => {
    console.log('Waiting connection server -> gameStart');
});

console.log('렌더링완료');

//게임 시작 인원 세는 변수
let ready_cnt = 0;

// 색깔 배열, 중복 제거한 배열
let uniqueSelectColor = [{}];

const colorArr = [
    //칼라이름, 코드값 배열
    { color: 'RED', code: '#FF0000' },
    { color: 'ORANGE', code: '#FF5E00' },
    { color: 'YELLOW', code: '#FFE400' },
    { color: 'GREEN', code: '#1DDB16' },
    { color: 'BLUE', code: '#0B37D3' },
    { color: 'PURPLE', code: '#5F00FF' },
    { color: 'PINK', code: '#FF00DD' },
    { color: 'GRAY', code: '#8C8C8C' },
];

const selectColorArr = [
    //선택 할 수 있는지 여부 배열, true : 선택가능
    { color: 'RED', choose: 'true', code: '#FF0000' },
    { color: 'ORANGE', choose: 'true', code: '#FF5E00' },
    { color: 'YELLOW', choose: 'true', code: '#FFE400' },
    { color: 'GREEN', choose: 'true', code: '#1DDB16' },
    { color: 'BLUE', choose: 'true', code: '#0B37D3' },
    { color: 'PURPLE', choose: 'true', code: '#5F00FF' },
    { color: 'PINK', choose: 'true', code: '#FF00DD' },
];

export default function WaitingRoom({ match }) {
    let location = useLocation();
    const history = useHistory();

    const room_index = match.params.name; // url에 입력해준 방 인덱스
    console.log('방 번호는 ?' + room_index);
    const [roomEnterInfo, setRoomEnterInfo] = useState('');
    const [roomInfo, setRoomInfo] = useState('');
    const [count, setCount] = useState('');

    //사람이 색을 변경해서 클릭했을 때 소켓통신을 실행하기 위한 변수
    const [changeColor, setChangeColor] = React.useState(false);

    //무슨 색을 선택할 수 있는가
    const [selectColor, setSelectColor] = React.useState([]);

    //내 이전 색이 무엇인지, 서버에서 색깔 지정해준 색도 이 변수에 넣기
    const [previousColor, setPreviousColor] = React.useState('');

    //팀원 레디 상태 state
    const [changeReady, setChangeReady] = React.useState(false);

    //방장인가 state
    const [isLeader, setIsLeader] = React.useState(0);

    //방장 상태 state 이 변수가 소켓에서 누적된 카운트 값과 동일해야함.
    const [startMember, setStartMember] = React.useState(0);

    const [gameStart, setGameStart] = React.useState(false);

    //방 정보 수정 useState
    const [roomUpdate, setRoomUpdate] = useState();

    useEffect(() => {
        //게임 시작 정보 socket
        socket.on('start game', (data) => {
            alert('게임 스타트, 게임 시작 인덱스 ' + data.game_idx);

            //플레잉룸으로 이동, 데이터 전달
            history.push({
                pathname: '/playingroom/' + room_idx,
                state: { data: data },
            });
        });
    }, [gameStart]);

    useEffect(() => {
        //사용자의 준비 상태 값 변경에 따른 소켓
        socket.on('change member ready', (data) => {
            alert('지금 ready 값이야 : ' + ready_cnt);

            if (data.user_idx != save_user_idx) {
                if (data.user_ready === true) {
                    ready_cnt += 1;
                    alert('ready 증가, ready 현재값 : ' + ready_cnt);
                } else {
                    if (ready_cnt != 0) ready_cnt -= 1;
                    alert('ready 감소, ready 현재값 : ' + ready_cnt);
                }
            }
            alert('socket user_idx : ' + data.user_idx + ' user_ready : ' + data.user_ready);
        });
    }, [changeReady]);

    useEffect(() => {
        //색깔 변경 시 소켓으로 response 받고 회색박스 처리해주는 부분
        socket.on('change member color', (data) => {
            alert('socket-> index: ' + data.user_idx + ' color: ' + data.user_color);

            const changeUserIdx = data.user_idx;
            const changeUserColor = data.user_color;

            console.log('change 유저 인덱스 : ' + changeUserIdx);

            let middleSocketArr = [{}];

            //if (changeUserIdx != save_user_idx) {
            uniqueSelectColor.forEach((element) => {
                if (element.color === changeUserColor) {
                    console.log('변경된 false : ' + JSON.stringify(element.color));
                    element.choose = 'false';
                    middleSocketArr.push(element);
                }
            });

            console.log('middle socket arr: ' + JSON.stringify(middleSocketArr));
            console.log('unique socket arr 합치기 전: ' + JSON.stringify(uniqueSelectColor));

            uniqueSelectColor = uniqueSelectColor.concat(middleSocketArr);
            uniqueSelectColor = uniqueSelectColor.filter((item, pos) => selectColorArr.indexOf(item) == pos);

            console.log('unique socket arr 합치기 전: ' + JSON.stringify(uniqueSelectColor));
        });
    }, [changeColor]);

    useEffect(() => {
        //방 정보 수정 소켓

        socket.on('edit room', (data) => {
            console.log('수정) 방정보! : ' + data.room_idx + data.room_name + data.room_mode + data.room_start_member_cnt);
            setRoomUpdate(data);
        });
    }, []);

    function readyClick(readyStatus) {
        if (readyStatus === true) ready_cnt += 1;
        else {
            if (ready_cnt != 0) ready_cnt -= 1;
        }
        setChangeReady(readyStatus);

        console.log('클릭 시 레디 값 : ' + ready_cnt + '정원 : ' + startMember);

        const restURL = BaseURL + '/waiting-room/user-ready	';

        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };

        axios
            .patch(
                restURL,
                {
                    room_idx: room_idx, //룸 인덱스 넘버여야함.
                    user_ready: readyStatus,
                },
                reqHeaders
            )
            .then(function (response) {
                alert('rest Start ' + readyStatus);
            })
            .catch(function (error) {
                alert('error Start' + error.message);
            });
    }

    function startClick() {
        alert('click start btn!');

        const restURL = BaseURL + '/game/start';

        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };

        axios
            .post(
                restURL,
                {
                    room_idx: room_idx,
                },
                reqHeaders
            )
            .then(function (response) {
                //response로 jwt token 반환
                alert('success! 게임시작');
                //플레잉룸으로 이동 동시에, 게임시장 정보 call 데이터 함께 전달
                setGameStart(true);
            })
            .catch(function (error) {
                alert(error);
            });
    }

    function colorClick(str) {
        alert('click: ' + str);
        setPreviousColor(str);

        let middleSocketArr = [{}];

        selectColorArr.forEach((element) => {
            if (element.color === previousColor) {
                console.log('이전 색깔 : ' + JSON.stringify(element.color));
                element.choose = 'true';
                middleSocketArr.push(element);
            }

            if (element.color === str) {
                console.log('바꾼 색깔 : ' + JSON.stringify(element.color));
                element.choose = 'false';
                middleSocketArr.push(element);
            }
        });

        console.log('middle click arr: ' + JSON.stringify(middleSocketArr));
        console.log('select click arr: ' + JSON.stringify(selectColorArr));

        uniqueSelectColor = selectColorArr.concat(middleSocketArr);
        uniqueSelectColor = uniqueSelectColor.filter((item, pos) => selectColorArr.indexOf(item) == pos);

        console.log('unique click arr: ' + JSON.stringify(uniqueSelectColor));

        setSelectColor(str);

        const restURL = BaseURL + '/waiting-room/user-color';

        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };

        axios
            .patch(
                restURL,
                {
                    room_idx: room_idx, //룸 인덱스 변수로 들어가야함.
                    user_color: str, //클릭했을 때 해당 색
                },
                reqHeaders
            )
            .then(function (response) {
                alert('rest ' + response.data);
                //setChangeColor(!changeColor); //색이 바꼈다는 상태값 변경
            })
            .catch(function (error) {
                alert('error ' + error.message);
            });

        setChangeColor(!changeColor); //색이 바꼈다는 상태값 변경
    }

    const getRoomInfo = async () => {
        // 대기실 정보 조회 api
        const restURL = 'http://3.17.55.178:3002/room/info/' + location.state.data.room_idx;

        const reqHeaders = {
            headers: {
                //1번 토큰 이용
                authorization: 'Bearer ' + save_token,
            },
        };
        axios
            .get(restURL, reqHeaders)
            .then(function (response) {
                setRoomInfo(response.data);
                console.log('response.data.room_start_member_cnt');
                console.log(response.data.room_idx);
                setCount(response.data.room_start_member_cnt);
                console.log('getRoomInfo 성공');
            })
            .catch(function (error) {
                console.log('getRoomInfo 실패');
                console.log(error.response);
            });
    };

    const exitWaitingRoom = async () => {
        // 대기실 정보 조회 api
        const restURL = BaseURL + '/waiting-room/exit/' + location.state.data.room_idx;

        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };
        axios
            .delete(restURL, reqHeaders)
            .then(function (response) {
                console.log(response.status);
                console.log('exitWaitingRoom 성공');
                history.push({
                    pathname: '/roomlist', // 나가기 성공하면 룸리스트로 이동
                });
            })
            .catch(function (error) {
                console.log('exitWaitingRoom 실패');
                console.log(error.response);
            });
    };

    useEffect(() => {
        setRoomEnterInfo(location.state.data);

        //room index 설정
        room_idx = location.state.data.room_idx; //이렇게 받아오면 number타입으로 api, 소켓 에러 X\

        //방장 인덱스 받아오기, save_user_idx 이게 내 인덱스 저장된 변수
        //받아와서 리더인지 아닌지 state 설정
        if (location.state.data.leader_idx === save_user_idx) {
            setIsLeader(1); //리더다
        }

        //userlist로 사용자들이 무슨 색을 할당 받았는지 저장하는 배열
        const user_list = location.state.data.waiting_room_member_list;

        const middleSelectArr = [{}];

        for (let i = 0; i < user_list.length; i++) {
            console.log(
                'user color랑 인덱스랑 레디값 : ' + user_list[i].wrm_user_color + user_list[i].user_idx + ' ' + user_list[i].wrm_user_ready
            );

            const currentColor = user_list[i].wrm_user_color;

            selectColorArr.forEach((element) => {
                if (element.color === currentColor) {
                    console.log('변경된 false : ' + JSON.stringify(element.color));
                    element.choose = 'false';
                    middleSelectArr.push(element);
                    if (user_list[i].wrm_user_ready === true) {
                        ready_cnt += 1;
                        console.log('세팅 레디 값 : ' + ready_cnt);
                    }

                    if (save_user_idx == user_list[i].user_idx) {
                        //선택된 값과 이전색으로 세팅
                        setSelectColor(element.color);
                        setPreviousColor(element.color);
                        //내 준비 상태
                        setChangeReady(user_list[i].wrm_user_ready);
                    }
                }
            });
        }

        uniqueSelectColor = selectColorArr.concat(middleSelectArr);
        uniqueSelectColor = uniqueSelectColor.filter((item, pos) => selectColorArr.indexOf(item) == pos);

        //게임 시작 인원 받아오기
        setStartMember(location.state.data.room_start_member_cnt - 1);

        setTimeout(() => getRoomInfo(), 1000); //방 정보 조회 api + 모달창에 뿌리기용
    }, []);

    return (
        <Background>
            <Container>
                {console.log('방장 인덱스 맞지? : ' + isLeader)}
                <SelectDiv>
                    selectDiv
                    <br />
                    {roomUpdate ? (
                        <TitleDiv>
                            TitleDiv {roomUpdate.room_idx}번 방
                            <br />
                            <Text>
                                방제 : {roomUpdate.room_name} | 방 코드 : {roomEnterInfo.room_code} | 인원:{' '}
                                {roomEnterInfo.room_current_member_cnt} / {roomUpdate.room_start_member_cnt} 명
                            </Text>
                            <br />
                            {isLeader === 1 && (
                                <ModalSetting
                                    title={roomUpdate.room_name}
                                    mode={roomUpdate.room_mode}
                                    member={roomUpdate.room_start_member_cnt}
                                    room_private={roomInfo.room_private}
                                    room_idx={roomUpdate.room_idx}
                                />
                            )}
                        </TitleDiv>
                    ) : (
                        <TitleDiv>
                            TitleDiv {match.params.name}번 방
                            <br />
                            <Text>
                                방제 : {roomEnterInfo.room_name} | 방 코드 : {roomEnterInfo.room_code} | 인원:{' '}
                                {roomEnterInfo.room_current_member_cnt} / {roomEnterInfo.room_start_member_cnt} 명
                            </Text>
                            {isLeader === 1 && (
                                <ModalSetting
                                    title={roomInfo.room_name}
                                    mode={roomInfo.room_mode}
                                    member={count}
                                    room_private={roomInfo.room_private}
                                    room_idx={roomInfo.room_idx}
                                />
                            )}
                        </TitleDiv>
                    )}
                    <BarDiv>
                        <BarInnerDiv>
                            {uniqueSelectColor.map(
                                (index, key) => (
                                    console.log('index 값 ' + uniqueSelectColor[key].code),
                                    console.log('예 : ' + index.choose),
                                    console.log('노 : ' + uniqueSelectColor[key].code),
                                    console.log('셀렉트칼라값: ' + selectColor + ', 인덱스 칼라값 : ' + index.color),
                                    index.choose === 'true' ? (
                                        <BarColorBox
                                            data={uniqueSelectColor[key].code}
                                            color={uniqueSelectColor[key].code}
                                            onClick={() => {
                                                colorClick(index.color);
                                            }}
                                        />
                                    ) : selectColor === index.color ? (
                                        <BarColorBox color={uniqueSelectColor[key].code}>V</BarColorBox>
                                    ) : (
                                        <BarColorBox data={uniqueSelectColor[key].code} color="#8C8C8C" />
                                    )
                                )
                            )}
                        </BarInnerDiv>
                    </BarDiv>
                    <UserDiv>
                        <UserTable
                            style={{
                                display: 'inline-block',
                                alignSelf: 'center',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                            }}
                        />
                    </UserDiv>
                    <div
                        onClick={() => {
                            console.log('눌림');
                            exitWaitingRoom();
                        }}
                        style={{
                            width: '100px',
                            justifyContent: 'space-between',
                            // backgroundColor: colors.red,
                        }}
                    >
                        <Exit src={exit} />
                        <ExitText style={{ color: colors.black }}>나가기</ExitText>
                    </div>
                </SelectDiv>
                <RightDiv>
                    <Chatting room_idx={location.state.data.room_idx} height="560px" available={true}></Chatting>
                    <StartDiv>
                        {isLeader === 0 //방장 아님
                            ? (console.log(style.red),
                              changeReady === true ? (
                                  <BtnDiv
                                      color="green"
                                      onClick={() => {
                                          readyClick(!changeReady);
                                      }}
                                  >
                                      Waiting...
                                  </BtnDiv>
                              ) : (
                                  <BtnDiv
                                      onClick={() => {
                                          readyClick(!changeReady);
                                      }}
                                  >
                                      Game Ready
                                  </BtnDiv>
                              ))
                            : //방장이다.
                              (console.log('방장이야'),
                              startMember === ready_cnt ? (
                                  <BtnDiv isStart="yes" onClick={startClick}>
                                      Game Start
                                  </BtnDiv> //게임 시작 api 요청 onclick 달기
                              ) : (
                                  <BtnDiv isStart="no">Game Start</BtnDiv>
                              ))}
                    </StartDiv>
                </RightDiv>
            </Container>
        </Background>
    );
}

const Background = styled.div`
    background-color: #180928;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Container = styled.div`
    width: 1020px;
    height: 620px;
    // border: 1px solid #000;
    background-color: ${style.white};
    display: flex;
    flex-direction: row;
    overflow: hidden;
`;

const SelectDiv = styled.div`
    text-align: center;
    width: 800px;
    height: 620px;
    background-color: #ffe5e5;
    justify-content: center;
    align-items: center;
`;

const RightDiv = styled.div`
    width: 220px;
    height: 620px;
    overflow: hidden;
`;

const ChatDiv = styled.div`
    width: 220px;
    height: 560px;
    background-color: #ffe7a8;
    overflow: hidden;
`;

const StartDiv = styled.div`
    width: 220px;
    height: 60px;
    overflow: hidden;
`;

const BtnDiv = styled.div`
    width: 220px;
    height: 40px;
    margin-top: 10px;
    background-color: #ff0000;
    border-radius: 10px;
    box-shadow: 0px 3px 3px #878787;
    font-size: 25px;
    text-align: center;
    ${(props) => (props.color == 'green' ? `background-color: #44A024;` : ``)}
    ${(props) => (props.isStart == 'yes' ? `` : props.isStart == 'no' ? `opacity: 0.5;` : ``)}
`;
const TitleDiv = styled.div`
    width: 625px;
    height: 70px;
    margin-top: 25px;
    background-color: #ffffff;
    text-align: center;
    display: inline-block;
    overflow: hidden;
`;

const UserDiv = styled.div`
    width: 590px;
    height: 390px;
    margin-top: 10px;
    background-color: #fff3ca;
    display: inline-block;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    text-align: center;
`;

const BarDiv = styled.div`
    width: 450px;
    height: 35px;
    //background-color: #6880fb;
    display: inline-block;
    overflow: hidden;
`;

const BarInnerDiv = styled.div`
    width: 420px;
    height: 29px;
    background-size: contain;
    margin-left: 15px;
    margin-top: 3px;
    //border-width:1;
    //border-style: solid;
    display: flex;
    flex-direction: row;
    border-radius: 30px;
    box-shadow: 0px 4px 4px #878787;
`;

const BarColorBox = styled.div`
    width: 70px;
    height: 29px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 2px solid #000000;
    disabled: true;

    ${(props) =>
        props.color == '#FF0000' || props.data == '#FF0000'
            ? `background-color: ${props.color}; border-top-left-radius: 15px; border-bottom-left-radius: 15px;`
            : props.color == '#FF00DD' || props.data == '#FF00DD'
            ? `background-color: ${props.color}; border-right: 0px solid #000000; border-top-right-radius: 15px; border-bottom-right-radius: 15px;`
            : `background-color: ${props.color};`}
`;

const Text = styled.text`
    color: #c11b1b;
    font-size: 12px;
    font-weight: light;
    // -webkit-text-stroke: 1px #c00202;
    margin-top: -5px;
`;

const Exit = styled.img`
    // position: absolute;
    // z-index: 0; // 안되면 30으로 바꿔보기..
    width: 35px;
`;

const ExitText = styled.text`
    color: #c11b1b;
    font-size: 13px;
    font-weight: light;
    // -webkit-text-stroke: 1px #c00202;
    margin-top: -5px;

    &:hover {
        background-color: ${style.light_green};
        border: 1px solid ${style.white};
        color: ${style.red};
    }
`;
