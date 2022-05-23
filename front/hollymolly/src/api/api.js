import axios from 'axios';

import RefreshVerfication from '../server/RefreshVerification';

const BASE_URL = 'http://3.17.55.178:3002';

let TOKEN = '', save_refrehToken = '', save_userIdx = '', save_userName = '';

async function _getBearerToken() {
  let data = sessionStorage.getItem('token');

  TOKEN = JSON.parse(data) && JSON.parse(data).access_token;
  save_refrehToken = JSON.parse(data) && JSON.parse(data).refresh_token;
  save_userIdx = JSON.parse(data) && JSON.parse(data).user_idx;
  save_userName = JSON.parse(data) && JSON.parse(data).user_name;

  return 'Bearer ' + TOKEN;
}

async function _basePutRequest(url, params) {
  const authorization = await _getBearerToken()

  const { data } = await axios.put(url, params, {
    headers: {
      Authorization: authorization,
    },
  })
    .catch(function (err) {
      const val = VerificationToken(err);
      if (val)
        _baseGetRequest(url);
    })

  return data;
}

async function _basePatchRequest(url, params) {
  const authorization = await _getBearerToken()

  const { data } = await axios.patch(url, params, {
    headers: {
      Authorization: authorization,
    },
  })
    .catch(function (err) {
      const val = VerificationToken(err);
      if (val)
        _baseGetRequest(url);
    })

  return data;
}

async function _baseDeleteRequest(url) {
  const authorization = await _getBearerToken()

  const { data } = await axios.delete(url, {
    headers: {
      Authorization: authorization,
    },
  })
    .catch(function (err) {
      const val = VerificationToken(err);
      if (val)
        _baseGetRequest(url);
    })

  return data;
}

async function _basePostRequest(url, params) {
  const authorization = await _getBearerToken()
  if (url === BASE_URL + "/login") {
    const { data } = await axios.post(url, params)
      .catch(function (err) {
        const val = VerificationToken(err);
        if (val)
          _baseGetRequest(url);
      })

    return data
  }
  else {
    const { data } = await axios.post(url, params, {
      headers: {
        Authorization: authorization,
      },
    })
      .catch(function (err) {
        const val = VerificationToken(err);
        if (val)
          _baseGetRequest(url);
      })

    return data;
  }
}

async function _baseGetRequest(url) {
  const authorization = await _getBearerToken()

  const { data } = await axios.get(url, {
    headers: {
      Authorization: authorization,
    },
  })
    .catch(function (err) {
      const val = VerificationToken(err);
      if (val)
        _baseGetRequest(url);
    })

  return data;
}

async function VerificationToken(err) {
  var errTxt = '"로그인 후 이용해주세요."';

  console.log(JSON.stringify(err.response.data.message));

  if (errTxt === JSON.stringify(err.response.data.message)) {
    const res = refreshToken(); //token refresh

    if (res) {
      sessionStorage.setItem(
        "token",
        JSON.stringify({
          access_token: res.access_token,
          refresh_token: save_refrehToken,
          user_idx: save_userIdx,
          user_name: save_userName,
        })
      );
      return true;
    }
    else {
      alert(err.response.data.message);

      let verify = RefreshVerfication.Verification();

    }
  }
}

async function refreshToken() {
  return await _basePostRequest(BASE_URL + '/login/refresh', {
    refresh_token: save_refrehToken,
  })
}

async function postNickName(nickName) {
  return await _basePostRequest(BASE_URL + '/login', { name: nickName });
}

async function getRoomList(url) {
  return await _baseGetRequest(BASE_URL + url);
}

async function patchChangeColor(url, params) {
  return await _basePatchRequest(BASE_URL + url, params);
}

async function deleteRoom(url) {
  return await _baseDeleteRequest(BASE_URL + url);
}

async function putUpdateRoomInfo(url, params) {
  return await _basePutRequest(BASE_URL + url);
}

export default {
  postNickName,
  getRoomList,
  patchChangeColor,
  deleteRoom,
  putUpdateRoomInfo,
  refreshToken,

};
