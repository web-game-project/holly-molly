import React, { useEffect, useRef, useState } from 'react';
import style from '../styles/styles';
import styled from 'styled-components';

//이미지
import gameBackground from '../assets/night.png';
//유저카드
import UserVote from './UserVote';

//통신
import axios from 'axios';
// 소켓
import { io } from 'socket.io-client';

import UserTotalVoteCard from './UserTotalVoteCard';

const GameVoteResult = (props) => {
    // local storage에 있는지 확인
    let data = localStorage.getItem('token');
    let save_token = JSON.parse(data) && JSON.parse(data).access_token;
    let save_refresh_token = JSON.parse(data) && JSON.parse(data).refresh_token;
    let save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;
    let save_user_name = JSON.parse(data) && JSON.parse(data).user_name;

    //전 페이지 즉, 플레잉 보트 안에서 넘겨준 데이터 세팅
    //const userList = props.data;
    const gameSetIdx = props.gameSet;
    const roomIdx = props.roomIdx;
    const role = props.role;
    //let arrSize = props.cnt;

    const BaseURL = 'http://3.17.55.178:3002/';

    const [arrSize, setArrSize] = useState();  //넘어온 유저 리스트 길이 값
    //let arrSize;

    let userList = useRef([]);

    //const [userList, setUserList] = useState(props.data);
    //let role = "human"; //역할 (human or ghost) 더미

    //console.log('유저리스트 : ' + JSON.stringify(userList));

    /* const userList = [
        { user_rank: "1", user_name: "동선동살쾡이", wrm_user_color: "RED", vote_cnt: "2" },
        { user_rank: "2", user_name: "수유동살쾡이", wrm_user_color: "ORANGE", vote_cnt: "2" },
        { user_rank: "3", user_name: "수선동살쾡이", wrm_user_color: "YELLOW", vote_cnt: "2" },
        { user_rank: "4", user_name: "방배동살쾡이", wrm_user_color: "GREEN", vote_cnt: "2" },
    //    { user_rank: "5", user_name: "진월동살쾡이", wrm_user_color: "PURPLE", vote_cnt: "2" },
    //    { user_rank: "6", user_name: "봉선동살쾡이", wrm_user_color: "PINK", vote_cnt: "2" },
    ]; */

    const settingSize = async () => {
        setArrSize(userList.current.length);
    }

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
                    userList.current = response.data.vote_result;
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
                //userList && setArrSize(userList.length), //넘어온 유저 리스트 길이 값
                arrSize !== undefined ? (
                    console.log('배열 사이즈 ' + arrSize),
                    console.log('투표 ㅇ저 ' + userList),
                    <Title cnt={arrSize}>투표 결과</Title>,
                    <ResultTable cnt={arrSize}>
                        {userList.current && userList.current.map((element, key) =>
                            <ColumnContainer>
                                {key === arrSize - 1 ?
                                    <div style={{ width: '560px', display: 'flex', flexDirection: 'row', paddingTop: '10px', paddingBottom: '10px', }}>

                                        <div style={{ width: '185px' }}>
                                            {element.user_rank}위
                                        </div>
                                        <div style={{ width: '355px' }}>
                                            {element.user_name}
                                        </div>
                                    </div>
                                    :
                                    <div style={{ width: '560px', display: 'flex', flexDirection: 'row', paddingTop: '10px', paddingBottom: '10px', borderBottom: '1px solid #fff' }}>

                                        <div style={{ width: '185px' }}>
                                            {element.user_rank}위
                                        </div>
                                        <div style={{ width: '355px' }}>
                                            {element.user_name}
                                        </div>
                                    </div>
                                }
                            </ColumnContainer>
                        )}
                    </ResultTable>,
                    //{
                    role === "human" ?
                        <TotalResultCard cnt={arrSize}>
                            <TotalTitle>
                                전체 결과 <text style={{ fontFamily: 'Hahmlet', fontSize: '18px', color: style.red }}> * 전체 결과는 몰리에게만 공개됩니다.</text>
                            </TotalTitle>
                            <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '60px' }}>
                                {
                                    arrSize <= 4 ?
                                        userList.current && userList.current.map((element, key) =>
                                            <UserTotalVoteCard nickname={element.user_name} color={element.wrm_user_color} vote_cnt={element.vote_cnt} width="120px" height="125px" innerHeight="90px" size="30px" />)
                                        :
                                        arrSize === 5 ?
                                            userList.current && userList.current.map((element, key) =>
                                                <UserTotalVoteCard nickname={element.user_name} color={element.wrm_user_color} vote_cnt={element.vote_cnt} width="90px" height="95px" innerHeight="60px" size="20px" />)
                                            :
                                            userList.current && userList.current.map((element, key) =>
                                                <UserTotalVoteCard nickname={element.user_name} color={element.wrm_user_color} vote_cnt={element.vote_cnt} width="70px" height="75px" innerHeight="40px" size="14px" />)
                                }
                            </div>
                        </TotalResultCard>
                        :
                        <TotalResulContainer>
                            전체 결과는 <text style={{ fontFamily: 'Black Han Sans', color: style.red, fontSize: '30px' }}>몰리만</text> 볼 수 있습니다.
                        </TotalResulContainer>
                )
                    :
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
    ${(props) => props.cnt === 2 ? `width: 560px; height: 110px; margin-top: 70px; font-size: 28px;` :
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