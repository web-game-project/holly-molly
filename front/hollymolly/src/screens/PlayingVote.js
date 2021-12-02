import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import MissionWord from '../components/MissionWord';
import night from '../assets/night.svg';
import Chatting from '../components/Chatting';
import GameUserCard from '../components/GameUserCard';
import Header from '../components/Header';

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

    let gameSetIdx = location.state.gameSetIdx; //그림판에서 넘어온 게임 세트 인덱스
    let userList = location.state.userList; //그림판에서 넘어온 유저리스트
    let roomIdx = location.state.roomIdx; //그림판에서 넘어온 룸인덱스
    let role =  location.state.role; //그림판에서 넘어온 역할
    let keyword =   location.state.keyword; //그림판에서 넘어온 키워드

    console.log('data 잘 받았냐? ' + gameSetIdx + '/' + userList + '/' +  roomIdx + '/' +  role + '/' + keyword);
    
    // local storage에 있는지 확인
    let data = localStorage.getItem('token');
    let save_token = JSON.parse(data) && JSON.parse(data).access_token;
    let save_refresh_token = JSON.parse(data) && JSON.parse(data).refresh_token;
    //let save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;
    let save_user_idx = 1;
    let save_user_name = JSON.parse(data) && JSON.parse(data).user_name;

    const [winner, setWinner] = useState(''); // 중간 결과 승리자

    /* // ** 더미 데이터 일단 넣어둠, Playing Vote에서 넘어오면 그걸로 바꿔주면 될 듯! //
    const userList = [
        { user_idx: 2, user_name: '가나다라마바사아자차', game_member_order: 2, user_color: 'GREEN' },
        { user_idx: 1, user_name: '나는 1번', game_member_order: 1, user_color: 'RED' },
        { user_idx: 3, user_name: '나는 3번', game_member_order: 3, user_color: 'BLUE' },
    ];
    const role = 'human';
    const keyword = '크리스마스'; */

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

    // 정렬시, 유저 리스트에서 본인 인덱스 찾아서 제일 위로 올리기 위해 0으로 바꾸기
    var myIndex = userList.find((x) => x.user_idx === save_user_idx);
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
                <Header />
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
                                        user_role="ghost"
                                        user_order={userList[key].game_member_order}
                                    ></GameUserCard>
                                ))
                            }
                        </UserDiv>
                        {/* 투표 */}
                        <GameVoteComponent data={userList} gameSet={gameSetIdx} /> {/* gameSet -> 숫자만 들어가면 됨, 임의의 숫자 넣어둠 */}
                        {/* 투표 결과 */}
                        {/* <GameVoteResult/> */}
                        <ChatDiv>
                            {/* <Chatting /> */}
                            {/* <Chatting room_idx={location.state.data.room_idx}></Chatting> */}
                            <Chatting room_idx={roomIdx} available={false}></Chatting> {/* 채팅 비활성화 */}
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
