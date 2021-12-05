import React, {useEffect, useState} from 'react';
 
// Importing toastify module
import {toast, ToastContainer} from 'react-toastify';
 
// Import toastify css file
import 'react-toastify/dist/ReactToastify.css';
 
toast.configure()
 
// This is main function
function Toast(props){

    const {pass, name, txt} = props;

    /* const pass = true;
    const name = "oo";
    const txt = "인간 미션 수행"; */


    const drawingNotify = ()=>{
        toast(name + '님이 그림을 그리고 있습니다.',
        { 
           position: toast.POSITION.TOP_CENTER, 
           autoClose:8000, // 자동으로 닫히는 시간 
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
        }else{
            drawingNotify();
        }
    }, []);
    
    
    return (
        <ToastContainer/> 

    );
}
  
export default Toast;