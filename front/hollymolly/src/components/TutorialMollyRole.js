import React, { useState } from 'react';
import styled from 'styled-components';
import style from '../styles/styles';
import NightSVG from '../assets/night.svg';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';

import MollyRole from '../assets/mollyRole.png';

import ReactTooltip from "react-tooltip";

export default function TutorialMollyRole({}) {
    const isLogin = useSelector((state) => state.socket.is_login);

    const history = useHistory();

    const [hide, setHide] = useState(false);
    
    /* function goRoomList() {
        history.push({
            pathname: '/roomlist', // 나가기 성공하면 룸리스트로 이동
        });
    } */

    const keyword = " ● easy mode일 경우에는 유령들이 그리는 키워드와 관련된 키워드를 보여줍니다.\n이 단어를 기반으로 유령들이 그리는 키워드를 추측해보세요. \n ● hard mode인 경우, 아무 키워드도 보여주지 않습니다.";
    const usercard = "플레이어 목록: 맨 위의 카드는 자기 자신을 나타냅니다. \n다른 사용자들은 그림 그리는 순서로 출력이 되며, \n카드의 테두리는 대기방에서 지정한 색깔로 보여줍니다.";

    return (
        <Container>

            <NextBtn>Next Page ☞</NextBtn>

            <RoleDiv>
              <div className= "textDiv"> 역할 : 시민 혹은 유령으로 게임에서의 역할을 알려줍니다.</div>
            ?
            </RoleDiv>
           
            <RoleTextDiv>
              <div className= "textDiv"> 게임은 총 3세트로 이루어져 있습니다.</div>
            ?
            </RoleTextDiv>

            <KeywordDiv>
              <div className= "textDiv">
                  {keyword.split("\n").map((i, key) => {
                      console.log('ㅑㅕ' + i);
                      if(key === 0 || key === 2)
                        return <p key={key}> {i}</p>;
                      else
                      return <p key={key}>&nbsp;&nbsp;&nbsp;{i}</p>;
                  })}
               </div>
            ?
            </KeywordDiv>          

            <UserCardDiv>
              <div className= "textDiv"> 
                {usercard.split("\n").map((i, key) => {
                        console.log('ㅑㅕ' + i);
                        /* if(key === 0 || key === 2) */
                            return <p key={key}> {i}</p>;
                       /*  else
                        return <p key={key}>&nbsp;&nbsp;&nbsp;{i}</p>; */
                    })}
              </div>
            ?
            </UserCardDiv>

            <Description>원하는 설명의 '?' 위에 마우스 올려보세요!</Description>
        </Container>
    );
}

const Description = styled.div`
    width: 500x;
    height: 50px;
    position: absolute;
    top: 88%;
    left: 21%;  
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
    top: 8%;
    left: 69%;
    border: 2px solid #000;
    border-radius: 20px;     
    font-size: 21px;   
    padding: 5px;

    &:hover {
        background-color: #462456;;
        color: ${style.white};
        border: 2px solid #000;
        border-radius: 20px;    
        
    }

`;
const RoleDiv = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.black};
    font-weight: bolder;
    position: absolute;
    top: 26%;
    left: 43%;

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
        top: 60%;
        left: 43%;
        width: 350px;
        display: none;
        padding: 5px;
    }
`;  

const RoleTextDiv = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.black};
    font-weight: bolder;
    position: absolute;
    top: 58%;
    left: 33.5%;

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
        top: 60%;
        left: 43%;
        width: 300px;
        display: none;
        padding: 5px;
    }
`;  

const KeywordDiv = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.black};
    font-weight: bolder;
    position: absolute;
    top: 16%;
    left: 20%;

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
        top: 60%;
        left: 43%;
        width: 500px;
        display: none;
        padding: 5px;
    }

    p{
        margin: 0px;
        text-align: left;
    }
`;  

const UserCardDiv = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.black};
    font-weight: bolder;
    position: absolute;
    top: 28%;
    left: 20%;

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
        top: 60%;
        left: 43%;
        width: 350px;
        display: none;
        padding: 5px;
    }

    p{
        margin: 0px;
        text-align: left;
    }
`;  

const Container = styled.div`
    background-image: url(${MollyRole});
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

