import React from "react";
import styled from "styled-components";

const MissionWord = (props) => {
   
    const {text, role, children} = props;
    

    let forColor = "#FFFFFF"
    if(role === 'human'){
      forColor = "#FF0026"
    }

    const styles = {
      color: forColor,
    };

      return (
        <React.Fragment>
              <MissionWordBox {...styles}>{text}</MissionWordBox>
        </React.Fragment>
      );
  };
  
  MissionWord.defaultProps = {
    chidren: null,
    backgroundColor: "#00ff00"
  };

  const MissionWordBox = styled.div`
    text-align: center;
    font-family: "Black Han Sans";
    font-size: 25px;
    width: 150px;
    height: 85px;
    margin-bottom: 5px;
    color: ${(props) => (props.color)}; 
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.5rem;
    background: linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%);
    border: 5px solid #FFBBC5;
  `;

  export default MissionWord;