import React, { useState } from 'react';
import styled from 'styled-components';
import style from '../../styles/styles';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import Missions from '../../assets/mission.png';

export default function TutorialMollyMissionComponent(props) {
    const isLogin = useSelector((state) => state.socket.is_login);

    const history = useHistory();
    
    function onMove(){
        history.push({
            pathname: '/MolltvoteresultTutorial', 
            state: { role: props.role },
        });
    } 

    return (
        <Container>

            <NextBtn onClick={onMove}>Next Page ☞</NextBtn>

            <Txt>
              <div className= "textDiv">시간은 10초입니다. <br></br>홀리들의 그림을 보고 추측한 키워드를 적어주세요.</div>
            1
            </Txt>

            <Description>원하는 설명 번호 위에 마우스 올려보세요!</Description>
        </Container>
    );
}

const Description = styled.div`
    width: 500x;
    height: 50px;
    position: absolute;
    margin-left: -65px;
    margin-top: 540px; 
    font-size: 30px;   
    padding: 5px;
    color: ${style.white};
    font-family: Hahmlet;
    -webkit-text-stroke: 2px ${style.red};
`;

const NextBtn = styled.div`
    width: 150px;
    height: 25px;
    border-radius: 30px;
    text-align: center;
    position: absolute;
    margin-left: 800px;
    margin-top: -700px;
    border: 2px solid #000;
    border-radius: 20px;     
    font-size: 21px;   
    padding: 5px;

    &:hover {
        background-color: #462456;;
        color: ${style.white};
        border: 2px solid #000;
        border-radius: 20px;    
        cursor: grab; 
    }

`;
const Txt = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.white};
    font-weight: bolder;
    position: absolute;
    margin-left: -400px;
    margin-top: -105px;

    &:hover .textDiv {
        background-color:  ${style.white};
        color: ${style.black};
        border: 2px solid #000;
        border-radius: 10px;        
        display: inline;
    }

    .textDiv{
        z-index: 1;
        overflow: hidden;
        position: absolute;  
        top: 30px;
        left: 25px;
        width: 320px;
        display: none;
        padding: 5px;
    }
`;  

const Container = styled.div`
    background-image: url(${Missions});
    width: 1020px;
    height: 620px;
    flex-direction: column;
    display: flex;
    background-color: black;
    background-size: contain;
    background-repeat: no-repeat;
    justify-content: center;
    // justify-content: space-between;
    align-items: center;
`;

