import React, { useState, useEffect } from 'react';
import RoomGrid from '../components/RoomGrid';
import style from '../styles/styles';
import RoomText from '../components/RoomText';
import axios from 'axios';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import RefreshVerification from '../server/RefreshVerification';

const Room = (props) => {
    const history = useHistory();
    const [clicked, setClicked] = useState(false);

    const BaseURL = 'http://api.hollymolly.kr';

    //토큰 검사
    // console.log('토큰 유효한지 검사 t/f 값 : ' + verify);
    let data, save_token;

    function getToken() {
        data = sessionStorage.getItem('token');
        save_token = JSON.parse(data) && JSON.parse(data).access_token;
    }

    useEffect(() => {
        getToken();
    }, [])

    const enterRoom = async () => {
        const reqURL = BaseURL + '/room/idx'; //parameter : 방 타입
        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };

        axios
            .post(
                reqURL,
                {
                    room_idx: props.room_idx, // 룸 index
                },
                reqHeaders
            )
            .then(function (response) {
                history.push({
                    pathname: '/waitingroom/' + props.room_idx,
                });
            })
            .catch(function (error) {
                let resErr = error.response.data.message;

                if ("로그인 후 이용해주세요." === resErr) { //401 err
                    let refresh = RefreshVerification.verification();
                    getToken();
                    enterRoom();

                }
                else
                    alert(resErr);
            });
    };

    const roomClick = () => {
        if (!props.disabled) {
            setClicked(!clicked);
            enterRoom();
        }
    };

    return (
        <React.Fragment>
            {props.empty !== 'true' ? (
                <RoomContainer
                    disabled={props.disabled}
                    onClick={roomClick}
                    cursor={props.cursor}
                >
                    {/* 방 제목 */}
                    <RoomGrid is_flex_start border="" boxShadow="" padding="15px" width="300px" height="25px" cursor={props.cursor}>
                        <RoomText bold size="20px" color="#FF2222">
                            {props.room_name}
                        </RoomText>
                    </RoomGrid>
                    {/* 방 모드  방 현재 인원 / 총 인원 */}
                    <RoomGrid is_flex_space border="" boxShadow="" padding="15px" width="300px" height="25px" cursor={props.cursor}>
                        {props.room_mode === 'easy' && (
                            <RoomText bold textStroke={props.textStroke} color={style.white}>
                                Easy Mode
                            </RoomText>
                        )}
                        {props.room_mode === 'hard' && (
                            <RoomText bold textStroke={props.textStroke} color={style.white}>
                                Hard Mode
                            </RoomText>
                        )}
                        <RoomGrid is_flex_end border="" boxShadow="" width="100px" height="25px">
                            <RoomText bold textStroke={props.textStroke} color="#FFE400">
                                {' '}
                                {props.room_current_member}/{props.room_start_member}&nbsp;
                            </RoomText>
                            👻
                        </RoomGrid>
                    </RoomGrid>
                    {/* 방 진행중 여부 */}
                    <RoomGrid is_flex_end border="" boxShadow="" padding="15px" width="300px" height="25px" cursor={props.cursor}>
                        {props.room_status === 'waiting' && (
                            <RoomText bold size="24px" textStroke={props.textStroke} color={style.light_green}>
                                WAITING
                            </RoomText>
                        )}
                        {props.room_status === 'playing' && (
                            <RoomText bold size="24px" textStroke={props.textStroke} color="#FF7B89">
                                PLAYING
                            </RoomText>
                        )}
                    </RoomGrid>
                </RoomContainer>
            ) : (
                <EmptyRoomContainer>
                    <RoomGrid
                        borderRadius
                        is_flex_start
                        border=""
                        boxShadow=""
                        padding="10px"
                        margin="5px"
                        width="280px"
                        height="25px"
                        bg="#eeeeee"
                        cursor="false"
                    ></RoomGrid>
                    <RoomGrid borderRadius is_flex_space border="" boxShadow="" margin="5px" width="280px" height="25px" cursor="false">
                        <RoomGrid borderRadius is_flex_end border="" boxShadow="" width="140px" height="25px" bg="#eeeeee" cursor="false"></RoomGrid>
                        <RoomGrid borderRadius is_flex_end border="" boxShadow="" width="100px" height="25px" bg="#eeeeee" cursor="false"></RoomGrid>
                    </RoomGrid>
                    <RoomGrid borderRadius is_flex_end border="" boxShadow="" margin="5px" width="280px" height="25px" cursor="false">
                        <RoomGrid borderRadius is_flex_end border="" boxShadow="" width="120px" height="25px" bg="#eeeeee" cursor="false"></RoomGrid>
                    </RoomGrid>
                </EmptyRoomContainer>
            )}
        </React.Fragment>
    );
};
// 컴포넌트 그리는데 꼭 필요한 데이터가 없을 시 나는 오류 방지하기 위해 필요한 데이터 미리 선언

Room.defaultProps = {
    room_idx: '9999',
    room_name: 'Test',
    room_current_member: '9',
    room_start_member: '9',
    room_mode: 'easy mode',
    room_status: 'waiting',
};

export default Room;

const RoomContainer = styled.div`
    box-shadow: 7px 5px 5px #2D2C2C;
    padding: 10px;
    margin: 10px;
    width: 320px;
    height: 115px;
    background-color: #ffffff;
    border: white;
    position: relative;
    box-sizing: border-box;
    border-radius: 1.5rem;

    ${(props) => props.cursor === "true" ? `cursor: grab; ` : `cursor: not-allowed; `} 
    ${(props) => props.disabled === true ? `opacity: 0.7;` : `&:hover {background-color: #CFCFCF}`}
`;

const EmptyRoomContainer = styled.div`
    box-shadow: 7px 5px 5px #2D2C2C;
    padding: 10px;
    margin: 10px;
    width: 320px;
    height: 115px;
    background-color: #ffffff;
    border: white;
    position: relative;
    box-sizing: border-box;
    border-radius: 1.5rem;
    cursor: not-allowed;
`;
