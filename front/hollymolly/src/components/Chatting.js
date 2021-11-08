import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import ChatContext from '../components/ChatContext';

const socket = io('http://3.17.55.178:3002/', {
    // 프론트가 서버와 동일한 도메인에서 제공되지 않는 경우 서버의 URL 전달 필요
    auth: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6NiwidXNlcl9uYW1lIjoidGVzdCIsImlhdCI6MTYzMjgzMzAxN30.ZnrUNSkD92PD-UV2z2DV4w5lbC2bXIn8GYu05sMb2FQ',
    },
});

socket.on('connect', () => {
    console.log('chatting connection server');
});

const Chatting = (props) => {
    // 입력된 유저 색깔 
    const [userColor, setUserColor] = useState('white');
    
    // 입력된 채팅 메시지 상태 값
    const [inputMessage, setInputMessage] = useState('');

    // 입력된 채팅 메시지 서버에 보내는 상태 값 
    const [emitMessage, setEmitMessage] = useState(false);

    // 로컬의 입장에서 계속 전체 값이 바뀌는 것이기에 내용 전체가 다시 렌더링 되는 것을 막기 위해 상태값을 두 종류로 나누어 관리

    // 하나는 기존의 채팅 내용을 담아두고 UI와 직접 연결되는 상태값
    const [chatMonitor, setChatMonitor] = useState([]);

    // 서버에서 메시지 받았을 때 변경되는 상태값 
    const [onMessage, setOnMessage] = useState(false);

    // 나머지 하나는 서버에서 받은 갱신된(새로 추가된) 내용을 받는 상태값
    const [recentChat, setRecentChat] = useState("");

    // 서버에서 받은 갱신된(새로 추가된) 유저 이름을 받는 상태값
    const [recentChatUserName, setRecentChatUserName] = useState('');

    // 서버에서 받은 갱신된(새로 추가된) 유저 인덱스 받는 상태값
    const [recentChatUserIdx, setRecentChatUserIdx] = useState('');

    // 입력값을 저장하는 상태값
    const handleInput = (e) => {
        setInputMessage(e.target.value);
    };

    // 엔터 시, 입력값을 서버로 보내는 함수
    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            if (inputMessage.length > 0) {
                let room_idx = 53;
                let user_idx = 6;
                let user_name = "test";
                let msg = inputMessage;

                let getMsgInfo = {
                    room_idx: room_idx,
                    user_idx: user_idx,
                    user_name: user_name,
                    msg: msg
                }

                socket.emit("chat", getMsgInfo);

                setEmitMessage(!emitMessage);
                setInputMessage('');
            }
            
        }
    };

    // 전송 버튼 클릭 시, 입력값을 서버로 보내는 함수
    const handleSubmit = () => {
        if (inputMessage.length > 0) {
            alert(inputMessage);
            let room_idx = 53;
            let user_idx = 6;
            let user_name = "test";
            let msg = inputMessage;

            let sendMsgInfo = {
                room_idx: room_idx,
                user_idx: user_idx,
                user_name: user_name,
                msg: msg
            }

            socket.emit("chat", sendMsgInfo);

            setInputMessage('');
            setEmitMessage(!emitMessage);
        }
    };

    // 서버에서 받은 입력값을 로컬 상태값으로 갱신하는 함수(바로 밑의 함수로 연결된다)

    useEffect(() => {
        socket.on("chat", (data) => {

            setRecentChatUserIdx(data.user_idx);
            setRecentChatUserName(data.user_name);
            setRecentChat(data.msg);
        
            setOnMessage(true);

        });

    }, []);

    // 서버에서 갱신된 내용(recentChat)을 받았을 때 로컬 채팅창에 추가하는 함수
    useEffect(() => {
        recentChat.length > 0 && setChatMonitor([...chatMonitor, {recentChat, recentChatUserName}]);  
        
        setRecentChat('');
        
        // 채팅값 초기화 : 이렇게 설정하지 않으면 같은 채팅이 반복됐을 때 이 함수가 반응하지 않는다.
    }, [recentChat]);

//   // 스크롤을 하단으로 이동시키는 함수
//   const scrollToBottom = () => {
//     document.getElementById('chatMonitor').scrollBy({ top: 100 });
//   };

//   // 이때 async, await 구문을 활용해서 아래 함수가 채팅방이 갱신되고 나서 실행되도록 설정하는 것이다
//   useEffect( () => {
//     const scrollUpdate = async () => {
//       (await recentChat.content?.length) > 0 &&
//         setChatMonitor([...chatMonitor, recentChat]);
      
//       // await 밑에 스크롤 함수가 위치되어야 한다
//       scrollToBottom();
//       setRecentChat('');
//     };

//     scrollUpdate();
//   }, [recentChat]);
  

  return (
    <React.Fragment>
        <BodyDiv>
            <Container>
                <ChatContainer>
                    
                    {/* 18개부터 스크롤 생김 */}
                    {chatMonitor.map((values, index) => {          
                        return (<ChatContext key={index} name={values.recentChatUserName} color={userColor} text={values.recentChat}></ChatContext>);
                    })}
                    
                </ChatContainer>
                <InputMsgContainer>
                    <InputMsg
                        type="text"
                        placeholder="채팅 사용 가능 😊"
                        value={inputMessage}
                        onChange={handleInput}
                        onKeyPress={handleEnter}
                    ></InputMsg>{' '}
                    {/* 채팅 사용 불가 😧*/}
                    <InputMsgBtn onClick={handleSubmit}>🚀</InputMsgBtn>
                </InputMsgContainer>
            </Container>
        </BodyDiv>
    </React.Fragment>
);
};

const BodyDiv = styled.div`
    border: 1px solid blue;
    width: 1020px;
    height: 620px;
    margin: 20px; // 삭제할거임
`;

const Container = styled.div`
    width: 220px;
    height: 620px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    color: white;
`;

const ChatContainer = styled.div`
    width: 220px;
    height: 520px;
    padding: 10px;
    margin-bottom: 20px;
    background-color: #b0b0b0;
    border-radius: 0.5rem;
    overflow: auto;
`;

const InputMsgContainer = styled.div`
    width: 220px;
    height: 80px;
    padding: 10px;
    background-color: #b0b0b0;
    border-radius: 0.5rem;
    display: flex;
    justify-content: space-between;
`;

const InputMsg = styled.textarea`
    width: 180px;
    height: 60px;
    padding: 10px;
    background-color: #797979;
    border-radius: 0.5rem;
    margin-right: 7px;
    border: none;
    outline: none !important;

    ::placeholder {
        color: white;
        font-weight: bold;
    }
    color: white;
`;

const InputMsgBtn = styled.div`
    width: 40px;
    height: 80px;
    background-color: #797979;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
`;

export default Chatting;