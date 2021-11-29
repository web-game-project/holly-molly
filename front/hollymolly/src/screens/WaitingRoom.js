import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled from "styled-components";
import { io } from "socket.io-client";
import style from "../styles/styles.js";
import exit from "../assets/exit.png";

import UserCard from "../components/UserCard";

import ModalSetting from "../components/ModalSetting.js";

import Chatting from "../components/Chatting.js";

//import { useLocation } from 'react-router';
import RefreshVerification from "../server/RefreshVerification.js";
import { useHistory, useLocation } from "react-router";
import colors from "../styles/styles.js";
import InfoSetModal from "../components/InfoSetModal.js";
import InfoModal from "../components/InfoModal.js";
import Header from "../components/Header.js";

import Loading from "../components/Loading";

const BaseURL = "http://3.17.55.178:3002";

//RefreshVerification.verification();

// local storage에 있는지 확인
let data = localStorage.getItem("token");
let save_token = JSON.parse(data) && JSON.parse(data).access_token;
let save_refresh_token = JSON.parse(data) && JSON.parse(data).refresh_token;
let save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;
let save_user_name = JSON.parse(data) && JSON.parse(data).user_name;

console.log("내 인덱스 : " + save_user_idx);

// room_idx 변수
let room_idx = 0;

//게임 시작 인원 세는 변수
let ready_cnt = 0;

let locationUserList = [{}]; //location에서 받아온 유저리스트 담는 배열

export default function WaitingRoom({ match }) {
    let location = useLocation();
    const history = useHistory();

    let room_index = parseInt(match.params.name); // url에 입력해준 방 인덱스
    console.log("방 번호는 ?" + room_index);

    const [currentSocketConnection, setCurrentSocketConnection] = useState();

    useEffect(() => {
        const socket = io("http://3.17.55.178:3002/", {
            auth: {
                token: save_token,
            },
        });

        socket.on("connect", () => {
            console.log("Waiting connection server -> gameStart");
            setCurrentSocketConnection(socket.connected);
        });

        // 연결 해제 시 임의 지연 기다린 다음 다시 연결 시도
        socket.on("disconnect", (reason) => {
            console.log("disconnect");
            setCurrentSocketConnection(socket.connected);
        });

        //방장 변경 leaderIdx
        socket.on("change host", (data) => {
            console.log("방장 탈출");

            setLeaderIdx(data.user_idx);
        });

        //방퇴장
        socket.on("exit room", (data) => {
            const exitUserIdx = data.user_idx;

            console.log("어레이냐> : " + Array.isArray(userList));
            const isArr = Array.isArray(userList);
            //유저리스트가 처음엔 배열이 아니였다가 렌더링 다하고나선 true로 바껴서 true인지 아닌지 처리를 해준다.
            if (isArr === true) {
                const exitUserList = userList.filter(
                    (user) => user.user_idx !== exitUserIdx
                );
                //filter로
                setUserList(exitUserList);
            }
            console.log("방 퇴장 시 현재 멤버 더하기 전 : " + currentMember);

            setCurrentMember(currentMember - 1);

        });

        // 방 입장 소켓
        socket.on("enter room", (data) => {
            console.log("입장 data : " + JSON.stringify(data));

            const user = {
                user_idx: data.user_idx,
                user_name: data.user_name,
                wrm_user_color: data.user_color,
                wrm_user_ready: false,
            };

            const isArr = Array.isArray(userList);

            //유저리스트가 처음엔 배열이 아니였다가 렌더링 다하고나선 true로 바껴서 true인지 아닌지 처리를 해준다.
            if (isArr === true) {
                const enterUserList = userList.concat(user);
                //concat으로 추가
                setUserList(enterUserList);
            }

            colorList &&
                colorList.map((element) => {
                    if (element.color === data.user_color) {
                        console.log(
                            "변경 칼라 : 바꾼 색깔 : " + JSON.stringify(element.color)
                        );
                        element.choose = "false";
                    }
                });

            setColorList(colorList);

            console.log("수정인데 현재 인원이 넘버냐? : " + parseInt(currentMember));
            //현재인원 증가
            setCurrentMember(parseInt(currentMember) + 1);

        });

        //사용자의 준비 상태 값 변경에 따른 소켓
        socket.on("change member ready", (data) => {
            const changeReadyUserIdx = data.user_idx;
            const changeReadyResult = data.user_ready;

            //userList에 해당 인덱스의 ready값을 변경해줘야함
            const isArr = Array.isArray(userList);

            let middleReadySocket = [{}];

            console.log("아아아악 : 어레이냐? " + isArr);

            //유저리스트가 처음엔 배열이 아니였다가 렌더링 다하고나선 true로 바껴서 true인지 아닌지 처리를 해준다.
            if (isArr === true) {
                userList.forEach((element) => {
                    if (changeReadyUserIdx === element.user_idx) {
                        //element.wrm_user_color = element.wrm_user_color;
                        //element.user_name = element.user_name;
                        element.user_idx = changeReadyUserIdx;
                        element.wrm_user_ready = changeReadyResult;
                        middleReadySocket.push(element);
                    }
                });

                console.log(
                    "아아아악: 중간소켓 : " + JSON.stringify(middleReadySocket)
                );

                const concatUserReady = userList.concat(middleReadySocket);
                console.log("아아아악: 컨캣 : " + JSON.stringify(concatUserReady));

                const filterReadyUserList = concatUserReady.filter(
                    (item, pos) => userList.indexOf(item) == pos
                );

                //filter로
                setUserList(filterReadyUserList);

                console.log("아아아악 : 유저리스트: " + JSON.stringify(userList));
            }

            //방장인덱스가 내인덱스를 비교할 필요가 잇는가?
            if (changeReadyResult === true) {
                ready_cnt += 1;
                console.log("악! ready 증가, ready 현재값 : " + ready_cnt);
            } else {
                if (ready_cnt != 0) ready_cnt -= 1;
                console.log("악! ready 감소, ready 현재값 : " + ready_cnt);
            }

            alert(
                "socket user_idx : " +
                data.user_idx +
                " user_ready : " +
                data.user_ready
            );
        });

        //색깔 변경 시 소켓으로 response 받고 회색박스 처리해주는 부분
        socket.on("change member color", (data) => {
            alert(
                "socket-> index: " +
                data.user_idx +
                "이전 color: " +
                data.before_color +
                "이후 color: " +
                data.current_color
            );

            const changeColorUserIdx = data.user_idx;
            const changeUserBeforeColor = data.before_color;
            const changeUserCurrentColor = data.current_color;

            const isArr = Array.isArray(userList);
            let middleColorSocket = [{}];

            //유저리스트가 처음엔 배열이 아니였다가 렌더링 다하고나선 true로 바껴서 true인지 아닌지 처리를 해준다.
            if (isArr === true) {
                userList.forEach((element) => {
                    if (changeColorUserIdx === element.user_idx) {
                        element.wrm_user_color = changeUserCurrentColor;
                        console.log("색깔 유저 변경 엘레먼트? " + element.wrm_user_color);
                        //element.user_name = element.user_name;
                        element.user_idx = changeColorUserIdx;
                        //element.wrm_user_ready = false;
                        middleColorSocket.push(element);
                    }
                });

                console.log(
                    "색깔 유저 : middle socket arr: " + JSON.stringify(middleColorSocket)
                );

                const concatUserColor = userList.concat(middleColorSocket);
                const filterColorUserList = concatUserColor.filter(
                    (item, pos) => userList.indexOf(item) == pos
                );

                //filter로
                setUserList(filterColorUserList);

                console.log("색깔 필터했다? : " + JSON.stringify(filterColorUserList));
            }

            colorList &&
                colorList.map((element) => {
                    if (element.color === changeUserCurrentColor) {
                        element.choose = "false";
                    }
                    setColorList(colorList);

                    if (element.color === changeUserBeforeColor) {
                        element.choose = "true";
                    }

                    setColorList(colorList);
                });

            console.log(
                "색깔 유저리스트 칼라리스트 후 : " + JSON.stringify(colorList)
            );
        });

        //방 정보 수정 소켓
        socket.on("edit room", (data) => {
            alert("수정) 방정보! ");
            setRoomUpdate(data);
        });

        //게임 시작 정보 socket
        socket.on("start game", (data) => {
            alert("게임 스타트, 게임 시작 인덱스 " + data.game_idx);

            //플레잉룸으로 이동, 데이터 전달
            history.push({
                pathname: "/playingroom/" + room_idx,
                state: { data: data, room : room_idx },
            });
        });
    }, []);

    //유저 리스트
    const [userList, setUserList] = useState();

    //색깔
    const [colorList, setColorList] = useState([
        //선택 할 수 있는지 여부 배열, true : 선택가능
        { color: "RED", choose: "true", code: "#FF0000" },
        { color: "ORANGE", choose: "true", code: "#FF5E00" },
        { color: "YELLOW", choose: "true", code: "#FFE400" },
        { color: "GREEN", choose: "true", code: "#1DDB16" },
        { color: "BLUE", choose: "true", code: "#0B37D3" },
        { color: "PURPLE", choose: "true", code: "#5F00FF" },
        { color: "PINK", choose: "true", code: "#FF00DD" },
    ]);

    const [roomEnterInfo, setRoomEnterInfo] = useState();
    const [roomInfo, setRoomInfo] = useState("");
    const [count, setCount] = useState("");

    //무슨 색을 선택할 수 있는가
    const [selectColor, setSelectColor] = React.useState([]);

    //팀원 레디 상태 state
    const [changeReady, setChangeReady] = React.useState(false);

    //방장인가 state
    const [isLeader, setIsLeader] = React.useState(0);

    //방장 상태 state 이 변수가 소켓에서 누적된 카운트 값과 동일해야함.
    const [startMember, setStartMember] = React.useState(0);

    const [gameStart, setGameStart] = React.useState(false);

    //방 정보 수정 useState
    const [roomUpdate, setRoomUpdate] = useState();

    //현재 인원
    const [currentMember, setCurrentMember] = useState();

    //방장 인덱스
    const [leaderIdx, setLeaderIdx] = useState();

    const [result, setResult] = useState(0);
    const clickedSetting = (result) => {
        setResult(result);
    };

    function readyClick(readyStatus) {
        setChangeReady(readyStatus);

        console.log("클릭 시 레디 값 : " + ready_cnt + "정원 : " + startMember);

        const restURL = BaseURL + "/waiting-room/user-ready   ";

        const reqHeaders = {
            headers: {
                authorization: "Bearer " + save_token,
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
                alert("rest Start " + readyStatus);
            })
            .catch(function (error) {
                alert("error Start" + error.message);
            });
    }

    function startClick() {
        alert("click start btn!");

        const restURL = BaseURL + "/game/start";

        const reqHeaders = {
            headers: {
                authorization: "Bearer " + save_token,
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
                alert("success! 게임시작");
                //플레잉룸으로 이동 동시에, 게임시장 정보 call 데이터 함께 전달
                setGameStart(true);
            })
            .catch(function (error) {
                alert(error);
            });
    }

    function colorClick(str) {
        alert("click: " + str);

        const restURL = BaseURL + "/waiting-room/user-color";

        const reqHeaders = {
            headers: {
                authorization: "Bearer " + save_token,
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
                alert("rest " + response.data);
                setSelectColor(str); //내가 선택한 색
            })
            .catch(function (error) {
                alert("error " + error.message);
            });
    }

    const getRoomInfo = async () => {
        // 대기실 정보 조회 api
        const restURL =
            "http://3.17.55.178:3002/room/info/" + room_idx;

        const reqHeaders = {
            headers: {
                //1번 토큰 이용
                authorization: "Bearer " + save_token,
            },
        };
        axios
            .get(restURL, reqHeaders)
            .then(function (response) {
                setRoomInfo(response.data);
                console.log("response.data.room_start_member_cnt");
                console.log(response.data.room_idx);
                setCount(response.data.room_start_member_cnt);
                console.log("getRoomInfo 성공");
            })
            .catch(function (error) {
                console.log("getRoomInfo 실패");
                console.log(error.response);
            });
    };

    const deleteRoom = async () => {
        //방 삭제
        const restURL = BaseURL + "/room/" + room_idx;

        const reqHeaders = {
            headers: {
                authorization: "Bearer " + save_token,
            },
        };
        axios
            .delete(restURL, reqHeaders)
            .then(function (response) {
                console.log("방 삭제 성공");
                history.push({
                    pathname: "/roomlist", // 나가기 성공하면 룸리스트로 이동
                });
            })
            .catch(function (error) {
                console.log("방 삭제  실패");
                console.log(error.response);
            });
    };

    const exitRoom = async () => {
        const restURL = BaseURL + "/waiting-room/exit/" + room_idx;

        const reqHeaders = {
            headers: {
                authorization: "Bearer " + save_token,
            },
        };
        axios
            .delete(restURL, reqHeaders)
            .then(function (response) {
                console.log(response.status);
                console.log("exitWaitingRoom 성공");
                history.push({
                    pathname: "/roomlist", // 나가기 성공하면 룸리스트로 이동
                });
            })
            .catch(function (error) {
                console.log("exitWaitingRoom 실패");
                console.log(error.response);
            });
    };

    const exitWaitingRoom = async () => {
        //현재 인원이 1명이면 방삭제 api call 아니면 대기실 나가기 조회 api call

        if (currentMember == 1) {
            deleteRoom(); //방 삭제 api
        } else {
            exitRoom(); //대기실 나가기 조회 api
        }
    };

    useEffect(() => {
        // setRoomEnterInfo(location.state.data);

        // 방 데이터 조회 api
        // 대기실 정보 조회 api
        const restURL =
            "http://3.17.55.178:3002/room/" + room_index;

        const reqHeaders = {
            headers: {
                //1번 토큰 이용
                authorization: "Bearer " + save_token,
            },
        };
        axios
            .get(restURL, reqHeaders)
            .then(function (response) {
                setRoomEnterInfo(response.data);
                console.log("대기실 데이터 성공");
                //room index 설정
                room_idx = response.data.room_idx; //이렇게 받아오면 number타입으로 api, 소켓 에러 X\

                //방장 인덱스 받아오기, save_user_idx 이게 내 인덱스 저장된 변수
                //받아와서 리더인지 아닌지 state 설정
                if (response.data.leader_idx === save_user_idx) {
                    console.log('방장 오케이');
                    setIsLeader(1); //리더다
                }

                //userlist로 사용자들이 무슨 색을 할당 받았는지 저장하는 배열
                locationUserList = response.data.waiting_room_member_list;
                //setUserList(location.state.data);
                setUserList(locationUserList);

                for (let i = 0; i < locationUserList.length; i++) {
                    console.log(
                        "user color랑 인덱스랑 레디값 : " +
                        locationUserList[i].wrm_user_color +
                        locationUserList[i].user_idx +
                        " " +
                        locationUserList[i].wrm_user_ready
                    );

                    const currentColor = locationUserList[i].wrm_user_color;

                    colorList &&
                        colorList.map((element) => {
                            if (element.color === currentColor) {
                                element.choose = "false";
                                if (locationUserList[i].wrm_user_ready === true) {
                                    ready_cnt += 1;
                                    console.log("세팅 레디 값 : " + ready_cnt);
                                }

                                if (save_user_idx == locationUserList[i].user_idx) {
                                    //선택된 값 세팅
                                    setSelectColor(element.color);
                                    //내 준비 상태
                                    setChangeReady(locationUserList[i].wrm_user_ready);
                                }
                            }
                            setColorList(colorList);
                        });
                }

                //햔재 인원 받아오기
                console.log(
                    "수정인데 세팅룸함수 안에 현재 인원 값 : " +
                    response.data.room_current_member_cnt
                );
                setCurrentMember(response.data.room_current_member_cnt);

                //게임 시작 인원 받아오기
                setStartMember(response.data.room_start_member_cnt - 1);

                //방장 인덱스 받아오기
                setLeaderIdx(response.data.leader_idx);

            })
            .catch(function (error) {
                console.log("대기실 데이터 실패");
                console.log(error.response);
            });

        setTimeout(() => getRoomInfo(), 1000); //방 정보 조회 api + 모달창에 뿌리기용
    }, []);

    return (        
        (
            <Background>
                {currentSocketConnection ? ( 
                    roomEnterInfo && roomEnterInfo ? (
                    <div>
                        <Header />
                        <Container>
                            {console.log("방장 인덱스 맞지? : " + isLeader)}
                            <SelectDiv>
                                selectDiv
                                <br />
                                {roomUpdate ? (
                                    // 소켓 변경 후 소켓 데이터로 변경
                                    <TitleDiv>
                                        TitleDiv{result} {roomUpdate.room_idx}번 방
                                        <br />
                                        <Text>
                                            방제 : {roomUpdate.room_name} | 방 코드 :{" "}
                                            {roomEnterInfo.room_code} | 인원:{" "}
                                            {roomEnterInfo.room_current_member_cnt} /{" "}
                                            {roomUpdate.room_start_member_cnt} 명
                                        </Text>
                                        <br />
                                        {isLeader === 1 ? (
                                            // 리더가 변경하는 컴포넌트
                                            <ModalSetting
                                                resultt={result}
                                                clickedSetting={clickedSetting}
                                                title={roomUpdate.room_name}
                                                mode={roomUpdate.room_mode}
                                                member={roomUpdate.room_start_member_cnt}
                                                room_private={roomInfo.room_private}
                                                room_idx={roomUpdate.room_idx}
                                            />
                                        ) : (
                                            <InfoModal
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
                                            방제 : {roomEnterInfo.room_name} | 방 코드 :{" "}
                                            {roomEnterInfo.room_code} | 인원:{" "}
                                            {roomEnterInfo.room_current_member_cnt} /{" "}
                                            {roomEnterInfo.room_start_member_cnt} 명
                                        </Text>
                                        {isLeader === 1 ? (
                                            <ModalSetting
                                                // 리더가 변경하는 컴포넌트
                                                resultt={result}
                                                clickedSetting={clickedSetting}
                                                title={roomInfo.room_name}
                                                mode={roomInfo.room_mode}
                                                member={count}
                                                room_private={roomInfo.room_private}
                                                room_idx={roomInfo.room_idx}
                                            />
                                        ) : (
                                            <InfoModal
                                                // 리더가 변경하는 컴포넌트
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
                                        {
                                            (
                                                colorList &&
                                                colorList.map((element, key) =>
                                                    //console.log('변경 칼라 값 ' + JSON.stringify(element.color)),
                                                    //console.log('변경 선택? : ' + element.choose),
                                                    //console.log('변경 코드 값 : ' + element.code),
                                                    element.choose === "true" ? (
                                                        <BarColorBox
                                                            data={element.code}
                                                            color={element.code}
                                                            onClick={() => {
                                                                colorClick(element.color);
                                                            }}
                                                        />
                                                    ) : selectColor === element.color ? (
                                                        <BarColorBox color={element.code}>V</BarColorBox>
                                                    ) : (
                                                        <BarColorBox data={element.code} color="#8C8C8C" />
                                                    )
                                                ))
                                        }
                                    </BarInnerDiv>
                                </BarDiv>
                                <UserDiv>
                                    <div style={styles.userListContainer}>
                                        {userList &&
                                            userList.map((element) => (
                                                <UserCard
                                                    leader={leaderIdx}
                                                    id={element.user_idx}
                                                    nickname={element.user_name}
                                                    color={element.wrm_user_color}
                                                    ready={element.wrm_user_ready}
                                                />
                                            ))}
                                    </div>
                                </UserDiv>
                                <div
                                    onClick={() => {
                                        console.log("눌림");
                                        exitWaitingRoom();
                                    }}
                                    style={{
                                        width: "100px",
                                        justifyContent: "space-between",
                                        // backgroundColor: colors.red,
                                    }}
                                >
                                    <Exit src={exit} />
                                    <ExitText style={{ color: colors.black }}>나가기</ExitText>
                                </div>
                            </SelectDiv>
                            <RightDiv>
                                <Chatting
                                    room_idx={room_idx}
                                    height="560px"
                                    available={true}
                                ></Chatting>
                                <StartDiv>
                                    {
                                        isLeader === 0 //방장 아님
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
                                            (console.log("방장이야"),
                                                (
                                                    //일단 플레잉룸으로 넘어가기 위한 하드코딩 밑에 주석임 지울 예정
                                                    // startMember === ready_cnt ? (
                                                    <BtnDiv isStart="yes" onClick={startClick}>
                                                        Game Start
                                                    </BtnDiv>
                                                )) //게임 시작 api 요청 onclick 달기
                                        // ) : (
                                        // <BtnDiv isStart="no">Game Start</BtnDiv>
                                        //)
                                    }
                                </StartDiv>
                            </RightDiv>
                        </Container>
                    </div>
                )
                : (
                    <Loading />
                )
                ) : (
                    <Loading />
                )}
            </Background>
        )
    );
}

const styles = {
    userListContainer: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        flexDirection: "column",
        width: "590px",
        height: "410px",
        flexFlow: "row wrap",
    },
};

const Background = styled.div`
  background-color: #180928;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
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
  ${(props) => (props.color == "green" ? `background-color: #44A024;` : ``)}
  ${(props) =>
        props.isStart == "yes" ? `` : props.isStart == "no" ? `opacity: 0.5;` : ``}
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
        props.color == "#FF0000" || props.data == "#FF0000"
            ? `background-color: ${props.color}; border-top-left-radius: 15px; border-bottom-left-radius: 15px;`
            : props.color == "#FF00DD" || props.data == "#FF00DD"
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
