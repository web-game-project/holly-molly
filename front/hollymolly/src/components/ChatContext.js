import React from "react";
import styled from "styled-components";

const ChatContext = (props) => {
    const {name, text, color} = props;
    const styles = {
      color: color,
     };

      return (
        <React.Fragment>
              <ChatContextBox {...styles}>{name} : {text}</ChatContextBox>
        </React.Fragment>
      );
  };
  
  ChatContext.defaultProps = {
    chidren: null,
  };

  const ChatContextBox = styled.div`
    width: 200px;
    border-radius: 0.5rem;
    font-size: 15px;
    color: ${(props) => props.color};
    font-family: 'Gowun Dodum';
    display: flex
    margin-bottom: 5px;
    white-space: normal;
    font-weight: bold;
  `;

  export default ChatContext;