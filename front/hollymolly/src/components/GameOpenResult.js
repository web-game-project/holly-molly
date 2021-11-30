import React from 'react';
import styled from 'styled-components';
import style from '../styles/styles';
import GameResultCard from '../components/GameResultCard';
import UserOpenCard from './UserOpenCard';

const GameFinalResult = ({ data }) => {
    console.log('이름, 칼라 : ' + data.human_user_name + data.human_user_color)
    return (
        <React.Fragment>
            <Container>
                <Title>인간 &nbsp; 공개</Title>
                <HumanContainer>
                    {/* <GameResultCard role={'유령'} engRole={'GHOST'} final win></GameResultCard> */}
                    <UserOpenCard nick = {data.human_user_name} color = {data.human_user_color}/>
               </HumanContainer>

                    <HumanWhoTxt>
                        인간 몰리는 <ResultSubtitle>{data.human_user_name} </ResultSubtitle>이였습니다.
                    </HumanWhoTxt>
                
            </Container>
        </React.Fragment>
    );
};

const Container = styled.div`
    background-color: transparent;
    width: 650px;
    height: 620px;
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
    margin-top: 25px;
    overflow: hidden;
`;

const HumanContainer = styled.div`
    background-color: transparent;
    width: 500px;
    height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 80px;
    margin-bottom: 15px;
`;

const Title = styled.text`
    font-size: 60px;
    font-family: Black Han Sans;
    -webkit-text-stroke: 1px #53305e;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 4px 4px 0px #53305e, 5px 5px 0px #53305e, 6px 6px 0px #53305e, 7px 7px 0px #2a132e, 8px 8px 0px #2a132e,
        9px 9px 0px #2a132e, 10px 10px 0px #2a132e; //#2A132E
    margin-bottom: 20px;
    margin-top: 30px;
`;

const ResultSubtitle = styled.text`
    font-size: 40px;
    font-family: Hahmlet;
    -webkit-text-stroke: 1px ${style.yellow};
    font-weight: bold;
    color: ${style.yellow};
    text-shadow: 4px 4px 0px #53305e, 7px 7px 0px #2a132e; //#2A132E
`;

const HumanWhoTxt = styled.text`
    font-size: 25px;
    font-family: Gowun Dodum;
    color: #ffffff;
    margin-top: 60px;
`;

export default GameFinalResult;