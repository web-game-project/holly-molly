import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import MissionWord from '../components/MissionWord';
import night from '../assets/night.svg';
import Chatting from '../components/Chatting';
import GameUserCard from '../components/GameUserCard';
import Header from '../components/Header';
import PlayingLoading from '../components/PlayingLoading';
import style from '../styles/styles';
//투표 컴포넌트
import GameVoteComponent from '../components/GameVoteComponent';
//투표 결과 컴포넌트
import GameVoteResult from '../components/GameVoteResultComponent';
//마피아 제시어 입력
import GameMissionPerformance from '../components/GameMissionPerformance';

//페이지 이동
import { useHistory, useLocation, Prompt } from 'react-router';

//통신
import axios from 'axios';
//깊은 복제
import * as _ from 'lodash';

import RefreshVerification from '../server/RefreshVerification.js';
//RefreshVerification.verification();

import { useSelector } from 'react-redux';

let userList = [{}];

const PlayingVote = (props) => {

    const BaseURL = useSelector((state) => state.socket.base_url);

    let location = useLocation();
    const history = useHistory();

    let exitSocket = useRef(false);
    let finalSocket = useRef(false);

    // 투표 10초 타이머 세기, 투표 10초 후에 1초 더 여유롭게.
    const [seconds, setSeconds] = useState(11);

    //투표 전 로딩페이지 구현을 위한 타이머
    //const [secondsLoading, setSecondsLoading] = useState(10);

    //유저가 미션수행은 햇는가?
    const [isHumanSubmit, setIsHumanSubmit] = useState(false);

    //이전페이지를 알 수 있는 방법
    //const movePage = useRef(location.state.move);

    let gameSetIdx = location.state.gameSetIdx; //그림판에서 넘어온 게임 세트 인덱스
    let gameSetNo = location.state.gameSetNo;
    let gameIdx = location.state.gameIdx;

    if(exitSocket.current === false){
        userList = location.state.userList; //그림판에서 넘어온 유저리스트
    }

    const [afterExitUserList, setAfterExitUserList] = useState(); 

    let roomIdx = location.state.roomIdx; //그림판에서 넘어온 룸인덱스
    let role = location.state.role; //그림판에서 넘어온 역할

    let keyword = location.state.keyword; //그림판에서 넘어온 키워드
    let leader = location.state.leaderIdx;

    let chatAvailable = useRef(true);

    //토큰 검사
    let data, save_token, save_user_idx;

    data = sessionStorage.getItem('token');
    save_token = JSON.parse(data) && JSON.parse(data).access_token;
    save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;

    function getToken() {
        data = sessionStorage.getItem('token');
        save_token = JSON.parse(data) && JSON.parse(data).access_token;
        save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;
    }

    //투표하기 전에 고민의 10초 세기
    /* useEffect(() => {
        if (movePage.current !== undefined) {
            const countdown = setInterval(() => {
                if (parseInt(secondsLoading) > 0) {
                    setSecondsLoading(parseInt(secondsLoading) - 1);
                }
                if (parseInt(secondsLoading) === 0) {
                    setSeconds(11);
                    setSecondsLoading(-1);
                }
            }, 1000);

            return () => {
                clearInterval(countdown);
            };

        }
    }, [secondsLoading]); */

    function changeColor(color){
        if(color === 'RED'){
            color = style.red_bg;
        }else if(color === 'ORANGE'){
            color = style.orange_bg;
        }else if(color === 'YELLOW'){
            color = style.yellow_bg;
        }else if(color === 'GREEN'){
            color = style.green_bg;
        }else if(color === 'BLUE'){
            color = style.blue_bg;
        }else if(color === 'PINK'){
            color = style.pink_bg;
        }else if(color === 'WHITE'){
            color = '#FFFFFF'
        }else{
            color = style.purple_bg;
        }
    
        return color;
    }

    //이전 채팅 이력 정보 조회
    let chats = useRef([]);
    const getChatHistory = async () => {
        
        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };
        const restURL = BaseURL + '/game/chat/' + roomIdx;

        axios
            .get(restURL, reqHeaders)
            .then(function (response) {
                //console.log(response.data);  
                for(let i = 0; i < response.data.length; i++){
                    const chat = {
                        recentChat: response.data[i].chat_msg,
                        recentChatColor: changeColor(response.data[i].wrm_user_color),
                        recentChatUserName: response.data[i].user_name
                    }

                    chats.current.push(chat); 
                    
                }   
                //console.log(chats.current);  
            })
            .catch(function (error) {

                let resErr = error.response.data.message;

                if ("로그인 후 이용해주세요." === resErr) { //401 err
                    let refresh = RefreshVerification.verification();
                    getToken();
                    getChatHistory();

                }
                else
                    alert(resErr);
            });
    }

    //투표 시간 10초 세기
    useEffect(() => {
        const countdown = setInterval(() => {
            if (parseInt(seconds) > 0) {
                setSeconds(parseInt(seconds) - 1);
            }

            if (parseInt(seconds) === 0) {
                chatAvailable.current = false;
                setSeconds(-1);  // -1인 이유 -1일 때 voteComponent call                  
            }
        }, 1000);
        return () => {
            clearInterval(countdown);
        };
    }, [seconds]);

    useEffect(() => {

        props.socket.on('connect', () => {
            //console.log('playing vote');
        });
        getChatHistory();

        /* props.socket.on('vote', (data) => {
            console.log('socket 투표 결과 ' + JSON.stringify(data.vote_rank)); // success 메시지
            voteTotalList.current = data.vote_rank;

            //data.vote_rank의 length가 0이면 투표결과가 없다!
        }); */

        // 인간 답안 제출 완료 
        props.socket.on('submit human answer', (data) => {
           // console.log('submit human answer' + data.human_submit);

            if (data.human_submit === true) {
                setIsHumanSubmit(true);
            }
        });

        // 방 퇴장 
        props.socket.on('exit room', (data) => {
            //console.log('exit room');   
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

        // 비정상 종료 감지 최종 결과 전송
        props.socket.on('get final result', (data) => {
            finalSocket.current = true;

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

            detectExit(data);
            /* if(exitSocket.current === true){
                history.push({
                    pathname: '/playingresult/' + roomIdx,
                    state: { gameSetNo: gameSetNo, gameIdx: gameIdx, leaderIdx: leader, userList: userList, roomIdx: roomIdx, gameSetIdx: gameSetIdx.current, keyword: keyword, role: role, exitData: data, normal: false},
                })
            } */

        });  
    }, []);

    // 비정상 종료 감지 후 최종 결과 페이지로 이동 
    const detectExit = async (data) => {
        if(exitSocket.current === true && finalSocket.current === true){
            history.push({
                pathname: '/playingresult/' + roomIdx,
                state: { gameSetNo: gameSetNo, gameIdx: gameIdx, leaderIdx: leader, userList: userList, roomIdx: roomIdx, gameSetIdx: gameSetIdx.current, keyword: "게임종료", role: role, exitData: data, normal: false},
            })
        }
    }

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

    // 비정상 종료
    const exit = async () => {
        //console.log("exit!!!");
        const restURL = BaseURL + '/game/exit';

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
               // alert(error.response.data.message);
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
                if(window.confirm('게임방에서 나가게됩니다. 뒤로 가시겠습니까?')){
                    exit();
                    return true
                }else{
                    return false
                }
            }
            return true
        })

        return () => unblock()
        
    },[])  */

    return (
        <React.Fragment>
            <Background>
                {/* {movePage.current !== undefined && secondsLoading > 0 ?
                    <PlayingLoading txt="투표 하기 전, 고민할 시간 10초 드리겠습니다." /> : */}
                    <div>
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
                                    (seconds !== -1) ? (<GameVoteComponent leaderIdx={leader} userList={userList} gameSet={gameSetIdx} />) :
                                        (!isHumanSubmit ? <GameMissionPerformance socket={props.socket} leaderIdx={leader} gameSet={gameSetIdx} role={role} /> :
                                           <GameVoteResult leaderIdx={leader} gameSetNo={gameSetNo} gameIdx={gameIdx} userList={userList} gameSet={gameSetIdx} roomIdx={roomIdx} keyword={keyword} role={role} cnt={userList.length} />)
                                }
                                
                                <ChatDiv>
                                    <Chatting chats={chats.current} socket={props.socket} roomIdx={roomIdx} available={chatAvailable.current} color={myList&&myList.user_color}></Chatting> {/* 채팅 비활성화 */}
                                </ChatDiv>
                            </BackGroundDiv>
                        </Container>
                    </div>
                {/* } */}
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
    overflow: hidden;
    border-bottom-left-radius: 1.5rem;
    border-bottom-right-radius: 1.5rem;
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

const DrawDiv = styled.div`
    width: 640px;
    height: 620px;
    display: flex;
    align-items: center;
    justify-content: center;
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
export default PlayingVote;