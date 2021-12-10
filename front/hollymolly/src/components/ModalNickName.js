import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import styled from 'styled-components';
import style from '../styles/styles';

import axios from 'axios';

import startBtn from '../assets/startBtn.png';
//페이지 이동
import { useHistory } from 'react-router';

// 리덕스
import { useDispatch } from 'react-redux';
import { actionCreators as socketActions } from '../redux/modules/socket';

export default function ModalBase({ tutorial }) {
    //history 객체
    const history = useHistory();

    // dispatch를 사용하기 위한 준비
    const dispatch = useDispatch();

    const [nickName, setNickName] = React.useState('');

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
            borderColor: '#000',
            borderWidth: 'thin',
            overflow: 'hidden',
            margin: '0',
            padding: '20px',
            boxShadow: '5px 5px 22px #808080',
            zIndex: 100,
            backgroundColor: '#462456',
        },
    };

    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }

    useEffect(() => {
        localStorage.removeItem('token');
        console.log('내 인덱스 delete 후 : ' + JSON.stringify(localStorage.getItem('token')));
    });

    const createNickname = async () => {
        const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\s]*$/; // 한글, 영어, 숫자, 공백 허용

        const str = nickName; // str 변수에 저장

        const usable = regex.test(str); // 정규식 테스트

        console.log('usable: ' + usable);

        if (str.length < 2 || str.length > 10 || usable === false) {
            setNickName('');
            alert('2~10자의 한글, 영문, 숫자만 사용할 수 있습니다.');
        }
        else if (usable === true) {
            const url = 'http://3.17.55.178:3002/login';

            axios
                .post(url, {
                    name: nickName,
                })
                .then(function (response) {
                    //response로 jwt token 반환
                    console.log('success!' + response.data.user_idx);
                    //  alert('success! ' + response.data.access_token);

                    localStorage.setItem(
                        'token',
                        JSON.stringify({
                            access_token: response.data.access_token,
                            refresh_token: response.data.refresh_token,
                            user_idx: response.data.user_idx,
                            user_name: nickName,
                        })
                    );

                    // 리덕스 store에 baseURL 넣기
                    dispatch(socketActions.socketAction('http://3.17.55.178:3002/'));
                    //history.push("/roomlist");
                    window.location.replace('/roomlist');
                })
                .catch(function (error) {
                    alert(error);
                });
        }

        //window.location.href = '/roomlist';
        //history.push("/roomlist");
    };

    const onChange = (e) => {
        setNickName(e.target.value);
    };

    const onEnter = (e) => {
        if(e.key === 'Enter'){
            createNickname();
        }
    }
    return (
        <div>
            {tutorial ? <TutorialStartBtn onClick={openModal} /> : <StartBtn onClick={openModal} />}
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Create Nickname Modal"
                shouldCloseOnOverlayClick={false}
                ariaHideApp={false}
            >
                <br />
                <div style={styles.container}>
                    <div style={styles.row_div}>
                        <text
                            style={{
                                fontSize: 27,
                                paddingTop: '20px',
                                marginTop: '0px',
                                width: '100%',
                                height: '60px',
                                backgroundColor: '#221330',
                                textAlign: 'center',
                                color: style.white,
                            }}
                        >
                            닉네임 입력
                        </text>
                        {/* <CloseButton onClick={closeModal}>X</CloseButton> */}
                    </div>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="           닉네임을 입력해주세요."
                        onChange={onChange}
                        onKeyPress={onEnter}
                        value={nickName}
                    ></input>
                    <text style={styles.usable}>＊한글, 영문, 숫자 공백 포함 2~10자까지 가능, 특수문자 입력 불가능 </text>

                    <BtnDiv>
                        <Button color="purple" onClick={createNickname}>
                            접속
                        </Button>
                        <Button color="red" onClick={closeModal}>
                            취소
                        </Button>
                    </BtnDiv>
                </div>
            </Modal>
        </div>
    );
}
const TutorialStartBtn = styled.div`
    width: 200px;
    height: 50px;
    background-image: url(${startBtn});
    margin-left: 800px;
    margin-top: -50px;
    background-size: contain;
    background-repeat: no-repeat;
    justify-content: center;
    align-self: end;
    &:hover {
        cursor: grab;
    }
`;
const StartBtn = styled.div`
    width: 250px;
    height: 50px;
    background-image: url(${startBtn});
    margin: -30px auto;
    background-size: contain;
    background-repeat: no-repeat;
    &:hover {
        cursor: grab;
    }
`;

const BtnDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: right;
    margin-top: 65px;
`;

const Button = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    border-radius: 15px;
    padding-left: 25px;
    padding-right: 25px;
    width: 40px;
    height: 30px;
    align-contents: center;
    align-self: center;
    text-align: center;
    shadow-color: '#000';
    shadow-offset: {
        width: 0;
        height: 10;
    }
    shadow-opacity: 0.12;
    shadow-radius: 60;
    color: ${style.white};

    ${(props) =>
        props.color == 'red'
            ? `background-color: ${style.red}; 
                margin-left: 10px; 
                margin-right: 25px;
                border: 2px solid ${style.red};
                &:hover { 
                    background-color: ${style.white};
                    color: ${style.red};
                    border: 2px solid ${style.red};
                    cursor: grab;
                }`
            : `
                background: linear-gradient(to right, #5c258f, #4389a2);
                color: ${style.white};                                                                    
                border: 2px solid #4389a2;                 
                &:hover { 
                    color:  ${style.white}; 
                    border-image: linear-gradient(to right, #5c258d, #4389a2);
                    border-image-slice: 2;                                                                        
                    border: 2px solid;
                    cursor: grab;
                }`}
`;

const styles = {
    container: {
        //border: '5px solid #fff',
        width: '475px',
        height: '95%',
        flexDirection: 'column',
        marginTop: '-39px',
        marginLeft: '-25px',
        borderRadius: 10,
    },
    usable: {
        fontSize: 14,
        color: style.white,
        display: 'flex',
        alignitems: 'center',
        justifycontent: 'center',
        marginTop: '10px',
        marginLeft: '12%',
        // color: '#FF0000',
        textAlign: 'center',
        width: '100%',
    },
    row_div: {
        display: 'flex',
        alignitems: 'center',
        justifycontent: 'center',
        flexDirection: 'row',
    },
    div: {
        margin: '20px',
    },
    text: {
        fontSize: 20,
        color: style.white,
    },
    input: {
        width: '70%',
        marginTop: '80px',
        marginBottom: '10px',
        marginLeft: '15%',
        padding: '5px 5px 5px 15px',
        // paddingLeft: '10px',
        borderColor: style.dark_purple,
        border: '2px solid',
        borderRadius: 20,
        color: style.black,
        height: '30px',
        fontSize: 20,
    },
};
