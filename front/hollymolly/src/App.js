import logo from './logo.svg';
import './App.css';
import style from './styles/styles.js';

function App() {
    return (
        <div style={{ backgroundColor: style.gray }} className="App">
            {' '}
            // import한 styles.js 사용할 때
            <div style={styles.dd}>
                {' '}
                // 아래에서 만든 스타일 변수 사용할 때<h1>안녕하세요!</h1>
                <hr style={{ width: '100%' }} />
                <p style={styles.text}>이름을 입력해주세요.</p> 아래에서 만든 스타일 변수 사용할 때
                <input type="text" />
            </div>
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
