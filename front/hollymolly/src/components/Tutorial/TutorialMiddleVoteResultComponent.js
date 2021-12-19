import React, { useState } from 'react';
import styled from 'styled-components';
import style from '../../styles/styles';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import MiddleResult from '../../assets/middleResult.png';

export default function TutorialMollyMiddleVoteResultComponent(props) {
    const isLogin = useSelector((state) => state.socket.is_login);

    const history = useHistory();
        
    function onMove(){
        history.push({
            pathname: '/finalresultTutorial', 
            state: { role: props.role },
        });
    } 

    const title = "게임은 총 3 세트로 이루어져 있습니다.\n두번째 세트가 끝나면 현재 누가 이기고 있는지 보여줍니다. \n3세트 모두 점수가 다르기 때문에, 지고 있다고 걱정하지 마세요! \n역전의 기회를 노려봅시다.";
    const content = "어느 팀이 이기고 있는지 보여줍니다.\n점수 기준은 다음과 같습니다.\n[1 라운드]\n인간이 키워드 맞힘 +1점\n유령이 인간을 상위권 후보에 오르게 함 +1점 \n[2 라운드]\n인간이 키워드 맞힘 +2점 \n유령이 인간을 상위권 후보에 오르게 함 +2점 \n[3 라운드]\n인간이 키워드 맞힘 +3점 \n유령이 인간을 상위권 후보에 오르게 함 + 3점";
    
    return (
        <Container>

            <NextBtn onClick={onMove}>Next Page ☞</NextBtn>

            <Title>
              <div className= "textDiv">
              {title.split("\n").map((i, key) => {
                        if(key === 1)
                            return <p key={key}>{i}<br></br> </p>;
                        else
                            return <p key={key}>{i}</p>;
                    })}
                </div>
            1
            </Title>

            <Content>
            <div className= "textDiv">
              {content.split("\n").map((i, key) => {
                        if(key === 2 || key === 5 || key === 8)
                            return <p key={key}><br></br>{i}</p>;
                        else
                            return <p key={key}>{i}</p>;
                    })}
                </div>
            2
            </Content>

            <Description>원하는 설명 번호 위에 마우스 올려보세요!</Description>
        </Container>
    );
}

const Description = styled.div`
    width: 500x;
    height: 50px;
    position: absolute;
    margin-left: -65px;
    margin-top: -550px; 
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

const Title = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.white};
    font-weight: bolder;
    position: absolute;
    margin-left: -370px;
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
        top: -85px;
        left: 25px;
        width: 390px;
        display: none;
        padding: 5px;
    }

    p{
        margin: 0px;
        text-align: left;
    }
`;  

const Content = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    text-align: center;
    padding: 10px;
    color: ${style.red};
    background-color: ${style.white};
    font-weight: bolder;
    position: absolute;
    margin-left: -410px;
    margin-top: 430px;

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
        top: -300px;
        left: -295px;
        width: 300px;
        display: none;
        padding: 5px;
    }

    p{
        margin: 0px;
        text-align: left;
    }
`;  

const Container = styled.div`
    background-image: url(${MiddleResult});
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

