import React, { useState, useEffect, useRef } from 'react';
import RoomGrid from '../components/RoomGrid';
import style from '../styles/styles';
import RoomText from '../components/RoomText';
import axios from 'axios';
// 소켓
import { io } from 'socket.io-client';

import {useHistory} from "react-router";

// local storage에 있는지 확인 
let data = localStorage.getItem("token");
let save_token = JSON.parse(data) && JSON.parse(data).access_token;
let save_refresh_token = JSON.parse(data) && JSON.parse(data).refresh_token;
let save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;
let save_user_name = JSON.parse(data) && JSON.parse(data).user_name;

const socket = io('http://3.17.55.178:3002/', {
    // 프론트가 서버와 동일한 도메인에서 제공되지 않는 경우 서버의 URL 전달 필요
    auth: {
        token: save_token
    },
});

socket.on('connect', () => {
    console.log('Room SearchBar connection server');
});

const RoomSearchBar = (props) => {

    const history = useHistory();

    const inputRef = useRef();
    const [clicked, setClicked] = useState(false);

    const enterRoom = async () => {
        const reqURL = 'http://3.17.55.178:3002/room/code'; //parameter : 방 타입
        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };

        axios
            .post(
                reqURL,
                {
                    room_code: inputRef.current.value, // 룸 code
                },
                reqHeaders
            )
            .then(function (response) {
                history.push({
                    pathname: "/waitingroom/" + response.data.room_idx,
                    state: {data: response.data}
                  })
            })
            .catch(function (error) {
                alert(error.response.data.message);
            });
    };

    const onClick = () => {
        setClicked(!clicked);
        enterRoom();
    };

    return (
        <React.Fragment>
            <RoomGrid is_flex_space padding="10px" width="410px" height="40px" border="" bg="white">
                <input style={styles.input} type="text" placeholder="입력하세요..." ref={inputRef} />
                {/* 검색 버튼 */}
                <RoomGrid onClick={onClick} is_flex_center width="160px" height="32px" border="1px solid white" bg="#4D1596">
                    <RoomText size="17px" color={style.white}>
                        코드로 입장하기
                    </RoomText>
                </RoomGrid>
            </RoomGrid>
        </React.Fragment>
    );
};

export default RoomSearchBar;

const styles = {
    input: {
        borderColor: style.white,
        border: '1px solid white',
        borderRadius: '1.5rem',
        color: style.black,
        height: '25px',
        width: '250px',
        fontSize: 15,
        outline: 'none',
    },
};
