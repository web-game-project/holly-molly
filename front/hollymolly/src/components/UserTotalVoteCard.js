import style from '../styles/styles';
import styled from 'styled-components';
import '../assets/font.css';

export default function UserTotalVoteCard({ nickname, color, vote_cnt, width, height, innerHeight, size }) {
    return (
        <div>
            {(function () {            
                if (color == 'RED') {
                    return (
                        <RedContainer width = {width} height = {height}>
                            <Name>{nickname}</Name>
                            <RedInnerContainer width = {width} height = {innerHeight}>
                                <text style={{ marginTop: '-10px', color: style.black, fontSize: size}}>{vote_cnt}표</text>
                            </RedInnerContainer>
                        </RedContainer>
                    );
                } else if (color == 'ORANGE') {
                    return (
                        <OrangeContainer width = {width} height = {height}>
                            <Name>{nickname}</Name>
                            <OrangeInnerContainer width = {width} height = {innerHeight}>
                            <text style={{ marginTop: '-10px', color: style.black, fontSize: size}}>{vote_cnt}표</text>
                            </OrangeInnerContainer>
                        </OrangeContainer>
                    );
                } else if (color == 'YELLOW') {
                    return (
                        <YellowContainer width = {width} height = {height}>
                            <Name>{nickname}</Name>
                            <YellowInnerContainer width = {width} height = {innerHeight}>
                            <text style={{ marginTop: '-10px', color: style.black, fontSize: size}}>{vote_cnt}표</text>
                            </YellowInnerContainer>
                        </YellowContainer>
                    );
                } else if (color == 'GREEN') {
                    return (
                        <GreenContainer width = {width} height = {height}>
                            <Name>{nickname}</Name>
                            <GreenInnerContainer width = {width} height = {innerHeight}>
                            <text style={{ marginTop: '-10px', color: style.black, fontSize: size}}>{vote_cnt}표</text>
                            </GreenInnerContainer>
                        </GreenContainer>
                    );
                } else if (color == 'BLUE') {
                    return (
                        <BlueContainer width = {width} height = {height}>
                            <Name>{nickname}</Name>
                            <BlueInnerContainer width = {width} height = {innerHeight}>
                            <text style={{ marginTop: '-10px', color: style.black, fontSize: size}}>{vote_cnt}표</text>
                            </BlueInnerContainer>
                        </BlueContainer>
                    );
                } else if (color == 'PURPLE') {
                    return (
                        <PurpleContainer width = {width} height = {height}>
                            <Name>{nickname}</Name>
                            <PurpleInnerContainer width = {width} height = {innerHeight}>
                            <text style={{ marginTop: '-10px', color: style.black, fontSize: size}}>{vote_cnt}표</text>
                            </PurpleInnerContainer>
                        </PurpleContainer>
                    );
                } else if (color == 'PINK') {
                    return (
                        <PinkContainer width = {width} height = {height}>
                            <Name>{nickname}</Name>
                            <PinkInnerContainer width = {width} height = {innerHeight}>
                            <text style={{ marginTop: '-10px', color: style.black, fontSize: size}}>{vote_cnt}표</text>
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
    width: ${(props) => props.width};
    height: ${(props) => props.height};
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
    width: ${(props) => props.width};
    height: ${(props) => props.height};
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
    width: ${(props) => props.width};
    height: ${(props) => props.height};
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
    width: ${(props) => props.width};
    height: ${(props) => props.height};
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
    width: ${(props) => props.width};
    height: ${(props) => props.height};
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
    width: ${(props) => props.width};
    height: ${(props) => props.height};
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
    width: ${(props) => props.width};
    height: ${(props) => props.height};
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
    width: ${(props) => props.width};
    height: ${(props) => props.height};
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
    width: ${(props) => props.width};
    height: ${(props) => props.height};
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
    width: ${(props) => props.width};
    height: ${(props) => props.height};  
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
    width: ${(props) => props.width};
    height: ${(props) => props.height};  
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
    width: ${(props) => props.width};
    height: ${(props) => props.height};  
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
    width: ${(props) => props.width};
    height: ${(props) => props.height};  
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
    width: ${(props) => props.width};
    height: ${(props) => props.height};  
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

