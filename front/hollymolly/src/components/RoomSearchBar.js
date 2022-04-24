import React, { useState, useEffect, useRef } from 'react';
import RoomGrid from '../components/RoomGrid';
import style from '../styles/styles';
import RoomText from '../components/RoomText';
import axios from 'axios';
import { useHistory } from 'react-router';
import RefreshVerification from '../server/RefreshVerification';

// 소켓
import { io } from 'socket.io-client';

const RoomSearchBar = (props) => {
    const history = useHistory();

    const inputRef = useRef();
    const [clicked, setClicked] = useState(false);

    //토큰 검사
    let verify = RefreshVerification.verification()
    //console.log('토큰 유효한지 검사 t/f 값 : ' + verify);
    let data, save_token;

    if (verify === true) {
        data = sessionStorage.getItem('token');
        save_token = JSON.parse(data) && JSON.parse(data).access_token;
    }

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
                    pathname: '/waitingroom/' + response.data.room_idx,
                });
            })
            .catch(function (error) {
                if(error.response.data.message === undefined){
                    alert("올바른 코드값을 입력해주세요")
                }else{
                    alert(error.response.data.message);
                }
                
            });
    };

    const onClick = () => {
        setClicked(!clicked);
        enterRoom();
    };

    const onEnter = (e) => {
        if(e.key === 'Enter'){
            enterRoom();
        }
    }

    return (
        <React.Fragment>
            <RoomGrid borderRadius is_flex_space padding="10px" width="410px" height="40px" border="" bg="white">
                <input onKeyPress={onEnter} style={styles.input} type="text" placeholder="입력하세요..." ref={inputRef} />
                {/* 검색 버튼 */}
                <RoomGrid borderRadius onClick={onClick} is_flex_center width="160px" height="32px" border="1px solid white" bg="#4D1596">
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
