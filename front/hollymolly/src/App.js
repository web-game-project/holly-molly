
import './App.css';
import GameStart from './screens/GameStart';
import Dialog from './screens/NickNameDialog';
import { BrowserRouter, Route } from 'react-router-dom'; //React-Router import

function App() {
    /* return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    홀리몰리의 세계에 오신 것을 환영합니다!
                </p>
                <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    Learn React
                </a>
            </header>
        </div>
    ); */
    return (
        <BrowserRouter>
            <div>
        {/*   <Dialog  title="닉네임 입력" confirmText="삭제" cancelText="취소" >
                <input type='text'></input>
                <p>한글</p>
            </Dialog> */}

            <Route path="/">
            <GameStart />
            </Route>

            <Route path="/InputName">
            <Dialog  title="닉네임 입력" confirmText="접속"/>
            </Route>
        </div >
        </BrowserRouter>

    );
}

export default App;
