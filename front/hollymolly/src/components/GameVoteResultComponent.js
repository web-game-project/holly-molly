import React, { useEffect, useRef, useState } from 'react';
import style from '../styles/styles';
import styled from 'styled-components';

//통신
import axios from 'axios';

//깊은 복제
import * as _ from 'lodash';

import UserTotalVoteCard from './UserTotalVoteCard';

const GameVoteResult = (props) => {
    // local storage에 있는지 확인
    let data = localStorage.getItem('token');
    let save_token = JSON.parse(data) && JSON.parse(data).access_token;
    let save_refresh_token = JSON.parse(data) && JSON.parse(data).refresh_token;
    let save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;
    let save_user_name = JSON.parse(data) && JSON.parse(data).user_name;

    //전 페이지 즉, 플레잉 보트 안에서 넘겨준 데이터 세팅
    const userList = props.data;
    const gameSetIdx = props.gameSet;
    const roomIdx = props.roomIdx;
    const role = props.role;
    const socket = props.socket;

    const BaseURL = 'http://3.17.55.178:3002/';

    const [arrSize, setArrSize] = useState();  //넘어온 유저 리스트 길이 값

    let voteList = useRef([]);
    let voteListLength = useRef(0);
    let isSame = useRef(false);
    let copyVoteList = useRef([]);

    let voteTotalList = useRef(props.voteTotalList);

    const settingSize = async () => {
        console.log('보트 토탈 넘어온 거 : ' + JSON.stringify(voteTotalList.current));
        console.log('보트 arr : ' + arrSize);

        setArrSize(voteTotalList.current.length);
        copyVoteList.current = _.cloneDeep(voteList.current); // 유저 리스트 중 순서 정리를 위한 리스트 
        voteListLength.current = voteList.current.length;

        for (let j = 0; j < userList.length; j++) {
            for (let i = 0; i < voteListLength.current; i++) {
                isSame.current = (userList[i].user_idx === copyVoteList.current[j].user_idx) ? true : false

                if (isSame.current === true) {
                    copyVoteList.current[j].user_color = userList[i].user_color;
                } else if (isSame.current === false) {
                    let overlap = copyVoteList.current.find((x) => x.user_idx === userList[i].user_idx)

                    if (!overlap) {
                        copyVoteList.current.push({ user_idx: userList[i].user_idx, user_name: userList[i].user_name, vote_cnt: 0, user_color: userList[i].user_color });
                    }
                }
            }
        }
    }

    // 투표 10초 타이머 세기, 투표 10초 후에 1초 더 여유롭게.
    const [seconds, setSeconds] = useState(10);

    useEffect(() => {
        const countdown = setInterval(() => {
            if (parseInt(seconds) > 0) {
                setSeconds(parseInt(seconds) - 1);
            }

            if (parseInt(seconds) === 0) {
                setSeconds(0);
            }
        }, 1000);

        return () => {
            clearInterval(countdown);
        };
    }, [seconds]);

    useEffect(() => {
        if (role === "human") {
            const reqHeaders = {
                headers: {
                    authorization: 'Bearer ' + save_token,
                },
            };
            const restURL = BaseURL + 'game/vote-result/' + gameSetIdx;

            axios
                .get(restURL, reqHeaders)
                .then(function (response) {
                    console.log('userLs' + JSON.stringify(response.data.vote_result));
                    voteList.current = response.data.vote_result;
                    settingSize();
                })
                .catch(function (error) {
                    alert('error voteResult : ' + error.message);
                });
        }
    });

    return (
        <Container>
            {
                arrSize && seconds > 0 ? (
                        role === "human" ? 
                        <div>
                        <Title cnt={arrSize}>투표 결과</Title>,                        
                        <text style={{ fontFamily: 'Black Han Sans' ,color: style.white, fontSize: '28px', marginLeft: '250px' }}>{seconds}초</text>
                        <ResultTable cnt={arrSize}>
                            {voteTotalList.current && voteTotalList.current.map((element, key) =>
                                <ColumnContainer>
                                    {key === arrSize - 1 ?
                                        <div style={{ width: '560px', display: 'flex', flexDirection: 'row', paddingTop: '10px', paddingBottom: '10px', }}>

                                            <div style={{ width: '185px' }}>
                                                {element.game_rank_no}위
                                            </div>
                                            <div style={{ width: '355px' }}>
                                                {element.user_name}
                                            </div>
                                        </div>
                                        :
                                        <div style={{ width: '560px', display: 'flex', flexDirection: 'row', paddingTop: '10px', paddingBottom: '10px', borderBottom: '1px solid #fff' }}>

                                            <div style={{ width: '185px' }}>
                                                {element.game_rank_no}위
                                            </div>
                                            <div style={{ width: '355px' }}>
                                                {element.user_name}
                                            </div>
                                        </div>
                                    }
                                </ColumnContainer>
                            )}
                        </ResultTable> 
                        <TotalResultCard cnt={arrSize}>
                            <TotalTitle>
                                전체 결과 <text style={{ fontFamily: 'Hahmlet', fontSize: '18px', color: style.red }}> * 전체 결과는 몰리에게만 공개됩니다.</text>
                            </TotalTitle>
                            <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '60px' }}>
                                {
                                    arrSize <= 4 ?
                                        copyVoteList.current && copyVoteList.current.map((element, key) =>
                                            <UserTotalVoteCard nickname={element.user_name} color={element.user_color} vote_cnt={element.vote_cnt} width="120px" height="125px" innerHeight="90px" size="30px" />)
                                        :
                                        arrSize === 5 ?
                                            copyVoteList.current && copyVoteList.current.map((element, key) =>
                                                <UserTotalVoteCard nickname={element.user_name} color={element.user_color} vote_cnt={element.vote_cnt} width="90px" height="95px" innerHeight="60px" size="20px" />)
                                            :
                                            copyVoteList.current && copyVoteList.current.map((element, key) =>
                                                <UserTotalVoteCard nickname={element.user_name} color={element.user_color} vote_cnt={element.vote_cnt} width="70px" height="75px" innerHeight="40px" size="14px" />)
                                }
                            </div>
                        </TotalResultCard>
                        </div>
                    : //ghost 일 때
                       <div>
                        <Title cnt={arrSize}>투표 결과</Title>,                        
                        <text style={{ color: style.black, fontSize: '30px' }}>{seconds}초</text>
                        <ResultTable cnt={arrSize}>
                            {voteTotalList.current && voteTotalList.current.map((element, key) =>
                                <ColumnContainer>
                                    {key === arrSize - 1 ?
                                        <div style={{ width: '560px', display: 'flex', flexDirection: 'row', paddingTop: '10px', paddingBottom: '10px', }}>

                                            <div style={{ width: '185px' }}>
                                                {element.game_rank_no}위
                                            </div>
                                            <div style={{ width: '355px' }}>
                                                {element.user_name}
                                            </div>
                                        </div>
                                        :
                                        <div style={{ width: '560px', display: 'flex', flexDirection: 'row', paddingTop: '10px', paddingBottom: '10px', borderBottom: '1px solid #fff' }}>

                                            <div style={{ width: '185px' }}>
                                                {element.game_rank_no}위
                                            </div>
                                            <div style={{ width: '355px' }}>
                                                {element.user_name}
                                            </div>
                                        </div>
                                    }
                                </ColumnContainer>
                            )}
                        </ResultTable> 
                        <TotalResulContainer>
                            전체 결과는 <text style={{ fontFamily: 'Black Han Sans', color: style.red, fontSize: '30px' }}>몰리만</text> 볼 수 있습니다.
                        </TotalResulContainer>
                       </div>
                ) : // playingResult로 
                <></>     
            }
        </Container>
    );
}

const TotalResulContainer = styled.div`
    width: 580px;
    height: 450px;
    font-size: 28px;  
    color: #fff;
    margin-top: 80px;  
    font-family: Black Han Sans;
`;

const TotalResultCard = styled.div`
    width: 580px;
    height: 450px;
    color: #fff;
    margin-left: -70px; 
    font-family: Black Han Sans;
    
    ${(props) => props.cnt === 2 ? `margin-top: 70px;` : props.cnt === 3 ? `margin-top: 40px` : `margin-top: 25px; `}
`;

const Container = styled.div`
    width: 580px;
    height: 500px;
    border-radius: 10px;
`;

const Title = styled.div`
    text-align: center;
    font-size: 45px;  
    color: #fff;    
    font-family: Black Han Sans;
    ${(props) => props.cnt <= 4 ? `
    margin-top: 60px;` :
        props.cnt === 5 ? `margin-top: 40px;`
            : `margin-top: 30px;`} 
`;

const TotalTitle = styled.div`
    text-align: center;
    font-size: 35px;  
    color: #fff;    
    font-family: Black Han Sans;
`;

const ResultTable = styled.div`
    /* width: 560px;
    height: 290px;
    margin-top: 30px;
    font-size: 22px; */  
    text-align: center;
    background-color: #6A3786;
    color: #fff;    
    font-family: Black Han Sans;
    border-radius: 30px;
    border:  4px solid #9978AD; //#963773
    ${(props) => props.cnt <= 2 ? `width: 560px; height: 110px; margin-top: 70px; font-size: 28px;` :
        props.cnt === 3 ? `width: 560px; height: 170px; margin-top: 70px; font-size: 28px;` : props.cnt === 4 ? `width: 560px; height: 205px; margin-top: 40px; font-size: 25px;`
            : props.cnt === 5 ? `width: 560px; height: 260px; margin-top: 40px; font-size: 25px;`
                : ` width: 560px; height: 290px; margin-top: 30px; font-size: 22px;  `} 
`;

const ColumnContainer = styled.div` 
    display: flex;
    flex-direction: colummn;
    jutift-content: center;
    align-item: center;
    margin-top: 0px;
`;
export default GameVoteResult;