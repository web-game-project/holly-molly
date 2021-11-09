import React, { useState, useEffect, useRef } from 'react';
import RoomGrid from '../components/RoomGrid';
import style from '../styles/styles';
import RoomText from '../components/RoomText';
import axios from 'axios';
// 소켓
import { io } from 'socket.io-client';

import {useHistory} from "react-router";


const RoomSearchBar = (props) => {

    const history = useHistory();

    const inputRef = useRef();
    const [clicked, setClicked] = useState(false);


    useEffect(() => {
        const socket = io('http://3.17.55.178:3002/', {
            auth: {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6OCwidXNlcl9uYW1lIjoidGVzdCIsImlhdCI6MTYzMjgzMzAxN30.Q6DBbNtwXRnhqfA31Z_8hlnXpN6YjN0YQXFEoypO7Mw',
            },
        });

        socket.on('connect', () => {
            console.log('Room SearchBar connection server');
        });
    })

    const enterRoom = async () => {
        const reqURL = 'http://3.17.55.178:3002/room/code'; //parameter : 방 타입
        const reqHeaders = {
            headers: {
                authorization:
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6NiwidXNlcl9uYW1lIjoidGVzdCIsImlhdCI6MTYzMjgzMzAxN30.ZnrUNSkD92PD-UV2z2DV4w5lbC2bXIn8GYu05sMb2FQ',
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
                alert('rest api success!');
                history.push({
                    pathname: "/waitingroom/" + response.data.room_idx,
                    state: {data: response.data}
                  })
            })
            .catch(function (error) {
                console.log(error.response);
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
