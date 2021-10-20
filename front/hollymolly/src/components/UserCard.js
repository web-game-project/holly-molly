import style from '../styles/styles';
import styled from 'styled-components';
import { ReactComponent as RedCharacter } from '../assets/red.svg';
import { ReactComponent as OrangeCharacter } from '../assets/orange.svg';
import { ReactComponent as YellowCharacter } from '../assets/yellow.svg';
import { ReactComponent as GreenCharacter } from '../assets/green.svg';
import { ReactComponent as BlueCharacter } from '../assets/blue.svg';
import { ReactComponent as PurpleCharacter } from '../assets/purple.svg';
import { ReactComponent as PinkCharacter } from '../assets/pink.svg';
import readyImg from '../assets/ready.png';
import leaderImg from '../assets/leader.png';

export default function UserCard({ id, nickname, color, ready }) {
    // 유저에게서 넘어올 예상 데이터
    const data = {
        id: 1,
        nick: '성북구 민혁이',
        color: 'yellow',
        ready: false,
    };

    const leader_idx = 3; // response에서 넘겨줄 임의의 방장 인덱스 값

    return (
        <div>
            {(function () {
                if (color == 'red') {
                    return (
                        <RedContainer>
                            {id == leader_idx && <LeaderImg src={leaderImg} />}
                            <Name>{nickname}</Name>
                            <RedInnerContainer>
                                {ready && <ReadyImg src={readyImg} />}
                                <RedCharacter className="ghost" width="80" height="127" />
                            </RedInnerContainer>
                        </RedContainer>
                    );
                } else if (color == 'orange') {
                    return (
                        <OrangeContainer>
                            {id == leader_idx && <LeaderImg src={leaderImg} />}
                            <Name>{nickname}</Name>
                            <OrangeInnerContainer>
                                {ready && <ReadyImg src={readyImg} />}
                                <OrangeCharacter className="ghost" width="80" height="117" />
                            </OrangeInnerContainer>
                        </OrangeContainer>
                    );
                } else if (color == 'yellow') {
                    return (
                        <YellowContainer>
                            {id == leader_idx && <LeaderImg src={leaderImg} />}
                            <Name>{nickname}</Name>
                            <YellowInnerContainer>
                                {ready && <ReadyImg src={readyImg} />}
                                <YellowCharacter className="ghost" width="80" height="117" />
                            </YellowInnerContainer>
                        </YellowContainer>
                    );
                } else if (color == 'green') {
                    return (
                        <GreenContainer>
                            {id == leader_idx && <LeaderImg src={leaderImg} />}
                            <Name>{nickname}</Name>
                            <GreenInnerContainer>
                                {ready && <ReadyImg src={readyImg} />}
                                <GreenCharacter className="ghost" width="80" height="117" />
                            </GreenInnerContainer>
                        </GreenContainer>
                    );
                } else if (color == 'blue') {
                    return (
                        <BlueContainer>
                            {id == leader_idx && <LeaderImg src={leaderImg} />}
                            <Name>{nickname}</Name>
                            <BlueInnerContainer>
                                {ready && <ReadyImg src={readyImg} />}
                                <BlueCharacter className="ghost" width="80" height="117" />
                            </BlueInnerContainer>
                        </BlueContainer>
                    );
                } else if (color == 'purple') {
                    return (
                        <PurpleContainer>
                            {id == leader_idx && <LeaderImg src={leaderImg} />}
                            <Name>{nickname}</Name>
                            <PurpleInnerContainer>
                                {ready && <ReadyImg src={readyImg} />}
                                <PurpleCharacter className="ghost" width="80" height="117" />
                            </PurpleInnerContainer>
                        </PurpleContainer>
                    );
                } else if (color == 'pink') {
                    return (
                        <PinkContainer>
                            {id == leader_idx && <LeaderImg src={leaderImg} />}
                            <Name>{nickname}</Name>
                            <PinkInnerContainer>
                                {ready && <ReadyImg src={readyImg} />}
                                <PinkCharacter className="ghost" width="80" height="117" />
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
`;

const RedInnerContainer = styled.div`
    width: 160px;
    height: 130px;
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
`;

const OrangeInnerContainer = styled.div`
    width: 160px;
    height: 130px;
    background-color: ${style.orange_fill};
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
`;

const YellowInnerContainer = styled.div`
    width: 160px;
    height: 130px;
    background-color: ${style.yellow_fill};
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
`;

const GreenInnerContainer = styled.div`
    width: 160px;
    height: 130px;
    background-color: ${style.green_fill};
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
`;

const BlueInnerContainer = styled.div`
    width: 160px;
    height: 130px;
    background-color: ${style.blue_fill};
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
`;

const PurpleInnerContainer = styled.div`
    width: 160px;
    height: 130px;
    background-color: ${style.purple_fill};
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
`;

const PinkInnerContainer = styled.div`
    width: 160px;
    height: 130px;
    background-color: ${style.pink_fill};
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
`;

const ReadyImg = styled.img`
    position: absolute;
    z-index: 30;
    width: 112px;
`;

const LeaderImg = styled.img`
    width: 30px;
    position: absolute;
    margin-top: 3px;
    margin-left: 3px;
`;
