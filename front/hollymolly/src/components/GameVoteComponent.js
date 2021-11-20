import React, { useEffect } from 'react';
import style from '../styles/styles';
import styled from 'styled-components';

//이미지
import gameBackground from '../assets/night.png';
//유저카드
import UserTable from './UserTable.js';
//통신
import axios from 'axios';
// 소켓
import { io } from 'socket.io-client';

function GameVoteComponent() {

    return (
        <Container>
                인간 같은 유령을 <text style={{ color : style.red }}>투표</text>  해주세요.           
            <UserDiv>
                <UserTable
                    style={{
                        display: 'inline-block',
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                    }}
                />
            </UserDiv>

            <p>투표 시간이 끝난 즉시 선택된 유령이 투표됩니다.</p>
        </Container>
    );
}

const Container = styled.div`
    //background-image: url(${gameBackground});
    width: 580px;
    height: 500px;
    margin-top: 67px;
    border-width: thin;
    border-radius: 10px;
    border-color: #000000;
    border-style: solid;
    text-align: center;
    font-size: 26px;  
    color: #fff;
    //background-size: contain;
    //background-position: center center;
    //background-repeat: no-repeat;
    p{
        font-size: 20px;  
    }
`;

const UserDiv = styled.div`
    width: 5080px;
    height: 390px;
    //margin: 180px 190px;
    display: inline-block;
    overflow: hidden;
    //align-items: center;
    //justify-content: center;
    text-align: center;
`;

export default GameVoteComponent;