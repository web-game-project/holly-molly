import React from "react";
import styled from "styled-components";

const MissionWord = (props) => {
    const {text, color, children} = props;
    const styles = {
      color: color,
     };

      return (
        <React.Fragment>
              <MissionWordBox {...styles}>{text}</MissionWordBox>
        </React.Fragment>
      );
  };
  
  MissionWord.defaultProps = {
    chidren: null,
  };

  const MissionWordBox = styled.div`
    text-align: center;
    font-family: "Black Han Sans";
    font-size: 30px;
    width: 160px;
    height: 85px;
    margin-bottom: 4px;
    background-color: #00ff00; 
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  export default MissionWord;