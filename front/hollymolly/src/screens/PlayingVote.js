import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import MissionWord from '../components/MissionWord';
import night from '../assets/night.svg';
import Chatting from '../components/Chatting';
import GameUserCard from '../components/GameUserCard';
import Header from '../components/Header';
import PlayingLoading from '../components/PlayingLoading';

//페이지 이동
import { useHistory, useLocation, Prompt } from 'react-router';

//투표 컴포넌트
import GameVoteComponent from '../components/GameVoteComponent';
//투표 결과 컴포넌트
import GameVoteResult from '../components/GameVoteResultComponent';

//통신
import axios from 'axios';

//import RefreshVerification from '../server/RefreshVerification.js';
//RefreshVerification.verification();

const PlayingVote = (props) => {

    let location = useLocation();
    const history = useHistory();

    // 투표 10초 타이머 세기, 투표 10초 후에 1초 더 여유롭게 샌다.
    const [seconds, setSeconds] = useState(11);

    //투표 전 로딩페이지 구현을 위한 타이머
    const [secondsLoading, setSecondsLoading] = useState(10);

    let gameSetIdx = location.state.gameSetIdx; //그림판에서 넘어온 게임 세트 인덱스
    let userList = location.state.userList; //그림판에서 넘어온 유저리스트
    let roomIdx = location.state.roomIdx; //그림판에서 넘어온 룸인덱스
    let role =  location.state.role; //그림판에서 넘어온 역할
    let keyword =   location.state.keyword; //그림판에서 넘어온 키워드
    let leader = location.state.leaderIdx;

    ///console.log('data 잘 받았냐? ' + gameSetIdx + '/' + userList + '/' +  roomIdx + '/' +  role + '/' + keyword);
    
    // local storage에 있는지 확인
    let data = localStorage.getItem('token');
    let save_token = JSON.parse(data) && JSON.parse(data).access_token;
    let save_refresh_token = JSON.parse(data) && JSON.parse(data).refresh_token;
    //let save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;
    let save_user_idx = 1;
    let save_user_name = JSON.parse(data) && JSON.parse(data).user_name;

    const [winner, setWinner] = useState(''); // 중간 결과 승리자

    const movePage = useRef(location.state.move);

    useEffect(() => {
         if(movePage.current !== undefined){
            //데이터 전달 받은게 세팅되기 전까지는 타이머가 돌아가면 안됨.
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
            //데이터 전달 받은게 세팅되기 전까지는 타이머가 돌아가면 안됨.
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

    const user_list = [
        {
            user_idx: 206,
            user_name: '가나다라마바사아자차',
            user_color: 'PURPLE',
            game_member_order: '나',
        },
        {
            user_idx: 207,
            user_name: '용명아저씨',
            user_color: 'RED',
            game_member_order: 1,
        },
        {
            user_idx: 210,
            user_name: '흰둥이',
            user_color: 'YELLOW',
            game_member_order: 2,
        },
        {
            user_idx: 211,
            user_name: '미선씌',
            user_color: 'GREEN',
            game_member_order: 3,
        },
        {
            user_idx: 315,
            user_name: '11',
            user_color: 'ORANGE',
            game_member_order: 4,
        },
        {
            user_idx: 384,
            user_name: '가나다라마바사아자차',
            user_color: 'BLUE',
            game_member_order: 5,
        },
    ];

    return (
        <React.Fragment>
            <Background>
            { movePage.current !== undefined && secondsLoading > 0 ?
                    <PlayingLoading move="투표 하기 전, 고민할 시간 10초 드리겠습니다." />                         
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

                                userList.map((index, key) => (
                                    <GameUserCard
                                        user_idx={userList[key].user_idx}
                                        user_color={userList[key].user_color}
                                        user_name={userList[key].user_name}
                                        user_role={userList[key].user_role}
                                        user_order={userList[key].game_member_order}
                                    ></GameUserCard>
                                ))
                            }
                        </UserDiv>
                        {
                            seconds > 0 ?
                                // 투표 
                                <GameVoteComponent data={userList} gameSet={gameSetIdx} /> 
                            :                           
                                // 투표 결과, 타이머가 0일 떄 
                                seconds === 0 ?
                                <GameVoteResult data={userList} gameSet={gameSetIdx} roomIdx={roomIdx} role={role} cnt={userList.length} />
                                : 
                                null
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
