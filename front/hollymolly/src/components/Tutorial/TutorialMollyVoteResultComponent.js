import React, { useState } from 'react';
import styled from 'styled-components';
import style from '../../styles/styles';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import VoteResult from '../../assets/mollyVoteResult.png';

export default function TutorialMollyVoteResultComponent({}) {
    const isLogin = useSelector((state) => state.socket.is_login);

    const history = useHistory();
    
    function onMove(){
        history.push({
            pathname: '/middleresultTutorial', 
        });
    } 

    return (
        <Container>

            <NextBtn onClick={onMove}>Next Page ☞</NextBtn>

            <ResultTxt>
              <div className= "textDiv"> 표를 가장 많이 받은 2명 (동점자가 있는 경우 포함)을 알려줍니다.</div>
            1
            </ResultTxt>
           
            <ResultTotalTxt>
              <div className= "textDiv"> 몰리는 투표 결과 전체를 확인할 수 있습니다. 이 정보를 적절히 활용해 보세요.</div>
            2
            </ResultTotalTxt>

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
const ResultTxt = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.white};
    font-weight: bolder;
    position: absolute;
    margin-left: -280px;
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
        left: 25px;
        width: 400px;
        display: none;
        padding: 5px;
    }
`;  

const ResultTotalTxt = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.white};
    font-weight: bolder;
    position: absolute;
    margin-left: -665px;
    margin-top: 150px;

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
        width: 500px;
        display: none;
        padding: 5px;
    }
`;  

const Container = styled.div`
    background-image: url(${VoteResult});
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

