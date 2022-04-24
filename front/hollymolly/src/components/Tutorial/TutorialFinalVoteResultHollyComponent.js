import React, { useState } from 'react';
import styled from 'styled-components';
import style from '../../styles/styles';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import FinalResult from '../../assets/hollyFinalResult.png';

export default function TutorialFinalVoteResultHollyComponent({}) {
    const isLogin = useSelector((state) => state.socket.is_login);

    const history = useHistory();
        
    function onMove(){
        history.push({
            pathname: '/', 
        });
    } 

    return (
        <Container>

            <NextBtn onClick={onMove}>Start Game ☞</NextBtn>

            <Result>
              <div className= "textDiv">최종적으로 누가 이겼는지 보여줍니다.</div>
            1
            </Result>

            <ResultContent>
              <div className= "textDiv">3세트의 득점 결과를 보여줍니다.</div>
            2
            </ResultContent>

            <Description>원하는 설명 번호 위에 마우스 올려보세요!</Description>
        </Container>
    );
}

const Description = styled.div`
    width: 500x;
    height: 50px;
    position: absolute;
    margin-left: -65px;
    margin-top: -580px; 
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

const Result = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.white};
    font-weight: bolder;
    position: absolute;
    margin-left: -350px;
    margin-top: -485px;

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
        top: 25px;
        left: -275px;
        width: 280px;
        display: none;
        padding: 5px;
    }
`;  

const ResultContent = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.white};
    font-weight: bolder;
    position: absolute;
    margin-left: -380px;
    margin-top: 105px;

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
        top: 23px;
        left: -240px;
        width: 240px;
        display: none;
        padding: 5px;
    }
`;  

const Container = styled.div`
    background-image: url(${FinalResult});
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

