import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { io } from 'socket.io-client';
import style from '../styles/styles.js';

import UserCard from '../components/UserCard';

import UserTable from '../components/UserTable.js';
import ModalSetting from '../components/ModalSetting.js';

//function component 사용시:
import { useLocation } from 'react-router';

export default function WaitingRoom({ match }) {
    let location = useLocation();

    const room_index = match.params.name; // url에 입력해준 방 인덱스
    console.log('방 번호는 ?' + room_index);
    const [roomEnterInfo, setRoomEnterInfo] = useState('');
    const [roomInfo, setRoomInfo] = useState('');

    const BaseURL = 'http://3.17.55.178:3002';

    //내 인덱스 저장 변수
    const [myIdx, setMyIdx] = React.useState(-1);

    //사람이 색을 변경해서 클릭했을 때 소켓통신을 실행하기 위한 변수
    const [changeColor, setChangeColor] = React.useState(false);

    //내가 무슨 색을 선택했는지
    const [selectColor, setSelectColor] = React.useState('');

    //내 이전 색이 무엇인지, 서버에서 색깔 지정해준 색도 이 변수에 넣기
    const [previousColor, setPreviousColor] = React.useState('');

    // 개별 색 state
    const [redColor, setRedColor] = React.useState('#FF0000');
    const [orangeColor, setOrangeColor] = React.useState('#FF5E00');
    const [yellowColor, setYellowColor] = React.useState('#FFE400');
    const [greenColor, setGreenColor] = React.useState('#1DDB16');
    const [blueColor, setBlueColor] = React.useState('#0B37D3');
    const [purpleColor, setPurpleColor] = React.useState('#5F00FF');
    const [pinkColor, setPinkColor] = React.useState('#FF00DD');

    useEffect(() => {
        //alert('통신 시작!');

        //8번 토큰 사용
        /* const socket = io(BaseURL, {
            auth: {
                token:
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6OCwidXNlcl9uYW1lIjoidGVzdCIsImlhdCI6MTYzMjgzMzAxN30.Q6DBbNtwXRnhqfA31Z_8hlnXpN6YjN0YQXFEoypO7Mw",
            },
        }); */

        //1번 토큰 사용
        const socket = io(BaseURL, {
            auth: {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6MSwidXNlcl9uYW1lIjoi7YWM7Iqk7Yq4IiwiaWF0IjoxNjMyODMzMDE3fQ.a_6lMSENV4ss6bKvPw9QvydhyIBdr07GsZhFCW-JdrY',
            },
        });

        // 소켓이 서버에 연결되어 있는지 여부
        // 연결 성공 시 시작
        socket.on('connect', () => {
            console.log('Waiting connection server');
        });

        /*  socket.on('error', () => {
            setTimeout(() => {
                socket.connect();
            }, 1000);
        });
 
         // 연결 해제 시 임의 지연 기다린 다음 다시 연결 시도
         socket.on('disconnect', (reason) => {
             if (reason === 'io server disconnect') {
                 // the disconnection was initiated by the server, you need to reconnect manually
                 socket.connect();
             }
             // else the socket will automatically try to reconnect
         }); */

        socket.on('change member color', (data) => {
            console.log('socket-> index: ' + data.user_idx + ' color: ' + data.user_color);
            //해당 user_color값 클릭안되게 설정 + X 표시로 바꿔줄 코드 삽입
            console.log('소켓 안 userindex: ' + myIdx);
            if (data.user_idx != myIdx) {
                //지금 내 인덱스값과 비교해서 다른 인덱스들한테만 회색박스처리
                if (data.user_color == 'RED') setRedColor('#8C8C8C');
                else if (data.user_color == 'ORANGE') setOrangeColor('#8C8C8C');
                else if (data.user_color == 'YELLOW') setYellowColor('#8C8C8C');
                else if (data.user_color == 'GREEN') setGreenColor('#8C8C8C');
                else if (data.user_color == 'BLUE') setBlueColor('#8C8C8C');
                else if (data.user_color == 'PURPLE') setPurpleColor('#8C8C8C');
                else setPinkColor('#8C8C8C');
            }
        });
    }, [changeColor]);

    function colorClick(str) {
        alert('click: ' + str);

        if (previousColor == 'RED') setRedColor('#FF0000');
        else if (previousColor == 'ORANGE') setOrangeColor('#FF5E00');
        else if (previousColor == 'YELLOW') setYellowColor('#FFE400');
        else if (previousColor == 'GREEN') setGreenColor('#1DDB16');
        else if (previousColor == 'BLUE') setBlueColor('#0B37D3');
        else if (previousColor == 'PURPLE') setPurpleColor('#5F00FF');
        else setPinkColor('#FF00DD');

        setSelectColor(str);
        setPreviousColor(str);

        const restURL = BaseURL + '/waiting-room/user-color';

        //8번 토큰
        /*  const reqHeaders = {
            headers: {
                authorization:
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6OCwidXNlcl9uYW1lIjoidGVzdCIsImlhdCI6MTYzMjgzMzAxN30.Q6DBbNtwXRnhqfA31Z_8hlnXpN6YjN0YQXFEoypO7Mw',
            },
        }; */

        //3번 토큰
        /* const reqHeaders = {
            headers: {
                authorization:
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6MywidXNlcl9uYW1lIjoiaHkiLCJpYXQiOjE2MzI4MzMwMTd9.-i36Z3KoqzCfgtVNl1-c8h5fZNSZ8Nlhnp4UI41tFxM',
            },
        }; */

        //1번 토큰
        const reqHeaders = {
            headers: {
                authorization:
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6MSwidXNlcl9uYW1lIjoi7YWM7Iqk7Yq4IiwiaWF0IjoxNjMyODMzMDE3fQ.a_6lMSENV4ss6bKvPw9QvydhyIBdr07GsZhFCW-JdrY',
            },
        };

        axios
            .patch(
                restURL,
                {
                    room_idx: room_index, //룸 인덱스 변수로 들어가야함.
                    user_color: str, //클릭했을 때 해당 색
                },
                reqHeaders
            )
            .then(function (response) {
                alert('rest ' + response.data);
            })
            .catch(function (error) {
                alert('error ' + error.message);
            });

        setChangeColor(!changeColor); //색이 바꼈다는 상태값 변경
    }

    // written by sunga at 10.31
    const getRoomInfo = async () => {
        // 대기실 정보 조회 api
        const restURL = 'http://3.17.55.178:3002/room/info/' + roomEnterInfo.room_idx;
        const reqHeaders = {
            headers: {
                //1번 토큰 이용
                authorization:
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6MSwidXNlcl9uYW1lIjoi7YWM7Iqk7Yq4IiwiaWF0IjoxNjMyODMzMDE3fQ.a_6lMSENV4ss6bKvPw9QvydhyIBdr07GsZhFCW-JdrY',
            },
        };
        axios
            .get(restURL, reqHeaders)
            .then(function (response) {
                setRoomInfo(response.data);
                console.log('getRoomInfo 성공');
            })
            .catch(function (error) {
                console.log('getRoomInfo 실패');
                console.log(error.response);
            });
    };

    useEffect(() => {
        //const user = location.state.data.room_idx;
        //alert('값 : ' + user);

        setRoomEnterInfo(location.state.data);
        getRoomInfo(); //방 정보 조회 api + 모달창에 뿌리기용
    }, []);

    return (
        <Container>
            <SelectDiv>
                selectDiv
                <br />
                <TitleDiv>
                    TitleDiv {match.params.name}번 방
                    <br />
                    <Text>
                        방제 : {roomEnterInfo.room_name} | 방 코드 : {roomEnterInfo.room_code} | 인원:{' '}
                        {roomEnterInfo.room_current_member_cnt} / {roomEnterInfo.room_start_member_cnt} 명
                    </Text>
                    <br />
                    <ModalSetting
                        title={roomInfo.room_name}
                        mode={roomInfo.room_mode}
                        member={roomInfo.room_start_member_cnt}
                        room_private={roomInfo.room_private}
                    />
                </TitleDiv>
                <BarDiv>
                    <BarInnerDiv>
                        {selectColor == 'RED' ? (
                            <BarColorBox
                                color={redColor}
                                onClick={() => {
                                    colorClick('RED');
                                }}
                            >
                                V
                            </BarColorBox>
                        ) : (
                            <BarColorBox
                                color={redColor}
                                onClick={() => {
                                    colorClick('RED');
                                }}
                            />
                        )}

                        {selectColor == 'ORANGE' ? (
                            <BarColorBox
                                color={orangeColor}
                                onClick={() => {
                                    colorClick('ORANGE');
                                }}
                            >
                                V
                            </BarColorBox>
                        ) : (
                            <BarColorBox
                                color={orangeColor}
                                onClick={() => {
                                    colorClick('ORANGE');
                                }}
                            />
                        )}
                        {selectColor == 'YELLOW' ? (
                            <BarColorBox
                                color={yellowColor}
                                onClick={() => {
                                    colorClick('YELLOW');
                                }}
                            >
                                V
                            </BarColorBox>
                        ) : (
                            <BarColorBox
                                color={yellowColor}
                                onClick={() => {
                                    colorClick('YELLOW');
                                }}
                            />
                        )}

                        {selectColor == 'GREEN' ? (
                            <BarColorBox
                                color={greenColor}
                                onClick={() => {
                                    colorClick('GREEN');
                                }}
                            >
                                V
                            </BarColorBox>
                        ) : (
                            <BarColorBox
                                color={greenColor}
                                onClick={() => {
                                    colorClick('GREEN');
                                }}
                            />
                        )}

                        {selectColor == 'BLUE' ? (
                            <BarColorBox
                                color={blueColor}
                                onClick={() => {
                                    colorClick('BLUE');
                                }}
                            >
                                V
                            </BarColorBox>
                        ) : (
                            <BarColorBox
                                color={blueColor}
                                onClick={() => {
                                    colorClick('BLUE');
                                }}
                            />
                        )}

                        {selectColor == 'PURPLE' ? (
                            <BarColorBox
                                color={purpleColor}
                                onClick={() => {
                                    colorClick('PURPLE');
                                }}
                            >
                                V
                            </BarColorBox>
                        ) : (
                            <BarColorBox
                                color={purpleColor}
                                onClick={() => {
                                    colorClick('PURPLE');
                                }}
                            />
                        )}
                        {selectColor == 'PINK' ? (
                            <BarColorBox
                                color={pinkColor}
                                onClick={() => {
                                    colorClick('BPINKLUE');
                                }}
                            >
                                V
                            </BarColorBox>
                        ) : (
                            <BarColorBox
                                color={pinkColor}
                                onClick={() => {
                                    colorClick('PINK');
                                }}
                            />
                        )}
                    </BarInnerDiv>
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
    //background-color: #6880fb;
    display: inline-block;
    overflow: hidden;
`;

const BarInnerDiv = styled.div`
    width: 420px;
    height: 29px;
    background-size: contain;
    margin-left: 15px;
    margin-top: 3px;
    //border-width:1;
    //border-style: solid;
    display: flex;
    flex-direction: row;
    border-radius: 30px;
    box-shadow: 0px 4px 4px #878787;
`;

const BarColorBox = styled.div`
    width: 70px;
    height: 29px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 2px solid #000000;
    disabled: true;

    ${(props) =>
        props.color == '#FF0000'
            ? `background-color: ${props.color}; border-top-left-radius: 15px; border-bottom-left-radius: 15px;`
            : props.color == '#FF00DD'
            ? `background-color: ${props.color}; border-right: 0px solid #000000; border-top-right-radius: 15px; border-bottom-right-radius: 15px;`
            : `background-color: ${props.color};`}
`;

const Text = styled.text`
    color: #c11b1b;
    font-size: 12px;
    font-weight: light;
    // -webkit-text-stroke: 1px #c00202;
    margin-top: -5px;
`;
