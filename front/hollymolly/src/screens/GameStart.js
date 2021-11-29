import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";
//이미지
import logo from '../assets/bigLogo.png';
import gameBackground from '../assets/night.png';
import startBtn from '../assets/startBtn.png';
import tutotrialBtn from '../assets/tutorialBtn.png';

import Modal from '../components/ModalNickName';

function GameStart() {

  function tutorialClick() {
    alert('튜토리얼 clicked ');
  }

  return (
    <Background>
      <Backgroundimg>

        <Logo />

        <StartDiv>
          <Modal />
        </StartDiv>

        <TutorialBtn onClick={tutorialClick} />

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
  background-size: cover;
  background-repeat: no-repeat;
`;

export default GameStart;
