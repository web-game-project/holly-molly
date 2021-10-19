import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { io } from 'socket.io-client';

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

    useEffect(() => {
        const roomInfo = async () => {
            console.log('서버 통신 시작');
            // const url = BaseURL + '/room/info/2';
            const restURL = 'http://3.17.55.178:3002/room/info/0 ';
            const reqHeaders = {
                headers: {
                    authorization:
                        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6NywidXNlcl9uYW1lIjoidGVzdCIsImlhdCI6MTYzMjgzMzAxN30.G1ECMSLaD4UpCo6uc-k6VRv7CxXY0LU_I5M2WZPYGug',
                },
            };

            axios
                .get(restURL, reqHeaders)
                .then(function (response) {
                    console.log(response.data);
                })
                .catch(function (error) {
                    console.log(restURL);
                });
        };
        roomInfo();
    }, []);

    return <>hello world</>;
}
