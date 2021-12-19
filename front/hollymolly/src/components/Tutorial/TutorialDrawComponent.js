import React, { useState } from 'react';
import styled from 'styled-components';
import style from '../../styles/styles';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';

import Draw from '../../assets/draw.png';

export default function TutorialDrawMollyComponent(props) {
    const isLogin = useSelector((state) => state.socket.is_login);

    const history = useHistory();
    let location = useLocation();

    /* function goRoomList() {
        history.push({
            pathname: '/roomlist', // 나가기 성공하면 룸리스트로 이동
        });
    } */
    
    function onMove(){
        history.push({
            pathname: '/voteTutorial', 
            state: { role: props.role },
        });
    } 

    return (
        <Container>

            <NextBtn onClick={onMove}>Next Page ☞</NextBtn>

            <Card>
              <div className= "textDiv"> 정해진 순서에 맞는 플레이어의 카드의 테두리가 진해집니다.</div>
            1
            </Card>
           
            <Timer>
              <div className= "textDiv"> 각 사용자는 자신의 순서에 10초 동안 그림을 그릴 수 있습니다. <br></br>힌트 단어와 유령들이 그린 그림을 기반으로, 단어를 유추해 그림을 그려보세요.</div>
            2
            </Timer>

            <Description>원하는 설명 번호 위에 마우스 올려보세요!</Description>
        </Container>
    );
}

const Description = styled.div`
    width: 500x;
    height: 50px;
    position: absolute;
    margin-left: -450px;
    margin-top: 540px; 
    font-size: 30px;   
    padding: 5px;
    color: ${style.black};
    font-family: Hahmlet;
    -webkit-text-stroke: 1px ${style.red};
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
const Card = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.black};
    font-weight: bolder;
    position: absolute;
    margin-left: -980px;
    margin-top: -420px;

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
        top: -20px;
        left: 25px;
        width: 370px;
        display: none;
        padding: 5px;
    }
`;  

const Timer = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.black};
    font-weight: bolder;
    position: absolute;
    margin-left: 300px;
    margin-top: -520px;

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
        top: 70%;
        left: -1230%;
        width: 500px;
        display: none;
        padding: 5px;
    }
`;  

const Container = styled.div`
    background-image: url(${Draw});
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

