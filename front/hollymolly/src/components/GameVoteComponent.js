import React, { useEffect, useState } from 'react';
import style from '../styles/styles';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import gameBackground from '../assets/night.png';
import UserVote from './UserVote';

// 소켓
import axios from 'axios';
import { io } from 'socket.io-client';

// local storage에 있는지 확인
let data = localStorage.getItem('token');
let save_token = JSON.parse(data) && JSON.parse(data).access_token;
let save_refresh_token = JSON.parse(data) && JSON.parse(data).refresh_token;
let save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;
let save_user_name = JSON.parse(data) && JSON.parse(data).user_name;

const GameVoteComponent = (props) => {
    const userList = props.data;
    const gameset = props.gameSet;
    const [clicked, setClicked] = useState(false); // 클릭리스너
    const [voteWho, setVoteWho] = useState(''); // 내가 투표한 사람의 컬러
    const [voteIndex, setVoteIndex] = useState(-1); // 내가 투표한 사람의 인덱스
    const baseURL = useSelector((state) => state.socket.base_url);

    useEffect(() => {
        setClicked(false);
        setVoteWho('');
    }, []);

    const postVote = async () => {
        //  타이머 카운트 주고 시간 다 되면 이 api 불러주면 됨
        // 투표 api
        const restURL = baseURL + 'game/vote';

        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };
        axios
            .post(
                restURL,
                {
                    game_set_idx: gameset,
                    user_idx: voteIndex,
                },
                reqHeaders
            )
            .then(function (response) {
                console.log('postVote 성공');
            })
            .catch(function (error) {
                console.log('postVote 실패');
                console.log(error.response);
            });
    };

    return (
        <Container>
            {/* <br /> */}
            몰리, 인간으로 의심되는 유령을 <text style={{ color: style.red, textShadow: '3px 3px #980000' }}>투표</text> 해주세요.
            <Button onClick={postVote}>투표하기</Button> {/* //투표 api 테스트 할 때 이 버튼 누르시면 됩니다. */}
            <div style={styles.userListContainer}>
                {userList &&
                    userList.map((element) => (
                        <Div
                            onClick={() => {
                                setClicked(true);
                                console.log(element.user_color);
                                setVoteWho(element.user_color);
                                setVoteIndex(element.user_idx);
                                console.log(voteWho + '가 voteWho');
                                console.log(gameset);
                                console.log('API: 게임세트? ' + gameset + ', 유저인덱스? ' + voteIndex);
                            }}
                        >
                            <UserVote nick={element.user_name} color={element.user_color} click={clicked} voteWho={voteWho} />
                        </Div>
                    ))}
            </div>
            <Info>
                투표 시간이 끝난 즉시<InfoYeLLOW> 선택된 유령 </InfoYeLLOW> 이 투표됩니다.
            </Info>
        </Container>
    );
};

const Button = styled.button`
    // api 보내기 테스트용 버튼
    background: white;
    color: palevioletred;
    width: 70px;
    height: 20px;
    font-size: 15px;
    font-weight: bolder;
    // margin: 0px 0px -15px 0px;
    padding: 0.25px 1px;
    border: 2px solid palevioletred;
    border-radius: 15px;

    &:hover {
        background: palevioletred;
        color: white;
        border: white;
        cursor: grab;
    }
`;

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

const Div = styled.div`
    &:hover {
        cursor: grab;
    }
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
        justifyContent: 'flex-start',
        flexDirection: 'column',
        width: '590px',
        height: '410px',
        flexFlow: 'row wrap',
        marginTop: '20px',
    },
};

export default GameVoteComponent;
