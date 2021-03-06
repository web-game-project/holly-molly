import React from "react";
import styled from "styled-components";

const MissionWord = (props) => {
   
    const {text, role} = props;
    
      return (
        <React.Fragment>
          {role === "ghost" ? 
              <GhostMissionWordBox >{text}</GhostMissionWordBox> : 
              <HumanMissionWordBox >{text}</HumanMissionWordBox> 
          }
        </React.Fragment>
      );
  };
  
  MissionWord.defaultProps = {
    chidren: null,
    backgroundColor: "#00ff00"
  };

  const GhostMissionWordBox = styled.div`
    text-align: center;
    font-family: "Gowun Dodum";
    font-size: 25px;
    width: 150px;
    height: 85px;
    margin-bottom: 5px;
    color: white; 
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.5rem;
    background: linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%);
    border: 5px solid #FFBBC5;
  `;

  const HumanMissionWordBox = styled.div`
    text-align: center;
    font-family: "Gowun Dodum";
    font-size: 25px;
    width: 150px;
    height: 85px;
    color: white; 
    margin-bottom: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.5rem;
    background: linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%);
    border: 5px solid #FFBBC5;
  `;

  export default MissionWord;
