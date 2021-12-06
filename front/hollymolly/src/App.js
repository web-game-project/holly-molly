import React from 'react';
import './App.css';
import { ConnectedRouter } from "connected-react-router";
import { history } from "./redux/configureStore";
import { io } from 'socket.io-client';

import RoomList from '../src/screens/RoomList';
import GameStart from './screens/GameStart';
import { BrowserRouter, Route, Switch } from 'react-router-dom'; //React-Router import
import WaitingRoom from './screens/WaitingRoom.js';
import PlayingRoom from './screens/PlayingRoom.js';
import VoteBoard from './components/VoteBoard';
import Tutorial from './screens/TutorialScreens/TutorialStart.js';
import TutorialRole from './screens/TutorialScreens/TutorialRole.js';
import PlayingResult from './screens/PlayingResult';
import Toast from './components/Toast';
import ModalNickName from './components/ModalNickName';
import PlayingVote from './screens/PlayingVote';

const htmlTitle = document.querySelector('title');
htmlTitle.innerHTML = '홀리몰리';

let data = localStorage.getItem('token');
let save_token = JSON.parse(data) && JSON.parse(data).access_token;
      
const socket = io('http://3.17.55.178:3002/', {
              auth: {
                  token: save_token,
              },
              transports: ['websocket']
});

 socket.on('connect', () => {
  console.log("app.js");
  console.log(socket);
});

socket.on('disconnect', (reason) => {
    socket.connect();
});
 
export default function App() {

    return (
        <div>
            <div>
                <BrowserRouter>
                    <ConnectedRouter history={history}>
                    
                    <Route path="/tutorial" component={Tutorial}></Route>
                    <Route path="/role/tutorial" component={TutorialRole}></Route>

                    <Route path="/nickname" component={ModalNickName}></Route>
                    <Route path="/vote" component={PlayingVote}></Route>
                    <Route path="/Toast" component={Toast}></Route>

                    <Route path="/voteboard" component={VoteBoard}></Route>
                    <Route exact path="/" component={GameStart} />
                    
                    <Route 
                        path="/roomlist" 
                        render={() => <RoomList socket={socket} />}/>
                    
                    <Switch>
                        <Route 
                            path="/waitingroom/:name" 
                            render={(props) => <WaitingRoom socket={socket} {...props} />}/>
                        <Route 
                            path="/waitingroom" 
                            render={(props) => <WaitingRoom socket={socket} {...props} />}/>
                    </Switch>

                    <Switch>
                        <Route 
                            path="/playingroom/:name" 
                            render={(props) => <PlayingRoom socket={socket} {...props} />}/>
                        <Route 
                            path="/playingroom" 
                            render={(props) => <PlayingRoom socket={socket} {...props} />}/>
                    </Switch>
                    
                    <Switch>
                        <Route 
                            path="/playingvote/:name" 
                            render={(props) => <PlayingVote socket={socket} {...props} />}/>
                        <Route 
                            path="/playingvote" 
                            render={(props) => <PlayingVote socket={socket} {...props} />}/>
                    </Switch>

                    <Switch>
                        <Route 
                            path="/playingresult/:name" 
                            render={(props) => <PlayingResult socket={socket} {...props} />}/>
                        <Route 
                            path="/playingresult" 
                            render={(props) => <PlayingResult socket={socket} {...props} />}/>
                    </Switch>

                  </ConnectedRouter>
                </BrowserRouter>
            </div>
        </div>
    );
}
