import React, { useState, useEffect } from "react";
import RoomGrid from "../components/RoomGrid";
import style from "../styles/styles";
import RoomText from "../components/RoomText";
import RoomGridDiv from "./RoomGridDiv";
import axios from 'axios'
 // 소켓 
import { io } from "socket.io-client";

const Room = (props) => {
  const [waitingRoomMemberList, setWaitingRoomMemberList] = useState();
  const [clicked, setClicked] = useState(false); 

    useEffect(() => {
        // 연결 실패 시, 
        const socket = io("http://3.17.55.178:3002/", { // 프론트가 서버와 동일한 도메인에서 제공되지 않는 경우 서버의 URL 전달 필요 
            auth: {
              token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6NywidXNlcl9uYW1lIjoidGVzdCIsImlhdCI6MTYzMjgzMzAxN30.G1ECMSLaD4UpCo6uc-k6VRv7CxXY0LU_I5M2WZPYGug"
            }
          }); 

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

          /* socket.on("enter room", (msg) => { // "enter room" 라는 이벤트 받음 
            alert('socket success!')
            console.log("socket success!" + msg.user_idx);
          });  */
          
        });

        // 연결 해제 시 임의 지연 기다린 다음 다시 연결 시도  
        socket.on("disconnect", (reason) => {
            if (reason === "io server disconnect") {
            // the disconnection was initiated by the server, you need to reconnect manually
              socket.connect();
            }
            // else the socket will automatically try to reconnect
        });
    }, [clicked]);


  const enterRoom = async () => {
    alert('대기실 이동 고고 '+ props.room_idx);

    const reqURL = "http://3.17.55.178:3002/room/idx"; //parameter : 방 타입
    const reqHeaders = {
      'headers': {
          authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6NywidXNlcl9uYW1lIjoidGVzdCIsImlhdCI6MTYzMjgzMzAxN30.G1ECMSLaD4UpCo6uc-k6VRv7CxXY0LU_I5M2WZPYGug',
      }
    }
    
    axios.post(reqURL, {
        room_idx: props.room_idx // 룸 index
    }, reqHeaders)
      .then(function (response) { //response로 jwt token 반환
        alert('rest api success!');
        setWaitingRoomMemberList(response.data)
      })
      .catch(function (error) {
        alert(error);
      })
  }

  const onClick = () => { 
    setClicked(!clicked); 
    enterRoom();
    alert("룸 인덱스: " + props.room_idx + " 제목: " + props.room_name + " 현재 인원: " + props.room_current_member + 
    " 총 인원: "+ props.room_start_member + " 모드 : " + props.room_mode + " 현재 상태: "+ props.room_status )
  } 

  return (
    <React.Fragment>
      <RoomGridDiv disabled={props.disabled} onClick={onClick} boxShadow cursor={props.cursor} padding="10px" margin="10px" width="214px" height="125px">
        {/* 방 제목 */}
        <RoomGrid is_flex_start border="" boxShadow="" padding="10px" width="198px" height="25px">
          <RoomText bold textShadow="3px 5px 5px #474747" textStroke={props.textStroke} size="15px" color={style.red}>
            {props.room_name}
          </RoomText>
        </RoomGrid>
        {/* 방 현재 인원 / 총 인원 */}
        <RoomGrid is_flex_end border="" boxShadow="" padding="10px" width="198px" height="25px">
          <RoomText bold>{props.room_current_member}/{props.room_start_member}</RoomText>
        </RoomGrid>
        {/* 방 모드 */}
        <RoomGrid is_flex_end border="" boxShadow="" padding="10px" width="198px" height="25px">
          <RoomText bold>{props.room_mode} mode</RoomText>
        </RoomGrid>
        {/* 방 진행중 여부 */}
        <RoomGrid is_flex_end border="" boxShadow="" padding="10px" width="198px" height="25px">
          <RoomText bold textStroke={props.textStroke} color={style.light_green}>
            {props.room_status}
          </RoomText>
        </RoomGrid>
      </RoomGridDiv>

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
