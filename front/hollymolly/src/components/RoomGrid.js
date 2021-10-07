import React from "react";
import styled from "styled-components";

const RoomGrid = (props) => {
    const { is_flex_start, is_flex_end, is_flex_center, is_flex_space, width, height, margin, padding, bg, border, boxShadow, borderRadius, onClick, children } = props;
  
    const styles = {
        is_flex_start: is_flex_start,
        is_flex_end: is_flex_end,
        is_flex_center: is_flex_center,
        is_flex_space: is_flex_space,
        width: width,
        height: height,
        margin: margin,
        padding: padding,
        bg: bg,
        border: border,
        boxShadow: boxShadow,
        borderRadius: borderRadius,
        onClick: onClick,
    };
    return (
      <React.Fragment>
        <RoomGridBox {...styles}>{children}</RoomGridBox>
      </React.Fragment>
    );
  };
  
  RoomGrid.defaultProps = {
    chidren: null,
    is_flex_start: false,
    is_flex_end: false,
    is_flex_center: false,
    is_flex_space: false,
    width: "100%",
    height: "100%",
    padding: false,
    margin: false,
    bg: "opacity: 0.5",
    border: "2px solid white",
    boxShadow: false,
    borderRadius: "1.5rem",
    onClick: false,
  };
  
  const RoomGridBox = styled.div`
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    box-sizing: border-box;
    ${(props) => (props.padding ? `padding: ${props.padding};` : "")}
    ${(props) => (props.margin ? `margin: ${props.margin};` : "")}
    ${(props) => (props.bg ? `background-color: ${props.bg};` : "")}
    ${(props) => (props.is_flex_start? `display: flex; align-items: center; justify-content: flex-start;` : "")}
    ${(props) => (props.is_flex_end? `display: flex; align-items: center; justify-content: flex-end;` : "")}
    ${(props) => (props.is_flex_center? `display: flex; align-items: center; justify-content: center;` : "")}
    ${(props) => (props.is_flex_space? `display: flex; align-items: center; justify-content: space-between;` : "")}

   
    border: ${(props) => props.border};
    border-radius: ${(props) => props.borderRadius};
    ${(props) => (props.boxShadow ? `box-shadow: 7px 5px 5px #2D2C2C;` : "")}
    
  `;
  
  export default RoomGrid;