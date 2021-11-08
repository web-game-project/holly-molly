import React, { useEffect, useState } from 'react';
import style from '../styles/styles';
import styled from 'styled-components';

//이미지
import gameBackground from '../assets/night.png';

//통신
import axios from 'axios';
// 소켓
import { io, Socket } from 'socket.io-client';
import GameStart from '../screens/GameStart';

function GameRoleComponent() {
    const [gameSetIndex, setGameSetIndex] = React.useState(0);

    const [startStaus, setStartStatus] = React.useState(false);
    const [infoStaus, setInfoStatus] = React.useState(false);

    const ghost = "\n현재 뭉게뭉게 왕국은 유령한테 \n 인질로 잡혀 있는 상태입니다.";

    const BaseURL = 'http://3.17.55.178:3002/';

    useEffect(() => {
        //3번 토큰
        const reqHeaders_info = {
            headers: {
                authorization:
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6MywidXNlcl9uYW1lIjoiaHkiLCJpYXQiOjE2MzI4MzMwMTd9.-i36Z3KoqzCfgtVNl1-c8h5fZNSZ8Nlhnp4UI41tFxM',
            },
        };

        //rest api start
        const restURL_information = BaseURL + 'game/member?gameSetIdx=' + gameSetIndex;
        console.log('주소 : ' + restURL_information);

        /* //1번 토큰
        const reqHeaders = {
           headers: {
               authorization:
                   'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6MSwidXNlcl9uYW1lIjoi7YWM7Iqk7Yq4IiwiaWF0IjoxNjMyODMzMDE3fQ.a_6lMSENV4ss6bKvPw9QvydhyIBdr07GsZhFCW-JdrY',
           },
       }; */

        axios
            .get(
                restURL_information,
                reqHeaders_info
            )
            .then(function (response) {
                alert('rest ' + response.data);
            })
            .catch(function (error) {
                alert('error information : ' + error.message);
            });
    }, [infoStaus]);

    useEffect(() => {
        //3번 토큰
        const reqHeaders_start = {
            headers: {
                authorization:
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6MywidXNlcl9uYW1lIjoiaHkiLCJpYXQiOjE2MzI4MzMwMTd9.-i36Z3KoqzCfgtVNl1-c8h5fZNSZ8Nlhnp4UI41tFxM',
            },
        };

        //game start rest api
        const restURL_start = BaseURL + 'game/start';

        axios
            .post(
                restURL_start,
                {
                    room_idx: 47
                },
                reqHeaders_start
            )
            .then(function (response) {
                alert('rest game start');
            })
            .catch(function (error) {
                alert('error game start ' + error.message);
            });

        setInfoStatus(!infoStaus);
    }, [startStaus]);

    useEffect(() => {

        //socket start
        const socket = io(BaseURL, {
            auth: {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6MywidXNlcl9uYW1lIjoiaHkiLCJpYXQiOjE2MzI4MzMwMTd9.-i36Z3KoqzCfgtVNl1-c8h5fZNSZ8Nlhnp4UI41tFxM',
            },
        });

        // 소켓이 서버에 연결되어 있는지 여부
        // 연결 성공 시 시작
        socket.on("connect", () => {
            alert("Game start connection server");
        });

        socket.on("start game", (data) => {
            alert('socket-> index: ' + data.game_idx + ' game set index: ' + data.game_set_idx);
            setGameSetIndex(data.game_set_idx);
        });

        setStartStatus(!startStaus);
    }, []);

    return (
        <Container>
            <TxtContainer>
                <HeadLine>
                    당신은 정의로운 &nbsp;<b> "시민" </b>&nbsp;입니다.
                </HeadLine>
                {ghost.split("\n").map((i, key) => {
                    return <Content key={key}>{i}</Content>;
                })}
            </TxtContainer>
        </Container>

    );
}

const Container = styled.div`
    width: 560px;
    height: 560px;
    border-width: thin;
    border-radius: 10px;
    border-color: #000000;
    border-style: solid;
`;

const TxtContainer = styled.div`
    width: 420px;
    height: 400px;
    padding: 10px;
    margin-left: 60px;
    margin-top: 20px;
`;

const HeadLine = styled.div`
    width: 100%;
    font-size: 25px;
    display: flex;
b{
    font-size: 32px;
    color: #FF0000;
}
`;

const Content = styled.div`
width: 100%;
font-size: 25px;
display: flex;

`;
export default GameRoleComponent;