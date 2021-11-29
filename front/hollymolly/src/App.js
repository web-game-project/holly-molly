import React from 'react';
import './App.css';
import { ConnectedRouter } from "connected-react-router";
import { history } from "./redux/configureStore";

import RoomList from '../src/screens/RoomList';
import GameStart from './screens/GameStart';
import { BrowserRouter, Route, Switch } from 'react-router-dom'; //React-Router import
import WaitingRoom from './screens/WaitingRoom.js';
import PlayingRoom from './screens/PlayingRoom.js';
import VoteBoard from './components/VoteBoard';

// 테스트 끝나면 삭제할거임- 연희
import GameMissionPerformance from './components/GameMissionPerformance';
import GameDrawing from './components/GameDrawing';
import GameMiddleResult from './components/GameMiddleResult';
import PlayingResult from './screens/PlayingResult';
import PlayingLoading from './components/PlayingLoading';
// 테스트 끝나면 삭제할거임- 연희

//정희
import GameRoleComponent from './components/GameRoleComponent';
import ModalNickName from './components/ModalNickName';

const htmlTitle = document.querySelector('title');
htmlTitle.innerHTML = '홀리몰리';

export default function App() {
  
    return (
        <div>
            <div>
                <BrowserRouter>
                    <ConnectedRouter history={history}>
                        {/* 정희 역할부여 테스트 */}
                        <Route path="/gameRole" component={GameRoleComponent}></Route>
                        <Route path="/nickname" component={ModalNickName}></Route>
                        {/* 테스트 끝나면 삭제할거임- 연희 */}
                        <Route path="/gameMissionPerformance" component={GameMissionPerformance}></Route>
                        <Route path="/gameDrawing" component={GameDrawing}></Route>
                        <Route path="/gameMiddleResult" component={GameMiddleResult}></Route>
                        <Route path="/playingresult" component={PlayingResult}></Route>
                        <Route path="/playingloading" component={PlayingLoading}></Route>
                        {/* 테스트 끝나면 삭제할거임- 연희 */}
                        <Route path="/voteboard" component={VoteBoard}></Route>
                        <Route exact path="/" component={GameStart} />
                        <Switch>
                            <Route path="/playingroom/:name" component={PlayingRoom} />
                            <Route path="/playingroom" component={PlayingRoom} />
                        </Switch>
                        <Route path="/roomlist" component={RoomList} />
                        <Switch>
                            <Route path="/waitingroom/:name" component={WaitingRoom} />
                            <Route path="/waitingroom" component={WaitingRoom} />
                        </Switch>
                    </ConnectedRouter>
                </BrowserRouter>
            </div>
        </div>
    );
}
