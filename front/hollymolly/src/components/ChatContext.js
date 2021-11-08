import React from "react";
import styled from "styled-components";

const ChatContext = (props) => {
    const {name, text, color, children} = props;
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
    width: 220px;
    background-color: #B0B0B0;
    border-radius: 0.5rem;
    font-size: 15px;
    color: ${(props) => props.color};
    font-family: 'Gowun Dodum';
    font-weight: bold;
    display: flex
    flex-flow: row wrap;
    margin-bottom: 5px;
    white-space: pre;
   
  `;

  export default ChatContext;