import React, { useState } from 'react';
import style from '../styles/styles';
import styled from 'styled-components';
import '../assets/font.css';

import roundVote from '../assets/roundVote.png';
import squareVote from '../assets/squareVote.png';

export default function UserVote({ nick, color }) {
    const [clicked, isClicked] = useState(0);

    function Click() {
        if (clicked == 1) {
            isClicked(0);
        } else {
            isClicked(1);
        }
        alert(nick + clicked);
    }

    return (
        <div>
            {(function () {
                if (color == 'RED') {
                    return (
                        <RedContainer onClick={Click}>
                            <Name>{nick}</Name>
                            <RedInnerContainer>{clicked == 1 ? <RoundVote src={roundVote} /> : <></>}</RedInnerContainer>
                        </RedContainer>
                    );
                } else if (color == 'ORANGE') {
                    return (
                        <OrangeContainer onClick={Click}>
                            <Name>{nick}</Name>
                            <OrangeInnerContainer>{clicked == 1 ? <RoundVote src={roundVote} /> : <></>}</OrangeInnerContainer>
                        </OrangeContainer>
                    );
                } else if (color == 'YELLOW') {
                    return (
                        <YellowContainer onClick={Click}>
                            <Name>{nick}</Name>
                            <YellowInnerContainer>{clicked == 1 ? <RoundVote src={roundVote} /> : <></>}</YellowInnerContainer>
                        </YellowContainer>
                    );
                } else if (color == 'GREEN') {
                    return (
                        <GreenContainer onClick={Click}>
                            <Name>{nick}</Name>
                            <GreenInnerContainer>{clicked == 1 ? <RoundVote src={roundVote} /> : <></>}</GreenInnerContainer>
                        </GreenContainer>
                    );
                } else if (color == 'BLUE') {
                    return (
                        <BlueContainer onClick={Click}>
                            <Name>{nick}</Name>
                            <BlueInnerContainer>{clicked == 1 ? <RoundVote src={roundVote} /> : <></>}</BlueInnerContainer>
                        </BlueContainer>
                    );
                } else if (color == 'PURPLE') {
                    return (
                        <PurpleContainer onClick={Click}>
                            <Name>{nick}</Name>
                            <PurpleInnerContainer>{clicked == 1 ? <RoundVote src={roundVote} /> : <></>}</PurpleInnerContainer>
                        </PurpleContainer>
                    );
                } else if (color == 'PINK') {
                    return (
                        <PinkContainer onClick={Click}>
                            <Name>{nick}</Name>
                            <PinkInnerContainer>{clicked == 1 ? <RoundVote src={roundVote} /> : <></>}</PinkInnerContainer>
                        </PinkContainer>
                    );
                }
            })()}
        </div>
    );
}

const RedContainer = styled.div`
    width: 160px;
    height: 165px;
    background-color: ${style.red_bg};
    margin: 10px auto;
    border-radius: 23px;
    border: 4px solid ${style.red_bg};
    box-shadow: 5px 5px 22px #808080;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    align-self: center;
    margin-left: 10px;
    margin-right: 10px;

    z-index: 31;
`;

const OrangeContainer = styled.div`
    width: 160px;
    height: 165px;
    background-color: ${style.orange_bg};
    margin: 10px auto;
    border-radius: 23px;
    border: 4px solid ${style.orange_bg};
    box-shadow: 5px 5px 22px #808080;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    align-self: center;
    margin-left: 10px;
    margin-right: 10px;
`;

const YellowContainer = styled.div`
    width: 160px;
    height: 165px;
    background-color: ${style.yellow_bg};
    margin: 10px auto;
    border-radius: 23px;
    border: 4px solid ${style.yellow_bg};
    box-shadow: 5px 5px 22px #808080;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    align-self: center;
    margin-left: 10px;
    margin-right: 10px;
`;

const GreenContainer = styled.div`
    width: 160px;
    height: 165px;
    background-color: ${style.green_bg};
    margin: 10px auto;
    border-radius: 23px;
    border: 4px solid ${style.green_bg};
    box-shadow: 5px 5px 22px #808080;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    align-self: center;
    margin-left: 10px;
    margin-right: 10px;
`;

const BlueContainer = styled.div`
    width: 160px;
    height: 165px;
    background-color: ${style.blue_bg};
    margin: 10px auto;
    border-radius: 23px;
    border: 4px solid ${style.blue_bg};
    box-shadow: 5px 5px 22px #808080;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    align-self: center;
    margin-left: 10px;
    margin-right: 10px;
`;

const PurpleContainer = styled.div`
    width: 160px;
    height: 165px;
    background-color: ${style.purple_bg};
    margin: 10px auto;
    border-radius: 23px;
    border: 4px solid ${style.purple_bg};
    box-shadow: 5px 5px 22px #808080;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    align-self: center;
    margin-left: 10px;
    margin-right: 10px;
`;

const PinkContainer = styled.div`
    width: 160px;
    height: 165px;
    background-color: ${style.pink_bg};
    margin: 10px auto;
    border-radius: 23px;
    border: 4px solid ${style.pink_bg};
    box-shadow: 5px 5px 22px #808080;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    align-self: center;
    margin-left: 10px;
    margin-right: 10px;
`;

const RedInnerContainer = styled.div`
    width: 160px;
    height: 130px;
    background-color: ${style.red_fill};
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 5px;
`;

const OrangeInnerContainer = styled.div`
    width: 160px;
    height: 130px;
    background-color: ${style.orange_fill};
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 5px;
`;

const YellowInnerContainer = styled.div`
    width: 160px;
    height: 130px;
    background-color: ${style.yellow_fill};
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 5px;
`;

const GreenInnerContainer = styled.div`
    width: 160px;
    height: 130px;
    background-color: ${style.green_fill};
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 5px;
`;

const BlueInnerContainer = styled.div`
    width: 160px;
    height: 130px;
    background-color: ${style.blue_fill};
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 5px;
`;

const PurpleInnerContainer = styled.div`
    width: 160px;
    height: 130px;
    background-color: ${style.purple_fill};
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 5px;
`;

const PinkInnerContainer = styled.div`
    width: 160px;
    height: 130px;
    background-color: ${style.pink_fill};
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 5px;
`;

const Name = styled.h4`
    color: white;
    text-align: center;
    margin-top: 7px;
    margin-bottom: 10px;
    // padding-top: 5px;
    align-items: center;
    justify-content: center;
    align-self: center;
    // background-color: blue;
    // font-family: 'Hahmlet', serif;
    // @import url('https://fonts.googleapis.com/css2?family=East+Sea+Dokdo&display=swap');
`;

const SquareVote = styled.img`
    // position: absolute;
    margin-top: -10px;
    z-index: 0; // 안되면 30으로 바꿔보기..
    width: 200px;
`;

const RoundVote = styled.img`
    // position: absolute;
    margin-top: -10px;
    z-index: 0; // 안되면 30으로 바꿔보기..
    width: 240px;
`;
