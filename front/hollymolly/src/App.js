import React, { useEffect } from 'react';
import './App.css';
import style from './styles/styles.js';
import CreateRoom from './components/CreateRoom';
import Filter from './components/Filter';
import CheckBox from './components/CheckBox';
import io from 'socket.io-client';

function App() {
    useEffect(() => {
        // ws://localhost:3002/
        const socketClient = io('http://ec2-3-17-55-178.us-east-2.compute.amazonaws.com:3002/', {
            auth: {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6NSwidXNlcl9uYW1lIjoidGVzdCIsImlhdCI6MTYzMjgzMzAxN30.om8LLnhGYOaq5-k6FWHHzABO2ZP4JZsuGYN6qeHGtic',
            },
        });

        socketClient.on('connect', () => {
            console.log('connection server!!!!!');
        });

        socketClient.on('connect_error', (err) => {
            if (err.message === 'invalid credentials') {
                socketClient.auth.token = 'efgh';
                socketClient.connect();
                console.log('오류난다ㅏㅏㅏㅏㅏㅏ server!!!!!');
            }
        });
    }, []);

    return (
        <div>
            {/* <button onclick={() => alert('Click!')}>방 만들기</button> */}
            <CreateRoom />
            <Filter />
            <CheckBox />
            {/* <button onclick={hi}>방 만들기</button> */}
        </div>
    );
}

export default App;

const styles = {
    dd: {
        border: '2px solid #eee',
        padding: '20px',
        display: 'flex',
        width: '100vw',
        maxWidth: '400px', // 400픽셀 이상으로는 커지지 않는다.
        margin: '30px auto',
        flexDirection: 'column',
    },
    text: {
        color: style.red,
    },
};
