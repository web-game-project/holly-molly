import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import MissionWord from '../components/MissionWord';
import night from '../assets/night.svg';
import day from '../assets/day.svg';
import Chatting from '../components/Chatting';
import GameUserCard from '../components/GameUserCard';
import GameRoleComponent from '../components/GameRoleComponent';
import GameDrawing from '../components/GameDrawing';
import PlayingLoading from '../components/PlayingLoading';
import Header from '../components/Header';
import { useLocation } from 'react-router';
//통신
import axios from 'axios';

//import RefreshVerification from '../server/RefreshVerification.js';
//RefreshVerification.verification();


import Loading from '../components/Loading';
// local storage에 있는지 확인
let data = localStorage.getItem('token');
let save_token = JSON.parse(data) && JSON.parse(data).access_token;
let save_refresh_token = JSON.parse(data) && JSON.parse(data).refresh_token;
let save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;
let save_user_name = JSON.parse(data) && JSON.parse(data).user_name;

console.log('내 인덱스 : ' + save_user_idx);

let userList = [{}];

const PlayingRoom = (props) => {
//const PlayingRoom = ({ match }) => {
    let location = useLocation();
    
    //alert('룸 인덱스 : ' + location.state.room);
    //let room_idx = location.state.room;
    let room_idx = 175;

    const [role, setRole] = React.useState('');
    const [keyword, setKeyWord] = React.useState('');

    //게임 시작 5초 후, 타이머
    const [seconds, setSeconds] = useState(6);

    const [playInfo, setPlayInfo] = React.useState(''); //웨이팅룸에서 넘어온 데이터 저장

    const [isDrawReady, setIsDrawReady] = React.useState(true); // 나중에 false로 바꿔놓아야 함 
    const [waitSeconds, setWaitSeconds] = useState(-1); // 게임 시작 전 10초 기다리는 타이머, 

    const BaseURL = 'http://3.17.55.178:3002/';

    const socket = io(BaseURL, {
        auth: {
            token: save_token,
        },
    });

    useEffect(() => {
        socket.on('connect', () => {
            console.log('playing room connection server');
        });

        socket.on('get next turn', (data) => {
            console.log(data.message); // success 메시지
            setIsDrawReady(true);
        });
    }, []);

    useEffect(() => {
        const waitcountdown = setInterval(() => {
            if (parseInt(waitSeconds) > 0) {
                setWaitSeconds(parseInt(waitSeconds) - 1);
            } else if (parseInt(waitSeconds) === 0) {
                // 10초가 지나도 받지 못하면 네트워크 에러 및 서버에서 강제 퇴장 처리
                if (isDrawReady) { // 받음 
                    setWaitSeconds(-1);
                } else { // 못받음 
                    console.log('순서 받기 시간 끝');
                    console.log('네트워크가 불안정합니다.');

                    setWaitSeconds(-1);
                }
            }
        }, 1000);

        return () => {
            clearInterval(waitcountdown);
        };
    }, [waitSeconds]);

    useEffect(() => {
        if (playInfo != null) {
            //데이터 전달 받은게 세팅되기 전까지는 타이머가 돌아가면 안됨.
            const countdown = setInterval(() => {
                if (parseInt(seconds) > 0) {
                    setSeconds(parseInt(seconds) - 1);
                }

                if (parseInt(seconds) === 0){
                    socket.emit('send next turn', {
                        room_idx: room_idx,
                        user_idx: save_user_idx,
                        member_count: 2,
                        draw_order: 1
                    }); 
                    setWaitSeconds(10); // 10초 기다림 
                    //setSeconds(-1);
                }
            }, 1000);

            return () => {
                clearInterval(countdown);
                console.log('플레잉 룸 초 끝');
            };
        }
    }, [seconds]);

    useEffect(() => {
        setPlayInfo(location.state.data);
        userList = location.state.data.user_list;

        console.log('넘어온 게임 세트 인덱스_playroom' + location.state.data.game_set_idx);

        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };
        const restURL = BaseURL + 'game/member/' + location.state.data.game_set_idx;

        console.log('url : ' + restURL);

        axios
            .get(restURL, reqHeaders)
            .then(function (response) {
                //alert('rest 키워드' + response.data.keyword + ', 역할' + response.data.user_role);
                setRole(response.data.user_role);
                setKeyWord(response.data.keyword);
            })
            .catch(function (error) {
                alert('error information : ' + error.message);
            });
    });

    // 정렬시, 유저 리스트에서 본인 인덱스 찾아서 제일 위로 올리기 위해 0으로 바꾸기
    var myIndex = userList.find((x) => x.user_idx === save_user_idx);
    if (myIndex) {
        myIndex.game_member_order = 0;
    }

    // 그림 그리기 순서 대로 유저 리스트 재정렬
    userList.sort(function (a, b) {
        return a.game_member_order - b.game_member_order;
    });

    // 유저 리스트 중 내 정보 배열 및 내 순서 저장 
    let user_order;
    var myList = userList.find((x) => x.user_idx === save_user_idx);
    if(myList){
        user_order = myList.game_member_order;
    }

    // 정렬된 리스트 중 본인 인덱스 찾아서 "나" 로 표시
    var myItem = userList.find((x) => x.user_idx === save_user_idx);
    if (myItem) {
        myItem.game_member_order = '나';
    }

    
    
    /* // 비정상 종료
    const exit = async () => {	
        console.log("exit!!!");
        const restURL = 'http://3.17.55.178:3002/game/exit';

        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };
        axios
            .delete(restURL, reqHeaders)
            .then(function (response) {
                alert(response);
                history.push({
                    pathname: '/inputname', // 성공하면 닉네임 설정 창으로 이동 
                });
            })
            .catch(function (error) {
                alert(error);
            });
    };

    // 게임 중 비정상 종료 감지
    useEffect(() => {
        window.addEventListener('beforeunload', alertUser) // 새로고침, 창 닫기, url 이동 감지 
        window.addEventListener('unload', handleEndConcert) //  사용자가 페이지를 떠날 때, 즉 문서를 완전히 닫을 때 실행
        return () => {
          window.removeEventListener('beforeunload', alertUser)
          window.removeEventListener('unload', handleEndConcert)
        }
    }, [])

    // 경고창 
    const alertUser = (e) => {
        e.preventDefault(); // 페이지가 리프레쉬 되는 고유의 브라우저 동작 막기
        e.returnValue = "";
    };

    // 종료시 실행 
    const handleEndConcert = async () => {
        exit();
    } */

    return (
        <React.Fragment>
            <Background>
                
                {isDrawReady? 
                role !== ""?
                <div>
                <Header />
                <Container>
                    <BackGroundDiv>
                        <UserDiv>
                            {/* 제시어 role parameter 값 ghost/human -> 역할에 따라 배경색이 변함*/}
                            <MissionWord text={keyword} role={role}></MissionWord>
                            {/* 유저 컴포넌트 */}
                            {
                                //let user_list = location.state.data.user_list,

                                userList.map(
                                    (index, key) => (
                                        console.log('user 길이' + userList.length),
                                        console.log('유저 인덱스 값 ' + userList[key].user_idx),
                                        console.log('순서 : ' + userList[key].game_member_order),
                                        console.log('칼라 : ' + userList[key].user_color),
                                        (
                                            <GameUserCard
                                                user_idx={userList[key].user_idx}
                                                user_color={userList[key].user_color}
                                                user_name={userList[key].user_name}
                                                user_role="ghost"
                                                user_order={userList[key].game_member_order}
                                            ></GameUserCard>
                                        )
                                    )
                                )
                            }
                        </UserDiv>
                        {/* 가운데*/}
                        {
                            //우선 역할부여 텍스트 테스트하고 주석 풀기!! jh
                            seconds === 0 ?
                            <DrawDiv>
                             {myList && <GameDrawing role={role} order={user_order} color={myList.user_color} room_idx={room_idx} idx={save_user_idx} member_count={userList.length}/> }
                            </DrawDiv> 
                            :
                            <GameRoleComponent role={role} timer={seconds} />
                        }
                        <ChatDiv>
                            {/* <Chatting /> */}
                            <Chatting room_idx={room_idx} height="615px" available={false} color={'RED'}></Chatting> 
                        </ChatDiv>
                    </BackGroundDiv>
                </Container> </div> : <Loading/> : <PlayingLoading/>
                }
            </Background>
        </React.Fragment>
    );
};

const Background = styled.div`
    flex-direction: column;
    background-color: #180928;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Container = styled.div`
    width: 1020px;
    height: 620px;
    display: flex;
    flex-direction: row;
    border-bottom-left-radius: 1.5rem;
    border-bottom-right-radius: 1.5rem;
`;

const UserDiv = styled.div`
    text-align: center;
    width: 160px;
    height: 620px;
    border-color: transparent;
    background-color: transparent;
    justify-content: center;
    align-items: center;
`;

const BackGroundDiv = styled.div`
    background-image: url(${day});
    width: 1020px;
    height: 620px;
    flex-direction: row;
    display: flex;
    justify-content: space-between;
`;

const ChatDiv = styled.div`
    margin: 1px;
    width: 220px;
    height: 620px;
    display: flex;
    align-items: center;
`;

const DrawDiv = styled.div`
    width: 640px;
    height: 620px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default PlayingRoom;
