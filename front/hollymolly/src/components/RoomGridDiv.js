import React from "react";
import styled from "styled-components";

const RoomGridDiv = (props) => {
    const { is_flex, width, height, margin, padding, bg, border, boxShadow, cursor, onClick, disabled, children } = props;
  
    const styles = {
        is_flex: is_flex,
        width: width,
        height: height,
        margin: margin,
        padding: padding,
        bg: bg,
        border: border,
        boxShadow: boxShadow,
        cursor: cursor,
        onClick: onClick,
        disabled: disabled

    };
    return (
      <React.Fragment>
        <RoomGridDivBox {...styles}>{children}</RoomGridDivBox>
      </React.Fragment>
    );
  };
  
  RoomGridDiv.defaultProps = {
    chidren: null,
    is_flex: false,
    width: "100%",
    height: "100%",
    padding: false,
    margin: false,
    bg: "white",
    border: "white",
    boxShadow: false,
    cursor: "true",
    onClick: false,
    disabled: "false"
  };
  
  const RoomGridDivBox  = styled.div`    
  position: relative;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  box-sizing: border-box;
  ${(props) => (props.padding ? `padding: ${props.padding};` : "")}
  ${(props) => (props.margin ? `margin: ${props.margin};` : "")}
  ${(props) => (props.bg ? `background-color: ${props.bg};` : "")}
  ${(props) =>
    props.is_flex
      ? `display: flex; align-items: center; justify-content: flex-end; `
      : ``}
  border-radius: 1.5rem;
  ${(props) => (props.boxShadow ? `box-shadow: 7px 5px 5px #2D2C2C;` : "")}
  border: white;
  ${(props) => props.cursor === "true" ? `cursor: grab; `: `cursor: not-allowed; `} 
 
  ${(props) => props.disabled === "true"? `opacity: 0.7;` : `&:hover {background-color: #CFCFCF}`}
  
`;

  
  export default RoomGridDiv;