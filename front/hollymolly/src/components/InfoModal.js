import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import styled from 'styled-components';
import style from '../styles/styles';
import { ReactComponent as SettingIcon } from '../assets/settingIcon.svg'; // 방 세팅 버튼
import { ReactComponent as SettingsIcon } from '../assets/SettingsIcon.svg';
import RefreshVerification from '../server/RefreshVerification';

// 소켓
import { io } from 'socket.io-client';
import axios from 'axios';
import colors from '../styles/styles';

const BaseURL = 'http://3.17.55.178:3002';

export default function InfoModal({ title, mode, room_private, member, room_idx }) {
    // 인원수 0 제목 0 난이도
    console.log(title, mode, member, room_private);
    // 방 설정 수정
    const [roomdata, setRoomdata] = useState();
    const [roomInfo, setRoomInfo] = useState('');
    // let count = 0;
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            width: '430px',
            height: '330px',
            overflow: 'hidden',
            borderRadius: 30,
            overflow: 'hidden',
            margin: '0',
            paddingRight: '5px',
            boxShadow: '5px 5px 22px #808080',
            zIndex: 1000,
        },
    };

    //토큰 검사
    let verify = RefreshVerification.verification()
    console.log('토큰 유효한지 검사 t/f 값 : ' + verify);
    let data, save_token;

    if (verify === true) {
        data = sessionStorage.getItem('token');
        save_token = JSON.parse(data) && JSON.parse(data).access_token;
    }
    
    useEffect(() => {
        // getRoomInfo();
    }, []);

    const UpdateRoomInfo = async () => {
        // 대기실 정보 수정 api
        const restURL = BaseURL + '/room/info/';

        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };
        axios
            .put(
                restURL,
                {
                    room_idx: room_idx,
                    room_name: inputRef.current.value,
                    room_mode: roomMode,
                    room_start_member_cnt: people,
                },
                reqHeaders
            )
            .then(function (response) {
                console.log(response.status);
                console.log('UpdateRoomInfo 성공');
            })
            .catch(function (error) {
                console.log('UpdateRoomInfo 실패');
                console.log(error.response);
            });
    };

    const getRoomInfo = async () => {
        // 대기실 정보 조회 api
        const restURL = BaseURL + '/room/info/' + room_idx;

        const reqHeaders = {
            headers: {
                //1번 토큰 이용
                authorization: 'Bearer ' + save_token,
            },
        };
        axios
            .get(restURL, reqHeaders)
            .then(function (response) {
                setRoomInfo(response.data);
                console.log(response.data);
                console.log('getRoomInfo 성공 in madal');
            })
            .catch(function (error) {
                console.log('getRoomInfo 실패 in madal');
                console.log(error.response);
            });
    };

    const inputRef = useRef();
    let roomMode = '';

    let a;
    mode == 'easy' ? (a = true) : (a = false); //  이지면 true 하드면 false
    console.log('넘오온' + a);
    // 난이도 useState
    const [isChecked, setIschecked] = React.useState(true);

    // 인원 useState
    let clicked;
    let b;
    console.log(member);
    member == 6 ? (b = 6) : member == 5 ? (b = 5) : (b = 4);
    const [people, setPeople] = useState(true);
    console.log(people);
    console.log('people');

    const click4 = () => {
        setPeople((people) => (people = 4));
        clicked = 4;
        console.log('선택) 인원수 4명');
    };

    const click5 = () => {
        setPeople((people) => (people = 5));
        clicked = 5;
        console.log('선택) 인원수 5명');
    };

    const click6 = () => {
        setPeople((people) => (people = 6));
        clicked = 6;
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
        console.log('오케이 눌림');
        // UpdateRoomInfo();
        console.log(':::최종결과:::');
        console.log('방이름은? ' + inputRef.current.value);

        if (inputRef.current.value == null || inputRef.current.value == '') {
            inputRef.current.value = title; // 제목 안적으면 수정 전 디폴트
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

        UpdateRoomInfo();
        // clickedSetting(resultt + 1);
        closeModal();

        // 방 생성했으면 초기화
        // if (isChecked === true) setIschecked(!isChecked); // easy로 바꿈
        // setPeople((people) => (people = 4)); //4명으로 바꿈
        // if (ispublic == false) setIsPublic(!ispublic); // public으로 바꿈
    };

    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        setIsOpen(true);

        if (member == 4) {
            setPeople((people) => (people = 4));
        }
        if (member == 5) {
            setPeople((people) => (people = 5));
        }

        if (member == 6) {
            setPeople((people) => (people = 6));
        }

        if (mode == 'hard') {
            setIschecked(false);
        }
        if (mode == 'easy') {
            setIschecked(true);
        }

        if (room_private == 1) {
            // 프라이빗
            setIsPublic(false);
        }
        if (room_private == 0) {
            // 퍼블릭
            setIsPublic(true);
        }
    }

    function closeModal() {
        // if (isChecked === true) setIschecked(!isChecked); // easy로 바꿈
        // setPeople((people) => (people = 4)); //4명으로 바꿈
        // if (ispublic == false) setIsPublic(!ispublic); // public으로 바꿈

        setIsOpen(false);
    }

    let subtitle;
    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }

    return (
        <div>
            <SettingsIcon
                style={{ marginTop: '25px', cursor: 'grab' }}
                onClick={() => {
                    openModal();
                }}
            />
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
                    <h1 style={{ textAlign: 'center' }}>방 설정 정보</h1>
                    <div style={{ marginLeft: '50px' }}>
                        <div style={styles.div}>
                            <text style={styles.text}>방 이름 : </text>
                            <input style={styles.input} type="text" placeholder={title} ref={inputRef} disabled />
                        </div>
                        <div style={styles.div}>
                            <text style={styles.text}>MODE : </text>
                            <button style={isChecked ? styles.button_on : styles.button_off}>easy</button>
                            <button style={!isChecked ? styles.button_on : styles.button_off}>hard</button>
                        </div>
                        <div style={styles.div}>
                            <text style={styles.text}>인원 수 : </text>
                            <button style={people == 4 ? styles.button_on : styles.button_off}>4명</button>
                            <button style={people == 5 ? styles.button_on : styles.button_off}>5명</button>
                            <button style={people == 6 ? styles.button_on : styles.button_off}>6명</button>
                        </div>
                        <div style={styles.div}>
                            <text style={styles.range_text}>공개범위 : </text>
                            <button style={ispublic ? styles.button_on : styles.button_off}>public</button>
                            <button style={!ispublic ? styles.button_on : styles.button_off}>private</button>
                        </div>
                    </div>
                    <p>
                        <text style={styles.notice}>* 방 설정 변경은 방장만 가능합니다.</text>
                        {/* <OKButton onClick={result}>OK</OKButton> */}
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
        zIndex: '1000',
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
    // range
    range_button_on: {
        fontSize: 20,
        color: colors.gray,
        backgroundColor: 'transparent',
        borderRadius: 20,
        border: '2px solid',
        borderColor: style.gray,
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 10,
    },

    range_button_off: {
        fontSize: 20,
        color: colors.gray,
        backgroundColor: 'transparent',
        border: style.white,
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 10,
    },
    range_text: {
        fontSize: 20,
        color: colors.black,
    },
    notice: {
        fontSize: 10,
        color: colors.red,
        marginLeft: 70,
    },
};
