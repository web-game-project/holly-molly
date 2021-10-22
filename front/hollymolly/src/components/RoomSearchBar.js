import React, { useState, useEffect, useRef } from "react";
import RoomGrid from "../components/RoomGrid";
import style from "../styles/styles";
import RoomText from "../components/RoomText";
import axios from 'axios'
 // 소켓 
import { io } from "socket.io-client";

const socket = io("http://3.17.55.178:3002/", {
  // 프론트가 서버와 동일한 도메인에서 제공되지 않는 경우 서버의 URL 전달 필요
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6NywidXNlcl9uYW1lIjoidGVzdCIsImlhdCI6MTYzMjgzMzAxN30.G1ECMSLaD4UpCo6uc-k6VRv7CxXY0LU_I5M2WZPYGug",
  },
}); 

const RoomSearchBar = (props) => {
  const inputRef = useRef();
  const [clicked, setClicked] = useState(false);
  const [waitingRoomMemberList, setWaitingRoomMemberList] = useState();
  
    useEffect(() => {
        // 연결 실패 시, 
        // const socket = io("http://3.17.55.178:3002/", { // 프론트가 서버와 동일한 도메인에서 제공되지 않는 경우 서버의 URL 전달 필요 
        //     auth: {
        //       token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6NywidXNlcl9uYW1lIjoidGVzdCIsImlhdCI6MTYzMjgzMzAxN30.G1ECMSLaD4UpCo6uc-k6VRv7CxXY0LU_I5M2WZPYGug"
        //     }
        //   }); 

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
            // 재연결 시도 
              socket.connect();
            }
        });
    }, [clicked]);


  const enterRoom = async () => {
    const reqURL = "http://3.17.55.178:3002/room/code"; //parameter : 방 타입
    const reqHeaders = {
      'headers': {
          authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6NywidXNlcl9uYW1lIjoidGVzdCIsImlhdCI6MTYzMjgzMzAxN30.G1ECMSLaD4UpCo6uc-k6VRv7CxXY0LU_I5M2WZPYGug',
      }
    }
    
    axios.post(reqURL, {
      room_code: inputRef.current.value // 룸 index
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
    alert("방이름은? " + inputRef.current.value);
  };

  return (
    <React.Fragment>
      <RoomGrid
        is_flex_space
        padding="10px"
        width="410px"
        height="40px"
        border=""
        bg="white"
      >
        <input
          style={styles.input}
          type="text"
          placeholder="입력하세요..."
          ref={inputRef}
        />
        {/* 검색 버튼 */}
        <RoomGrid
          onClick={onClick}
          is_flex_center
          width="160px"
          height="32px"
          border="1px solid white"
          bg="#4D1596"
        >
          <RoomText bold size="15px" color={style.white}>
            코드로 입장하기
          </RoomText>
        </RoomGrid>
      </RoomGrid>
    </React.Fragment>
  );
};

export default RoomSearchBar;

const styles = {
  input: {
    borderColor: style.white,
    border: "1px solid white",
    borderRadius: "1.5rem",
    color: style.black,
    height: "25px",
    width: "250px",
    fontSize: 15,
  },
};