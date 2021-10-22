import React from "react";
import styled from "styled-components";

const ChatContext = (props) => {
    const {name, text, color, children} = props;
    

    const styles = {
      color: color,
     };

    const nameLength = props.name.length * 16;
    console.log(nameLength);

    

      return (
        <React.Fragment>
          <Container>
              <ChatContextBox {...styles}><ChatUserNameBox style={{color : color, width : nameLength}}>{name}:</ChatUserNameBox> {text}</ChatContextBox>
          </Container>
        </React.Fragment>
      );
  };
  
  ChatContext.defaultProps = {
    chidren: null,
  };

  const Container = styled.div`
    width: 220px;
    height: 20px; 
    margin-bottom: 5px;
    display: flex; 
    align-items: center; 
    justify-content: flex-start;
  `;

  const ChatUserNameBox = styled.div`
    width: 220px;
    height: 20px;    
    background-color: #B0B0B0;
    border-radius: 0.5rem;
    color: ${(props) => props.color};
    font-size: 15px;
  `;

  const ChatContextBox = styled.div`
    width: 220px;
    height: 20px;    
    background-color: #B0B0B0;
    border-radius: 0.5rem;
    font-size: 15px;
    display: flex; 
    align-items: flex-start; 
    justify-content: flex-start;
    flex-direction: row;
  `;

  export default ChatContext;