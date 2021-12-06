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

//"무비페이지에 str 자리 값넣어주기!!"

const PlayingResult = (props) => {
     let location = useLocation();
    const history = useHistory();

    const [seconds, setSeconds] = useState(10); //10초 보여주기
    const [winner, setWinner] = useState(''); // 중간 결과 승리자
    const [finalData, setFinalData] = useState(); //최종 결과 데이터

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

    /* alert('프롭스 넘어왔다!! ' + keyword +gameSetNo +gameIdx + gameSetIdx+ leaderIdx+JSON.stringify(userList) +roomIdx+role); */
        
    // local storage에 있는지 확인
    let data = localStorage.getItem('token');
    let save_token = JSON.parse(data) && JSON.parse(data).access_token;
    let save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;

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
        const restURL = 'http://3.17.55.178:3002/game/interim-result/' + gameIdx;

        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };
        axios
            .get(restURL, reqHeaders)
            .then(function (response) {
                console.log(response);
                //startSetAPI(3);
            })
            .catch(function (error) {
                console.log(error.response);
            });
    };

    const getFinalResult = async () => {
        const restURL = 'http://3.17.55.178:3002/game/final/' + gameIdx;

        console.log('토큰,,' + save_token);

        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };
        axios
            .delete(restURL, 
                reqHeaders, 
                {data : {
                    gameIdx : gameIdx
                }})

            .then(function (response) {
                console.log('최종결과 성공');
            })
            .catch(function (error) {
                console.log(error.response);
            });
    }

    useEffect(() => {
        props.socket.on('connect', () => {
            console.log('playing result connection server');
        });

        // 같은 대기실에 있는 클라이언트들에게 중간 결과 전송
        props.socket.on('get interim result', (data) => {
            setWinner(data.winner);
        });     
        
        // 같은 대기실에 있는 클라이언트들에게 최종 결과 전송
        props.socket.on('get final result', (data) => {
            setFinalData(data);
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
        //먼가 여기서 방장 인덱스랑 내 인덱스가 같은지 같다면 
        // 1) 세트시작 2) 중간결과 3) 최종결과 api 를 호출한다. ( 2,3번은 success 시 세트시작 api도 콜한다면?)
        // 밑에서 gameSetNo에 값에 따른 삼항 연산자로 
        //각각의 소켓에 데이터가 있을 때 
        //--------
        //중간 최종결과는 10초씩 보여줘야하니깐 밑에 if문에서 setSeconds 해주기!

        if(gameSetNo === 2 && leaderIdx === save_user_idx) {
            getMiddleResult();
        }
        else if(gameSetNo === 3 && leaderIdx === save_user_idx) {
            getFinalResult();
        }               

    }, []);

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
                            seconds <= 0 ? (
                                gameSetNo === 2 ?
                                    //플레잉 룸으로 
                                    history.push({
                                        pathname: '/playingroom/' + roomIdx,
                                        state: { isSet: true, gameSetNo: gameSetNo+1, gameIdx: gameIdx, userList: userList, gameSetIdx: gameSetIdx, room: roomIdx, leaderIdx: leaderIdx},
                                    })
                                :
                                    history.push({
                                        pathname: '/roomlist'
                                    }) //게임종료, 룸리스트로 이동
                            )
                            : 
                            ( 
                               gameSetNo === 2 ? 
                                winner && <GameMiddleResult winner={winner} />
                                :
                                finalData && <GameFinalResult data={finalData} /> //최종 결과
                            )
                        }

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
