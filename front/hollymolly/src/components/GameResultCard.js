import React from 'react';
import styled from 'styled-components';
import style from '../styles/styles';
import night from '../assets/night.svg';
import PurpleCharacter from '../assets/purple.svg';
import Human from '../assets/human.svg';

const GameResultCard = (props) => {
    const { role, engRole, final, win } = props;

    return (
        <React.Fragment>
            {!final ? ( // 중간 결과시 사용
                <CardContainer>
                    <WinnerRoleContext>{engRole}</WinnerRoleContext>
                    <CharacterContainer className="ghost">
                        {role === '유령' ? <CharacterGhost></CharacterGhost> : <CharacterHuman></CharacterHuman>}
                    </CharacterContainer>
                </CardContainer>
            ) : // 최종 결과시 사용
            win ? (
                <CardFinalWinContainer>
                    <FinalWinnerRoleContext>{engRole}</FinalWinnerRoleContext>
                    <CharacterFinalContainer className="ghost">
                        {role === '유령' ? <CharacterFinalGhost></CharacterFinalGhost> : <CharacterFinalHuman></CharacterFinalHuman>}
                    </CharacterFinalContainer>
                </CardFinalWinContainer>
            ) : (
                <CardFinalLoseContainer>
                    <FinalWinnerRoleContext>{engRole}</FinalWinnerRoleContext>
                    <CharacterFinalContainer className="ghost">
                        {role === '유령' ? <CharacterFinalGhost></CharacterFinalGhost> : <CharacterFinalHuman></CharacterFinalHuman>}
                    </CharacterFinalContainer>
                </CardFinalLoseContainer>
            )}
        </React.Fragment>
    );
};

const WinnerRoleContext = styled.text`
    margin-top: 10px;
    font-size: 28px;
    font-family: Hahmlet;
    -webkit-text-stroke: 1px #53305e;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 4px 4px 0px #53305e, 4px 4px 0px #53305e;
`;

const FinalWinnerRoleContext = styled.text`
    margin-top: 10px;
    font-size: 20px;
    font-family: Hahmlet;
    -webkit-text-stroke: 1px #53305e;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 4px 4px 0px #53305e, 4px 4px 0px #53305e;
`;

const CharacterHuman = styled.div`
    background-image: url(${Human});
    background-size: cover;
    width: 120px;
    height: 180px;
`;

const CharacterFinalHuman = styled.div`
    background-image: url(${Human});
    background-size: cover;
    width: 100px;
    height: 150px;
`;

const CharacterGhost = styled.div`
    background-image: url(${PurpleCharacter});
    background-size: cover;
    width: 120px;
    height: 180px;
`;

const CharacterFinalGhost = styled.div`
    background-image: url(${PurpleCharacter});
    background-size: cover;
    width: 100px;
    height: 150px;
`;

const CardContainer = styled.div`
    width: 180px;
    height: 260px;
    border: 2px solid #ffffff;
    background-color: #060010;
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
`;

// 패배
const CardFinalLoseContainer = styled.div`
    width: 140px;
    height: 210px;
    border: 2px solid ${style.black};
    background-color: #060010;
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
`;

// 승리
const CardFinalWinContainer = styled.div`
    width: 140px;
    height: 210px;
    border: 2px solid ${style.yellow};
    background-color: #060010;
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
`;

const CharacterContainer = styled.div`
    width: 160px;
    height: 260px;
    background-color: transparent;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const CharacterFinalContainer = styled.div`
    width: 120px;
    height: 260px;
    background-color: transparent;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export default GameResultCard;
