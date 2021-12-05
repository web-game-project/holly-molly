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

//페이지 이동
import { useHistory, useLocation, Prompt } from 'react-router';
//통신
import axios from 'axios';
//깊은 복제
import * as _ from 'lodash';
//import RefreshVerification from '../server/RefreshVerification.js';
//RefreshVerification.verification();


const PlayingResult = (props) => {
    //location으로 넘어올 데이터 : userList, role, keyword, 게임세트인덱스, 리더인덱스, 게임인덱스, 게임세트_no, 룸인덱스
    let location = useLocation();
    const history = useHistory();

    const BaseURL = 'http://3.17.55.178:3002';

    // 전 페에지 (GameVoteResultComponet) 넘어온 데이터 
    let gameSetNo = location.state.gameSetNo;
    const gameIdx = location.state.gameIdx;
    const gameSetIdx = location.state.gameSetIdx;
    const leaderIdx = location.state.leaderIdx;
    const userList = location.state.userList;
    const roomIdx = location.state.roomIdx;
    const keyword = location.state.keyword;
    const role = location.state.role;

    alert('프롭스 넘어왔다!! ' + keyword +gameSetNo +gameIdx + gameSetIdx+ leaderIdx+JSON.stringify(userList) +roomIdx+role);
        
    let currentGameSetNo = useRef(0);
    const socketData = useRef({});

    //const [possible, setPossible] = useState(false);
    const possible = useRef(false);

    // local storage에 있는지 확인
    let data = localStorage.getItem('token');
    let save_token = JSON.parse(data) && JSON.parse(data).access_token;
    let save_refresh_token = JSON.parse(data) && JSON.parse(data).refresh_token;
    let save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;
    let save_user_name = JSON.parse(data) && JSON.parse(data).user_name;

    const [winner, setWinner] = useState(''); // 중간 결과 승리자

    const dummyTest = {
        one_game_set_human_score: 1,
        two_game_set_human_score: 2,
        three_game_set_human_score: 0,
        total_game_set_human_score: 3,
        one_game_set_ghost_score: 1,
        two_game_set_ghost_score: 2,
        three_game_set_ghost_score: 0,
        total_game_set_ghost_score: 2,
    };

    const dummyOpenResultTest = {
        human_user_name: '나는 1번',
        human_user_color: 'RED',
    };
    // **

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
    
    // 중간 결과 (방장만 부를 수 있음)
    const getMiddleResult = async () => {
        const restURL = 'http://3.17.55.178:3002/game/interim-result/' + location.state.data.game_idx;

        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };
        axios
            .get(restURL, reqHeaders)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error.response);
            });
    };

    useEffect(() => {
        //getMiddleResult();
        props.socket.on('connect', () => {
            console.log('playing result connection server');
        });

        // 같은 대기실에 있는 클라이언트들에게 중간 결과 전송
        props.socket.on('get interim result', (data) => {
            setWinner(data.winner);
        });

        //세트 시작 소켓
        props.socket.on('start set', (data) => {
            alert('세트 ' + JSON.stringify(data.before_game_set_img));
           // socketData.current = data.user_list; 
            socketData.current = data; 
            possible.current = true;            
        });
    }, []);

    const startSetAPI = async (str) => {
        console.log('api call');

        const restURL = BaseURL + '/game/set';

        currentGameSetNo.current = str;

        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };

        axios
            .post(
                restURL,
                {
                    game_idx : gameIdx,
                    game_set_no : str,
                },
                reqHeaders
            )
            .then(function (response) {
                console.log('game set success');
                //possible.current = true;
            })
            .catch(function (error) {
                alert('set' + error);
            });
    }

    useEffect(() => {       
        if(gameSetNo === 1 && leaderIdx === save_user_idx) {
                startSetAPI(2);
        }

        if(possible === true){ //가능 할 때 세트시작
            if(gameSetNo === 2 && leaderIdx === save_user_idx) {
                    startSetAPI(3);
            }
            else{
                
            }      
        }   
        else{

        }  

    }, [possible]);

     // 비정상 종료
     const exit = async () => {   
        console.log("exit!!!");
        const restURL = 'http://3.17.55.178:3002/game/exit';

        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };
        axios
            .delete(restURL, reqHeaders)
            .then(function (response) {
                alert(response);
                history.push({
                    pathname: '/inputname', // 성공하면 닉네임 설정 창으로 이동 
                });
            })
            .catch(function (error) {
                alert(error);
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
    };

    // 종료시 실행 
    const handleEndConcert = async () => {
        exit();
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
                            {
                                reOrderList.map((index, key) => (
                                    <GameUserCard
                                        user_idx={reOrderList[key].user_idx}
                                        user_color={reOrderList[key].user_color}
                                        user_name={reOrderList[key].user_name}
                                        user_role={reOrderList[key].user_role}
                                        user_order={reOrderList[key].game_member_order}
                                    ></GameUserCard>
                                ))
                            }
                        </UserDiv>

                        {
                            possible === true ?
                                socketData && <GameSetImageShow beforeData={socketData.current} roomIdx={roomIdx} gameSetNo={currentGameSetNo.current} leaderIdx={leaderIdx}/>
                            :
                                <text>두번째 세트 아직 놉 </text>
                        }
                        
                        {/* 중간 결과 출력이라면? */}

                        {/* <GameMiddleResult winner={'ghost'} /> */}
                        {/* <GameMiddleResult winner={winner} />  */}

                        {/* 최종 결과 출력이라면?*/}

                        {/* <GameFinalResult data={dummyTest} /> */}

                        {/* 최종 결과 공개라면? */}
                        {/* <GameOpenResult data={dummyOpenResultTest} /> */}

                        <ChatDiv>
                            {/* <Chatting /> */}
                            {/* <Chatting room_idx={location.state.data.room_idx}></Chatting> */}
                            <Chatting socket={props.socket} room_idx={53} available={false}></Chatting> {/* 채팅 비활성화 */}
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
