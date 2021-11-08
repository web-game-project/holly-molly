import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import MissionWord from '../components/MissionWord';
import night from '../assets/night.svg';
import day from '../assets/day.svg';
import Chatting from '../components/Chatting'

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
            <Container>
                <UserDiv>
                    {/* 제시어 */}
                    <MissionWord text={'크리스마스'}></MissionWord>
                    {/* 유저 컴포넌트 */}
                    <EachUserDiv></EachUserDiv>
                    <EachUserDiv></EachUserDiv>
                    <EachUserDiv></EachUserDiv>
                    <EachUserDiv></EachUserDiv>
                    <EachUserDiv></EachUserDiv>
                    <EachUserDiv></EachUserDiv>
                
                </UserDiv>
                <BackGroundDiv><Chatting/></BackGroundDiv>
                
                
            </Container>
        </React.Fragment>
    );
};

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
    background-color: #ffe5e5; 
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
