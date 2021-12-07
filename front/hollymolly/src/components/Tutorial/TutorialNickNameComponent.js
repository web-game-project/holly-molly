import React, { useState } from 'react';
import styled from 'styled-components';
import style from '../../styles/styles';
import { useSelector } from 'react-redux';
import { useHistory, useLocation} from 'react-router';

import NickName from '../../assets/nickName.png';

export default function TutorialNickNameComponent({}) {
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
            pathname: '/roomlistTutorial', 
            state: { role: location.state.role },
        });
    } 
    return (
        <Container>

            <NextBtn onClick={onMove}>Next Page ☞</NextBtn>

            <InputName>
              <div className= "textDiv"> 닉네임 입력: 일회성 닉네임을 생성합니다. 중복된 닉네임도 가능합니다.</div>
            1
            </InputName>
           
            <Btn>
              <div className= "textDiv"> 접속: 접속을 눌러 로그인을 합니다. <br></br> 취소: 닉네임 생성을 취소합니다.</div>
            2
            </Btn>

            
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
    -webkit-text-stroke: 3px ${style.purple};
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
const InputName = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.black};
    font-weight: bolder;
    position: absolute;
    margin-left: -350px;
    margin-top: -50px;

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
        top: -18px;
        left: 28px;
        width: 430px;
        display: none;
        padding: 5px;
    }
`;  

const Btn = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.black};
    font-weight: bolder;
    position: absolute;
    margin-left: 5px;
    margin-top: 250px;

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
        top: -120%;
        left: 55%;
        width: 250px;
        display: none;
        padding: 5px;
    }
`;  

const Container = styled.div`
    background-image: url(${NickName});
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

