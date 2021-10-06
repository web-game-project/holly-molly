import styled from "styled-components";
import React from "react";

const RoomText = (props) => {
  const { bold, color, size, textShadow, children } = props;
  const styles = { bold: bold, color: color, size: size, textShadow: textShadow};
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
  size: "24px",
  textShadow: false
};

const RoomTextP = styled.p`
  color: ${(props) => props.color};
  font-size: ${(props) => props.size};
  font-weight: ${(props) => (props.bold ? "800" : "400")};
  stroke: ${(props) => props.stroke};
  stroke-width: ${(props) => props.strokeWidth};
  text-shadow: ${(props) => props.textShadow};
  -webkit-text-stroke: 1px #000000;
`;

export default RoomText;
