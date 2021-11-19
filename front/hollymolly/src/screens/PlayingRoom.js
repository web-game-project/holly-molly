import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import MissionWord from '../components/MissionWord';
import night from '../assets/night.svg';
import day from '../assets/day.svg';
import Chatting from '../components/Chatting';
import GameUserCard from '../components/GameUserCard';

const socket = io('http://3.17.55.178:3002/', {
    // 프론트가 서버와 동일한 도메인에서 제공되지 않는 경우 서버의 URL 전달 필요
    auth: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6NywidXNlcl9uYW1lIjoidGVzdCIsImlhdCI6MTYzMjgzMzAxN30.G1ECMSLaD4UpCo6uc-k6VRv7CxXY0LU_I5M2WZPYGug',
    },
});

socket.on('connect', () => {
    console.log('chatting connection server');
});

const PlayingRoom = (props) => {
    return (
        <React.Fragment>
            <Background>
                <Container>
                    <UserDiv>
                        {/* 제시어 role parameter 값 ghost/human -> 역할에 따라 배경색이 변함*/}
                        <MissionWord text={'크리스마스'} role={'ghost'}></MissionWord>
                        {/* 유저 컴포넌트 */}
                        <GameUserCard color="red" name="인계동 껍데기" role="ghost" order="1"></GameUserCard>
                        <GameUserCard color="orange" name="돈암동 마라탕" role="ghost" order="2"></GameUserCard>
                        <GameUserCard color="yellow" name="용두동 쭈꾸미" role="ghost" order="3"></GameUserCard>
                        <GameUserCard color="blue" name="왕십리 소곱창" role="ghost" order="4"></GameUserCard>
                        <GameUserCard color="pink" name="매탄동 닭갈비" role="ghost" order="5"></GameUserCard>
                        {/* <GameUserCard color="purple" name="수유동 케이크" role="ghost" order="6"></GameUserCard> */}

                        <GameUserCard color="gray"></GameUserCard>
                    </UserDiv>
                    <BackGroundDiv>
                        <Chatting />
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
    position: absolute;
    top: 0;
    left: 0;
    justify-content: center;
    align-items: center;
`;

const EachUserDiv = styled.div`
    text-align: center;
    width: 160px;
    height: 85px;
    margin-bottom: 4px;
    background-color: #ff0000;
`;

const BackGroundDiv = styled.div`
    background-image: url(${day});
    background-size: cover;
    width: 860px;
    height: 620px;
    flex-direction: row;
    display: flex;
    justify-content: flex-end;
`;

const ChatDiv = styled.div`
    width: 220px;
    height: 620px;
    background-color: #ffe5e5;
    opacity: 0.5;
`;

export default PlayingRoom;
