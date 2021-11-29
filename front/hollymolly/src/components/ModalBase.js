import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import styled from 'styled-components';
import style from '../styles/styles';
import { useHistory } from 'react-router';

// 소켓
import { io } from 'socket.io-client';
import axios from 'axios';

// local storage에 있는지 확인
let data = localStorage.getItem('token');
let save_token = JSON.parse(data) && JSON.parse(data).access_token;
let save_refresh_token = JSON.parse(data) && JSON.parse(data).refresh_token;
let save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;
let save_user_name = JSON.parse(data) && JSON.parse(data).user_name;

const socket = io('http://3.17.55.178:3002/', {
    auth: {
        token: save_token,
    },
});

export default function ModalBase() {
    const history = useHistory();
    const [roomdata, setRoomdata] = useState();
    let idx;
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            // marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '430px',
            height: '330px',
            overflow: 'hidden',
            borderRadius: 30,
            overflow: 'hidden',
            margin: '0',
            paddingRight: '5px',
            boxShadow: '5px 5px 22px #808080',
            zIndex: 100,
        },
    };

    useEffect(() => {
        socket.on('error', () => {
            setTimeout(() => {
                socket.connect();
                console.log(socket);
            }, 1000);
        });

        // 소켓이 서버에 연결되어 있는지 여부
        // 연결 성공 시 시작
        socket.on('connect', () => {
            console.log('room connection server!');
        });

        // 연결 해제 시 임의 지연 기다린 다음 다시 연결 시도
        socket.on('disconnect', (reason) => {
            if (reason === 'io server disconnect') {
                // the disconnection was initiated by the server, you need to reconnect manually
                socket.connect();
            }
            // else the socket will automatically try to reconnect
        });
        //}
    }, []);

    const inputRef = useRef();
    let roomMode = '';

    // 난이도 useState
    const [isChecked, setIschecked] = React.useState(true);
    const isHard = () => {
        if (isChecked === true) setIschecked(!isChecked);
        console.log('선택) 난이도 상');
    };
    const isEasy = () => {
        if (isChecked === false) setIschecked(!isChecked);
        console.log('선택) 난이도 하');
    };

    // 인원 useState
    const [people, setPeople] = React.useState(4); // 4명이 디폴트
    const click4 = () => {
        setPeople((people) => (people = 4));
        console.log('선택) 인원수 4명');
    };

    const click5 = () => {
        setPeople((people) => (people = 5));
        console.log('선택) 인원수 5명');
    };

    const click6 = () => {
        setPeople((people) => (people = 6));
        console.log('선택) 인원수 6명');
    };

    // 공개범위 useState
    const [ispublic, setIsPublic] = React.useState(true);
    const isPrivate = () => {
        if (ispublic == true) setIsPublic(!ispublic);
        console.log('선택) 공개범위 전체');
    };
    const isPublic = () => {
        if (ispublic == false) setIsPublic(!ispublic);
        console.log('선택) 공개범위 개인');
    };

    const result = () => {
        console.log(':::최종결과:::');
        console.log('방이름은? ' + inputRef.current.value);

        if (inputRef.current.value == null || inputRef.current.value == '') {
            inputRef.current.value = '어서들어오세요! 기본방'; // 제목 안적으면 디폴트
        }
        if (isChecked) {
            // easy
            roomMode = 'easy';
            console.log('모드는? easy');
        } else {
            roomMode = 'hard';
            console.log('모드는? hard');
        }

        console.log('인원수는? ' + people + '명');

        if (ispublic) {
            // public
            console.log('공개범위는? public'); // 반대로 나옴
        } else console.log('공개범위는? private'); // 반대로 나옴

        roomCreate();
        // setTimeout(() => enterRoomInfo(), 1000);
        // enterRoom();
        closeModal();

        //방 생성했으면 초기화
        if (isChecked === false) setIschecked(!isChecked); // easy로 바꿈
        setPeople((people) => (people = 4)); //4명으로 바꿈
        if (ispublic == false) setIsPublic(!ispublic); // public으로 바꿈
    };

    const roomCreate = async () => {
        //방 생성
        console.log('방 생성 api 시작');
        const restURL = 'http://3.17.55.178:3002/room';
        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };
        axios
            .post(
                restURL,
                {
                    room_name: inputRef.current.value,
                    room_mode: roomMode,
                    room_private: !ispublic, // false면 공개
                    room_start_member_cnt: people,
                },
                reqHeaders
            )
            .then(function (response) {
                idx = response.data.room_idx;
                // console.log(response.data);

                // 대기실로 이동
                history.push({
                    pathname: '/waitingroom/' + idx,
                });
            })
            .catch(function (error) {
                console.log('생성 실패');
                console.log(error.response);
            });
    };

    // 방 생성 후에 방 접속까지 해줌

    // const enterRoomInfo = async () => {
    //     // 방 접속
    //     const reqURL = 'http://3.17.55.178:3002/room/' + idx; //parameter : 방 타입
    //     const reqHeaders = {
    //         headers: {
    //             authorization: 'Bearer ' + save_token,
    //         },
    //     };

    //     axios
    //         .get(reqURL, reqHeaders)
    //         .then(function (response) {
    //             console.log('방 정보 조회 성공');

    //             // 대기실로 이동
    //             history.push({
    //                 pathname: '/waitingroom/' + idx,
    //             });
    //         })
    //         .catch(function (error) {
    //             // alert(error);
    //             console.log('방 접속 실패');
    //             console.log(error.response);
    //         });
    // };

    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    let subtitle;
    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }

    return (
        <div>
            <Button onClick={openModal}>방 만들기</Button>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Create Room Modal"
                shouldCloseOnOverlayClick={false}
                ariaHideApp={false}
            >
                <CloseButton onClick={closeModal}>X</CloseButton>
                <br />
                <div style={styles.container}>
                    <h1 style={{ textAlign: 'center' }}>방 생성</h1>
                    <div style={{ marginLeft: '50px' }}>
                        <div style={styles.div}>
                            <text style={styles.text}>방 이름 : </text>
                            <input style={styles.input} type="text" placeholder="입력하세요..." ref={inputRef} />
                        </div>
                        <div style={styles.div}>
                            <text style={styles.text}>MODE : </text>
                            <button style={isChecked ? styles.button_on : styles.button_off} onClick={isEasy}>
                                easy
                            </button>
                            <button style={!isChecked ? styles.button_on : styles.button_off} onClick={isHard}>
                                hard
                            </button>
                        </div>
                        <div style={styles.div}>
                            <text style={styles.text}>인원 수 : </text>
                            <button style={people == 4 ? styles.button_on : styles.button_off} onClick={click4}>
                                {' '}
                                4명{' '}
                            </button>
                            <button style={people == 5 ? styles.button_on : styles.button_off} onClick={click5}>
                                {' '}
                                5명{' '}
                            </button>
                            <button style={people == 6 ? styles.button_on : styles.button_off} onClick={click6}>
                                {' '}
                                6명{' '}
                            </button>
                        </div>
                        <div style={styles.div}>
                            <text style={styles.text}>공개범위 : </text>
                            <button style={ispublic ? styles.button_on : styles.button_off} onClick={isPublic}>
                                public
                            </button>
                            <button style={!ispublic ? styles.button_on : styles.button_off} onClick={isPrivate}>
                                private
                            </button>
                        </div>
                    </div>
                    <p>
                        <OKButton onClick={result}>OK</OKButton>
                        <br />
                    </p>
                </div>
            </Modal>
        </div>
    );
}

const Button = styled.button`
    background: white;
    color: palevioletred;
    width: 130px;
    height: 40px;
    font-size: 1em;
    font-weight: bolder;
    margin: 5px 0px 0px 0px;
    padding: 0.25px 1px;
    border: 2px solid palevioletred;
    border-radius: 15px;

    &:hover {
        background: palevioletred;
        color: white;
        border: white;
    }
`;

const CloseButton = styled.button`
    font-size: 2em;
    color: ${style.skyblue};
    background-color: transparent;
    border: ${style.white};
    font-weight: bold;
    float: right;
    padding-right: 0.5em;

    &:hover {
        color: ${style.red};
    }
`;

const OKButton = styled.button`
    float: right;
    font-size: 20px;
    color: ${style.skyblue};
    background-color: ${style.white};
    border: 2px solid ${style.skyblue};
    border-radius: 15px;
    padding-left: 15px;
    padding-right: 15px;
    shadow-color: '#000';
    shadow-offset: {
        width: 0;
        height: 10;
    }
    shadow-opacity: 0.12;
    shadow-radius: 60;
    &:hover {
        background-color: ${style.skyblue};
        // border: 2px solid ${style.white};
        color: ${style.white};
    }
`;

const styles = {
    container: {
        border: '2px solid #fff',
        width: '400px',
        hieght: '250px',
        flexDirection: 'column',
        borderRadius: 10,
    },
    div: {
        margin: '20px',
    },
    text: {
        fontSize: 20,
    },
    button_on: {
        fontSize: 20,
        color: style.lightblue,
        backgroundColor: 'transparent',
        borderRadius: 20,
        border: '2px solid',
        borderColor: style.skyblue,
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 10,
    },

    button_off: {
        fontSize: 20,
        color: style.black,
        backgroundColor: 'transparent',
        border: style.white,
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 10,
    },
    input: {
        borderColor: style.skyblue,
        border: '2px solid',
        borderRadius: 20,
        color: style.skyblue,
        height: '20px',
        marginLeft: 10,
        paddingLeft: 10,
        fontSize: 14,
    },
    button_close: {
        fontSize: 30,
        color: style.skyblue,
        backgroundColor: 'transparent',
        border: style.white,
    },
    button_OK: {
        fontSize: 20,
        color: style.white,
        backgroundColor: style.skyblue,
        borderRadius: 7,
        paddingLeft: 20,
        paddingRight: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.12,
        shadowRadius: 60,
    },
};
