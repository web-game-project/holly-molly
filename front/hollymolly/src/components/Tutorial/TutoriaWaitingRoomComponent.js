import React, { useState } from 'react';
import styled from 'styled-components';
import style from '../../styles/styles';
import { useSelector } from 'react-redux';
import { useHistory, useLocation} from 'react-router';

import waitingRoom from '../../assets/waitingRoom.png';

export default function TutorialRoomListComponent({}) {
    const isLogin = useSelector((state) => state.socket.is_login);

    const history = useHistory();
    let location = useLocation();

    const colorTxt = "색깔 정보 변경 \n● 총 7가지 색 중, 게임에서 사용할 색을 선택할 수 있습니다.\n● 다른 사람이 이미 선택한 색은 회색으로 표시됩니다.";

    function onMove(){
        history.push({
            pathname: '/roleTutorial', 
            state: { role: location.state.role },          
        });
    } 

    return (
        <Container>

            <NextBtn onClick={onMove}>Next Page ☞</NextBtn>

            <Info>
              <div className= "textDiv"> 대기방 정보 간단 확인: 방의 정보를 간단하게 확인할 수 있습니다.<br></br> 방 코드를 다른 사람에게 공유하여 친구와 같이 게임을 즐길 수 있습니다.</div>
            1
            </Info>
           
            <Modify>
              <div className= "textDiv"> 
              대기방 정보 상세 확인 및 수정<br></br> 대기방 모든 인원이 방의 정보를 상세히 확인할 수 있고, <br></br>방장은 정보를 수정할 수 있습니다. 
              </div>
            2
            </Modify>

            <Chatting>
              <div className= "textDiv"> 채팅 : 같은 방에 참여한 사람들끼리는 간단한 이야기를 나눌 수 있습니다. </div>
            3
            </Chatting>

            <ColorBar>
              <div className= "textDiv">
                {colorTxt.split("\n").map((i, key) => {
                        if(key === 0)
                            return <p key={key}>{i}<br></br> </p>;
                        else
                            return <p key={key}>{i}</p>;
                    })}
              </div>
            4
            </ColorBar>          

            <UserCard>
              <div className= "textDiv"> 
              캐릭터 프로필 : 캐릭터의 이름, 색깔, 레디 여부를 확인할 수 있습니다.
              </div>
            5
            </UserCard>

            <Exit>
              <div className= "textDiv"> 
              방 나가기 : 방을 나갈 수 있습니다.
              </div>
            6
            </Exit>

            <Ready>
              <div className= "textDiv"> 
                게임 준비 : 준비가 되었을 때 클릭하면 됩니다. <br></br>
                방장은 게임 시작 버튼이면 참여자가 모두 <br></br>
                레디를 해야지 클릭할 수 있습니다.    
              </div>
            7
            </Ready>

            <Description>원하는 설명 번호 위에 마우스 올려보세요!</Description>
        </Container>
    );
}

const Container = styled.div`
    background-image: url(${waitingRoom});
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

const Description = styled.div`
    width: 500x;
    height: 50px;
    position: absolute;
    margin-left: -200px;
    margin-top: 570px; 
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
        
    }

`;
const Info = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.black};
    font-weight: bolder;
    position: absolute;
    margin-left: -525px;
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
        top: -45px;
        left: 30px;
        width: 450px;
        display: none;
        padding: 5px;
    }
`;  

const Chatting = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.black};
    font-weight: bolder;
    position: absolute;
    margin-left: 540px;
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
        top: -95%;
        left: -500%;
        width: 450px;
        display: none;
        padding: 5px;
    }

    p{
        margin: 0px;
        text-align: left;
    }
`;  

const Exit = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.black};
    font-weight: bolder;
    position: absolute;
    margin-left: -880px;
    margin-top: 480px;

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
        top: -50%;
        left: 60%;
        width: 250px;
        display: none;
        padding: 5px;
    }

    p{
        margin: 0px;
        text-align: left;
    }
`;  

const Ready = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.black};
    font-weight: bolder;
    position: absolute;
    margin-left: 550px;
    margin-top: 480px;

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
        top: -180%;
        left: -680%;
        width: 280px;
        display: none;
        padding: 5px;
    }

    p{
        margin: 0px;
        text-align: left;
    }
`;

const ColorBar = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.black};
    font-weight: bolder;
    position: absolute;
    margin-left: -620px;
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
        top: -180%;
        left: 60%;
        width: 380px;
        display: none;
        padding: 5px;
    }

    p{
        margin: 0px;
        text-align: left;
    }
`;  

const Modify = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.black};
    font-weight: bolder;
    position: absolute;
    margin-left: 240px;
    margin-top: -550px;

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
        left: 60%;
        width: 350px;
        display: none;
        padding: 5px;
    }
`;
const UserCard = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.black};
    font-weight: bolder;
    position: absolute;
    margin-left: 10px;
    margin-top: -250px;

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
        top: -60%;
        left: 60%;
        width: 430px;
        display: none;
        padding: 5px;
    }

    p{
        margin: 0px;
        text-align: left;
    }
`;  

