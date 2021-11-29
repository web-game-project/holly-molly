import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
//이미지
import logo from '../assets/bigLogo.png';
import gameBackground from '../assets/night.png';
import startBtn from '../assets/startBtn.png';
import tutotrialBtn from '../assets/tutorialBtn.png';

import Modal from '../components/ModalNickName';

function Tutorial() {
    return (
        <Container>
            <Text>튜토리얼 페이지</Text>
        </Container>
    );
}

const Container = styled.div`
    background-color: #180928;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;
const Text = styled.text`
    color: #c11b1b;
    font-size: 50px;
    font-weight: light;
    // -webkit-text-stroke: 1px #c00202;
    margin-top: -5px;
`;
export default Tutorial;
