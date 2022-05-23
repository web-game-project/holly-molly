// 통신
import axios from "axios";
// 소켓
import { io, Socket } from "socket.io-client";
//페이지 이동
import { useHistory, useLocation } from 'react-router';

const RefreshVerification = {
  //API사용해서 catch문에 에러가 401일 때 refresh api 갱신 요청
  //API는 방 리스트 조회 사용 -> 각 각 request body나 parameter에 필요한 데이터들이 앞부분에는 없어서 가장 처음 사용하는 api로 결정

  Verification() {
    const history = useHistory();
    //메인으로
    history.push({
      pathname: '/',
    });

  },
};

export default RefreshVerification;
