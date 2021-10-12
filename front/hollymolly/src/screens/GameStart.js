import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";
//이미지
import logo from '../assets/bigLogo.png';
import gameBackground from '../assets/night.png';
import startBtn from '../assets/startBtn.png';
import tutotrialBtn from '../assets/tutorialBtn.png';

function GameStart() {

  function tutorialClick() {
    alert('튜토리얼 clicked ');
  }

  return (
    <Background>
      <Backgroundimg>

        <Logo />

        <Link to='/InputName'>
          <StartBtn />
        </Link>

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
  background-image: url(${gameBackground});
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
`;

const Backgroundimg = styled.div`
  background-image: url(${gameBackground});
  width: 100vw;
  height: 100vh;
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
`;

const StartBtn = styled.div`
  width: 250px;  
  height: 50px;
  background-image: url(${startBtn});
  margin: -30px auto;  
  background-size: cover;
  background-repeat: no-repeat;
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
