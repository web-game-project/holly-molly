import styled from "styled-components";
import React from "react";
import '../assets/font.css';

const RoomText = (props) => {
  const { bold, color, size, textShadow, textStroke, children } = props;
  const styles = { bold: bold, color: color, size: size, textShadow: textShadow, textStroke: textStroke };
  return (
    <React.Fragment>
      <RoomTextP {...styles}>{children}</RoomTextP>
    </React.Fragment>
  );
};

RoomText.defaultProps = {
  children: null,
  bold: false,
  color: "#222831",
  size: "22px",
  textShadow: false,
  textStroke: "false",
};

const RoomTextP = styled.p`
  color: ${(props) => props.color};
  font-size: ${(props) => props.size};
  font-weight: ${(props) => (props.bold ? "500" : "400")};
  stroke: ${(props) => props.stroke};
  stroke-width: ${(props) => props.strokeWidth};
  text-shadow: ${(props) => props.textShadow};
  ${(props) => (props.textStroke === "true" ? ` -webkit-text-stroke: 1px #000000;` : "")}
  font-family: "Black Han Sans";
`;

export default RoomText;
