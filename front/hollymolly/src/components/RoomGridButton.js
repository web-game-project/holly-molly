import React from "react";
import styled from "styled-components";

const RoomGridButton = (props) => {
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
        <RoomGridButtonBox {...styles}>{children}</RoomGridButtonBox>
      </React.Fragment>
    );
  };
  
  RoomGridButton.defaultProps = {
    chidren: null,
    is_flex: false,
    width: "100%",
    height: "100%",
    padding: false,
    margin: false,
    bg: "white",
    border: "white",
    boxShadow: false,
    cursor: false,
    onClick: false,
    disabled: false
  };
  
  const RoomGridButtonBox  = styled.button`    
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
  ${(props) => props.cursor? `cursor: not-allowed; `: `cursor: grab; `}
  ${(props) => props.disabled? `background-color: rgba(0, 0, 0, 0.7); opacity: 0.7;` : `&:hover {box-shadow: 5px 5px 5px yellow}`}
  
`;

  
  export default RoomGridButton;