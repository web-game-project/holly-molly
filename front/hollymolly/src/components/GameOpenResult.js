import React from 'react';
import styled from 'styled-components';
import style from '../styles/styles';
import night from '../assets/night.svg';
import PurpleCharacter from '../assets/purple.svg';
import Human from '../assets/human.svg';
import GameResultCard from '../components/GameResultCard';

const GameFinalResult = ({ data }) => {
    return (
        <React.Fragment>
            <Container>
                <Title>인간 &nbsp; 공개</Title>
                <HumanContainer>
                    <GameResultCard role={'유령'} engRole={'GHOST'} final win></GameResultCard>
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
    margin-top: 50px;
    margin-bottom: 15px;
`;

const Title = styled.text`
    font-size: 55px;
    font-family: Black Han Sans;
    -webkit-text-stroke: 1px #53305e;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 4px 4px 0px #53305e, 5px 5px 0px #53305e, 6px 6px 0px #53305e, 7px 7px 0px #2a132e, 8px 8px 0px #2a132e,
        9px 9px 0px #2a132e, 10px 10px 0px #2a132e; //#2A132E
    margin-bottom: 20px;
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
`;

export default GameFinalResult;