import React, { useEffect, useRef, useState } from 'react';
import style from '../styles/styles';
import styled from 'styled-components';

//통신
import axios from 'axios';

//깊은 복제
import * as _ from 'lodash';

import UserTotalVoteCard from './UserTotalVoteCard';

const GameVoteResult = (props) => {
    
    let setBeforeImgSrc = props.setBeforeImg;
    let setBeforeHumanAnswer = props.setBeforeHumanAnswer;
    let setBeforeKeyword = props.setBeforeKeyword;

    /* let roomIdx = props.roomIdx;
    let gameSetNo = props.gameSetNo;
    let leaderIdx = props.leaderIdx;
    let gameIdx = props.gameIdx; */


    // local storage에 있는지 확인
    let data = localStorage.getItem('token');
    let save_token = JSON.parse(data) && JSON.parse(data).access_token;
    let save_refresh_token = JSON.parse(data) && JSON.parse(data).refresh_token;
    let save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;
    let save_user_name = JSON.parse(data) && JSON.parse(data).user_name;

    const [seconds, setSeconds] = useState(5);

    useEffect(() => {
        const countdown = setInterval(() => {
            if (parseInt(seconds) > 0) {
                setSeconds(parseInt(seconds) - 1);
            }
        }, 1000);

        return () => {
            clearInterval(countdown);
        };
    }, [seconds]);

    return ( // 4초동안 보여준다.
        <React.Fragment>
            {
                seconds > 0 ?
                    <Container>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <Title>이전 게임 정보 공개 </Title>
                            <Timer>{seconds}초</Timer>
                        </div>
                        <Description>몰리가 입력한 제시어, 정답 제시어 그리고 이전 게임의 그림을 보여줍니다.</Description>
                        <BeforeRowContainer>
                            <Headline> 제시어 : &nbsp;</Headline> <Content>{setBeforeKeyword}</Content>
                            <Headline> 몰리 입력 : &nbsp;</Headline> <Content>{setBeforeHumanAnswer}</Content>
                            {/* <HumanAnswer> 몰리가 </HumanAnswer> */}
                        </BeforeRowContainer>

                        <img src={setBeforeImgSrc} className="DrawImg" />
                    </Container> 
                    :
                    <></>
                }

        </React.Fragment>
    );
}


const Container = styled.div`
    width: 580px;
    height: 580px;
    border-radius: 10px;
    color: #fff;
    font-size: 25px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;

    .DrawImg{
        width: 420px;
        height: 420px;
        background-color: ${style.white};
        margin-left: 85px;
        border-radius: 20px;
    }
`;

const Title = styled.text`
    font-size: 50px;
    font-family: Black Han Sans;
    -webkit-text-stroke: 1px #53305e;
    font-weight: bold;
    color:${style.white};
    text-shadow: 4px 4px 0px #53305e, 5px 5px 0px #53305e;
    margin-left: 100px;
`;

const Timer = styled.div`
    background-color : #53305e;
    border-radius: 60px;
    -webkit-text-stroke: 1px #53305e;
    font-weight: bold;
    font-family: Black Han Sans;
    color:${style.white};
    text-shadow: 4px 4px 0px #53305e;
    margin-left: 35px;
   // margin-top: -10px;
    padding: 10px;
    width: 40px;
    height: 35px;
`;

const Description = styled.div`
    font-size: 20px;
    font-family: Nanum Pen Script;
    color: ${style.white};
    margin-left: 100px;
`;
const BeforeRowContainer = styled.div`
    width: 580px;
    height: 150px;
    margin-top: 13px;
    display: flex;
    flex-direction: row;
`;

const Headline = styled.div`    
    text-shadow: 4px 4px 0px #53305e, 5px 5px 0px #53305e;
    font-size: 30px;
    margin-left: 40px;    
`;

const Content = styled.div`    
    text-shadow: 4px 4px 0px #53305e, 5px 5px 0px #53305e;
    font-size: 40px;
    font-family: Hahmlet;
    -webkit-text-stroke: 1px ${style.yellow};
    color: ${style.yellow};  
    margin-top: -10px;  
`;
export default GameVoteResult;