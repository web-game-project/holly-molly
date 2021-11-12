import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { io } from 'socket.io-client';
import style from '../styles/styles.js';

import UserCard from '../components/UserCard';

import UserTable from '../components/UserTable.js';
import ModalSetting from '../components/ModalSetting.js';

import Chatting from '../components/Chatting.js';

//function component 사용시:

import { useLocation } from "react-router";
import RefreshVerification from '../server/RefreshVerification.js';

const BaseURL = 'http://3.17.55.178:3002';

//RefreshVerification.verification();

// local storage에 있는지 확인 
let data = localStorage.getItem("token");
let save_token = JSON.parse(data) && JSON.parse(data).access_token;
let save_refresh_token = JSON.parse(data) && JSON.parse(data).refresh_token;
let save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;
let save_user_name = JSON.parse(data) && JSON.parse(data).user_name;

console.log('내 인덱스 : ' + save_user_idx);

// room_idx 변수 
let room_idx = 0;

//1번 토큰 사용
const socket = io(BaseURL, {
    auth: {
        //token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6MSwidXNlcl9uYW1lIjoi7YWM7Iqk7Yq4IiwiaWF0IjoxNjMyODMzMDE3fQ.a_6lMSENV4ss6bKvPw9QvydhyIBdr07GsZhFCW-JdrY',
        //8번
        //token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6OCwidXNlcl9uYW1lIjoidGVzdCIsImlhdCI6MTYzMjgzMzAxN30.Q6DBbNtwXRnhqfA31Z_8hlnXpN6YjN0YQXFEoypO7Mw'
        token: save_token,
    },
});

// 연결 성공 시 시작
socket.on("connect", () => {
    console.log('Waiting connection server -> gameStart');
});

console.log('렌더링완료');

//게임 시작 인원 세는 변수 
let ready_cnt = 0;

//준비 변경 소켓
socket.on("change member ready", (data) => {
    if (data.user_ready === true) {
        ready_cnt += 1;
        console.log('ready 증가, ready 현재값 : ' + ready_cnt);
    }
    else {
        if(ready_cnt != 0)
            ready_cnt -= 1;
        console.log('ready 감소, ready 현재값 : ' + ready_cnt);
    }
    alert('socket user_idx : ' + data.user_idx + ' user_ready : ' + data.user_ready);
});

let changeUserIdx = 0;
let changeUserColor = "BLACK";

socket.on("change member color", (data) => {
    console.log('socket-> index: ' + data.user_idx + ' color: ' + data.user_color);

    changeUserIdx = data.user_idx;
    changeUserColor = data.user_color;
});

// 색깔 배열, 중복 제거한 배열
let uniqueSelectColor = [{}];

const colorArr = [ //칼라이름, 코드값 배열
    { 'color': "RED", 'code': "#FF0000" },
    { 'color': "ORANGE", 'code': "#FF5E00" },
    { 'color': "YELLOW", 'code': "#FFE400" },
    { 'color': "GREEN", 'code': "#1DDB16" },
    { 'color': "BLUE", 'code': "#0B37D3" },
    { 'color': "PURPLE", 'code': "#5F00FF" },
    { 'color': "PINK", 'code': "#FF00DD" },
    { 'color': "GRAY", 'code': "#8C8C8C" },
];

/* const selectColorArr = [ //선택 할 수 있는지 여부 배열, true : 선택가능 
    { 'color': "RED", 'choose': "true" },
    { 'color': "ORANGE", 'choose': "true" },
    { 'color': "YELLOW", 'choose': "true" },
    { 'color': "GREEN", 'choose': "true" },
    { 'color': "BLUE", 'choose': "true" },
    { 'color': "PURPLE", 'choose': "true" },
    { 'color': "PINK", 'choose': "true" },
];
 */
const selectColorArr = [ //선택 할 수 있는지 여부 배열, true : 선택가능 
    { 'color': "RED", 'choose': "true", 'code': "#FF0000" },
    { 'color': "ORANGE", 'choose': "true", 'code': "#FF5E00" },
    { 'color': "YELLOW", 'choose': "true", 'code': "#FFE400" },
    { 'color': "GREEN", 'choose': "true", 'code': "#1DDB16" },
    { 'color': "BLUE", 'choose': "true", 'code': "#0B37D3" },
    { 'color': "PURPLE", 'choose': "true", 'code': "#5F00FF" },
    { 'color': "PINK", 'choose': "true", 'code': "#FF00DD" },
];

export default function WaitingRoom({ match }) {
    let location = useLocation();

    const room_index = match.params.name; // url에 입력해준 방 인덱스
    console.log('방 번호는 ?' + room_index);
    const [roomEnterInfo, setRoomEnterInfo] = useState('');
    const [roomInfo, setRoomInfo] = useState('');

    //사람이 색을 변경해서 클릭했을 때 소켓통신을 실행하기 위한 변수
    const [changeColor, setChangeColor] = React.useState(false);

    //내가 무슨 색을 선택했는지 //지워야하는 주석
    //무슨 색을 선택할 수 있는가
    const [selectColor, setSelectColor] = React.useState([]);

    //내 이전 색이 무엇인지, 서버에서 색깔 지정해준 색도 이 변수에 넣기
    const [previousColor, setPreviousColor] = React.useState('');

    // 개별 색 state
    const [redColor, setRedColor] = React.useState('#FF0000');
    const [orangeColor, setOrangeColor] = React.useState('#FF5E00');
    const [yellowColor, setYellowColor] = React.useState('#FFE400');
    const [greenColor, setGreenColor] = React.useState('#1DDB16');
    const [blueColor, setBlueColor] = React.useState('#0B37D3');
    const [purpleColor, setPurpleColor] = React.useState('#5F00FF');
    const [pinkColor, setPinkColor] = React.useState('#FF00DD');

    //팀원 레디 상태 state
    const [changeReady, setChangeReady] = React.useState(false);

    //방장인가 state
    const [isLeader, setIsLeader] = React.useState(0);

    //방장 상태 state 이 변수가 소켓에서 누적된 카운트 값과 동일해야함.
    const [changeStart, setChangeStart] = React.useState(0);

    useEffect(() => {
        //색깔 변경 시 소켓으로 response 받고 회색박스 처리해주는 코드
        console.log('change 유저 인덱스 : ' + changeUserIdx);

        console.log('이전 값: ' + previousColor);

        let middleSocketArr = [{}];

        selectColorArr.forEach(element => {

            if (element.color === previousColor) {
                console.log('변경된 값 : ' + JSON.stringify(element.color));
                element.choose = "true";
                middleSocketArr.push(element);
            }
        })

        uniqueSelectColor = selectColorArr.concat(middleSocketArr);
        uniqueSelectColor = uniqueSelectColor.filter((item, pos) => selectColorArr.indexOf(item) == pos);

        middleSocketArr = [{}];

        if (changeUserIdx != save_user_idx) {
            uniqueSelectColor.forEach(element => {

                if (element.color === changeUserColor) {
                    console.log('변경된 false : ' + JSON.stringify(element.color));
                    element.choose = "false";
                    middleSocketArr.push(element);
                }
            })

            uniqueSelectColor = uniqueSelectColor.concat(middleSocketArr);
            uniqueSelectColor = uniqueSelectColor.filter((item, pos) => selectColorArr.indexOf(item) == pos);
        }
        /* if (changeUserIdx != save_user_idx) {
            //지금 내 인덱스값과 비교해서 다른 인덱스들한테만 회색박스처리
            if (changeUserColor == 'RED') setRedColor('#8C8C8C');
            else if (changeUserColor == 'ORANGE') setOrangeColor('#8C8C8C');
            else if (changeUserColor == 'YELLOW') setYellowColor('#8C8C8C');
            else if (changeUserColor == 'GREEN') setGreenColor('#8C8C8C');
            else if (changeUserColor == 'BLUE') setBlueColor('#8C8C8C');
            else if (changeUserColor == 'PURPLE') setPurpleColor('#8C8C8C');
            else setPinkColor('#8C8C8C');
        } */
    }, [changeColor]);

    function readyClick(readyStatus) {

        setChangeReady(readyStatus);

        console.log('rest api 호출');

        const restURL = BaseURL + '/waiting-room/user-ready	';

        const reqHeaders = {
            headers: {
                authorization:
                    'Bearer ' + save_token,
            },
        };

        axios
            .patch(
                restURL,
                {
                    room_idx: room_idx, //룸 인덱스 넘버여야함.
                    user_ready: readyStatus,
                },
                reqHeaders
            )
            .then(function (response) {
                alert('rest Start ' + readyStatus);
            })
            .catch(function (error) {
                alert('error Start' + error.message);
            });
    }

    function startClick() {
        alert('click start btn!');

        const restURL = BaseURL + '/game/start';

        const reqHeaders = {
            headers: {
                authorization:
                    'Bearer ' + save_token,
            },
        };

        axios.post(restURL,
            {
                room_idx: room_idx
            },
            reqHeaders
        )
            .then(function (response) { //response로 jwt token 반환
                alert('success! 게임시작');
            })
            .catch(function (error) {
                alert(error);
            })
    }

    function colorClick(str) {
        alert('click: ' + str);

        /* if (previousColor == 'RED') setRedColor('#FF0000');
        else if (previousColor == 'ORANGE') setOrangeColor('#FF5E00');
        else if (previousColor == 'YELLOW') setYellowColor('#FFE400');
        else if (previousColor == 'GREEN') setGreenColor('#1DDB16');
        else if (previousColor == 'BLUE') setBlueColor('#0B37D3');
        else if (previousColor == 'PURPLE') setPurpleColor('#5F00FF');
        else setPinkColor('#FF00DD'); */

        setPreviousColor(selectColor);
        setSelectColor(str);

        const restURL = BaseURL + '/waiting-room/user-color';

        const reqHeaders = {
            headers: {
                authorization:
                    'Bearer ' + save_token,
            },
        };

        axios
            .patch(
                restURL,
                {
                    room_idx: room_idx, //룸 인덱스 변수로 들어가야함.
                    user_color: str, //클릭했을 때 해당 색
                },
                reqHeaders
            )
            .then(function (response) {
                alert('rest ' + response.data);
            })
            .catch(function (error) {
                alert('error ' + error.message);
            });

        setChangeColor(!changeColor); //색이 바꼈다는 상태값 변경
    }

    const getRoomInfo = async () => {
        // 대기실 정보 조회 api
        const restURL = 'http://3.17.55.178:3002/room/info/' + location.state.data.room_idx;

        const reqHeaders = {
            headers: {
                //1번 토큰 이용
                authorization:
                    'Bearer ' + save_token,
            },
        };
        axios
            .get(restURL, reqHeaders)
            .then(function (response) {
                setRoomInfo(response.data);
                console.log('getRoomInfo 성공');
            })
            .catch(function (error) {
                console.log('getRoomInfo 실패');
                console.log(error.response);
            });
    };

    useEffect(() => {
        setRoomEnterInfo(location.state.data);

        //room index 설정
        room_idx = location.state.data.room_idx; //이렇게 받아오면 number타입으로 api, 소켓 에러 X\

        //방장 인덱스 받아오기, save_user_idx 이게 내 인덱스 저장된 변수
        //받아와서 리더인지 아닌지 state 설정
        if (location.state.data.leader_idx === save_user_idx) {
            setIsLeader(1); //리더다
        }

        //내가 들어왔을 때 무슨색인가?
        const currentCnt = location.state.data.room_current_member_cnt - 1; //-1해줘서 내 배열 인덱스 구하기
        const serverColor = location.state.data.waiting_room_member_list[currentCnt].wrm_user_color;
        //선택된 값과 이전색으로 세팅
        setSelectColor(serverColor);
        setPreviousColor(serverColor);

        //내 준비 상태
        setChangeReady(location.state.data.waiting_room_member_list[currentCnt].wrm_user_ready);

        //userlist로 사용자들이 무슨 색을 할당 받았는지 저장하는 배열
        const user_list = location.state.data.waiting_room_member_list;

        const middleSelectArr = [{}];

        for (let i = 0; i < user_list.length; i++) {
            console.log('user color : ' + user_list[i].wrm_user_color);

            const currentColor = user_list[i].wrm_user_color;

            selectColorArr.forEach(element => {

                if (element.color === currentColor) {
                    console.log('변경된 false : ' + JSON.stringify(element.color));
                    element.choose = "false";
                    middleSelectArr.push(element);
                }
            })
        }

        uniqueSelectColor = selectColorArr.concat(middleSelectArr);
        uniqueSelectColor = uniqueSelectColor.filter((item, pos) => selectColorArr.indexOf(item) == pos);

        //게임 시작 인원 받아오기
        setChangeStart(location.state.data.room_start_member_cnt - 1);

        setTimeout(() => getRoomInfo(), 1000); //방 정보 조회 api + 모달창에 뿌리기용
    }, []);

    return (
        <Container>
            {console.log('방장 인덱스 맞지? : ' + isLeader)}
            <SelectDiv>
                selectDiv
                <br />
                <TitleDiv>
                    TitleDiv {match.params.name}번 방
                    <br />
                    <Text>
                        방제 : {roomEnterInfo.room_name} | 방 코드 : {roomEnterInfo.room_code} | 인원:{' '}
                        {roomEnterInfo.room_current_member_cnt} / {roomEnterInfo.room_start_member_cnt} 명
                    </Text>
                    <br />
                    <ModalSetting
                        title={roomInfo.room_name}
                        mode={roomInfo.room_mode}
                        member={roomInfo.room_start_member_cnt}
                        room_private={roomInfo.room_private}
                    />
                </TitleDiv>
                <BarDiv>
                    <BarInnerDiv>
                        {
                            uniqueSelectColor.map((index, key) => (
                                console.log('index 값 ' + uniqueSelectColor[key].code),
                                console.log('예 : ' + index.choose),
                                console.log('노 : ' + uniqueSelectColor[key].code),
                                console.log('셀렉트칼라값: ' + selectColor + ', 인덱스 칼라값 : ' + index.color),
                                selectColor === index.color ?
                                    <BarColorBox
                                        color={uniqueSelectColor[key].code}>
                                        V
                                    </BarColorBox>
                                    :
                                    index.choose === "true" ?
                                        <BarColorBox
                                            data={uniqueSelectColor[key].code}
                                            color={uniqueSelectColor[key].code}
                                            onClick={() => {
                                                colorClick(index.color);
                                            }} />
                                        :
                                        <BarColorBox
                                            data={uniqueSelectColor[key].code}
                                            color="#8C8C8C" />
                            ))}
                    </BarInnerDiv>

                </BarDiv>
                <UserDiv>
                    <UserTable
                        style={{
                            display: 'inline-block',
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                        }}
                    />
                </UserDiv>
            </SelectDiv>
            <RightDiv>
                {/* <Chatting room_idx={location.state.data.room_idx}>
                </Chatting> */}

                <Chatting room_idx={location.state.data.room_idx} height="560px"></Chatting>

                <StartDiv>
                    {isLeader === 0 ? ( //방장 아님
                        console.log(style.red),
                        changeReady === true ?
                            <BtnDiv color="green" onClick={() => {
                                readyClick(!changeReady)
                            }}>Waiting...</BtnDiv> :
                            <BtnDiv onClick={() => {
                                readyClick(!changeReady)
                            }}>Game Ready</BtnDiv>
                    ) :  //방장이다. 
                        (
                            console.log('방장이야'),
                            changeStart === ready_cnt ?
                                <BtnDiv isStart="yes" onClick={startClick}>Game Start</BtnDiv> //게임 시작 api 요청 onclick 달기
                                : <BtnDiv isStart="no">Game Start</BtnDiv>
                        )

                    }
                </StartDiv>
            </RightDiv>
        </Container>
    );
}

const Container = styled.div`
    width: 1020px;
    height: 620px;
    // border: 1px solid #000;
    background-color: ${style.white};
    display: flex;
    flex-direction: row;
    overflow: hidden;
`;

const SelectDiv = styled.div`
    text-align: center;
    width: 800px;
    height: 620px;
    background-color: #ffe5e5;
    justify-content: center;
    align-items: center;
`;

const RightDiv = styled.div`
    width: 220px;
    height: 620px;
    overflow: hidden;
`;

const ChatDiv = styled.div`
    width: 220px;
    height: 560px;
    background-color: #ffe7a8;
    overflow: hidden;
`;

const StartDiv = styled.div`
    width: 220px;
    height: 60px;        
    overflow: hidden;
`;

const BtnDiv = styled.div`
    width: 220px;
    height: 40px;
    margin-top: 10px;
    background-color: #ff0000;
    border-radius: 10px;
    box-shadow: 0px 3px 3px #878787;
    font-size: 25px;
    text-align: center;
    ${(props) =>
        props.color == 'green'
            ? `background-color: #44A024;`
            : ``}
     ${(props) =>
        props.isStart == 'yes'
            ? ``
            : `opacity: 0.5;`}
`;
const TitleDiv = styled.div`
    width: 625px;
    height: 70px;
    margin-top: 25px;
    background-color: #ffffff;
    text-align: center;
    display: inline-block;
    overflow: hidden;
`;

const UserDiv = styled.div`
    width: 590px;
    height: 390px;
    margin-top: 10px;
    background-color: #fff3ca;
    display: inline-block;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    text-align: center;
`;

const BarDiv = styled.div`
    width: 450px;
    height: 35px;
    //background-color: #6880fb;
    display: inline-block;
    overflow: hidden;
`;

const BarInnerDiv = styled.div`
    width: 420px;
    height: 29px;
    background-size: contain;
    margin-left: 15px;
    margin-top: 3px;
    //border-width:1;
    //border-style: solid;
    display: flex;
    flex-direction: row;
    border-radius: 30px;
    box-shadow: 0px 4px 4px #878787;
`;

const BarColorBox = styled.div`
    width: 70px;
    height: 29px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 2px solid #000000;
    disabled: true;

    ${(props) =>
        props.color == "#FF0000" || props.data == "#FF0000"
            ? `background-color: ${props.color}; border-top-left-radius: 15px; border-bottom-left-radius: 15px;`
            : props.color == "#FF00DD" || props.data == "#FF00DD"
                ? `background-color: ${props.color}; border-right: 0px solid #000000; border-top-right-radius: 15px; border-bottom-right-radius: 15px;`
                : `background-color: ${props.color};`}         
`;

const Text = styled.text`
    color: #c11b1b;
    font-size: 12px;
    font-weight: light;
    // -webkit-text-stroke: 1px #c00202;
    margin-top: -5px;
`;
