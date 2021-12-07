import React, { useState } from 'react';
import styled from 'styled-components';
import style from '../../styles/styles';
import { useSelector } from 'react-redux';
import { useHistory, useLocation} from 'react-router';

import RoomList from '../../assets/roomList.png';

export default function TutorialRoomListComponent({}) {
    const isLogin = useSelector((state) => state.socket.is_login);

    const history = useHistory();
    let location = useLocation();

    const roomTxt = "대기방 입장: 생성되어 있는 방의 여러 정보를 \n확인할 수 있고, 클릭해서 입장할 수 있습니다."
    const filterTxt = "검색 필터 선택\n[Mode]\nEasy - 마피아에게 키워드에 대한 힌트를 키워드의 상의어로 제공합니다.\nHard - 마피아에게 키워드에 대한 힌트를 제공하지 않습니다.\n[People]\n대기방의 인원수를 선택합니다.\n[Waiting]\n게임을 시작하지 않은 방만 출력할 수 있습니다.\n[Check]\n모든 필터를 체크할 수도 있고, 모든 필터를 체크하지 않을 수도 있습니다"
   
    function onMove(){
        history.push({
            pathname: '/waitingroomTutorial', 
            state: { role: location.state.role },          
        });
    } 

    return (
        <Container>

            <NextBtn onClick={onMove}>Next Page ☞</NextBtn>

            <CodeDiv>
              <div className= "textDiv"> 코드로 입장: 이미 생성되어 있는 방의 코드로 입장합니다.</div>
            1
            </CodeDiv>
           
            <Room>
              <div className= "textDiv"> 
                {roomTxt.split("\n").map((i, key) => {
                        if(key === 0)
                            return <p key={key}> {i}</p>;
                        else
                            return <p key={key}>&nbsp;&nbsp;{i}</p>;
                    })}
                </div>
            2
            </Room>

            <CreateRoom>
              <div className= "textDiv">
                방 생성: 난이도, 인원 수, 공개 범위를 직접 선택하여 방을 생성합니다.
              </div>
            3
            </CreateRoom>          

            <RandomRoom>
              <div className= "textDiv"> 
                랜덤입장: 이미 생성되어 있는 대기방에 랜덤으로 입장합니다.
              </div>
            4
            </RandomRoom>

            <Filter>
              <div className= "textDiv"> 
              {filterTxt.split("\n").map((i, key) => {
                        if(key === 1 || key === 4 || key === 6 || key === 8)
                            return <p key={key}><br></br> {i}</p>;
                        else
                            return <p key={key}>{i}</p>;
                    })}

              </div>
            5
            </Filter>

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
        
    }

`;
const CodeDiv = styled.div`
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
        top: -15px;
        left: 30px;
        width: 350px;
        display: none;
        padding: 5px;
    }
`;  

const Room = styled.div`
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
    margin-top: -280px;

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
        top: -110%;
        left: 60%;
        width: 290px;
        display: none;
        padding: 5px;
    }

    p{
        margin: 0px;
        text-align: left;
    }
`;  

const Filter = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.black};
    font-weight: bolder;
    position: absolute;
    margin-left: 620px;
    margin-top: -230px;

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
        left: -1120%;
        width: 450px;
        display: none;
        padding: 5px;
    }

    p{
        margin: 0px;
        text-align: left;
    }
`;  

const CreateRoom = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.black};
    font-weight: bolder;
    position: absolute;
    margin-left: 620px;
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
        top: -60%;
        left: -480%;
        width: 450px;
        display: none;
        padding: 5px;
    }

    p{
        margin: 0px;
        text-align: left;
    }
`;  

const RandomRoom = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.black};
    font-weight: bolder;
    position: absolute;
    margin-left: 620px;
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
        top: 80%;
        left: -400%;
        width: 380px;
        display: none;
        padding: 5px;
    }

    p{
        margin: 0px;
        text-align: left;
    }
`;  

const Container = styled.div`
    background-image: url(${RoomList});
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

