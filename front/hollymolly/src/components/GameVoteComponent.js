import React, { useEffect, useState, useRef } from 'react';
import style from '../styles/styles';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import UserVote from './UserVote';
import axios from 'axios';
import RefreshVerification from '../server/RefreshVerification';

//페이지 이동
import { useHistory, useLocation, Prompt } from 'react-router';

const GameVoteComponent = (props) => {
    const userList = props.userList;
    const gameSet = props.gameSet;

    const [clicked, setClicked] = useState(false); // 클릭리스너
    const [voteWho, setVoteWho] = useState(''); // 내가 투표한 사람의 컬러
    //const [voteIndex, setVoteIndex] = useState(); // 내가 투표한 사람의 인덱스
    const baseURL = useSelector((state) => state.socket.base_url);

    //투표 유저 인덱스
    const voteIndex = useRef(-1); // orderCount

    //투표 10초 타이머
    const [seconds, setSeconds] = useState(10);

    //토큰 검사
    let verify = RefreshVerification.verification()
   // console.log('토큰 유효한지 검사 t/f 값 : ' + verify);
    let data, save_token;

    if (verify === true) {
        data = sessionStorage.getItem('token');
        save_token = JSON.parse(data) && JSON.parse(data).access_token;
    }
    
    useEffect(() => {
        setClicked(false);
        setVoteWho('');
    }, []);

    useEffect(() => {
        if (props != null) {
            //데이터 전달 받은게 세팅되기 전까지는 타이머가 돌아가면 안됨.
            const countdown = setInterval(() => {
                if (parseInt(seconds) > 0) {
                    setSeconds(parseInt(seconds) - 1);
                }

                if (parseInt(seconds) === 0) {
                    setSeconds(0);
                    postVote();
                }
            }, 1000);

            return () => {
                clearInterval(countdown);
            };
        }
    }, [seconds]);

    const postVote = async () => {
        //  타이머 카운트 주고 시간 다 되면 이 api 불러주면 됨
        // 투표 api

        /* let str = -1;

        if (voteIndex !== null || voteIndex !== '')
            str = voteIndex.current; */

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
                    game_set_idx: gameSet,
                    user_idx: voteIndex.current,
                },
                reqHeaders
            )
            .then(function (response) {
                //console.log('postVote 성공');
            })
            .catch(function (error) {
                //console.log('postVote 실패');
                //console.log(error.response);
                //alert(error.response.data.message);
            });

        setSeconds(-1);
    };

    return (
        <Container>
            {/* <br /> */}
            몰리, 인간으로 의심되는 유령을 <text style={{ color: style.red, textShadow: '3px 3px #980000' }}>투표</text> 해주세요.
            <div style={styles.userListContainer}>
                {userList &&
                    userList.map((element) => (
                        <Div
                            onClick={() => {
                                setClicked(true);
                                setVoteWho(element.user_color);
                                //setVoteIndex(element.user_idx);
                                voteIndex.current = element.user_idx;
                                //console.log('API: 게임세트? ' + gameSet + ', 유저인덱스? ' + voteIndex.current);
                            }}
                        >
                            <UserVote nick={element.user_name} color={element.user_color} click={clicked} voteWho={voteWho} />
                        </Div>
                    ))}
            </div>

            {
                seconds === 0 ?
                    <Info>
                        투표 시간이 <InfoRed> 마감 </InfoRed>되었습니다.
                    </Info>
                    :
                    seconds > 0 ?
                        <Info>
                            투표 시간이 <InfoRed> {seconds} </InfoRed> 초 남았습니다.
                        </Info>
                        :
                        null //-1되면 -1 초라고 떠서 처리해줌
            }

        </Container>
    );
};

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

const InfoRed = styled.text`
    font-family: Hahmlet;
    -webkit-text-stroke: 1px ${style.red};
    color: ${style.red};
    3px 3px #980000
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