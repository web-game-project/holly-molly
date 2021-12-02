import React, { useState, useEffect } from 'react';
import style from '../styles/styles';
import styled from 'styled-components';
import '../assets/font.css';

import roundVote from '../assets/roundVote.png';
import holly from '../assets/holly.png';

export default function UserVote({ nick, color, click, voteWho }) {
    const [clicked, isClicked] = useState();
    const [who, ClickWho] = useState(voteWho);

    useEffect(() => {
        ClickWho(voteWho);
    }, []);

    function Click() {
        if (clicked == 1) {
            isClicked(0);
        } else {
            isClicked(1);
        }
        // alert(nick + clicked);
    }

    return (
        <div style={{ marginRight: 3, marginLeft: 3 }}>
            {(function () {
                if (color == 'RED') {
                    return (
                        <RedContainer>
                            <Name>{nick}</Name>
                            {/* <RedInnerContainer>{clicked == 1 ? <RoundVote src={roundVote} /> : <></>}</RedInnerContainer> */}
                            <RedInnerContainer>
                                {/* ({voteWho == 'RED'}&&{click ? <></> : <></>}) */}
                                {voteWho == 'RED' ? <RoundVote src={roundVote} /> : <RoundVote />}
                            </RedInnerContainer>
                        </RedContainer>
                    );
                } else if (color == 'ORANGE') {
                    return (
                        <OrangeContainer onClick={Click}>
                            <Name>{nick}</Name>
                            {/* <OrangeInnerContainer>{clicked == 1 ? <RoundVote src={roundVote} /> : <></>}</OrangeInnerContainer> */}
                            <OrangeInnerContainer>
                                {/* ({voteWho == 'ORANGE'}&&{click ? <RoundVote src={roundVote} /> : <></>}) */}

                                {voteWho == 'ORANGE' ? <RoundVote src={roundVote} /> : <RoundVote />}
                            </OrangeInnerContainer>
                        </OrangeContainer>
                    );
                } else if (color == 'YELLOW') {
                    return (
                        <YellowContainer onClick={Click}>
                            <Name>{nick}</Name>
                            {/* <YellowInnerContainer>{clicked == 1 ? <RoundVote src={roundVote} /> : <></>}</YellowInnerContainer> */}
                            <YellowInnerContainer>
                                {/* ({voteWho == 'YELLOW'}&&{click ? <RoundVote src={roundVote} /> : <></>}) */}

                                {voteWho == 'YELLOW' ? <RoundVote src={roundVote} /> : <RoundVote />}
                            </YellowInnerContainer>
                        </YellowContainer>
                    );
                } else if (color == 'GREEN') {
                    return (
                        <GreenContainer onClick={Click}>
                            <Name>{nick}</Name>
                            {/* <GreenInnerContainer>{clicked == 1 ? <RoundVote src={roundVote} /> : <></>}</GreenInnerContainer> */}
                            <GreenInnerContainer>
                                {/* ({voteWho == 'GREEN'}&&{click ? <RoundVote src={roundVote} /> : <></>}) */}

                                {voteWho == 'GREEN' ? <RoundVote src={roundVote} /> : <RoundVote />}
                            </GreenInnerContainer>
                        </GreenContainer>
                    );
                } else if (color == 'BLUE') {
                    return (
                        <BlueContainer onClick={Click}>
                            <Name>{nick}</Name>
                            {/* <BlueInnerContainer>{clicked == 1 ? <RoundVote src={roundVote} /> : <></>}</BlueInnerContainer> */}
                            <BlueInnerContainer>
                                {/* ({voteWho == 'BLUE'}&&{click ? <RoundVote src={roundVote} /> : <></>}) */}

                                {voteWho == 'BLUE' ? <RoundVote src={roundVote} /> : <RoundVote />}
                            </BlueInnerContainer>
                        </BlueContainer>
                    );
                } else if (color == 'PURPLE') {
                    return (
                        <PurpleContainer onClick={Click}>
                            <Name>{nick}</Name>
                            {/* <PurpleInnerContainer>{clicked == 1 ? <RoundVote src={roundVote} /> : <></>}</PurpleInnerContainer> */}
                            <PurpleInnerContainer>
                                {/* ({voteWho == 'PURPLE'}&&{click ? <RoundVote src={roundVote} /> : <></>}) */}

                                {voteWho == 'PURPLE' ? <RoundVote src={roundVote} /> : <RoundVote />}
                            </PurpleInnerContainer>
                        </PurpleContainer>
                    );
                } else if (color == 'PINK') {
                    return (
                        <PinkContainer onClick={Click}>
                            <Name>{nick}</Name>
                            {/* <PinkInnerContainer>{clicked == 1 ? <RoundVote src={roundVote} /> : <></>}</PinkInnerContainer> */}
                            <PinkInnerContainer>
                                {/* ({voteWho == 'PINK'}&&{click ? <RoundVote src={roundVote} /> : <></>}) */}

                                {voteWho == 'PINK' ? <RoundVote src={roundVote} /> : <RoundVote />}
                            </PinkInnerContainer>
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

const Name = styled.div`
    color: white;
    text-align: center;
    margin-top: 7px;
    margin-bottom: 10px;
    // padding-top: 5px;
    align-items: center;
    justify-content: center;
    align-self: center;
    font-size: 18px;
    // background-color: blue;
    // font-family: 'Hahmlet', serif;
    // @import url('https://fonts.googleapis.com/css2?family=East+Sea+Dokdo&display=swap');
`;

const RoundVote = styled.img`
    // position: absolute;
    margin-top: -10px;
    z-index: 0; // 안되면 30으로 바꿔보기..
    width: 240px;
`;
