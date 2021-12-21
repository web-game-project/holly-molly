// 리덕스 스토어 
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { connectRouter } from "connected-react-router";

import socket from "./modules/socket";

// redux-persist
import {persistReducer  } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export const history = createBrowserHistory();

// 새로운 persist config를 선언
const persistConfig = {
  key: 'root', // reducer 객체의 어느 지점에서 부터 데이터를 저장할 것인지 설정해주는것이 key, root부터 시작한다고 지정
  storage: storage, // localstorage 지정
  //whitelist: ["socket"], // 유지 및 보존하고 싶은 데이터를 배열안에 지정, 아래 combineReducers에 지정된 값들을 사용
};

const middlewares = [thunk.withExtraArgument({history: history})];

const rootReducer = combineReducers({
  socket: socket,
  router: connectRouter(history),
});

const persistedReducer = persistReducer(persistConfig, rootReducer); // rootReducer에 persist능력을 추가

// 지금이 어느 환경인지
const env = process.env.NODE_ENV;
// 배포 레벨에서는 리덕스 발동시 찍히는 logger를 사용하지 않습니다.
if (env === "development") {
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}

// 브라우저일때만
const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;


const enhancer = composeEnhancers(applyMiddleware(...middlewares));

let store = (initialStore) => createStore(persistedReducer, enhancer);

//export const store = createStore(persist, enhancer);

// store의 persisted 버전 선언 
//export const persistor = persistStore(store);

export default store();

