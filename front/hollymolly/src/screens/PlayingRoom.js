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
import { useLocation, useHistory } from 'react-router';
import GameSetImageShow from '../components/GameSetImageShow';

//통신
import axios from 'axios';
//깊은 복제
import * as _ from 'lodash';

import RefreshVerification from '../server/RefreshVerification.js';

import Loading from '../components/Loading';

let userList = [{}];

const PlayingRoom = (props) => {
    let location = useLocation();
    const history = useHistory();

    let room_idx = location.state.room;
    let leaderIdx = location.state.leaderIdx; //리더인지 아닌지 

    let gameIdx = location.state.gameIdx;
    let gameSetIdx = useRef(location.state.gameSetIdx);

    let beforeUserList = location.state.userList;

    let gameSetNo = location.state.gameSetNo;
    ;
    let isSet = location.state.isSet;

    let setBeforeImg = useRef('');
    let setBeforeHumanAnswer = useRef('');
    let setBeforeKeyword = useRef('');

    const [role, setRole] = React.useState('');
    const [keyword, setKeyWord] = React.useState('');

    //게임 시작 5초 후, 타이머
    const [seconds, setSeconds] = useState(5);

    const [playInfo, setPlayInfo] = React.useState(''); //웨이팅룸에서 넘어온 데이터 저장

    const [isDrawReady, setIsDrawReady] = React.useState(true); // 나중에 false로 바꿔놓아야 함
    const [waitSeconds, setWaitSeconds] = useState(-1); // 게임 시작 전 10초 기다리는 타이머,

    const BaseURL = 'http://3.17.55.178:3002/';

    let u = RefreshVerification.verification()
    //console.log('리플시? ' + u); 
    let data, save_token, save_user_idx;
    if(u === true){
        data = localStorage.getItem('token');
        save_token = JSON.parse(data) && JSON.parse(data).access_token;
        save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;
    }
    
    const startSetAPI = async (str) => {
        const restURL = BaseURL + 'game/set';

        //gameSetNo = str;

        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };

        axios
            .post(
                restURL,
                {
                    game_idx: gameIdx,
                    game_set_no: str,
                },
                reqHeaders
            )
            .then(function (response) {
                console.log('game set success');
                //possible.current = true;
            })
            .catch(function (error) {
                alert('set Rest API' + error);
            });
    }

    const getGameMember = async () => {
        //게임 멤버 정보 조회
        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };
        const restURL = BaseURL + 'game/member/' + gameSetIdx.current;

        axios
            .get(restURL, reqHeaders)
            .then(function (response) {
                setRole(response.data.user_role);
                setKeyWord(response.data.keyword);
            })
            .catch(function (error) {
                alert('error 게임멤버정보조회 : ' + error.message);
            });
    }

    useEffect(() => {
        const waitcountdown = setInterval(() => {
            //console.log('waitcountdown 값: ' + parseInt(waitSeconds));

            if (parseInt(waitSeconds) > 0) {
                setWaitSeconds(parseInt(waitSeconds) - 1);
            } else if (parseInt(waitSeconds) === 0) {
                // 10초가 지나도 받지 못하면 네트워크 에러 및 서버에서 강제 퇴장 처리
                if (isDrawReady) {
                    // 받음
                    setWaitSeconds(-1);
                } else {
                    // 못받음
                    console.log('순서 받기 시간 끝');
                    alert('네트워크가 불안정합니다.');
                    window.location.replace('/');

                    setWaitSeconds(-1);
                }
            }
        }, 1000);

        return () => {
            clearInterval(waitcountdown);
        };
    }, [waitSeconds]);

    useEffect(() => {
        if (beforeUserList != null) {
            //데이터 전달 받은게 세팅되기 전까지는 타이머가 돌아가면 안됨.
            const countdown = setInterval(() => {
                if (parseInt(seconds) > 0) {
                    setSeconds(parseInt(seconds) - 1);
                }

                if (parseInt(seconds) === 0) {
                    console.log('역할 부여 초 끝');
                    //그림판 시작 되기 전 다음 순서 준비
                    setIsDrawReady(false);
                    props.socket.emit('send next turn', {
                        room_idx: parseInt(room_idx),
                        user_idx: parseInt(save_user_idx),
                        member_count: userList.length,

                        draw_order: 1,
                    });
                    
                    setWaitSeconds(10); // 10초 기다림

                    setSeconds(-1);
                }
            }, 1000);

            return () => {
                clearInterval(countdown);
            };
        }
    }, [seconds]);


    useEffect(() => {
        props.socket.on('get next turn', (data) => {
            console.log(data.data); // success 메시지
            setIsDrawReady(true);
        });

        //세트 시작 소켓
        props.socket.on('start set', (data) => {
            // alert('세트 소켓 ' + JSON.stringify(data.before_game_set_human_answer));
            userList = data.user_list;
            gameSetIdx.current = data.current_game_set_idx;

            setBeforeImg.current = data.before_game_set_img;
            setBeforeHumanAnswer.current = data.before_game_set_human_answer;
            setBeforeKeyword.current = data.before_game_set_keyword;

            getGameMember();

            //setSeconds(4); // 이전 그림 보여주는 초는 4초!
        });

        // 방 퇴장 
        props.socket.on('exit room', (data) => {
            console.log("퇴장한 사람 : " + data.user_idx);

            var exitPerson = userList.find((x) => x.user_idx === data.user_idx); 

            var exitIndex = userList.findIndex(v => v.user_idx === data.user_idx);
            userList.splice(exitIndex,1);

            if(exitPerson){
                for (let i = 0; i < userList.length; i++) {
                    if(exitPerson.game_member_order < userList[i].game_member_order){
                            userList[i].game_member_order = userList[i].game_member_order - 1;
                    }
                }
            }
        });

        // 비정상 종료 감지 최종 결과 전송
        props.socket.on('get final result', (data) => {
            history.push({
                pathname: '/playingresult/' + room_idx,
                state: { gameSetNo: gameSetNo, gameIdx: gameIdx, leaderIdx: leaderIdx, userList: userList, roomIdx: room_idx, gameSetIdx: gameSetIdx.current, keyword: keyword, role: role, exitData: data, normal: false},
            })
        });   
    }, []);


    useEffect(() => {

        userList = beforeUserList;

        if (gameSetIdx.current !== undefined && isSet === true) {
            if (leaderIdx === save_user_idx) { //리더만 세트시작 api 요청 가능
                if (gameSetNo === 2) { // playingvoteresult에서 하나 증가값으로 준다. 여기 조건문은 그 다음세트 값에 해당.
                    startSetAPI(2); // 세트시작
                    //getGameMember(); // 게임 멤버 정보 조회 api를 통해 역할, 키워드 세팅
                    isSet = 'no'; // 한번 돈 후 요청 안가게! 제어
                }
                else {
                    startSetAPI(3); // 세트시작
                    //getGameMember(); // 게임 멤버 정보 조회 api를 통해 역할, 키워드 세팅
                    isSet = 'no'; // 한번 돈 후 요청 안가게! 제어
                }
            }
        }
        else if (isSet === false) //웨이팅룸에서 넘어왔을 때는 멤버 정보 조회만.
            getGameMember();

    }, []);

    for (let i = 0; i < userList.length; i++) {
        if (userList[i].user_idx === save_user_idx) {
            userList[i].user_role = role;
        } else {
            userList[i].user_role = "ghost";
        }
    }

    for (let i = 0; i < userList.length; i++) {
        userList[i].user_exit = "0";
    }

    // 깊은 복사 
    let onlyUserList = _.cloneDeep(userList); // 내 정보 저장 
    let reOrderList = _.cloneDeep(userList); // 유저 리스트 중 순서 정리를 위한 리스트 

    // 유저 리스트 중 내 정보 배열 및 내 순서 저장
    const myList = onlyUserList.find((x) => x.user_idx === save_user_idx);

    // 정렬시, 유저 리스트에서 본인 인덱스 찾아서 제일 위로 올리기 위해 0으로 바꾸기
    let myIndex = reOrderList.find((x) => x.user_idx === save_user_idx);
    if (myIndex) {
        myIndex.game_member_order = 0;
    }

    // 그림 그리기 순서 대로 유저 리스트 재정렬
    reOrderList.sort(function (a, b) {
        return a.game_member_order - b.game_member_order;
    });

    // 정렬된 리스트 중 본인 인덱스 찾아서 "나" 로 표시
    var myItem = reOrderList.find((x) => x.user_idx === save_user_idx);
    if (myItem) {
        myItem.game_member_order = '나';
    }

    const highOrderFunction = (text) => {
        console.log(text); // 현재 유저 이름 
    }

    // 비정상 종료
    const exit = async () => {
        console.log("playing room exit");
        const restURL = 'http://3.17.55.178:3002/game/exit';

        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };
        axios
            .delete(restURL, reqHeaders)
            .then(function (response) {
                console.log(response);
                window.location.replace('/');
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
            //window.removeEventListener('beforeunload', alertUser)
            //window.removeEventListener('unload', handleEndConcert)
        }  
    }, [])

    // 경고창 
    const alertUser = (e) => {
        e.preventDefault(); // 페이지가 리프레쉬 되는 고유의 브라우저 동작 막기
        e.returnValue = "";
        
        exit();
    };

    // 종료시 실행 
    const handleEndConcert = async () => {
        exit();
    } 

    // 뒤로 가기 감지 시 비정상종료 처리 
    /* useEffect(()=> {
        const unblock = history.block((loc, action) => {
            if (action === 'POP') {
                if(window.confirm('게임방에서 나가게됩니다. 뒤로 가시겠습니까?')){
                    exit();
                    return true
                }else{
                    return false
                }
            }
            return true
        })

        return () => unblock()
        
    },[])  */

    return (
        <React.Fragment>
            <Background>
                {isDrawReady ? (
                    role !== '' && keyword !== '' ? (
                        <div>
                            <Header />
                            <Container>
                                <BackGroundDiv>
                                    <UserDiv>
                                        {/* 제시어 role parameter 값 ghost/human -> 역할에 따라 배경색이 변함*/}
                                        <MissionWord text={keyword} role={role}></MissionWord>
                                        {/* 유저 컴포넌트 */}

                                        {reOrderList.map((index, key) => (
                                            <GameUserCard
                                                user_idx={reOrderList[key].user_idx}
                                                user_color={reOrderList[key].user_color}
                                                user_name={reOrderList[key].user_name}
                                                user_role={reOrderList[key].user_role}
                                                user_order={reOrderList[key].game_member_order}
                                                user_exit={reOrderList[key].user_exit}
                                            ></GameUserCard>
                                        ))}
                                    </UserDiv>

                                    {seconds < 0 ? (
                                        <DrawDiv>
                                            {myList && (
                                                <GameDrawing
                                                    keyword={keyword}
                                                    setIdx={gameSetIdx.current}
                                                    role={role}
                                                    color={myList.user_color}
                                                    room_idx={room_idx}
                                                    idx={save_user_idx}
                                                    member_count={userList.length}
                                                    userList={userList}
                                                    socket={props.socket}
                                                    gameIdx={gameIdx}
                                                    gameSetNo={gameSetNo}
                                                    leaderIdx={leaderIdx}
                                                    currentOrder={highOrderFunction}
                                                />
                                            )}
                                        </DrawDiv>
                                    ) :
                                        gameSetNo === 1 ?
                                            (
                                                <GameRoleComponent role={role} timer={seconds} />
                                            )
                                            : (
                                                gameSetNo === 2 ?
                                                    (
                                                        setBeforeImg.current && <GameSetImageShow setBeforeImg={setBeforeImg.current} setBeforeHumanAnswer={setBeforeHumanAnswer.current} setBeforeKeyword={setBeforeKeyword.current} />
                                                    )
                                                    :
                                                    (
                                                        setBeforeImg.current && <GameSetImageShow setBeforeImg={setBeforeImg.current} setBeforeHumanAnswer={setBeforeHumanAnswer.current} setBeforeKeyword={setBeforeKeyword.current} />
                                                    )
                                            )}


                                    <ChatDiv>
                                        <Chatting socket={props.socket} room_idx={room_idx} height="615px" available={true} color={myList&&myList.user_color}></Chatting>
                                    </ChatDiv>
                                </BackGroundDiv>
                            </Container>
                        </div>
                    ) : (
                        <Loading />
                    )
                ) :
                    (
                        <PlayingLoading txt="게임이 곧 시작됩니다..." />
                    )}
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