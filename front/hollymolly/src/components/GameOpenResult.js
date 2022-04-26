import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import style from '../styles/styles';
import GameResultCard from '../components/GameResultCard';
import UserOpenCard from './UserOpenCard';

//페이지 이동
import { useHistory} from 'react-router';

const GameFinalResult = (props) => {
    const history = useHistory();

    //console.log('이름, 칼라 : ' + props.name + props.color );

    let name = props.name;
    let color = props.color;

    const [seconds, setSeconds] = useState(5); 
     
    useEffect(() => {
        const countdown = setInterval(() => {
            if (parseInt(seconds) > 0) {
                setSeconds(parseInt(seconds) - 1);
            }
            else {
                history.push({
                    pathname: '/waitingroom/' + props.roomIdx,
                }); //게임종료, 웨이팅룸으로 이동
                //window.location.replace('/waitingroom/'+ props.roomIdx);
            }
        }, 1000);

        return () => {
            clearInterval(countdown);
        };
    }, [seconds]);

    return (
        <React.Fragment>
            <Container>
                <Title>몰리 &nbsp; 공개</Title>
                <Timer>{seconds}초 후 대기실로 넘어갑니다.</Timer>,
                <HumanContainer>
                    {/* <GameResultCard role={'유령'} engRole={'GHOST'} final win></GameResultCard> */}
                    <UserOpenCard nick = {name} color = {color}/>
               </HumanContainer>

                    <HumanWhoTxt>
                        인간 몰리는 <ResultSubtitle>{name} </ResultSubtitle>이였습니다.
                    </HumanWhoTxt>
                
            </Container>
        </React.Fragment>
    );
};

const Timer = styled.div`
    font-weight: bold;
    font-family: Gowun Dodum;
    font-size: 20px;
    color:${style.white};   
    margin-top: 10px;
    text-align: center;
`;

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
   // margin-bottom: 15px;
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
    margin-top: 50px;
`;

export default GameFinalResult;