import style from '../styles/styles';
import styled from 'styled-components';
import '../assets/font.css';

export default function UserTotalVoteCard({ nickname, color, vote_cnt }) {
    return (
        <div>
            {(function () {            
                if (color == 'RED') {
                    return (
                        <RedContainer>
                            <Name>{nickname}</Name>
                            <RedInnerContainer>
                                <text style={{ marginTop: '-10px', color: style.black, fontSize: '14px'}}>{vote_cnt}표</text>
                            </RedInnerContainer>
                        </RedContainer>
                    );
                } else if (color == 'ORANGE') {
                    return (
                        <OrangeContainer>
                            <Name>{nickname}</Name>
                            <OrangeInnerContainer>
                            <text style={{ marginTop: '-10px', color: style.black, fontSize: '14px'}}>{vote_cnt}표</text>
                            </OrangeInnerContainer>
                        </OrangeContainer>
                    );
                } else if (color == 'YELLOW') {
                    return (
                        <YellowContainer>
                            <Name>{nickname}</Name>
                            <YellowInnerContainer>
                            <text style={{ marginTop: '-10px', color: style.black, fontSize: '14px'}}>{vote_cnt}표</text>
                            </YellowInnerContainer>
                        </YellowContainer>
                    );
                } else if (color == 'GREEN') {
                    return (
                        <GreenContainer>
                            <Name>{nickname}</Name>
                            <GreenInnerContainer>
                            <text style={{ marginTop: '-10px', color: style.black, fontSize: '14px'}}>{vote_cnt}표</text>
                            </GreenInnerContainer>
                        </GreenContainer>
                    );
                } else if (color == 'BLUE') {
                    return (
                        <BlueContainer>
                            <Name>{nickname}</Name>
                            <BlueInnerContainer>
                            <text style={{ marginTop: '-10px', color: style.black, fontSize: '14px'}}>{vote_cnt}표</text>
                            </BlueInnerContainer>
                        </BlueContainer>
                    );
                } else if (color == 'PURPLE') {
                    return (
                        <PurpleContainer>
                            <Name>{nickname}</Name>
                            <PurpleInnerContainer>
                            <text style={{ marginTop: '-10px', color: style.black, fontSize: '14px'}}>{vote_cnt}표</text>
                            </PurpleInnerContainer>
                        </PurpleContainer>
                    );
                } else if (color == 'PINK') {
                    return (
                        <PinkContainer>
                            <Name>{nickname}</Name>
                            <PinkInnerContainer>
                            <text style={{ marginTop: '-10px', color: style.black, fontSize: '14px'}}>{vote_cnt}표</text>
                            </PinkInnerContainer>
                        </PinkContainer>
                    );
                }
            })()}
            {/* <div style={{  marginTop: '-20px'}}>
                <text style={{  fontSize: '14px'}}>{vote_cnt}표</text>
            </div> */}
        </div>
    );
}

const RedContainer = styled.div`
    width: 70px;
    height: 75px;
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
    width: 70px;
    height: 75px;
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
    width: 70px;
    height: 75px;
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
    width: 70px;
    height: 75px;
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
    width: 70px;
    height: 75px;
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
    width: 70px;
    height: 75px;
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
    width: 70px;
    height: 75px;
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
    width: 70px;
    height: 40px;
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
`;

const OrangeInnerContainer = styled.div`
    width: 70px;
    height: 40px;
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
`;

const YellowInnerContainer = styled.div`
    width: 70px;
    height: 40px;   
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
`;

const GreenInnerContainer = styled.div`
    width: 70px;
    height: 40px;
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
`;

const BlueInnerContainer = styled.div`
    width: 70px;
    height: 40px;
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
`;

const PurpleInnerContainer = styled.div`
    width: 70px;
    height: 40px;
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
`;

const PinkInnerContainer = styled.div`
    width: 70px;
    height: 40px;
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
`;

const Name = styled.h4`
    color: white;
    text-align: center;
    margin-top: 7px;
    margin-bottom: 10px;
    align-items: center;
    justify-content: center;
    align-self: center;
    font-size: 14px;
`;

