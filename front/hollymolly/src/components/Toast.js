import React, {useEffect} from 'react';
 
// Importing toastify module
import {toast, ToastContainer} from 'react-toastify';
 
// Import toastify css file
import 'react-toastify/dist/ReactToastify.css';
 
toast.configure()

// local storage에 있는지 확인
let data = localStorage.getItem('token');
let save_user_name = JSON.parse(data) && JSON.parse(data).user_name;
 
// This is main function
const Toast = (props) => {
    const {pass, draw, name, txt} = props;

    let drawingTxt = '';

    if(save_user_name === name){
        drawingTxt = name + '님이 그림을 그릴 차례입니다.'
    }else{
        drawingTxt = name + '님이 그림을 그리고 있습니다.';
    }

    const drawingNotify = ()=>{
        toast(drawingTxt,
        { 
           position: toast.POSITION.TOP_CENTER, 
           autoClose: 9000, // 자동으로 닫히는 시간 
           pauseOnHover: false, // 마우스 올렸을 때 자동으로 닫히는 시간을 멈추게 함 
           draggable: false, // 드래그 해서 움직일 수 있게 함 
           closeOnClick: false,
           theme: "colored",
        });
    }


    const passNotify = ()=>{
        toast('잠시 후 ' + txt + ' 화면으로 넘어갑니다.',
        { 
           position: toast.POSITION.TOP_CENTER, 
           autoClose:4000, // 자동으로 닫히는 시간 
           pauseOnHover: false, // 마우스 올렸을 때 자동으로 닫히는 시간을 멈추게 함 
           draggable: false, // 드래그 해서 움직일 수 있게 함 
           closeOnClick: false,
        });
    }

    useEffect(() => {
        if(pass === true ){
            passNotify();
        }else {
            drawingNotify();
        }
    }, []);
    
    return (
        <div>
            <ToastContainer/> 
        </div>
    );
}
  
export default Toast;