import React, { useEffect, useRef, useState } from 'react';
import style from '../styles/styles';
import styled from 'styled-components';

//통신
import axios from 'axios';

//깊은 복제
import * as _ from 'lodash';

import UserTotalVoteCard from './UserTotalVoteCard';

//페이지 이동
import { useHistory, useLocation, Prompt } from 'react-router';

const GameVoteResult = (props) => {
    const history = useHistory();

    let socketData = props.beforeData;
    let roomIdx = props.roomIdx;
    let gameSetNo = props.gameSetNo;
    let leaderIdx = props.leaderIdx;

    console.log('세트이미지 : ' + socketData + roomIdx + gameSetNo + leaderIdx);

    // local storage에 있는지 확인
    let data = localStorage.getItem('token');
    let save_token = JSON.parse(data) && JSON.parse(data).access_token;
    let save_refresh_token = JSON.parse(data) && JSON.parse(data).refresh_token;
    let save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;
    let save_user_name = JSON.parse(data) && JSON.parse(data).user_name;

    // 투표 10초 타이머 세기, 투표 10초 후에 1초 더 여유롭게.
    const [seconds, setSeconds] = useState(4);

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

    return ( // 4초동안 보여준다.
        <Container>
            {socketData} + {roomIdx} + {gameSetNo} + {leaderIdx}
        </Container>
    );
}


const Container = styled.div`
    width: 580px;
    height: 500px;
    border-radius: 10px;
    color: #fff;
    font-size: 25px;
`;
export default GameVoteResult;