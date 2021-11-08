import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from "react-router-dom";
//이미지
import closeBtn from '../assets/close.png';

//storage
import RefreshVerification from '../server/RefreshVerification';

function NickNameDialog({ title, children, confirmText, cancelText }) {

  const [nickName, setNickName] = React.useState('');

  const onChange = (e) => {
    setNickName(e.target.value);
  }

  function closeClick() {
    alert('닫아라');
  }

  const connectClick = async () => {
    //alert('페이지 이동 고고'+ nickName);

    const url = "http://3.17.55.178:3002/login";

    axios.post(url, {
      name: nickName
    })
      .then(function (response) { //response로 jwt token 반환
        alert('success! '+ response.data.access_token);       

        window.localStorage.setItem("token", JSON.stringify({
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          user_idx: response.data.user_idx,
        }));
       
      })
      .catch(function (error) {
        alert(error);
      })
  }

  return (
    <DiglogBackground>
      <DialogContent>
        <Title>
          <p>{title}</p>
        {/*   <img src={closeBtn} onClick={closeClick} /> */}
          <Link to='/'>
            <img src={closeBtn} onClick={closeClick} />
          </Link>
        </Title>

        <input type='text' placeholder="닉네임을 입력해주세요." onChange={onChange} value={nickName}></input>
        <h5>＊한글2~8자 또는 영문2~16자, 특수문자 입력 불가능 </h5>

        <button onClick={connectClick}> {confirmText}</button>
          
      </DialogContent>

    </DiglogBackground>
  );
}

const Title= styled.div`
display: flex;
flex-direction: row;
background-color: #221330;
width: 100%;
p{
  width: 100%;
  font-size: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px;
  padding: 15px;
  color: #fff;
}
img{
  width: 50px;
  height: 50px; 
  background-size: stretch;
  background-color: #221330;
  position: absolute;
}
`;
/* img{
  width: 50px;
  height: 50px; 
  background-size: stretch;
  background-color: #221330;
  position: absolute;
  top: 25%;
   left: 66.2%;
} */


const DiglogBackground = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
`;

const DialogContent = styled.div`
  width: 40%;
  height: 50%;
  background: #38214F;
  border-width: thick;
  border-radius: 10px;
  border-color: #ffffff;
  border-style: solid;
  text-align: center;
  input{
    font-size: 23px;
    border-radius: 30px;
    width: 50%;
    margin: 50px 25%;
    padding: 5px;
  }
  input::placeholder{
    font-size: 15px;
    padding: 10px;
    text-align: center;
  }
  h5{
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: -40px ;
    color: #FF0000;
  }
  button{
    display:inline-block;
    margin-top: 20%;
    width: 10vw;
    height: 2vw;
    background: linear-gradient(to right, #5c258d, #4389a2);
    border-width: thin;
    border-radius: 5px;
    border-color: #ffffff;
    border-style: solid;
    color: white;    
  }
`;

export default NickNameDialog;
