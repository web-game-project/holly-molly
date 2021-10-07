import React from "react";
import styled from "styled-components";

const RoomDiv = (props) => {
    const { is_flex, width, height, margin, padding, bg, border, boxShadow, borderRadius, children } = props;
  
    const styles = {
        is_flex: is_flex,
        width: width,
        height: height,
        margin: margin,
        padding: padding,
        bg: bg,
        border: border,
        boxShadow: boxShadow,
        borderRadius: borderRadius
    };
    return (
      <React.Fragment>
        <RoomDivBox {...styles}>{children}</RoomDivBox>
      </React.Fragment>
    );
  };
  
  RoomDiv.defaultProps = {
    chidren: null,
    is_flex: false,
    width: "100%",
    height: "100%",
    padding: false,
    margin: false,
    bg: "white",
    border: "2px solid white",
    borderRadius: "1.5rem"
  };
  
  const RoomDivBox = styled.div`
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    box-sizing: border-box;
    ${(props) => (props.padding ? `padding: ${props.padding};` : "")}
    ${(props) => (props.margin ? `margin: ${props.margin};` : "")}
    ${(props) => (props.bg ? `background-color: ${props.bg};` : "")}
    ${(props) => props.is_flex
        ? `display: flex; align-items: center; justify-content: flex-end; `
        : `display: flex; align-items: center; justify-content: flex-start; `}
    border: ${(props) => props.border};
    border-radius: ${(props) => props.borderRadius};

  `;
  
  export default RoomDiv;