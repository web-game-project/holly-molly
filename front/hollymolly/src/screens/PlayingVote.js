import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import MissionWord from '../components/MissionWord';
import night from '../assets/night.svg';
import Chatting from '../components/Chatting';
import GameUserCard from '../components/GameUserCard';
import Header from '../components/Header';
import PlayingLoading from '../components/PlayingLoading';
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

//import RefreshVerification from '../server/RefreshVerification.js';
//RefreshVerification.verification();

const PlayingVote = (props) => {

    let location = useLocation();
    const history = useHistory();

    // 투표 10초 타이머 세기, 투표 10초 후에 1초 더 여유롭게.
    const [seconds, setSeconds] = useState(11);

    //투표 전 로딩페이지 구현을 위한 타이머
    const [secondsLoading, setSecondsLoading] = useState(10);

    let gameSetIdx = location.state.gameSetIdx; //그림판에서 넘어온 게임 세트 인덱스
    let userList = location.state.userList; //그림판에서 넘어온 유저리스트

    let roomIdx = location.state.roomIdx; //그림판에서 넘어온 룸인덱스
    let role =  location.state.role; //그림판에서 넘어온 역할

    let keyword =   location.state.keyword; //그림판에서 넘어온 키워드
    let leader = location.state.leaderIdx;

    let isMissionPerformance = location.state.perforamance; 
    console.log('투표 미션 ㄱ밧' + isMissionPerformance);

    if(isMissionPerformance === false){
        console.log('미견 수행하러가');
    }
    else{
        console.log('미션 수행 함   '+isMissionPerformance);
    }

    let gameSetNo = location.state.gameSetNo;

    let gameIdx = location.state.gameIdx;
    
    let voteTotalList = useRef([]);

    if(location.state.voteTotalList !== undefined)
        voteTotalList.current = location.state.voteTotalList;
    console.log('투표 보트토탈 리ㅡㅅ트' + JSON.stringify(voteTotalList.current));

    // local storage에 있는지 확인
    let data = localStorage.getItem('token');
    let save_token = JSON.parse(data) && JSON.parse(data).access_token;
    let save_refresh_token = JSON.parse(data) && JSON.parse(data).refresh_token;
    let save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;
    let save_user_name = JSON.parse(data) && JSON.parse(data).user_name;

    const [winner, setWinner] = useState(''); // 중간 결과 승리자

    const movePage = useRef(location.state.move);

    useEffect(() => {
         if(movePage.current !== undefined){
            const countdown = setInterval(() => {
                if (parseInt(secondsLoading) > 0) {
                    setSecondsLoading(parseInt(secondsLoading) - 1);
                }
                if (parseInt(secondsLoading) === 0) {
                    setSecondsLoading(0); 
                }
            }, 1000);

            return () => {
                clearInterval(countdown);                
            };
            
        }
    }, [secondsLoading]);
    
    useEffect(() => {
            const countdown = setInterval(() => {
                if (parseInt(seconds) > 0) {
                    setSeconds(parseInt(seconds) - 1);
                }

                if (parseInt(seconds) === 0) {
                    setSeconds(0);                    
                }
            }, 1000);

            return () => {
                clearInterval(countdown);                
            };

    }, [seconds]);

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
            { movePage.current !== undefined && secondsLoading > 0 ?
                    <PlayingLoading txt="투표 하기 전, 고민할 시간 10초 드리겠습니다." />                         
                : 
                <Header />,
                <Container>
                    <BackGroundDiv>
                        <UserDiv>
                            {/* 제시어 role parameter 값 ghost/human -> 역할에 따라 배경색이 변함*/}
                            <MissionWord text={keyword} role={role}></MissionWord>
                            {/* 유저 컴포넌트 */}
                            {
                                //let user_list = location.state.data.user_list,

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
                            seconds > 0 ?
                                // 투표  
                                <GameVoteComponent socket={props.socket} gameIdx = {gameIdx} gameSetNo={gameSetNo} gameSet={gameSetIdx} role={role} leaderIdx={leader} userList={userList} room_idx={roomIdx} keyword={keyword}/>                             
                            :       
                                isMissionPerformance === false ?
                                 <GameMissionPerformance leaderIdx={leader} gameSetNo={gameSetNo} gameIdx = {gameIdx} voteTotalList={voteTotalList.current} socket={props.socket} userList={userList} gameSet={gameSetIdx} roomIdx={roomIdx} keyword={keyword} role={role} cnt={userList.length} />
                                :
                                <GameVoteResult leaderIdx={leader} gameSetNo={gameSetNo} gameIdx = {gameIdx} voteTotalList={voteTotalList.current} socket={props.socket} userList={userList} gameSet={gameSetIdx} roomIdx={roomIdx} keyword={keyword} role={role} cnt={userList.length} />
                        }                        

                        <ChatDiv>
                            <Chatting socket={props.socket} room_idx={roomIdx} available={false}></Chatting> {/* 채팅 비활성화 */}
                        </ChatDiv>
                    </BackGroundDiv>                    
                </Container> 
                } : <></> 
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
