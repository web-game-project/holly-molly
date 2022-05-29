import React, { useEffect, useRef, useState } from 'react';
import style from '../styles/styles';
import styled from 'styled-components';
import RefreshVerification from '../server/RefreshVerification';
//페이지 이동
import { useHistory, useLocation, Prompt } from 'react-router';

//통신
import axios from 'axios';
//깊은 복제
import * as _ from 'lodash';

import UserTotalVoteCard from './UserTotalVoteCard';
import { useSelector } from 'react-redux';

const GameVoteResult = (props) => {
    const history = useHistory();

    //전 페이지 즉, 플레잉 보트 안에서 넘겨준 데이터 세팅
    const userList = props.userList;
    const gameSetIdx = props.gameSet;
    const roomIdx = props.roomIdx;
    const role = props.role;
    const gameSetNo = props.gameSetNo;
    const gameIdx = props.gameIdx;
    const leaderIdx = props.leaderIdx;
    const keyword = props.keyword;

    const BaseURL = useSelector((state) => state.socket.base_url);

    const [arrSize, setArrSize] = useState();  //넘어온 유저 리스트 길이 값
    const [control, setControl] = useState(false); 

    let voteList = useRef([]);
    let voteListLength = useRef(0);
    let isSame = useRef(false);
    let copyVoteList = useRef([]);

    let voteTotalList = useRef([]);

    //토큰 검사
    let verify = RefreshVerification.verification()
   // console.log('토큰 유효한지 검사 t/f 값 : ' + verify);
    let data, save_token;

    data = sessionStorage.getItem('token');
    save_token = JSON.parse(data) && JSON.parse(data).access_token;

    function getToken() {
        data = sessionStorage.getItem('token');
        save_token = JSON.parse(data) && JSON.parse(data).access_token;
    }

    // 투표 10초 타이머 세기, 투표 10초 후에 1초 더 여유롭게.
    const [seconds, setSeconds] = useState(10);

    useEffect(() => {
        const countdown = setInterval(() => {
            if (parseInt(seconds) > 0) {
                setSeconds(parseInt(seconds) - 1);
            }

            if (parseInt(seconds) === 0) {
                //여기서 gameSetNo 비교하기
                if (gameSetNo === 1) {
                    //플레잉룸으로 이동, 게임 세트가 1이라 중간, 최종결과가 필요x
                    history.push({
                        pathname: '/playingroom/' + roomIdx,
                        state: { isSet: true, gameSetNo: gameSetNo + 1, gameIdx: gameIdx, userList: userList, gameSetIdx: gameSetIdx, room: roomIdx, leaderIdx: leaderIdx },
                    });
                }
                else {
                    history.push({
                        pathname: '/playingresult/' + roomIdx,
                        state: { gameSetNo: gameSetNo, gameIdx: gameIdx, leaderIdx: leaderIdx, userList: userList, roomIdx: roomIdx, gameSetIdx: gameSetIdx, keyword: keyword, role: role, normal: true, exitData: null},
                    })
                }
                setSeconds(-1);
            }
        }, 1000);

        return () => {
            clearInterval(countdown);
        };
    }, [seconds]);

    useEffect(() => {
        getVoteResult();
    }, []);

    const getVoteResult = async () => {
        if (role === "human") { //인간일때
            const reqHeaders = {
                headers: {
                    authorization: 'Bearer ' + save_token,
                },
            };
            const restURL = BaseURL + '/game/vote-result/' + gameSetIdx;

            axios
                .get(restURL, reqHeaders)
                .then(function (response) {
                    voteList.current = response.data.vote_result;
                    //console.log('전체 투표 결과야!' + JSON.stringify(voteList.current));
                })
                .catch(function (error) {
                    let resErr = error.response.data.message;

                    if ("로그인 후 이용해주세요." === resErr) { //401 err
                        let refresh = RefreshVerification.verification();
                        getToken();
                        getVoteResult();
    
                    }
                    else
                        alert(resErr);
                });
        }

        const reqHeadersVoteResult = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };
        const restURLVoteResult = BaseURL + '/game/top-vote-result/' + gameSetIdx;

        axios
            .get(restURLVoteResult, reqHeadersVoteResult)
            .then(function (response) {
                voteTotalList.current = response.data.vote_rank;
                setArrSize(voteTotalList.current.length);
                setControl(true);
            })
            .catch(function (error) {
                let resErr = error.response.data.message;

                    if ("로그인 후 이용해주세요." === resErr) { //401 err
                        let refresh = RefreshVerification.verification();
                        getToken();
                        getVoteResult();
    
                    }
                    else
                        alert(resErr);
            });

    }

    return (
        <Container>
            {
                control === true ?
                (voteTotalList.current.length > 0 && voteTotalList.current !== []?
                    (role === "human") ?
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Title cnt={arrSize}>투표 결과</Title>,
                            <text style={{ color: style.white, fontSize: '20px', fontFamily: 'Gowun Dodum', fontWeight: 'bold' }}>{seconds}초 후 넘어갑니다.</text>
                            {
                                <div>
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
                                                voteList.current && voteList.current.map((element, key) =>
                                                        <UserTotalVoteCard nickname={element.user_name} color={element.user_color} vote_cnt={element.vote_cnt} width="120px" height="125px" innerHeight="90px" size="30px" />)
                                                    :
                                                    arrSize === 5 ?
                                                    voteList.current && voteList.current.map((element, key) =>
                                                            <UserTotalVoteCard nickname={element.user_name} color={element.user_color} vote_cnt={element.vote_cnt} width="90px" height="95px" innerHeight="60px" size="20px" />)
                                                        :
                                                        voteList.current && voteList.current.map((element, key) =>
                                                            <UserTotalVoteCard nickname={element.user_name} color={element.user_color} vote_cnt={element.vote_cnt} width="70px" height="75px" innerHeight="40px" size="14px" />)
                                            }
                                        </div>
                                    </TotalResultCard>
                                </div>
                            }
                        </div>
                        : //ghost 일 때
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Title cnt={arrSize}>투표 결과</Title>,
                            <text style={{ color: style.white, fontSize: '20px', fontFamily: 'Gowun Dodum', fontWeight: 'bold' }}>{seconds}초 후 넘어갑니다.</text>
                            {
                                <div>
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
                            }
                        </div>
                    :
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Title cnt={arrSize}>투표 결과</Title>,
                        <text style={{ color: style.white, fontSize: '20px', fontFamily: 'Gowun Dodum', fontWeight: 'bold' }}>{seconds}초 후 넘어갑니다.</text>
                        <text style={{ color: style.white, fontFamily: "Black Han Sans", fontSize: "35px", marginTop: "150px" }}> 아무도 투표를 하지 않았습니다.</text>
                    </div>
                )
                :
                null
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