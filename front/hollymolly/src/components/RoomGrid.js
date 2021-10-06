import React from "react";
import styled from "styled-components";

const RoomGrid = (props) => {
    const { is_flex, width, height, margin, padding, bg, border, boxShadow, children } = props;
  
    const styles = {
        is_flex: is_flex,
        width: width,
        height: height,
        margin: margin,
        padding: padding,
        bg: bg,
        border: border,
        boxShadow: boxShadow
    };
    return (
      <React.Fragment>
        <RoomGridBox {...styles}>{children}</RoomGridBox>
      </React.Fragment>
    );
  };
  
  RoomGrid.defaultProps = {
    chidren: null,
    is_flex: false,
    width: "100%",
    height: "100%",
    padding: false,
    margin: false,
    bg: "opacity: 0.5",
    border: "2px solid white",
    boxShadow: "7px 5px 5px #2D2C2C",
  };
  
  const RoomGridBox = styled.div`
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    box-sizing: border-box;
    ${(props) => (props.padding ? `padding: ${props.padding};` : "")}
    ${(props) => (props.margin ? `margin: ${props.margin};` : "")}
    ${(props) => (props.bg ? `background-color: ${props.bg};` : "")}
    ${(props) =>
      props.is_flex
        ? `display: flex; align-items: center; justify-content: flex-end; `
        : `display: flex; align-items: center; justify-content: flex-start; `}
    border: ${(props) => props.border};
    border-radius: 1.5rem;
    box-shadow: ${(props) => props.boxShadow};
  `;
  
  export default RoomGrid;