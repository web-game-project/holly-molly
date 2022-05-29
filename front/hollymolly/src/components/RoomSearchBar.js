import React, { useState, useEffect, useRef } from 'react';
import RoomGrid from '../components/RoomGrid';
import style from '../styles/styles';
import RoomText from '../components/RoomText';
import axios from 'axios';
import { useHistory } from 'react-router';
import RefreshVerification from '../server/RefreshVerification';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const RoomSearchBar = (props) => {
    const history = useHistory();

    const inputRef = useRef();
    const [clicked, setClicked] = useState(false);

    const BaseURL = useSelector((state) => state.socket.base_url);

    let data, save_token;

    data = sessionStorage.getItem('token');
    save_token = JSON.parse(data) && JSON.parse(data).access_token;

    function getToken() {
        data = sessionStorage.getItem('token');
        save_token = JSON.parse(data) && JSON.parse(data).access_token;
    }

    const enterRoom = async () => {
        const reqURL = BaseURL + '/room/code'; //parameter : 방 타입
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
                let resErr = error.response.data.message;

                if ("로그인 후 이용해주세요." === resErr) { //401 err
                    let refresh = RefreshVerification.verification();
                    getToken();
                    enterRoom();

                }
                else if (resErr === undefined) {
                    alert("올바른 코드값을 입력해주세요")
                } else {
                    alert(resErr);
                }

            });
    };

    const btnClick = () => {
        setClicked(!clicked);
        enterRoom();
    };

    const onEnter = (e) => {
        if (e.key === 'Enter') {
            enterRoom();
        }
    }

    return (
        <React.Fragment>
            <SearchContainer>
                <input onKeyPress={onEnter} style={styles.input} type="text" placeholder="입력하세요..." ref={inputRef} />
                {/* 검색 버튼 */}
                <SearchBtn onClick={btnClick}>
                    <RoomText size="17px" color={style.white}>
                        코드로 입장하기
                    </RoomText>
                </SearchBtn>
            </SearchContainer>
        </React.Fragment>
    );
};

export default RoomSearchBar;

const SearchContainer = styled.div`
    border-radius: 1.5rem;
    display: flex; 
    align-items: center; 
    justify-content: space-between;
    padding: 10px;
    width: 410px;
    height: 40px;
    background-color: white;
    box-sizing: border-box;
    &:hover {
        cursor: grab;
    }
`;

const SearchBtn = styled.div`
    display: flex; 
    align-items: center; 
    justify-content: center;
    border-radius: 1.5rem;
    width: 160px; 
    height: 32px; 
    border: 1px solid white; 
    background-color: #4D1596;
`;

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
