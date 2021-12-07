import React, { useState } from 'react';
import styled from 'styled-components';
import style from '../../styles/styles';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import HollyRole from '../../assets/hollyRole.png';

export default function TutorialHollyRoleComponent(props) {
    const isLogin = useSelector((state) => state.socket.is_login);

    const history = useHistory();
    
    /* function goRoomList() {
        history.push({
            pathname: '/roomlist', // 나가기 성공하면 룸리스트로 이동
        });
    } */

    const usercard = "플레이어 목록: 맨 위의 카드는 자기 자신을 나타냅니다. \n다른 사용자들은 그림 그리는 순서로 출력이 되며, \n카드의 테두리는 대기방에서 지정한 색깔로 보여줍니다.";

    function onMove(){
        history.push({
            pathname: '/drawTutorial', 
            state: { role: props.role },
        });
    } 

    return (
        <Container>

            <NextBtn onClick={onMove}>Next Page ☞</NextBtn>

            <RoleDiv>
              <div className= "textDiv"> 역할 : 시민 혹은 유령으로 게임에서의 역할을 알려줍니다.</div>
            3
            </RoleDiv>
           
            <RoleTextDiv>
              <div className= "textDiv"> 게임은 총 3세트로 이루어져 있습니다.</div>
            4
            </RoleTextDiv>

            <KeywordDiv>
              <div className= "textDiv">
                    키워드: 그림으로 그릴 키워를 보여줍니다.
               </div>
            1
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
            2
            </UserCardDiv>

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
    margin-left: -200px;
    margin-top: -450px;

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
        top: -25px;
        left: 30px;
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
    margin-left: -530px;
    margin-top: 260px;

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
    margin-left: -976.5px;
    margin-top: -580px;

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
    margin-left: -976.5px;
    margin-top: -380px;

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
    background-image: url(${HollyRole});
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

