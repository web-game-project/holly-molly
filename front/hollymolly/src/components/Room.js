import React, { useState } from "react";
import RoomGrid from "../components/RoomGrid";
import style from "../styles/styles";
import RoomText from "../components/RoomText";
import RoomGridButton from "../components/RoomGridButton";

const Room = (props) => {
  const [clicked, setClicked] = useState(false); 
  const onClick = () => { setClicked(!clicked); 
  console.log(clicked)}; 

  return (
    <React.Fragment>
      <RoomGridButton onClick={onClick} boxShadow padding="16px" margin="8px" width="234px" height="161px">
        {/* 방 제목 */}
        <RoomGrid is_flex_start border="" boxShadow="" padding="16px" width="198px" height="30px">
          <RoomText bold textShadow="3px 5px 5px #474747" textStroke size="32px" color={style.red}>
            {props.room_info.room_name}
          </RoomText>
        </RoomGrid>
        {/* 방 현재 인원 / 총 인원 */}
        <RoomGrid is_flex_end border="" boxShadow="" padding="16px" width="198px" height="30px">
          <RoomText bold>{props.room_info.room_current_people}/{props.room_info.room_total_people}</RoomText>
        </RoomGrid>
        {/* 방 모드 */}
        <RoomGrid is_flex_end border="" boxShadow="" padding="16px" width="198px" height="30px">
          <RoomText bold>{props.room_info.room_mode}</RoomText>
        </RoomGrid>
        {/* 방 진행중 여부 */}
        <RoomGrid is_flex_end border="" boxShadow="" padding="16px" width="198px" height="30px">
          <RoomText bold textStroke color={style.light_green}>
            {props.room_info.room_progress}
          </RoomText>
        </RoomGrid>

      </RoomGridButton>

      <RoomGridButton disabled onClick={onClick} boxShadow cursor padding="16px" margin="8px" width="234px" height="161px">
        {/* 방 제목 */}
        <RoomGrid is_flex_start border="" boxShadow="" padding="16px" width="198px" height="30px">
          <RoomText bold textShadow="3px 5px 5px #474747" size="32px" color={style.red}>
            {props.room_info.room_name}
          </RoomText>
        </RoomGrid>
          {/* 방 현재 인원 / 총 인원 */}
        <RoomGrid is_flex_end border="" boxShadow="" padding="16px" width="198px" height="30px">
          <RoomText bold>{props.room_info.room_current_people}/{props.room_info.room_total_people}</RoomText>
        </RoomGrid>
        {/* 방 모드 */}
        <RoomGrid is_flex_end border="" boxShadow="" padding="16px" width="198px" height="30px">
          <RoomText bold>{props.room_info.room_mode}</RoomText>
        </RoomGrid>
        {/* 방 진행중 여부 */}
        <RoomGrid is_flex_end border="" boxShadow="" padding="16px" width="198px" height="30px">
          <RoomText bold color={style.light_green}>
            {props.room_info.room_progress}
          </RoomText>
        </RoomGrid>
      </RoomGridButton>

    </React.Fragment>
  );
};
// 컴포넌트 그리는데 꼭 필요한 데이터가 없을 시 나는 오류 방지하기 위해 필요한 데이터 미리 선언
Room.defaultProps = {
  room_info: {
    room_name: "Test",
    room_current_people: "9",
    room_total_people: "9",
    room_mode: "easy mode",
    room_progress: "waiting",
  },
};

export default Room;
