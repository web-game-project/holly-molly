import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import MissionWord from '../components/MissionWord';
import night from '../assets/night.svg';
import Chatting from '../components/Chatting';
import GameUserCard from '../components/GameUserCard';
import Header from '../components/Header';
import GameMiddleResult from '../components/GameMiddleResult';
import GameFinalResult from '../components/GameFinalResult';
import GameOpenResult from '../components/GameOpenResult';
import GameSetImageShow from '../components/GameSetImageShow';
import Loading from '../components/Loading';
import RefreshVerification from '../server/RefreshVerification.js';

//페이지 이동
import { useHistory, useLocation } from 'react-router';
//통신
import axios from 'axios';
//깊은 복제
import * as _ from 'lodash';

import BGM from '../assets/sound/backgroundSound.mp3';
import BGMSound from '../components/BGMSound';

let userList = [{}];

const PlayingResult = (props) => {
    BGMSound(BGM, 1, 2000);
    
    let location = useLocation();
    const history = useHistory();
    let exitSocket = useRef(false);

    const [seconds, setSeconds] = useState(15); //10초 보여주기
    const [winner, setWinner] = useState(''); // 중간 결과 승리자
    const [finalData, setFinalData] = useState(); //최종 결과 데이터

    const [normal, setNormal] = useState(location.state.normal); //props로 받음 비정상 종료인지 구분하는 변수
    const [exitData, setExitData] = useState(location.state.exitData); //props로 받는 비정상 종료 후 최종결과 데이터
    const [keyword, setKeyword] = useState(location.state.keyword);

    const BaseURL = 'http://3.17.55.178:3002';

    // 전 페에지 (GameVoteResultComponet) 넘어온 데이터 
    let gameSetNo = location.state.gameSetNo;
    const gameIdx = location.state.gameIdx;
    const gameSetIdx = location.state.gameSetIdx;
    const leaderIdx = location.state.leaderIdx;

    if(exitSocket.current === false){
        userList = location.state.userList; //그림판에서 넘어온 유저리스트
    }

    const [afterExitUserList, setAfterExitUserList] = useState(); 

    const roomIdx = location.state.roomIdx;
    const role = location.state.role;

    //토큰 검사
    let verify = RefreshVerification.verification();
    let data, save_token, save_user_idx;

    if (normal === true) {
        if (verify === true) {
            data = sessionStorage.getItem('token');
            save_token = JSON.parse(data) && JSON.parse(data).access_token;
            save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;
        }
    }

    // 중간 결과 (방장만 부를 수 있음)
    const getMiddleResult = async () => {
        const restURL = 'http://3.17.55.178:3002/game/interim-result/' + gameIdx;

        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };
        axios
            .get(restURL, reqHeaders)
            .then(function (response) {
                //startSetAPI(3);
            })
            .catch(function (error) {
               // alert('Error ' + error.response.data.message);
            });
    };

    const getFinalResult = async () => {
        const restURL = 'http://3.17.55.178:3002/game/final/' + gameIdx;

        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };
        axios
            .delete(restURL,
                reqHeaders,
                {
                    data: {
                        gameIdx: gameIdx
                    }
                })

            .then(function (response) {
            })
            .catch(function (error) {
               // alert('Error ' + error.response.data.message);
            });
    }

    useEffect(() => {
        props.socket.on('connect', () => {
        });

        // 같은 대기실에 있는 클라이언트들에게 중간 결과 전송
        props.socket.on('get interim result', (data) => {
            setWinner(data.winner);
        });

        // 같은 대기실에 있는 클라이언트들에게 최종 결과 전송
        props.socket.on('get final result', (data) => {           

            if (gameSetNo === 2 && exitSocket.current === true) { //게임 세트가 2인데 최종결과 전송이 왔다? 비정상 종료다.
                // 정렬시, 유저 리스트에서 본인 인덱스 찾아서 제일 위로 올리기 위해 0으로 바꾸기
                let myIndex = userList.find((x) => x.user_idx === save_user_idx);
                if (myIndex) {
                    myIndex.game_member_order = 0;
                }

                // 그림 그리기 순서 대로 유저 리스트 재정렬
                userList.sort(function (a, b) {
                    return a.game_member_order - b.game_member_order;
                });

                // 정렬된 리스트 중 본인 인덱스 찾아서 "나" 로 표시
                var myItem = userList.find((x) => x.user_idx === save_user_idx);
                if (myItem) {
                    myItem.game_member_order = '나';
                }

                //console.log('중간결과 비정상' + JSON.stringify(data));
                setKeyword("게임 종료");
                setNormal(false);
                setExitData(data);
                setSeconds(15); ///다시 15초를 샌다.
            }
            else { // 게임 세트가 3일 때
                setFinalData(data);
            }

        });

        // 방 퇴장 
        props.socket.on('exit room', (data) => {
            var exitPerson = userList.find((x) => x.user_idx === data.user_idx); 

            userList = userList.filter(x => x.user_idx !== data.user_idx);
            
            if(exitPerson){
                for (let i = 0; i < userList.length; i++) {
                    if(exitPerson.game_member_order < userList[i].game_member_order){
                        userList[i].game_member_order = userList[i].game_member_order - 1;
                    }
                }
            }

            let copyList = _.cloneDeep(userList);

            // 정렬시, 유저 리스트에서 본인 인덱스 찾아서 제일 위로 올리기 위해 0으로 바꾸기
            let myIndex = copyList.find((x) => x.user_idx === save_user_idx);
            if (myIndex) {
                myIndex.game_member_order = 0;
            }

            // 그림 그리기 순서 대로 유저 리스트 재정렬
            copyList.sort(function (a, b) {
                return a.game_member_order - b.game_member_order;
            });
            
            // 정렬된 리스트 중 본인 인덱스 찾아서 "나" 로 표시
            var myItem = copyList.find((x) => x.user_idx === save_user_idx);
            if (myItem) {
                myItem.game_member_order = '나';
            }

            exitSocket.current = true;

            setAfterExitUserList(copyList);
        });
    }, []);

    useEffect(() => {
        const countdown = setInterval(() => {
            if (parseInt(seconds) > 0) {
                setSeconds(parseInt(seconds) - 1);
            }
        }, 1000);

        return () => {
            clearInterval(countdown);
        };
    }, [seconds]);

    useEffect(() => {
        //getFinalResult : 정상적으로 게임이 3세트가 진행되었을 때 API 요청하면 백쪽에서 최종결과 소켓을 전송함.
        if (normal === true) {
            if (gameSetNo === 2 && leaderIdx === save_user_idx) {
                getMiddleResult();
            }
            else if (gameSetNo === 3 && leaderIdx === save_user_idx) {
                getFinalResult();
            }
        }
    }, []);

    // 비정상 종료
    const exit = async () => {
        const restURL = 'http://3.17.55.178:3002/game/exit';

        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };
        axios
            .delete(restURL, reqHeaders)
            .then(function (response) {
                //console.log(response);
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

    // 뒤로 가기 감지 시 비정상종료 처리 
    /* useEffect(()=> {
        const unblock = history.block((loc, action) => {
            if (action === 'POP') {
                if (window.confirm('게임방에서 나가게됩니다. 뒤로 가시겠습니까?')) {
                    exit();
                    return true
                } else {
                    return false
                }
            }
            return true
        })

        return () => unblock()
    },[])  */

    // 깊은 복사 
    let onlyUserList = _.cloneDeep(userList); // 내 정보 저장 
    let reOrderList = _.cloneDeep(userList); // 유저 리스트 중 순서 정리를 위한 리스트 

    // 유저 리스트 중 내 정보 배열 및 내 순서 저장
    const myList = onlyUserList.find((x) => x.user_idx === save_user_idx);

    // 정렬시, 유저 리스트에서 본인 인덱스 찾아서 제일 위로 올리기 위해 0으로 바꾸기
    let myIndex = reOrderList.find((x) => x.user_idx === save_user_idx);
    if (myIndex) {
        myIndex.game_member_order = 0;
    }

    // 그림 그리기 순서 대로 유저 리스트 재정렬
    reOrderList.sort(function (a, b) {
        return a.game_member_order - b.game_member_order;
    });

    // 정렬된 리스트 중 본인 인덱스 찾아서 "나" 로 표시
    var myItem = reOrderList.find((x) => x.user_idx === save_user_idx);
    if (myItem) {
        myItem.game_member_order = '나';
    }

    return (
        <React.Fragment>
            <Background>
                <Header />
                <Container>
                    <BackGroundDiv>
                        <UserDiv>
                            {/* 제시어 role parameter 값 ghost/human -> 역할에 따라 배경색이 변함*/}
                            <MissionWord text={keyword} role={role}></MissionWord>
                            {/* 유저 컴포넌트 */}
                            {exitSocket.current  === false? 
                                            (reOrderList && (reOrderList.map((values) => (
                                                <GameUserCard
                                                    user_idx={values.user_idx}
                                                    user_color={values.user_color}
                                                    user_name={values.user_name}
                                                    user_role={values.user_role}
                                                    user_order={values.game_member_order}
                                                    user_exit={values.user_exit}
                                                ></GameUserCard>
                                            )))) : 
                                            (afterExitUserList && (
                                                afterExitUserList.map((values) => (
                                                    <GameUserCard
                                                        user_idx={values.user_idx}
                                                        user_color={values.user_color}
                                                        user_name={values.user_name}
                                                        user_role={values.user_role}
                                                        user_order={values.game_member_order}
                                                        user_exit={values.user_exit}
                                                ></GameUserCard>
                                                )))) 
                            }
                        </UserDiv>

                        {
                            seconds <= 5 ? (
                                gameSetNo === 2 && normal === true ?
                                    //플레잉 룸으로 
                                    history.push({
                                        pathname: '/playingroom/' + roomIdx,
                                        state: { isSet: true, gameSetNo: gameSetNo + 1, gameIdx: gameIdx, userList: userList, gameSetIdx: gameSetIdx, room: roomIdx, leaderIdx: leaderIdx },
                                    })
                                    :
                                    finalData === undefined && normal === true ?
                                        <Loading />
                                        :
                                        (normal === false ?
                                            <GameOpenResult roomIdx={roomIdx} name={exitData.human_name} color={exitData.human_color} />
                                            :
                                            <GameOpenResult roomIdx={roomIdx} name={finalData.human_name} color={finalData.human_color} />
                                        )
                            )
                                :
                                (
                                    gameSetNo === 2 && normal === true ?  // 2세트이고, 비정상 종료가 아닐 때,
                                        winner && <GameMiddleResult winner={winner} />
                                        : //게임세트가 어떻게 되었든 최종결과 보여주기
                                        normal === true ?
                                            finalData && <GameFinalResult data={finalData} /> //최종 결과
                                            :
                                            exitData && <GameFinalResult data={exitData} />
                                )
                        }

                        {/* 최종 결과 출력이라면?*/}

                        {/* <GameFinalResult data={dummyTest} /> */}

                        {/* 최종 결과 공개라면? */}
                        {/* <GameOpenResult data={dummyOpenResultTest} /> */}

                        <ChatDiv>
                            {/* <Chatting /> */}
                            {/* <Chatting room_idx={location.state.data.room_idx}></Chatting> */}
                            <Chatting socket={props.socket} room_idx={53} available={true}></Chatting> {/* 채팅 비활성화 */}
                        </ChatDiv>
                    </BackGroundDiv>
                </Container>
            </Background>
        </React.Fragment>
    );
};

const Background = styled.div`
    background-color: #180928;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const Container = styled.div`
    width: 1020px;
    height: 620px;
    display: flex;
    flex-direction: row;
`;

const UserDiv = styled.div`
    text-align: center;
    width: 160px;
    height: 620px;
    border-color: transparent;
    background-color: transparent;
    justify-content: center;
    align-items: center;
`;

const BackGroundDiv = styled.div`
    background-image: url(${night});
    width: 1020px;
    height: 620px;
    flex-direction: row;
    display: flex;
    justify-content: space-between;
`;

const ChatDiv = styled.div`
    margin: 1px;
`;

export default PlayingResult;