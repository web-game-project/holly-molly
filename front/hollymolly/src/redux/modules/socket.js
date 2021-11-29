// 리듀서
import { createAction, handleActions } from "redux-actions";
import { produce } from "immer"; // 불변성 관리 

// 액션 타입 지정 
const RECEIVE_SOCKET = "RECEIVE_SOCKET";

// 액션 생성 함수 
const receiveSocket = createAction(RECEIVE_SOCKET, (base_url) => ({ base_url }));

// initialState
const initialState = {
    base_url: null,
    is_login: false,
};

// 미들웨어 
const socketAction = (base_url) => {
    return function (dispatch, getState, {history}) {
        dispatch(receiveSocket(base_url));
        history.push("/roomlist");
    }
}

// reducer - 리덕스에서 상태값을 변경하는 함수 
export default handleActions({
    [RECEIVE_SOCKET]: (state, action) =>
      produce(state, (draft) => { // (원본값, 원본값을 복사한 값)
        draft.base_url = action.payload.base_url;
		draft.is_login = true;
      })
},
initialState
);

// 액션 생성 함수 export
const actionCreators = {
    receiveSocket,
    socketAction,
  };
  
  export { actionCreators };

