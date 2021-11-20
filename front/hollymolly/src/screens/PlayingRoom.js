import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import MissionWord from '../components/MissionWord';
import night from '../assets/night.svg';
import day from '../assets/day.svg';
import Chatting from '../components/Chatting';
import GameUserCard from '../components/GameUserCard';
import GameRoleComponent from '../components/GameRoleComponent';
import GameVoteComponent from '../components/GameVoteComponent';
import { useLocation } from 'react-router';
//통신
import axios from 'axios';

//import RefreshVerification from '../server/RefreshVerification.js';
//RefreshVerification.verification();

// local storage에 있는지 확인
let data = localStorage.getItem('token');
let save_token = JSON.parse(data) && JSON.parse(data).access_token;
let save_refresh_token = JSON.parse(data) && JSON.parse(data).refresh_token;
let save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;
let save_user_name = JSON.parse(data) && JSON.parse(data).user_name;

console.log('내 인덱스 : ' + save_user_idx);

const socket = io('http://3.17.55.178:3002/', {
    // 프론트가 서버와 동일한 도메인에서 제공되지 않는 경우 서버의 URL 전달 필요
    auth: {
        token: save_token,
    },
});

socket.on('connect', () => {
    console.log('chatting connection server');
});

let userList = [{}];

const PlayingRoom = (props) => {
    let location = useLocation();

    const [role, setRole] = React.useState('');
    const [keyword, setKeyWord] = React.useState('');

    //게임 시작 5초 후, 타이머
    const [seconds, setSeconds] = useState(6);

    const [playInfo, setPlayInfo] = React.useState(''); //웨이팅룸에서 넘어온 데이터 저장

    const BaseURL = 'http://3.17.55.178:3002/';

    useEffect(() => {
        if (playInfo != null) { //데이터 전달 받은게 세팅되기 전까지는 타이머가 돌아가면 안됨.
            const countdown = setInterval(() => {
                if (parseInt(seconds) > 0) {
                    setSeconds(parseInt(seconds) - 1);
                }
            }, 1000);

            return () => {
                clearInterval(countdown);
                console.log('플레잉 룸 초 끝')
            };
        }
    }, [seconds]);

    useEffect(() => {
        setPlayInfo(location.state.data);
        userList = location.state.data.user_list;

        console.log('넘어온 게임 세트 인덱스_playroom' + location.state.data.game_set_idx);

        const reqHeaders = {
            headers: {
                authorization:
                    'Bearer ' + save_token,
            },
        };
        const restURL = BaseURL + 'game/member/' + location.state.data.game_set_idx;

        console.log('url : ' + restURL);

        axios
            .get(
                restURL,
                reqHeaders
            )
            .then(function (response) {
                //alert('rest 키워드' + response.data.keyword + ', 역할' + response.data.user_role);
                setRole(response.data.user_role);
                setKeyWord(response.data.keyword);
            })
            .catch(function (error) {
                alert('error information : ' + error.message);
            });

    });
    return (
        <React.Fragment>
            <Background>
                <Container>
                    <BackGroundDiv>
                        <UserDiv>
                            {/* 제시어 role parameter 값 ghost/human -> 역할에 따라 배경색이 변함*/}
                            <MissionWord text={keyword} role={role}></MissionWord>
                            {/* 유저 컴포넌트 */}
                            {//let user_list = location.state.data.user_list,

                                userList.map(
                                    (index, key) => (
                                        console.log('user 길이' + userList.length),
                                        console.log('유저 인덱스 값 ' + userList[key].user_idx),
                                        console.log('순서 : ' + userList[key].game_member_order),
                                        console.log('칼라 : ' + userList[key].user_color),
                                        <GameUserCard user_idx={userList[key].user_idx} user_color={userList[key].user_color} user_name={userList[key].user_name} user_role="ghost" user_order={userList[key].game_member_order}></GameUserCard>
                                    )
                                )
                            }
                        </UserDiv>
                        {/* 가운데*/}
                        {
                            seconds === 0 ?
                                <GameVoteComponent />
                                :
                                <GameRoleComponent role={role} timer={seconds} />
                        }
                        {/* <DrawDiv>
                            <GameRoleComponent />
                        </DrawDiv> */}
                        <ChatDiv>
                            <Chatting />
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
    background-image: url(${day});
    width: 1020px;
    height: 620px;
    flex-direction: row;
    display: flex;
    justify-content: space-between;
`;

const ChatDiv = styled.div`
    margin: 1px;
`;

const DrawDiv = styled.div`
    background-color: #ffffff;
    width: 650px;
    height: 620px;
    display: flex;
`;

export default PlayingRoom;
