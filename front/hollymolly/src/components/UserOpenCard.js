import React, { useState } from 'react';
import style from '../styles/styles';
import styled from 'styled-components';
import '../assets/font.css';

import roundVote from '../assets/roundVote.png';

import { ReactComponent as HumanCharacter } from '../assets/human.svg';

export default function UserOpenCard({ nick, color }) {
    
    return (
        <div>
            {(function () {
                if (color == 'RED') {
                    return (
                        <RedContainer>
                            <Name>{nick}</Name>
                            <RedInnerContainer>
                                <RoundVote src={roundVote} />
                                <HumanCharacter className="ghost" width="250" height="180" />
                            </RedInnerContainer>
                        </RedContainer>
                    );
                } else if (color == 'ORANGE') {
                    return (
                        <OrangeContainer>
                            <Name>{nick}</Name>
                            <OrangeInnerContainer>
                                <RoundVote src={roundVote} />
                                <HumanCharacter className="ghost" width="250" height="180" />
                            </OrangeInnerContainer>
                        </OrangeContainer>
                    );
                } else if (color == 'YELLOW') {
                    return (
                        <YellowContainer>
                            <Name>{nick}</Name>
                            <YellowInnerContainer>
                                <RoundVote src={roundVote} />
                                <HumanCharacter className="ghost" width="250" height="180" />
                            </YellowInnerContainer>
                        </YellowContainer>
                    );
                } else if (color == 'GREEN') {
                    return (
                        <GreenContainer>
                            <Name>{nick}</Name>
                            <GreenInnerContainer>
                                <RoundVote src={roundVote} />
                                <HumanCharacter className="ghost" width="250" height="180" />
                            </GreenInnerContainer>
                        </GreenContainer>
                    );
                } else if (color == 'BLUE') {
                    return (
                        <BlueContainer>
                            <Name>{nick}</Name>
                            <BlueInnerContainer>
                                <RoundVote src={roundVote} />
                                <HumanCharacter className="ghost" width="250" height="180" />
                            </BlueInnerContainer>
                        </BlueContainer>
                    );
                } else if (color == 'PURPLE') {
                    return (
                        <PurpleContainer>
                            <Name>{nick}</Name>
                            <PurpleInnerContainer>
                                <RoundVote src={roundVote} />
                                <HumanCharacter className="ghost" width="250" height="180" />
                            </PurpleInnerContainer>
                        </PurpleContainer>
                    );
                } else if (color == 'PINK') {
                    return (
                        <PinkContainer>
                            <Name>{nick}</Name>
                            <PinkInnerContainer>
                                <RoundVote src={roundVote} />
                                <HumanCharacter className="ghost" width="250" height="180" />
                            </PinkInnerContainer>
                        </PinkContainer>
                    );
                }
            })()}
        </div>
    );
}

const RedContainer = styled.div`
    width: 250px;
    height: 255px;
    background-color: ${style.red_bg};
    margin: 10px auto;
    border-radius: 23px;
    border: 4px solid ${style.red_bg};
    overflow: hidden;
    align-items: center;
    justify-content: center;
    align-self: center;
    margin-left: 10px;
    margin-right: 10px;

    z-index: 31;
`;

const OrangeContainer = styled.div`
    width: 250px;
    height: 255px;
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
    width: 250px;
    height: 255px;  
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
    width: 250px;
    height: 255px;
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
    width: 250px;
    height: 255px;
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
    width: 250px;
    height: 255px;
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
    width: 250px;
    height: 255px;
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
    width: 250px;
    height: 220px;
    background-color: ${style.red_fill};
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 5px;

    .wrap {
        text-align: center;
        margin-bottom: 10px;
    }
    .ghost {
        animation: motion 1.5s linear 0s infinite;
        margin-top: -20px;
        margin-bottom: 0;
    }
`;

const OrangeInnerContainer = styled.div`
    width: 250px;
    height: 220px;
    background-color: ${style.orange_fill};
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 5px;
`;

const YellowInnerContainer = styled.div`
    width: 250px;
    height: 220px;
    background-color: ${style.yellow_fill};
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 5px;
`;

const GreenInnerContainer = styled.div`
    width: 250px;
    height: 220px;
    background-color: ${style.green_fill};
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 5px;
`;

const BlueInnerContainer = styled.div`
    width: 250px;
    height: 220px;
    background-color: ${style.blue_fill};
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 5px;
`;

const PurpleInnerContainer = styled.div`
    width: 250px;
    height: 220px;
    background-color: ${style.purple_fill};
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 5px;
`;

const PinkInnerContainer = styled.div`
    width: 250px;
    height: 220px;
    background-color: ${style.pink_fill};
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 5px;
`;

const Name = styled.div`
    color: white;
    text-align: center;
    margin-top: 7px;
    margin-bottom: 10px;
    align-items: center;
    justify-content: center;
    align-self: center;
    font-size: 25px;
`;

const RoundVote = styled.img`
    margin-top: 20px;
    z-index: 0; 
    width: 180px;
    position: absolute;    

`;