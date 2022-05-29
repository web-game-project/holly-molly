import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import style from '../styles/styles.js';
import exitPng from '../assets/exit.png';

import UserCard from '../components/UserCard';

import ModalSetting from '../components/ModalSetting.js';

import Chatting from '../components/Chatting.js';

import RefreshVerification from '../server/RefreshVerification.js';
import { useHistory, useLocation } from 'react-router';
import InfoModal from '../components/InfoModal.js';
import Header from '../components/Header.js';

import Loading from '../components/Loading';
import { useSelector } from 'react-redux';

// room_idx 변수
let room_idx = 0;

//게임 시작 인원 세는 변수
let ready_cnt = 0;

let locationUserList = [{}]; //location에서 받아온 유저리스트 담는 배열

export default function WaitingRoom(props) {
    let location = useLocation();
    const history = useHistory();

    const BaseURL = useSelector((state) => state.socket.base_url);

    const dummyChatData = [];

    let room_index = parseInt(props.match.params.name); // url에 입력해준 방 인덱스
    //   console.log('방 번호는 ?' + room_index);

    // 뒤로가기 감지 
    const [isBlocking, setIsBlocking] = useState(false);

    //유저 리스트
    //const [userList, setUserList] = useState();

    let userList = useRef([]);

    //토큰 검사
    //console.log('토큰 유효한지 검사 t/f 값 : ' + verify);
    let data, save_token, save_user_idx;

    data = sessionStorage.getItem('token');
    save_token = JSON.parse(data) && JSON.parse(data).access_token;
    save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;

    function getToken() {
        data = sessionStorage.getItem('token');
        save_token = JSON.parse(data) && JSON.parse(data).access_token;
        save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;
    }

    //색깔
    const [colorList, setColorList] = useState([
        //선택 할 수 있는지 여부 배열, true : 선택가능
        { color: 'RED', choose: 'true', code: '#FF0000' },
        { color: 'ORANGE', choose: 'true', code: '#FF5C00' },
        { color: 'YELLOW', choose: 'true', code: '#FFB800' },
        { color: 'GREEN', choose: 'true', code: '#95DB3B' },
        { color: 'BLUE', choose: 'true', code: '#3B8EDB' },
        { color: 'PURPLE', choose: 'true', code: '#823BDB' },
        { color: 'PINK', choose: 'true', code: '#FF0A9D' },
    ]);

    const [roomEnterInfo, setRoomEnterInfo] = useState();
    const [roomInfo, setRoomInfo] = useState('');
    const [count, setCount] = useState('');

    //사용자가 색을 바꾸었을 때, 변경중입니다 toast 띄우기 위해서
    const [modify, setModifiy] = React.useState(false);

    const [ready, setReady] = React.useState(false);

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
    const leader_idx = useRef(0);

    const getWaiting = () => {
        //   console.log("getWaiting: " + room_index);
        const restURL = BaseURL + '/room/' + room_index;

        const reqHeaders = {
            headers: {
                //1번 토큰 이용
                authorization: 'Bearer ' + save_token,
            },
        };
        axios
            .get(restURL, reqHeaders)
            .then(function (response) {
                //   console.log(response.data);
                setRoomEnterInfo(response.data);
                //room index 설정
                room_idx = response.data.room_idx; //이렇게 받아오면 number타입으로 api, 소켓 에러 X\

                //방장 인덱스 받아오기, save_user_idx 이게 내 인덱스 저장된 변수
                //받아와서 리더인지 아닌지 state 설정
                if (response.data.leader_idx === save_user_idx) {
                    //   console.log('방장 오케이');
                    setIsLeader(1); //리더다
                }

                //userlist로 사용자들이 무슨 색을 할당 받았는지 저장하는 배열
                locationUserList = response.data.waiting_room_member_list;
                //setUserList(location.state.data);

                //setUserList(locationUserList);
                userList.current = locationUserList;

                ready_cnt = 0;
                for (let i = 0; i < locationUserList.length; i++) {
                    //리더의 레디는 안새게
                    if (response.data.leader_idx != locationUserList[i].user_idx) {
                        if (locationUserList[i].wrm_user_ready === true) { // 레디가 트루면,
                            ready_cnt = ready_cnt + 1;
                        }
                    }

                    //   console.log('ready 카운트 ' + ready_cnt);

                    const currentColor = locationUserList[i].wrm_user_color;

                    colorList &&
                        colorList.map((element) => {
                            if (element.color === currentColor) {
                                element.choose = 'false';

                                if (save_user_idx == locationUserList[i].user_idx) {
                                    //색깔변경중입니다 토스트 지우기
                                    setModifiy(false);
                                    //선택된 값 세팅
                                    setSelectColor(element.color);
                                    //내 준비 상태
                                    setChangeReady(locationUserList[i].wrm_user_ready);

                                    setReady(false);
                                }
                            }
                            setColorList(colorList);
                        });
                }

                //햔재 인원 받아오기
                //  console.log('수정인데 세팅룸함수 안에 현재 인원 값 : ' + response.data.room_current_member_cnt);
                setCurrentMember(response.data.room_current_member_cnt);

                //게임 시작 인원 받아오기
                setStartMember(response.data.room_start_member_cnt - 1);

                //방장 인덱스 받아오기
                setLeaderIdx(response.data.leader_idx);
                leader_idx.current = response.data.leader_idx;
            })
            .catch(function (error) {
                let resErr = error.response.data.message;

                if ("로그인 후 이용해주세요." === resErr) { //401 err
                    let refresh = RefreshVerification.verification();
                    getToken();
                    getWaiting();

                }
                else
                    alert(resErr);
            });

        setTimeout(() => getRoomInfo(), 1000); //방 정보 조회 api + 모달창에 뿌리기용
    }

    useEffect(() => {
        //  console.log("waiting room");
        //  console.log(props.socket);

        if (props.socket.connected) {
            getWaiting();
        }

        props.socket.on('connect', () => {

            getWaiting();

            //getWaiting();
            //console.log('색깔 변경 컴포넌트 ' + socket.id);
            //alert(socket.connected);
        });

        //방장 변경 leaderIdx
        props.socket.on('change host', (data) => {
            // console.log('방장 탈출');

            // setLeaderIdx(data.user_idx);
            getWaiting();
        });

        //방퇴장
        props.socket.on('exit room', (data) => {
            let exitUserColor = data.user_color;
            //  console.log('나감 : ' + exitUserColor);
            colorList &&
                colorList.map((element) => {
                    if (element.color === exitUserColor) {
                        element.choose = 'true';
                    }
                });

            setColorList(colorList);
            if (data.user_idx !== save_user_idx)
                getWaiting();

            /* const exitUserIdx = data.user_idx;

            console.log('어레이냐> : ' + Array.isArray(userList));
            const isArr = Array.isArray(userList);
            //유저리스트가 처음엔 배열이 아니였다가 렌더링 다하고나선 true로 바껴서 true인지 아닌지 처리를 해준다.
            if (isArr === true) {
                const exitUserList = userList.current.filter((user) => user.user_idx !== exitUserIdx);
                //filter로
                //setUserList(exitUserList);
                userList.current = exitUserList;
            }
            console.log('방 퇴장 시 현재 멤버 더하기 전 : ' + currentMember);

            setCurrentMember(currentMember - 1); */
        });

        // 방 입장 소켓
        props.socket.on('enter room', (data) => {

            getWaiting();
            /* console.log('입장 data : ' + JSON.stringify(data));

            const user = {
                user_idx: data.user_idx,
                user_name: data.user_name,
                wrm_user_color: data.user_color,
                wrm_user_ready: false,
            };

            const isArr = Array.isArray(userList);

            //유저리스트가 처음엔 배열이 아니였다가 렌더링 다하고나선 true로 바껴서 true인지 아닌지 처리를 해준다.
            if (isArr === true) {
                const enterUserList = userList.current.concat(user);
                //concat으로 추가
                //setUserList(enterUserList);
                userList.current = enterUserList;

            }

            colorList &&
                colorList.map((element) => {
                    if (element.color === data.user_color) {
                        console.log('변경 칼라 : 바꾼 색깔 : ' + JSON.stringify(element.color));
                        element.choose = 'false';
                    }
                });

            setColorList(colorList);

            console.log('수정인데 현재 인원이 넘버냐? : ' + parseInt(currentMember));
            //현재인원 증가
            setCurrentMember(parseInt(currentMember) + 1); */
        });

        //사용자의 준비 상태 값 변경에 따른 소켓
        props.socket.on('change member ready', (data) => {

            getWaiting();

            /*  console.log('idx : ' + save_user_idx + data.user_idx);
             if(save_user_idx === data.user_idx){
                 console.log('dd : ' + changeReady);
                 setChangeReady(!changeReady);
                /*  if(changeReady){
                     setReadyTxt("준비 완료");
                 }
                 else{
                     setReadyTxt("준비 시작");
                 } 
             } */

            //임시방편으로 주석 푼 코드
            /* const changeReadyResult = data.user_ready;
            if(ready_cnt > startMember){ // 레디카운트가 시작 멤버보다 값이 크게 바꼈다면 레디카운트에 시작 멤버 값 대입
                ready_cnt = startMember;
            }
            if (changeReadyResult === true) { // 레디가 트루면,
                ready_cnt = ready_cnt + 1;
                console.log('소켓 ready 증가, ready 현재값 : ' + ready_cnt);
            } else {
                if (ready_cnt != 0) ready_cnt = ready_cnt - 1; // 레디카운트가 0이 아닐 때만 -1
                console.log('소켓 ready 감소, ready 현재값 : ' + ready_cnt);
            } */

            //22.01.02
            /*  const changeReadyUserIdx = data.user_idx;
              const changeReadyResult = data.user_ready;
 
             for (let i = 0; i < locationUserList.length; i++) {
                 if(locationUserList[i].user_idx === changeReadyUserIdx)
                     locationUserList[i].wrm_user_ready = changeReadyResult;
             }
 
             userList.current = locationUserList;
 
             if (changeReadyResult === true) { // 레디가 트루면,
                 ready_cnt = ready_cnt + 1;
                 console.log('소켓 ready 증가, ready 현재값 : ' + ready_cnt);
             } else {
                 if (ready_cnt != 0) ready_cnt = ready_cnt - 1; // 레디카운트가 0이 아닐 때만 -1
                 console.log('소켓 ready 감소, ready 현재값 : ' + ready_cnt);
             } */

            // getWaiting();

            //20년 코드
            /* const changeReadyUserIdx = data.user_idx;
             const changeReadyResult = data.user_ready;
 
             //userList에 해당 인덱스의 ready값을 변경해줘야함
             const isArr = Array.isArray(userList);
 
             let middleReadySocket = [{}];
 
             //console.log('아아아악 : 어레이냐? ' + isArr);
 
             //유저리스트가 처음엔 배열이 아니였다가 렌더링 다하고나선 true로 바껴서 true인지 아닌지 처리를 해준다.
             if (isArr === true) {
                 userList.current.forEach((element) => {
                     if (changeReadyUserIdx === element.user_idx) {
                         //element.wrm_user_color = element.wrm_user_color;
                         //element.user_name = element.user_name;
                         element.user_idx = changeReadyUserIdx;
                         element.wrm_user_ready = changeReadyResult;
                         middleReadySocket.push(element);
                     }
                 });
 
                 console.log('아아아악: 중간소켓 : ' + JSON.stringify(middleReadySocket));
 
                 const concatUserReady = userList.current.concat(middleReadySocket);
                 console.log('아아아악: 컨캣 : ' + JSON.stringify(concatUserReady));
 
                 const filterReadyUserList = concatUserReady.filter((item, pos) => userList.current.indexOf(item) == pos);
 
                 //filter로
                 //setUserList(filterReadyUserList);
                 userList.current = filterReadyUserList;
 
                 console.log('아아아악 : 유저리스트: ' + JSON.stringify(userList.current));
             }
 
             //방장인덱스가 내인덱스를 비교할 필요가 잇는가?
             if (changeReadyResult === true) {
                 ready_cnt += 1;
                 console.log('악! ready 증가, ready 현재값 : ' + ready_cnt);
             } else {
                 if (ready_cnt != 0) ready_cnt -= 1;
                 console.log('악! ready 감소, ready 현재값 : ' + ready_cnt);
             }
 
             alert('socket user_idx : ' + data.user_idx + ' user_ready : ' + data.user_ready); */
        });

        //색깔 변경 시 소켓으로 response 받고 회색박스 처리해주는 부분
        props.socket.on('change member color', (data) => {
            //임시방편으로 주석 푼 코드
            const changeUserBeforeColor = data.before_color;

            colorList &&
                colorList.map((element) => {
                    if (element.color === changeUserBeforeColor) {
                        element.choose = 'true';
                    }
                    setColorList(colorList);
                });

            getWaiting();
            //  alert('socket-> index: ' + data.user_idx + '이전 color: ' + data.before_color + '이후 color: ' + data.current_color);

            /* const changeColorUserIdx = data.user_idx;
            const changeUserBeforeColor = data.before_color;
            const changeUserCurrentColor = data.current_color;

            const isArr = Array.isArray(userList);
            let middleColorSocket = [{}];

            console.log('어레이냐> : ' + Array.isArray(userList));

            //유저리스트가 처음엔 배열이 아니였다가 렌더링 다하고나선 true로 바껴서 true인지 아닌지 처리를 해준다.
            //if (isArr === true) {
                userList.current.forEach((element) => {
                    if (changeColorUserIdx === element.user_idx) {
                        element.wrm_user_color = changeUserCurrentColor;
                        console.log('색깔 유저 변경 엘레먼트? ' + element.wrm_user_color);
                        //element.user_name = element.user_name;
                        element.user_idx = changeColorUserIdx;
                        //element.wrm_user_ready = false;
                       // middleColorSocket.push(element);
                    }
                });

                console.log('유저 칼라 변경 : ' + JSON.stringify(userList.current));

               // console.log('색깔 유저 : middle socket arr: ' + JSON.stringify(middleColorSocket));

              //  const concatUserColor = userList.current.concat(middleColorSocket);
               // const filterColorUserList = concatUserColor.filter((item, pos) => userList.current.indexOf(item) == pos);

                //filter로
                //setUserList(filterColorUserList);
               // userList.current = filterColorUserList;

               // console.log('색깔 필터했다? : ' + JSON.stringify(filterColorUserList));
            //}

            colorList &&
                colorList.map((element) => {
                    if (element.color === changeUserCurrentColor) {
                        element.choose = 'false';
                    }
                    setColorList(colorList);

                    if (element.color === changeUserBeforeColor) {
                        element.choose = 'true';
                    }

                    setColorList(colorList);
                });

            console.log('색깔 유저리스트 칼라리스트 후 : ' + JSON.stringify(colorList)); */
        });

        //방 정보 수정 소켓
        props.socket.on('edit room', (data) => {
            //  console.log('수정) 방정보! ');
            //setRoomUpdate(data);
            getWaiting();
        });


        //게임 시작 정보 socket
        props.socket.on('start game', (data) => {
            //   console.log('게임 스타트, 게임 시작 인덱스 ' + data.game_idx);
            //   console.log(leader_idx.current);

            // getWaiting();
            //플레잉룸으로 이동, 데이터 전달
            history.push({
                pathname: '/playingroom/' + room_idx,
                state: { isSet: false, gameIdx: data.game_idx, userList: data.user_list, gameSetIdx: data.game_set_idx, room: room_idx, leaderIdx: leader_idx.current, gameSetNo: 1 },
            });


        });
    }, []);

    const [result, setResult] = useState(0);
    const clickedSetting = (result) => {
        setResult(result);
    };

    function readyClick(readyStatus) {
        // setChangeReady(readyStatus);
        setReady(true);

        let readyVal = readyStatus;

        //  console.log('클릭 시 레디 값 : ' + ready_cnt + '정원 : ' + startMember);

        const restURL = BaseURL + '/waiting-room/user-ready   ';

        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };

        axios
            .patch(
                restURL,
                {
                    room_idx: parseInt(room_idx), //룸 인덱스 넘버여야함.
                    user_ready: readyVal,
                },
                reqHeaders
            )
            .then(function (response) {
                //  console.log('레디 rest: ' + readyStatus);
            })
            .catch(function (error) {
                let resErr = error.response.data.message;

                if ("로그인 후 이용해주세요." === resErr) { //401 err
                    let refresh = RefreshVerification.verification();

                    getToken();
                    readyClick(readyVal);

                }
                else
                    alert(resErr);
            });
    }

    function startClick() {
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
                    room_idx: parseInt(room_idx),
                },
                reqHeaders
            )
            .then(function (response) {
                //response로 jwt token 반환
                //  console.log('success! 게임시작');
                //플레잉룸으로 이동 동시에, 게임시장 정보 call 데이터 함께 전달
                setGameStart(true);
            })
            .catch(function (error) {
                let resErr = error.response.data.message;

                if ("로그인 후 이용해주세요." === resErr) { //401 err
                    let refresh = RefreshVerification.verification();
                    getToken();
                    startClick();

                }
                else
                    alert(resErr);
            });
    }

    function colorClick(str) {
        setModifiy(true);

        let color = str;

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
                    room_idx: parseInt(room_idx), //룸 인덱스 변수로 들어가야함.
                    user_color: color, //클릭했을 때 해당 색
                },
                reqHeaders
            )
            .then(function (response) {
                //   console.log('색깔 rest: ' + response.data);
                //setSelectColor(str); //내가 선택한 색
            })
            .catch(function (error) {
                let resErr = error.response.data.message;

                if ("로그인 후 이용해주세요." === resErr) { //401 err
                    let refresh = RefreshVerification.verification();
                    getToken();
                    colorClick(color);

                }
                else
                    alert(resErr);
            });
    }

    const getRoomInfo = async () => {
        // 대기실 정보 조회 api
        const restURL = BaseURL + '/room/info/' + room_idx;

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
                //  console.log('response.data.room_start_member_cnt');
                //  console.log(response.data.room_idx);
                setCount(response.data.room_start_member_cnt);
                //  console.log('getRoomInfo 성공');
            })
            .catch(function (error) {
                let resErr = error.response.data.message;

                if ("로그인 후 이용해주세요." === resErr) { //401 err
                    let refresh = RefreshVerification.verification();
                    getToken();
                    getRoomInfo();

                }
                else
                    alert(resErr);
            });
    };

    const deleteRoom = async () => {
        //방 삭제
        const restURL = BaseURL + '/room/' + room_idx;

        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };
        axios
            .delete(restURL, reqHeaders)
            .then(function (response) {
                //   console.log('방 삭제 성공');
                history.push({
                    pathname: '/roomlist', // 나가기 성공하면 룸리스트로 이동
                });
            })
            .catch(function (error) {
                let resErr = error.response.data.message;

                if ("로그인 후 이용해주세요." === resErr) { //401 err
                    let refresh = RefreshVerification.verification();
                    getToken();
                    deleteRoom();

                }
                else
                    alert(resErr);
            })
    };

    const exitRoom = async () => {
        const restURL = BaseURL + '/waiting-room/exit/' + room_idx;

        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };
        axios
            .delete(restURL, reqHeaders)
            .then(function (response) {
                //   console.log(response.status);
                //   console.log('exitWaitingRoom 성공');
                history.push({
                    pathname: '/roomlist', // 나가기 성공하면 룸리스트로 이동
                });
            })
            .catch(function (error) {
                let resErr = error.response.data.message;

                if ("로그인 후 이용해주세요." === resErr) { //401 err
                    let refresh = RefreshVerification.verification();
                    getToken();
                    exitRoom();

                }
                else
                    alert(resErr);
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

    // 뒤로 가기 감지 시 대기방 나가기 처리 
    /*useEffect(() => {
        const unblock = history.block((loc, action) => {
            if (action === 'POP') {
                //if(window.confirm('대기방에서 나가게됩니다. \n뒤로 가시겠습니까?')){
                exitWaitingRoom();
                //return true
                //}else{
                //return false
                //}
            }
            //return true
        })

        return () => unblock()
    }, [])*/

    // 비정상 종료
    const exit = async () => {
        // console.log("playing room exit");
        const restURL = BaseURL + '/game/exit';

        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };
        axios
            .delete(restURL, reqHeaders)
            .then(function (response) {
                //   console.log(response);
                history.push({
                    pathname: '/',
                });
                //window.location.replace('/');
            })
            .catch(function (error) {
                //  alert(error.response.data.message);
            });
    };

    // 게임 중 비정상 종료 감지
    useEffect(() => {
        window.addEventListener('beforeunload', alertUser) // 새로고침, 창 닫기, url 이동 감지 
        window.addEventListener('unload', handleEndConcert) //  사용자가 페이지를 떠날 때, 즉 문서를 완전히 닫을 때 실행

        return () => {
            window.removeEventListener('beforeunload', alertUser)
            window.removeEventListener('unload', handleEndConcert)
        }
    }, [])

    // 경고창 
    const alertUser = (e) => {
        e.preventDefault(); // 페이지가 리프레쉬 되는 고유의 브라우저 동작 막기
        e.returnValue = "";

        exit();
    };

    // 종료시 실행 
    const handleEndConcert = async () => {
        exit();
    }

    /*   useEffect(()=>{
          info && setIsBlocking(true)
      }, [info]) */

    /* useEffect(() => {
        // setRoomEnterInfo(location.state.data);

        // 방 데이터 조회 api
        // 대기실 정보 조회 api
        const restURL = 'http://3.17.55.178:3002/room/' + room_index;

        const reqHeaders = {
            headers: {
                //1번 토큰 이용
                authorization: 'Bearer ' + save_token,
            },
        };
        axios
            .get(restURL, reqHeaders)
            .then(function (response) {
                console.log(response.data);
                setRoomEnterInfo(response.data);
                console.log('대기실 데이터 성공');
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
                        'user color랑 인덱스랑 레디값 : ' +
                            locationUserList[i].wrm_user_color +
                            locationUserList[i].user_idx +
                            ' ' +
                            locationUserList[i].wrm_user_ready
                    );

                    const currentColor = locationUserList[i].wrm_user_color;

                    colorList &&
                        colorList.map((element) => {
                            if (element.color === currentColor) {
                                element.choose = 'false';
                                if (locationUserList[i].wrm_user_ready === true) {
                                    ready_cnt += 1;
                                    console.log('세팅 레디 값 : ' + ready_cnt);
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
                console.log('수정인데 세팅룸함수 안에 현재 인원 값 : ' + response.data.room_current_member_cnt);
                setCurrentMember(response.data.room_current_member_cnt);

                //게임 시작 인원 받아오기
                setStartMember(response.data.room_start_member_cnt - 1);

                //방장 인덱스 받아오기
                setLeaderIdx(response.data.leader_idx);
            })
            .catch(function (error) {
                console.log('대기실 데이터 실패');
                console.log(error.response);
            });

        setTimeout(() => getRoomInfo(), 1000); //방 정보 조회 api + 모달창에 뿌리기용
    }, []); */

    const grayBox = () => {
        // console.log('함수' + startMember + currentMember);
        let cnt = startMember + 1 - currentMember;
        const result = [];

        for (let i = 0; i < cnt; i++) {
            //  console.log('몇변 ' + cnt);

            result.push(<UserCard color="gray" />);

        }
        return result;
    }

    return (
        <Background>
            {props.socket.connected ? (
                // console.log("socket 연결!"),
                roomEnterInfo && roomEnterInfo ? (
                    //  console.log("정보 조회 성공!"),
                    (
                        <div>
                            <Header />
                            <Container>
                                <SelectDiv>
                                    <br />
                                    {roomUpdate ? (
                                        // 소켓 변경 후 소켓 데이터로 변경
                                        <TitleDiv>
                                            <div style={styles.roomInfoContainer}>
                                                <div style={styles.codeContainer}>{roomEnterInfo.room_code}</div>
                                                <NameContainer>{roomUpdate.room_name}</NameContainer>
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
                                                        style={{ marginTop: '30px' }}
                                                        title={roomUpdate.room_name}
                                                        mode={roomUpdate.room_mode}
                                                        member={roomUpdate.room_start_member_cnt}
                                                        room_private={roomInfo.room_private}
                                                        room_idx={roomUpdate.room_idx}
                                                    />
                                                )}
                                            </div>
                                            {/* TitleDiv{result} {roomUpdate.room_idx}번 방 */}
                                            {/* <br />
                                        <Text>
                                            방제 : {roomUpdate.room_name} | 방 코드 : {roomEnterInfo.room_code} | 인원:{' '}
                                            {roomEnterInfo.room_current_member_cnt} / {roomUpdate.room_start_member_cnt} 명
                                        </Text>
                                        <br /> */}
                                        </TitleDiv>
                                    ) : (
                                        <TitleDiv>
                                            <div style={styles.roomInfoContainer}>
                                                <div style={styles.codeContainer}>{roomEnterInfo.room_code}</div>
                                                <NameContainer>{roomEnterInfo.room_name}</NameContainer>

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
                                            </div>
                                            {/* TitleDiv {match.params.name}번 방 */}
                                            {/*  <br /> */}
                                            {/*  <Text>
                                            방제 : {roomEnterInfo.room_name} | 방 코드 : {roomEnterInfo.room_code} | 인원:{' '}
                                            {roomEnterInfo.room_current_member_cnt} / {roomEnterInfo.room_start_member_cnt} 명
                                        </Text> */}
                                        </TitleDiv>
                                    )}
                                    <BarContainer>
                                        <BarDiv>
                                            <BarInnerDiv>
                                                {colorList &&
                                                    colorList.map((element, key) =>
                                                        element.choose === 'true' ? (
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
                                                    )}
                                            </BarInnerDiv>
                                        </BarDiv>
                                    </BarContainer>
                                    {
                                        modify ?
                                            <ColorToast>색깔 변경 중 입니다....</ColorToast>
                                            :
                                            null
                                    }
                                    <UserDiv>
                                        <div style={styles.userListContainer}>
                                            {
                                                userList.current &&
                                                userList.current.map((element) => (

                                                    <UserCard
                                                        leader={leaderIdx}
                                                        id={element.user_idx}
                                                        nickname={element.user_name}
                                                        color={element.wrm_user_color}
                                                        ready={element.wrm_user_ready}
                                                    />
                                                ))
                                            }
                                            {
                                                grayBox()
                                            }

                                        </div>
                                    </UserDiv>
                                    <div
                                        onClick={() => {
                                            //   console.log('눌림');
                                            exitWaitingRoom();
                                        }}
                                        style={{
                                            width: '100px',
                                            justifyContent: 'space-between',
                                            marginTop: '-40px',
                                            cursor: 'grab',
                                        }}
                                    >
                                        <Exit src={exitPng} />
                                        <ExitText>나가기</ExitText>
                                    </div>
                                </SelectDiv>
                                <RightDiv>
                                    <Chatting chats={dummyChatData} socket={props.socket} room_idx={room_idx} height="520px" available={true} color={'WHITE'}></Chatting>
                                    <StartDiv>
                                        {
                                            isLeader === 0 //방장 아님
                                                ? (//console.log(style.red),
                                                    changeReady === true ? (
                                                        <BtnDiv
                                                            color="waiting"
                                                            onClick={() => {
                                                                readyClick(!changeReady);
                                                            }}
                                                        >
                                                            준비 완료
                                                        </BtnDiv>
                                                    ) : (
                                                        <BtnDiv
                                                            color="ready"
                                                            onClick={() => {
                                                                readyClick(!changeReady);
                                                            }}
                                                        >
                                                            준비 시작
                                                        </BtnDiv>
                                                    ))
                                                : //방장이다.
                                                (//console.log('방장이야'),
                                                    (
                                                        //일단 플레잉룸으로 넘어가기 위한 하드코딩 밑에 주석임 지울 예정
                                                        startMember === ready_cnt ? (
                                                            <BtnDiv isStart="yes" onClick={startClick}>
                                                                게임 시작
                                                            </BtnDiv>
                                                        )
                                                            : (
                                                                <BtnDiv isStart="no">
                                                                    <div className="textDiv"> 모든 플레이어가 레디를 해야 게임을 시작할 수 있습니다.</div>
                                                                    게임 시작</BtnDiv>
                                                            )
                                                    )) //게임 시작 api 요청 onclick 달기
                                        }
                                        {
                                            ready ?
                                                <ReadyToast>처리 중 입니다....</ReadyToast>
                                                :
                                                null
                                        }
                                    </StartDiv>
                                </RightDiv>
                            </Container>
                        </div>
                    )
                ) : (
                    <Loading />
                )
            ) : (
                <Loading />
            )}
        </Background>
    );
}

const styles = {
    userListContainer: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        width: '570px',
        height: '410px',
        flexFlow: 'row wrap',
    },

    roomInfoContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '625px',
        height: '50px',
    },

    codeContainer: {
        width: '70px',
        height: '20px',
        backgroundColor: '#A274D5',
        color: '#ffffff',
        fontFamily: 'Jua',
        borderRadius: '20px',
        fontSize: '13px',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '15px',
    },
};

const ColorToast = styled.div`
    display: flex;
    justify-content: center;
    width: 625px;
    height: 50px;
    margin-top: -10px;
    margin-left: 120px;
    text-align: center;
    position: absolute;
   /*  border-radius: 18px;
    border: 3px solid #a274d5; */
`;

const ReadyToast = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 8px;
    text-align: center;
`;

const NameContainer = styled.text`
    font-size: 45px;
    font-family: Black Han Sans;
    -webkit-text-stroke: 1px #000000; // 53305e
    font-weight: bold;
    color: #ffffff;
    text-shadow: 4px 4px 0px #000000;
    height: 50px;
    text-align: center;
    margin-left: 15px;
    margin-right: 15px;
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

const Container = styled.div`
    width: 1020px;
    height: 620px;
    // border: 1px solid #000;
    background-color: ${style.white};
    display: flex;
    flex-direction: row;
    overflow: hidden;
    border-bottom-left-radius: 1.5rem;
    border-bottom-right-radius: 1.5rem;
`;

const SelectDiv = styled.div`
    text-align: center;
    width: 780px;
    height: 600px;
    //background-color: #ffe5e5;
    justify-content: center;
    align-items: center;
`;

const RightDiv = styled.div`
    width: 220px;
    height: 600px;
    padding: 10px;
    overflow: hidden;
`;
const StartDiv = styled.div`
    width: 220px;
    height: 75px;
    overflow: hidden;
`;

const BtnDiv = styled.div`
  width: 210px;
  height: 38px;
  margin-top: 30px;
  background-color: #ffffff;
  border-radius: 18px;
  border: 3px solid #a274d5;
  color: #a274d5;
  //box-shadow: 2px 2px 2px #878787, 4px 4px 4px #878787;
  font-size: 27px;
  text-align: center;
  display: flow;
  align-items: center;
  justify-content: center;
  position: absolute;

  &:hover {
    background: #a274d5;
    color: white;
    border: 3px solid #a274d5;
    cursor: grab;
  }

  ${(props) =>
        props.color == "waiting"
            ? `
    background-color: #a274d5; 
    color: white; 
    &:hover {
        background: white;
        color: #a274d5; 
        border: 3px solid #a274d5;
        cursor: grab;
    }`
            : ""}

  ${(props) =>
        props.isStart == "yes"
            ? ``
            : props.isStart == "no"
                ? `&:hover { cursor: not-allowed;}opacity: 0.5;`
                : ``}

    &:hover .textDiv {
    background-color: ${style.white};
    color: ${style.black};
    border: 2px solid #000;
    border-radius: 10px;
    display: inline;
  }

  .textDiv {
    z-index: 1;
    overflow: hidden;
    position: absolute;
    top: -35px;
    left: -60px;
    width: 320px;
    display: none;
    padding: 5px;
    font-size: 15px;
  }
`;

const TitleDiv = styled.div`
    width: 625px;
    height: 55px;
    //margin-top: 25px;
    margin-bottom: 20px;
    margin-left: 30px;
    // background-color: #fff3ca;
    text-align: center;
    display: inline-block;
    overflow: hidden;
    align-item: center;
`;

const BarContainer = styled.div`
    width: 625px;
    text-align: center;
    display: inline-block;
    overflow: hidden;
    margin-left: 49px;
`;

const UserDiv = styled.div`
    width: 600px;
    padding: 5px;
    height: 420px;
    margin-top: 10px;
    margin-left: 80px;
    //background-color: #fff3ca;
    display: inline-block;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    text-align: center;
`;

const BarDiv = styled.div`
    width: 450px;
    height: 50px;
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
    border: 3px solid black;
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

    &:hover {
        cursor: grab;
    }

    ${(props) =>
        props.color == '#FF0000' || props.data == '#FF0000'
            ? `background-color: ${props.color}; border-top-left-radius: 15px; border-bottom-left-radius: 15px;`
            : props.color == '#FF0A9D' || props.data == '#FF0A9D'
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
    color: #000000;
    font-size: 13px;
    font-weight: light;
    // -webkit-text-stroke: 1px #c00202;
    margin-top: -5px;

    &:hover {
        color: #ff0000;
    }
`;