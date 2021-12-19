import React, { useState } from 'react';
import styled from 'styled-components';
import style from '../../styles/styles';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';

import Vote from '../../assets/hollyVote.png';

export default function TutorialMollyVoteComponent(props) {
    const isLogin = useSelector((state) => state.socket.is_login);

    const history = useHistory();
    let location = useLocation();

    function onMove(){
            history.push({
                pathname: '/missionTutorial', 
                state: { role: props.role },
            });       
    } 

    return (
        <Container>

            <NextBtn onClick={onMove}>Next Page ☞</NextBtn>

            <Text>
              <div className= "textDiv"> 인간으로 지목하고 싶은 플레이어를 투표합니다. 시간 내에 투표하지 않으면 기권으로 처리됩니다.</div>
            1
            </Text>

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
    color: ${style.white};
    font-family: Hahmlet;
    -webkit-text-stroke: 1px ${style.yellow};
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
const Text = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.white};
    font-weight: bolder;
    position: absolute;
    margin-left: -640px;
    margin-top: -480px;

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
        left: 28px;
        width: 600px;
        display: none;
        padding: 5px;
    }
`;  

const Container = styled.div`
    background-image: url(${Vote});
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

