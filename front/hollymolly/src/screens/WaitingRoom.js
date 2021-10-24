import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { io } from 'socket.io-client';
import style from '../styles/styles.js';

import UserCard from '../components/UserCard';

import UserTable from '../components/UserTable.js';

export default function WaitingRoom() {
    const BaseURL = 'http://3.17.55.178:3002';
    // useEffect(() => {
    //     console.log('소켓 통신 시작');
    //     const socket = io(BaseURL, {
    //         auth: {
    //             token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6NywidXNlcl9uYW1lIjoidGVzdCIsImlhdCI6MTYzMjgzMzAxN30.G1ECMSLaD4UpCo6uc-k6VRv7CxXY0LU_I5M2WZPYGug',
    //         },
    //     });

    //     socket.on('connect', () => {
    //         console.log('connection server 연결 성공입니다!'); // 소켓 연결
    //     });
    // }, []);

    // useEffect(() => {
    //     const roomInfo = async () => {
    //         console.log('서버 통신 시작');
    //         // const url = BaseURL + '/room/info/2';
    //         const restURL = 'http://3.17.55.178:3002/room/info/0 ';
    //         const reqHeaders = {
    //             headers: {
    //                 authorization:
    //                     'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6NywidXNlcl9uYW1lIjoidGVzdCIsImlhdCI6MTYzMjgzMzAxN30.G1ECMSLaD4UpCo6uc-k6VRv7CxXY0LU_I5M2WZPYGug',
    //             },
    //         };

    //         axios
    //             .get(restURL, reqHeaders)
    //             .then(function (response) {
    //                 console.log(response.data);
    //             })
    //             .catch(function (error) {
    //                 console.log(restURL);
    //             });
    //     };
    //     roomInfo();
    // }, []);

    return (
        <Container>
            <SelectDiv>
                selectDiv
                <br />
                <TitleDiv>
                    TitleDiv
                    <br />
                </TitleDiv>
                <BarDiv>
                    BarDiv
                    <br />
                </BarDiv>
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
            </SelectDiv>
            <ChatDiv>
                ChatDiv
                <br />
            </ChatDiv>
        </Container>
    );
}

const Container = styled.div`
    width: 1020px;
    height: 620px;
    // border: 1px solid #000;
    background-color: ${style.white};
    display: flex;
    flex-direction: row;
`;

const SelectDiv = styled.div`
    text-align: center;
    width: 800px;
    height: 620px;
    background-color: #ffe5e5;
    justify-content: center;
    align-items: center;
`;

const ChatDiv = styled.div`
    width: 220px;
    height: 620px;
    background-color: #ffe7a8;
    overflow: hidden;
`;

const TitleDiv = styled.div`
    width: 625px;
    height: 70px;
    margin-top: 25px;
    background-color: #ffffff;
    text-align: center;
    display: inline-block;
    overflow: hidden;
`;

const UserDiv = styled.div`
    width: 590px;
    height: 390px;
    margin-top: 10px;
    background-color: #fff3ca;
    display: inline-block;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    text-align: center;
`;

const BarDiv = styled.div`
    width: 450px;
    height: 35px;
    // margin-top: 3px;
    background-color: #6880fb;
    display: inline-block;
    overflow: hidden;
`;
