import React, { useState } from 'react';
import styled from 'styled-components';
import style from '../styles/styles';
import NightSVG from '../assets/night.svg';
import molly from '../assets/molly.png';
import holly from '../assets/holly.png';
import { Link } from 'react-router-dom';
import tutorial_btn from '../assets/tutorial_btn.svg';
// import start_btn from '../assets/start_btn.svg';
import Human from '../assets/human.svg';
import PurpleCharacter from '../assets/purple.svg';

export default function TutorialWorldview({}) {
    return (
        <Container>
            {/* 인간 div */}
            <HumanDiv>
                <Div>
                    <MollyCharacter src={molly}></MollyCharacter>
                    <MollyTitle>
                        당신의 역할이 <text style={{ ...style, color: style.red }}>인간</text>이라면?
                    </MollyTitle>
                    <MollyText>
                        공포영화를 보다가 잠에 빠진 Molly! 눈 떠보니 유령세계라고? <text style={{ ...style, color: style.red }}>3일</text>을
                        들키지 않고 지내야 인간세계로 가는 길이 열린다. 이 유령들 수다떠는 걸 엄청 좋아하는데 그 사이에서 인간임을 들키지
                        않아야 산다. 한 번 유령인척을 열심히 해보자구!
                    </MollyText>
                    <br />
                </Div>

                <Link to="/">
                    <CardContainer>
                        <CharacterContainer className="ghost">
                            <HumanCharacter />
                        </CharacterContainer>
                    </CardContainer>
                </Link>
            </HumanDiv>

            {/* 유령 설명 페이지로 div */}
            <GhostDiv>
                <Link to="/">
                    <CardContainer>
                        <CharacterContainer className="ghost">
                            <GhostCharacter />
                        </CharacterContainer>
                    </CardContainer>
                </Link>
                <Div>
                    <HollyCharacter src={holly}></HollyCharacter>
                    <HollyTitle>
                        당신의 역할이 <text style={{ ...style, color: style.red }}>유령</text>이라면?
                    </HollyTitle>
                    <HollyText>
                        유령 친구들과 수다를 떨고 있는 Holly! 그런데.. 동작 그만! 자꾸 생뚱맞은 이야기를 하는 너, 대체 누구야? 아무리 봐도
                        지금 우리 사이에 인간이 들어 온 것 같다! 겁없이 유령 사이에 끼어든 인간을 찾아 혼쭐을 내주자.{' '}
                        <text style={{ ...style, color: style.red }}>3일</text>동안 유령 친구들과 함께 최선을 다해서 인간을 찾아보자구!
                    </HollyText>
                    <br />
                </Div>
            </GhostDiv>
            {/* <GameStart src={start_btn} /> */}
        </Container>
    );
}

const HumanDiv = styled.div`
    flex-direction: row;
    display: flex;
    // background-color: black;
    // justify-content: space-between;
    align-self: end;
    margin-right: 30px;
    margin-top: 30px;
`;

const GhostDiv = styled.div`
    flex-direction: row;
    display: flex;
    // background-color: black;
    // justify-content: space-between;
    // align-items: center;
    align-self: start;
    margin-left: 50px;
`;

const Container = styled.div`
    background-image: url(${NightSVG});
    width: 1020px;
    height: 620px;
    flex-direction: column;
    display: flex;
    background-color: black;
    // justify-content: space-between;
    // align-items: center;
    padding-top: 10px;
`;

const Div = styled.div`
    flex-direction: column;
    // background-color: pink;
    width: 450px;
    height: auto;
    display: flex;
    margin-right: 10px;
    margin-top: 15px;
`;

const MollyCharacter = styled.img`
    // background-color: ${style.skyblue};
    align-self: end;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: auto;
    width: 200px;
    margin-bottom: 20px;
    margin-right: 10px;
    &:hover {
        cursor: grab;
    }
`;

const HollyCharacter = styled.img`
    // background-color: ${style.skyblue};
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: auto;
    width: 200px;
    margin-bottom: 20px;
    margin-right: 10px;
    &:hover {
        cursor: grab;
    }
`;

const MollyTitle = styled.text`
    color: white;
    font-size: 23px;
    font-weight: light;
    // -webkit-text-stroke: 1px #c00202;
    margin-top: 5px;
    text-align: right;
    padding-right: 30px;
`;
const HollyTitle = styled.text`
    color: white;
    font-size: 23px;
    font-weight: light;
    // -webkit-text-stroke: 1px #c00202;
    margin-top: 5px;
    text-align: left;
`;

const MollyText = styled.text`
    color: white;
    font-size: 18px;
    font-weight: light;
    // -webkit-text-stroke: 1px #c00202;
    margin-top: 5px;
    text-align: right;
    padding-right: 30px;
`;
const HollyText = styled.text`
    color: white;
    font-size: 18px;
    font-weight: light;
    // -webkit-text-stroke: 1px #c00202;
    margin-top: 5px;
    text-align: left;
`;

const CardContainer = styled.div`
    margin-right: 30px;
    width: 180px;
    height: 260px;
    border: 2px solid #ffffff;
    background-color: transparent;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 0px 10px 10px rgba(0, 0, 0, 0.4); /* offset-x | offset-y | blur-radius | spread-radius | color */

    .ghost {
        animation: motion 1.5s linear 0s infinite;
        margin-bottom: 0;
    }

    @keyframes motion {
        0% {
            margin-bottom: 4px;
        }
        10% {
            margin-bottom: 7px;
        }
        20% {
            margin-bottom: 10px;
        }
        30% {
            margin-bottom: 12px;
        }
        40% {
            margin-bottom: 14px;
        }
        50% {
            margin-bottom: 16px;
        }
        60% {
            margin-bottom: 14px;
        }
        70% {
            margin-bottom: 12px;
        }
        80% {
            margin-bottom: 10px;
        }
        90% {
            margin-bottom: 7px;
        }
        100% {
            margin-bottom: 4px;
        }
    }

    &:hover {
        cursor: grab;
    }
`;

const CardText = styled.text`
    margin-top: 10px;
    font-size: 20px;
    font-family: Hahmlet;
    -webkit-text-stroke: 1px #53305e;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 4px 4px 0px #53305e, 4px 4px 0px #53305e;
`;

const CharacterContainer = styled.div`
    width: 120px;
    height: 260px;
    background-color: transparent;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const HumanCharacter = styled.div`
    background-image: url(${Human});
    background-size: cover;
    width: 150px;
    height: 230px;
`;

const GhostCharacter = styled.div`
    background-image: url(${PurpleCharacter});
    background-size: cover;
    width: 160px;
    height: 230px;
`;

// // 튜토리얼
// const GameStart = styled.img`
//     // background-color: ${style.yellow};
//     justify-content: center;
//     align-items: center;
//     height: 90px;
//     width: 180px;
//     margin-right: 30px;
//     margin-top: 20px;

//     &:hover {
//         cursor: grab;
//     }
// `;
