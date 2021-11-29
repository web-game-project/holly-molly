import React, { useState, useEffect } from "react";
import RoomGrid from "../components/RoomGrid";
import style from "../styles/styles";
import RoomText from "../components/RoomText";
import RoomGridDiv from "./RoomGridDiv";
import axios from "axios";
import styled from "styled-components";
import {useHistory} from "react-router";
// 소켓
import { io } from "socket.io-client";

import RefreshVerification from '../server/RefreshVerification';
//RefreshVerification.verification();

// local storage에 있는지 확인 
let data = localStorage.getItem("token");
let save_token = JSON.parse(data) && JSON.parse(data).access_token;
let save_refresh_token = JSON.parse(data) && JSON.parse(data).refresh_token;
let save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;
let save_user_name = JSON.parse(data) && JSON.parse(data).user_name;

const socket = io("http://3.17.55.178:3002/", {
  // 프론트가 서버와 동일한 도메인에서 제공되지 않는 경우 서버의 URL 전달 필요
  auth: {
    // 1번 토큰
    token: save_token
  },
});

const Room = (props) => {
  const history = useHistory();
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    // 오류 시, 수동으로 다시 연결 시도
    socket.on("error", () => {
      setTimeout(() => {
        socket.connect();
      }, 1000);
    });

    // 소켓이 서버에 연결되어 있는지 여부
    // 연결 성공 시 시작
    socket.on("connect", () => {
      console.log("room connection server");
    });

    // 연결 해제 시 임의 지연 기다린 다음 다시 연결 시도
    socket.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        socket.connect();
      }
    });
  }, [clicked]);

  const enterRoom = async () => {
    const reqURL = "http://3.17.55.178:3002/room/idx"; //parameter : 방 타입
    const reqHeaders = {
      headers: {
        authorization: 'Bearer ' + save_token,
      },
    };

    axios
      .post(
        reqURL,
        {
          room_idx: props.room_idx, // 룸 index
        },
        reqHeaders
      )
      .then(function (response) {
        //response로 jwt token 반환
        
        history.push({
          pathname: "/waitingroom/" + response.data.room_idx,
          state: {data: response.data}
        })
        
      })
      .catch(function (error) {
        alert(error.response.data.message);
      });
  };

  const onClick = () => {
    if(props.disabled === "false"){
      setClicked(!clicked);
      enterRoom();
    }
  }

  return (
    <React.Fragment>
      {props.empty !== "true" ? (
        <RoomGridDiv
          disabled={props.disabled}
          onClick={onClick}
          boxShadow
          cursor={props.cursor}
          padding="10px"
          margin="10px"
          width="320px"
          height="115px"
        >
          {/* 방 제목 */}
          <RoomGrid
            is_flex_start
            border=""
            boxShadow=""
            padding="15px"
            width="300px"
            height="25px"
          >
            <RoomText bold size="20px" color="#FF2222">
              {props.room_name}
            </RoomText>
          </RoomGrid>
          {/* 방 모드  방 현재 인원 / 총 인원 */}
          <RoomGrid
            is_flex_space
            border=""
            boxShadow=""
            padding="15px"
            width="300px"
            height="25px"
          >
            {props.room_mode === "easy" && (
              <RoomText bold textStroke={props.textStroke} color={style.white}>
                Easy Mode
              </RoomText>
            )}
            {props.room_mode === "hard" && (
              <RoomText bold textStroke={props.textStroke} color={style.white}>
                Hard Mode
              </RoomText>
            )}
            <RoomGrid
              is_flex_end
              border=""
              boxShadow=""
              width="100px"
              height="25px"
            >
              <RoomText bold textStroke={props.textStroke} color="#FFE400">
                {" "}
                {props.room_current_member}/{props.room_start_member}&nbsp;
              </RoomText>
              👻
            </RoomGrid>
          </RoomGrid>
          {/* 방 진행중 여부 */}
          <RoomGrid
            is_flex_end
            border=""
            boxShadow=""
            padding="15px"
            width="300px"
            height="25px"
          >
            {props.room_status === "waiting" && (
              <RoomText
                bold
                size="24px"
                textStroke={props.textStroke}
                color={style.light_green}
              >
                WAITING
              </RoomText>
            )}
            {props.room_status === "playing" && (
              <RoomText
                bold
                size="24px"
                textStroke={props.textStroke}
                color="#FF7B89"
              >
                PLAYING
              </RoomText>
            )}
          </RoomGrid>
        </RoomGridDiv>
      ) : (
        <RoomGrid
          boxShadow
          bg="#ffffff"
          padding="10px"
          margin="10px"
          width="320px"
          height="115px"
        >
          <RoomGrid is_flex_start border="" boxShadow="" padding="10px" margin="5px" width="280px" height="25px" bg="#eeeeee"></RoomGrid>
          <RoomGrid is_flex_space border="" boxShadow="" margin="5px" width="280px" height="25px" >       
            <RoomGrid is_flex_end border="" boxShadow="" width="140px" height="25px" bg="#eeeeee"></RoomGrid>
            <RoomGrid is_flex_end border="" boxShadow="" width="100px" height="25px" bg="#eeeeee"></RoomGrid>
          </RoomGrid>
          <RoomGrid is_flex_end border="" boxShadow="" margin="5px" width="280px" height="25px" >       
            <RoomGrid is_flex_end border="" boxShadow="" width="120px" height="25px" bg="#eeeeee"></RoomGrid>
          </RoomGrid>
        </RoomGrid>
      )}
    </React.Fragment>
  );
};
// 컴포넌트 그리는데 꼭 필요한 데이터가 없을 시 나는 오류 방지하기 위해 필요한 데이터 미리 선언
Room.defaultProps = {
  room_idx: "9999",
  room_name: "Test",
  room_current_member: "9",
  room_start_member: "9",
  room_mode: "easy mode",
  room_status: "waiting",
};

export default Room;
