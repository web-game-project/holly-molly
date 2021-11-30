import React, { useEffect } from 'react';
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

const GameVoteComponent = (props) => {
    const  userList  = props.data;

    //console.log('유저리스트 : ' + JSON.stringify(userList));

    /* const userList = [
        { user_name: "동선동살쾡이", wrm_user_color: "RED" },
        { user_name: "수유동살쾡이", wrm_user_color: "ORANGE" },
        { user_name: "수선동살쾡이", wrm_user_color: "YELLOW" },
        { user_name: "방배동살쾡이", wrm_user_color: "GREEN" },
        { user_name: "진월동살쾡이", wrm_user_color: "PURPLE" },
        { user_name: "봉선동살쾡이", wrm_user_color: "PINK" },
    ]; */

    return (
        <Container>
            몰리, 인간을 지목해서 <text style={{ color: style.red, textShadow: '3px 3px #980000'  }}>투표</text>  해주세요.
            <div style={styles.userListContainer}>
                {userList && userList.map((element) => (
                    <UserVote
                        nick={element.user_name}
                        color={element.wrm_user_color} />
                ))}
            </div>

            <Info>
                투표 시간이 끝난<InfoYeLLOW> 즉시 선택된 유령 </InfoYeLLOW> 이 투표됩니다.
            </Info>
        </Container>
    );
}

const Container = styled.div`
    width: 580px;
    height: 500px;
    margin-top: 70px;
    border-radius: 10px;
    text-align: center;
    font-size: 30px;  
    color: #fff;
    font-family: Black Han Sans;
`;

const Info = styled.text`
    font-size: 20px;  
    color: #ffffff;
    margin-top: 60px;    
    font-family: Black Han Sans;
`;

const InfoYeLLOW = styled.text`
    font-family: Hahmlet;
    -webkit-text-stroke: 1px ${style.yellow};
    color: ${style.yellow};
    text-shadow: 4px 4px 0px #53305e, 7px 7px 0px #2a132e; //#2A132E
`;

const styles = {
    userListContainer: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexDirection: 'column',
        width: '590px',
        height: '410px',
        flexFlow: 'row wrap',
        marginTop: '20px',
    },
};

export default GameVoteComponent;