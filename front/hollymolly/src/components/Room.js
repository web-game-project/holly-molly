import React, { useState } from "react";
import RoomGrid from "../components/RoomGrid";
import style from "../styles/styles";
import RoomText from "../components/RoomText";
import RoomGridDiv from "./RoomGridDiv";

const Room = (props) => {
  const [clicked, setClicked] = useState(false); 
  const onClick = () => { 
    setClicked(!clicked); 
    alert("제목: " + props.room_name + " 현재 인원: " + props.room_current_people + 
    " 총 인원: "+ props.room_total_people + " 모드 : " + props.room_mode + " 현재 상태: "+ props.room_status )
  } 

  return (
    <React.Fragment>
      <RoomGridDiv disabled={props.disabled} onClick={onClick} boxShadow cursor={props.cursor} padding="10px" margin="10px" width="214px" height="125px">
        {/* 방 제목 */}
        <RoomGrid is_flex_start border="" boxShadow="" padding="10px" width="198px" height="25px">
          <RoomText bold textShadow="3px 5px 5px #474747" textStroke={props.textStroke} size="30px" color={style.red}>
            {props.room_name}
          </RoomText>
        </RoomGrid>
        {/* 방 현재 인원 / 총 인원 */}
        <RoomGrid is_flex_end border="" boxShadow="" padding="10px" width="198px" height="25px">
          <RoomText bold>{props.room_current_people}/{props.room_total_people}</RoomText>
        </RoomGrid>
        {/* 방 모드 */}
        <RoomGrid is_flex_end border="" boxShadow="" padding="10px" width="198px" height="25px">
          <RoomText bold>{props.room_mode}</RoomText>
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
    room_name: "Test",
    room_current_people: "9",
    room_total_people: "9",
    room_mode: "easy mode",
    room_status: "waiting",
};

export default Room;
