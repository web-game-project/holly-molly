import logo from './logo.svg';
import React from 'react';
import './App.css';
import style from './styles/styles.js';
import CreateRoom from './components/CreateRoom';
import Filter from './components/Filter';
const link = console.log('kkkk');
const hi = console.log('hi');

function App() {
    const hi = console.log('hi');
    return (
        <div>
            {/* <button onclick={() => alert('Click!')}>방 만들기</button> */}
            <CreateRoom />
            <Filter />
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
