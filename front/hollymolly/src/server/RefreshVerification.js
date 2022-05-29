// 통신
import axios from "axios";
// 소켓
import { io, Socket } from "socket.io-client";
//페이지 이동
import { useHistory, useLocation } from 'react-router';
import session from "redux-persist/lib/storage/session";

const RefreshVerification = {
  //API사용해서 catch문에 에러가 401일 때 refresh api 갱신 요청
  //API는 방 리스트 조회 사용 -> 각 각 request body나 parameter에 필요한 데이터들이 앞부분에는 없어서 가장 처음 사용하는 api로 결정

  verification() {
    const BaseURL = 'http://api.hollymolly.kr';
    let data = sessionStorage.getItem('token');
    let save_token = JSON.parse(data) && JSON.parse(data).access_token;
    let save_refreshToken = JSON.parse(data) && JSON.parse(data).refresh_token;
    let save_userIdx = JSON.parse(data) && JSON.parse(data).user_idx;
    let save_userName = JSON.parse(data) && JSON.parse(data).user_name;

    const reqHeaders_room = {
      headers: {
        //1번 토큰
        authorization:
          'Bearer ' + save_token,
      },
    };

    const restURL_refresh = BaseURL + "/login/refresh";

    console.log('refresh!');

    axios
      .post(restURL_refresh, {
        refresh_token: save_refreshToken,
      }, reqHeaders_room)
      .then(function (response) {
        //response로 access token 반환
        //console.log("토큰만료되고 리프레시 토큰 갱신 api 요청 성공! " + response.data.access_token);

        //받은 access_token이랑 유저 인덱스로 다시 저장
        sessionStorage.clear();
        sessionStorage.setItem(
          "token",
          JSON.stringify({
            access_token: response.data.access_token,
            refresh_token: save_refreshToken,
            user_idx: save_userIdx,
            user_name: save_userName,
          })
        );
       
      })
      .catch(function (error) {
        alert(error.response.data.message);

        const history = useHistory();
        //메인으로
        history.push({
          pathname: '/',
        });
      });

  },
};

export default RefreshVerification;
