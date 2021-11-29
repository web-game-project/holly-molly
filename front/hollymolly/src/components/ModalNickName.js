import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import styled from 'styled-components';
import style from '../styles/styles';

import axios from 'axios';

import startBtn from '../assets/startBtn.png';
//페이지 이동
import { useHistory } from "react-router";

export default function ModalBase() {
    //history 객체
    const history = useHistory();

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

    let subtitle;

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }

    const createNickname = async () => {
        //alert('페이지 이동 고고'+ nickName);

        const url = "http://3.17.55.178:3002/login";

        axios.post(url, {
            name: nickName
        })
            .then(function (response) { //response로 jwt token 반환
                alert('success! ' + response.data.access_token);

                window.localStorage.setItem("token", JSON.stringify({
                    access_token: response.data.access_token,
                    refresh_token: response.data.refresh_token,
                    user_idx: response.data.user_idx,
                    user_name: nickName,
                }));

            })
            .catch(function (error) {
                alert(error);
            })

        //window.location.href = '/roomlist';
        history.push("/roomlist");
    }

    const onChange = (e) => {
        setNickName(e.target.value);
    }

    return (
        <div>
            <StartBtn onClick={openModal}/>
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
                    <text style={{ fontSize: 27, paddingTop: '15px', marginTop: '0px', width: '100%', height: '60px', backgroundColor: '#221330', textAlign: 'center', color: style.white}}>닉네임 입력</text>
                    {/* <CloseButton onClick={closeModal}>X</CloseButton> */}
                    </div>
                    <input style={styles.input} type='text' placeholder="                  닉네임을 입력해주세요." onChange={onChange} value={nickName}></input>
                    <h5 style={styles.usable}>＊한글2~8자 또는 영문2~16자, 특수문자 입력 불가능 </h5>
                    
                    <BtnDiv>
                        <Button color='purple' onClick={createNickname} >접속</Button>
                        <Button color='red' onClick={closeModal}>취소</Button>
                    </BtnDiv>
                </div>
            </Modal>
        </div>
    );
}

const StartBtn = styled.div`
  width: 250px;  
  height: 50px;
  background-image: url(${startBtn});
  margin: -30px auto;  
  background-size: contain;
  background-repeat: no-repeat;  
`;

const BtnDiv = styled.div `
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: right;
    margin-top: 65px;
`;

const Button = styled.div`
    float: right;
    font-size: 20px;    
    border-radius: 15px;
    padding-left: 25px;
    padding-right: 25px;
    width: 40px;
    text-align: center;
    shadow-color: '#000';
    shadow-offset: {
        width: 0;
        height: 10;
    }
    shadow-opacity: 0.12;
    shadow-radius: 60;
    color: ${style.white};
    
    ${(props) => (props.color == 'red' ? `
                                        background-color: ${style.red}; 
                                        margin-left: 10px; 
                                        margin-right: 25px;
                                        &:hover { 
                                            background-color: ${style.white};
                                            color: ${style.red};
                                            border: 2px solid ${style.red};
                                        }` 
                                        :
                                        `
                                        background: linear-gradient(to right, #5c258d, #4389a2);
                                        color: ${style.white};                              
                                        &:hover { 
                                            color:  ${style.white}; 
                                            border-image: linear-gradient(to right, #5c258d, #4389a2);
                                            border-image-slice: 1;                                                                        
                                            border: 2px solid;
                                        }` )}

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
        fontSize: 12,        
        color: style.white,
        display: 'flex',
        alignitems: 'center',
        justifycontent: 'center',
        marginTop: '10px',
        marginLeft: '25%',
        color: '#FF0000',
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
        color: style.white
    },
    input: {
        width: '70%',
        marginTop: '100px',
        marginLeft: '15%',
        padding: '5px',
        borderColor: style.dark_purple,
        border: '2px solid',
        borderRadius: 20,
        color: style.black,
        height: '30px',
        fontSize: 16,
    },
};