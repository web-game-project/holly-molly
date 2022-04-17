import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatContext from '../components/ChatContext';
import style from '../styles/styles';

const Chatting = (props) => { 

    const [recentChatColor, setRecentChatColor] = useState(); // 기본 화이트 색
    
    // 입력된 채팅 메시지 상태 값
    const [inputMessage, setInputMessage] = useState('');

    // 입력된 채팅 메시지 서버에 보내는 상태 값 
    const [emitMessage, setEmitMessage] = useState(false);

    // 로컬의 입장에서 계속 전체 값이 바뀌는 것이기에 내용 전체가 다시 렌더링 되는 것을 막기 위해 상태값을 두 종류로 나누어 관리

    // 하나는 기존의 채팅 내용을 담아두고 UI와 직접 연결되는 상태값
    const [chatMonitor, setChatMonitor] = useState(props.chats);

    // 서버에서 메시지 받았을 때 변경되는 상태값 
    const [onMessage, setOnMessage] = useState(false);

    // 나머지 하나는 서버에서 받은 갱신된(새로 추가된) 내용을 받는 상태값
    const [recentChat, setRecentChat] = useState("");

    // 서버에서 받은 갱신된(새로 추가된) 유저 이름을 받는 상태값
    const [recentChatUserName, setRecentChatUserName] = useState('');

    // 서버에서 받은 갱신된(새로 추가된) 유저 인덱스 받는 상태값
    const [recentChatUserIdx, setRecentChatUserIdx] = useState('');

    

    // 지정 색 코드로 바꿔주기 
    let user_color = props.color; 
    
    if(user_color === 'RED'){
        user_color = style.red_bg;
    }else if(user_color === 'ORANGE'){
        user_color = style.orange_bg;
    }else if(user_color === 'YELLOW'){
        user_color = style.yellow_bg;
    }else if(user_color === 'GREEN'){
        user_color = style.green_bg;
    }else if(user_color === 'BLUE'){
        user_color = style.blue_bg;
    }else if(user_color === 'PINK'){
        user_color = style.pink_bg;
    }else if(user_color === 'WHITE'){
        user_color = '#FFFFFF'
    }else{
        user_color = style.purple_bg;
    }

    // 입력값을 저장하는 상태값
    const handleInput = (e) => {
        let textValue = e.target.value.replace(/^\s*/, "");
        setInputMessage(textValue);
    };

    // 엔터 시, 입력값을 서버로 보내는 함수
    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            if (inputMessage.length > 0) {
                let msg = inputMessage;

                let getMsgInfo = {
                    user_color: user_color,
                    msg: msg
                }

                props.socket.emit("chat", getMsgInfo);

                setEmitMessage(!emitMessage);
                setInputMessage('');
            }
            
        }
    };

    // 전송 버튼 클릭 시, 입력값을 서버로 보내는 함수
    const handleSubmit = () => {
        if (inputMessage.length > 0) {
            let msg = inputMessage;

            let sendMsgInfo = {
                user_color: user_color,
                msg: msg
            }

            props.socket.emit("chat", sendMsgInfo);

            setInputMessage('');
            setEmitMessage(!emitMessage);
        }
    };

    // 서버에서 받은 입력값을 로컬 상태값으로 갱신하는 함수(바로 밑의 함수로 연결된다)

    useEffect(() => {
        props.socket.on('connect', () => {
            //console.log('chatting connection server');
        });
        
        props.socket.on("chat", (data) => {
            setRecentChatColor(data.user_color);
            setRecentChatUserName(data.user_name);
            setRecentChat(data.msg);
            setRecentChatUserIdx(data.user_idx);

            setOnMessage(true);

        });

        props.socket.on('exit room', (data) => {
            if(data.user_name !== undefined){
                let msg = data.user_name + " 님이 퇴장하셨습니다."

                setRecentChatColor('#fff');
                setRecentChatUserName('📢 관리자');
                setRecentChat(msg);
                setRecentChatUserIdx('00');

                setOnMessage(true);
            }else{
                let msg = data.user_idx + " 님이 퇴장하셨습니다."

                setRecentChatColor('#fff');
                setRecentChatUserName('📢 관리자');
                setRecentChat(msg);
                setRecentChatUserIdx('00');

                setOnMessage(true);
            }
            
        });

    }, []);

    // 스크롤을 하단으로 이동시키는 함수
    const scrollToBottom = () => {
        document.getElementById('chatMonitor').scrollBy({ top: 100 });
    };

    // 갱신 후, 스크롤을 하단으로 이동시키기 위해, async, await 구문을 활용해서 아래 함수가 채팅방이 갱신되고 나서 실행되도록 설정
    useEffect( () => {
        const scrollUpdate = async () => {
        // 새로운 채팅 내용 갱신 
        (await recentChat.length) > 0 && setChatMonitor([...chatMonitor, {recentChat, recentChatUserName, recentChatColor}]); 
        
        // await 밑에 스크롤 함수 위치
        scrollToBottom();
        setRecentChat('');
        };

        console.log(chatMonitor);

        scrollUpdate();
    }, [recentChat]);

  return (
    <React.Fragment>
            <Container style={{height : props.height}}>
                <ChatContainer id="chatMonitor">
                    {/* 18개부터 스크롤 생김 */}
                    {chatMonitor.map((values, index) => {          
                        return (<ChatContext key={index} name={values.recentChatUserName} color={values.recentChatColor} text={values.recentChat}></ChatContext>);
                    })}
                </ChatContainer>
                <InputMsgContainer>
                {props.available?
                    <InputMsg
                        type="text"
                        placeholder="채팅 사용 가능 😊"
                        value={inputMessage}
                        onChange={handleInput}
                        onKeyPress={handleEnter}
                    ></InputMsg> :
                    <InputMsg
                        type="text"
                        placeholder="채팅 사용 불가 😧"
                        value={inputMessage}
                        onChange={handleInput}
                        onKeyPress={handleEnter}
                        disabled={true}
                    ></InputMsg>

                }
                    <InputMsgBtn onClick={handleSubmit}>🚀</InputMsgBtn>
                </InputMsgContainer>
            </Container>
    </React.Fragment>
);
};

const Container = styled.div`
    font-family: Gowun Dodum;
    width: 220px;
    height: 620px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    color: white;
    opacity: 1.5;
    font-weight: bold;
`;

const ChatContainer = styled.div`
    font-family: Gowun Dodum;
    width: 200px;
    height: 520px;
    padding: 10px;
    margin-bottom: 20px;
    background-color: rgba( 0, 0, 0, 0.5 );
    border-radius: 0.5rem;
    // overflow-y: scroll;
    // overflow-x:hidden;
    overflow: auto;
    &::-webkit-scrollbar {
        /* 세로 스크롤 넓이 */
        width: 10px;

        /* 가로 스크롤 높이 */
        height: 10px;

        border-radius: 6px;
        background: rgba(255, 255, 255, 0.4);
    }
    &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 6px;
    }
`;

const InputMsgContainer = styled.div`
    font-family: Gowun Dodum;
    width: 200px;
    height: 80px;
    padding: 10px;
    background-color: rgba( 0, 0, 0, 0.5 );
    border-radius: 0.5rem;
    display: flex;
    justify-content: space-between;
    font-weight: bold;
`;

const InputMsg = styled.textarea`
    font-family: Gowun Dodum;
    width: 160px;
    height: 60px;
    padding: 10px;
    background-color: #000000;
    border-radius: 0.5rem;
    margin-right: 7px;
    border: none;
    outline: none !important;
    resize: none;
    font-weight: bold;

    &:hover {
        cursor: grab;
    }

    ::placeholder {
        color: white;
        font-weight: bold;
    }
    color: white;

    overflow-y: scroll;
    &::-webkit-scrollbar {
        /* 세로 스크롤 넓이 */
        width: 10px;

        /* 가로 스크롤 높이 */
        height: 10px;

        border-radius: 6px;
        background: rgba(255, 255, 255, 0.4);
    }
    &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 6px;
    }
`;

const InputMsgBtn = styled.div`
    font-family: Gowun Dodum;
    width: 40px;
    height: 80px;
    background-color: #000000;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;

    &:hover {
        cursor: grab;
    }
`;

export default Chatting;