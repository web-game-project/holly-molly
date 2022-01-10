import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
//이미지
import logo from '../assets/bigLogo.png';
import gameBackground from '../assets/night.png';
import startBtn from '../assets/startBtn.png';
import tutotrialBtn from '../assets/tutorialBtn.png';
import Modal from '../components/ModalNickName';
import style from '../styles/styles.js';

function GameStart() {

    console.log('세션스토리지 : ' + sessionStorage.getItem('token'));
    
    return (
        <Background>
            <Backgroundimg>
                
                <text style={{color: style.red, fontSize: "15px", marginLeft: "15px"}}>권장 브라우저: Chrome, 다른 브라우저로 이용 시 게임이 원활하지 않을 수 있습니다.</text>
                <br/>
                <text style={{color: style.red, fontSize: "15px", marginLeft: "15px"}}>게임 중 새로고침, URL 이동, 브라우저 종료 시 비정상 종료 처리가 될 수 있습니다.</text>
            
                <Logo />

                <StartDiv>
                    <Modal />
                </StartDiv>

                <Link to="/tutorial">
                    <TutorialBtn />
                </Link>
            </Backgroundimg>
        </Background>
    );
}

const Logo = styled.div`
    background-image: url(${logo});
    width: 480px;
    height: 480px;
    margin: auto;
    background-size: contain;
    background-position: 100% 40%;
    background-repeat: no-repeat;
`;

const Background = styled.div`
    background-color: #180928;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Backgroundimg = styled.div`
    background-image: url(${gameBackground});
    width: 1020px;
    height: 720px;
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    border-radius: 1.5rem;
`;

const StartDiv = styled.div`
    width: 250px;
    height: 50px;
    margin: -30px auto;
`;

const TutorialBtn = styled.div`
    width: 250px;
    height: 50px;
    background-image: url(${tutotrialBtn});
    margin: 40px auto;
    background-size: contain;
    background-repeat: no-repeat;
    &:hover {
        cursor: grab;
    }
`;

export default GameStart;
