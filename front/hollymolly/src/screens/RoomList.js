import React, { useState, useEffect, useRef } from "react";
import Room from "../components/Room";
import RoomSearchBar from "../components/RoomSearchBar";
import RoomGrid from "../components/RoomGrid";
import axios from 'axios'
import styled from 'styled-components';

// 이미지
import leftArrowBtn from '../assets/leftArrowBtn.png';
import rightArrowBtn from '../assets/rightArrowBtn.png';

// 소켓 
import { io } from "socket.io-client";

let total_room_cnt = 0;

const RoomList = () => {   
    // 방 전체 리스트 
    const [rooms, setRooms] = useState();

    // 소켓 응답 상태 
    const [socketResponse, setSocketResponse] = useState(false);

    useEffect(() => {
        //const socketCheck = () => {
        // 연결 실패 시, 
        const socket = io("http://3.17.55.178:3002/", { // 프론트가 서버와 동일한 도메인에서 제공되지 않는 경우 서버의 URL 전달 필요 
            auth: {
              token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6NywidXNlcl9uYW1lIjoidGVzdCIsImlhdCI6MTYzMjgzMzAxN30.G1ECMSLaD4UpCo6uc-k6VRv7CxXY0LU_I5M2WZPYGug"
            }
          }); 

        // 수동으로 다시 연결 시도 
        socket.on("error", () => {
            setTimeout(() => {
              socket.connect();
            }, 1000);
        });

          // 소켓이 서버에 연결되어 있는지 여부 
          // 연결 성공 시 시작 
        socket.on("connect", () => {
            setSocketResponse(socket.connected);
        });

          // 연결 해제 시 임의 지연 기다린 다음 다시 연결 시도  
        socket.on("disconnect", (reason) => {
            if (reason === "io server disconnect") {
            // the disconnection was initiated by the server, you need to reconnect manually
              socket.connect();
            }
            // else the socket will automatically try to reconnect
        });
    //}
    });

    // 페이지 슬라이드 
    let TOTAL_SLIDES = Math.floor(total_room_cnt/7); // 한 페이지 당 6개 방을 가지고 있으므로, 즉, 전체 페이지 개수 =  전체 방의 개수 / 6 
    console.log("TOTAL_SLIDES: " + TOTAL_SLIDES) 

    const [currentSlide, setCurrentSlide] = useState(0);
    const slideRef = useRef(null);

    useEffect(() => {
        slideRef.current.style.transition = "all 0.5s ease-in-out";//속도 
        slideRef.current.style.transform = `translateX(-${currentSlide}00%)`; // 백틱을 사용하여 슬라이드로 이동하는 애니메이션을 만듭니다.
      }, [currentSlide]);

    // 다음 페이지 이동 
    const nextPage = () => {
        if (currentSlide >= TOTAL_SLIDES) { // 더 이상 넘어갈 슬라이드가 없으면 슬라이드를 초기화합니다.
        setCurrentSlide(0);
        } else {
        setCurrentSlide(currentSlide + 1);
        }
    };

    // 이전 페이지 이동 
    const prevPage = () => {
        if (currentSlide === 0) {
        setCurrentSlide(TOTAL_SLIDES);
        } else {
        setCurrentSlide(currentSlide - 1);
        }
    };

    // 방 리스트 조회 => get 방식으로 데이터 요청
    useEffect(() => {
       
        const roomListCheck = async () => {
            const restURL = 'http://3.17.55.178:3002/room '
            const reqHeaders = {
                'headers': {
                    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6NywidXNlcl9uYW1lIjoidGVzdCIsImlhdCI6MTYzMjgzMzAxN30.G1ECMSLaD4UpCo6uc-k6VRv7CxXY0LU_I5M2WZPYGug',
                }
            }
    
            axios.get(restURL, reqHeaders)
                .then(function (response) {
                    total_room_cnt = response.data.total_room_cnt;       
                    setRooms(response.data); 
                })
                .catch(function (error) {
                    console.log(error.data); 
                });
        };
        roomListCheck();
        
    }, [socketResponse]);


    return (
        <React.Fragment>
            <RoomGrid flexDirection="column" padding="20px" width="965px" height="475px" bg="#251D82">
                {/* 검색바 & 버튼 div*/}
                <RoomGrid is_flex_space width="920px" height="100px" bg="#251D82" border="1px solid #251D82">
                    <div style={styles.grid}>
                        <RoomSearchBar/>
                    </div>
                    {/* 버튼 div*/}
                    <div style={styles.btn}></div>
                </RoomGrid>
                {/* 방 & 필터 div*/}
                <RoomGrid is_flex_space width="920px" height="330px" bg="#251D82" border="1px solid #251D82">
                     {/* 왼쪽 화살표 div*/}
                    <PrevBtn onClick={prevPage}/>
                     {/* 방 리스트 슬라이더 div*/}
                     <div style={styles.sliderContainer}>
                        <div style={styles.roomListContainer} ref={slideRef}>
                            {/* {roomList} */}
                            {rooms && rooms.room_list.map( values => {
                                return <Room room_idx = {values.room_idx} room_name = {values.room_name} room_current_member = {values.room_current_member_cnt} 
                                room_start_member = {values.room_start_member_cnt}  room_mode={values.room_mode} room_status={values.room_status}  disabled="false" textStroke="true" cursor="true" />
                            })}
                        </div>
                     </div>
                     {/* 오른쪽 화살표 div*/}
                    <NextBtn onClick={nextPage}/>
                {/* 필터 div*/}
                <div style={styles.filter}></div> 
                </RoomGrid>
            </RoomGrid>
        </React.Fragment>
    );
}

const NextBtn = styled.div`
    width: 40px;  
    height: 40px;
    background-size: contain;
    background-image: url(${rightArrowBtn});
`;

const PrevBtn = styled.div`
    width: 40px;  
    height: 40px;
    background-size: contain;
    background-image: url(${leftArrowBtn});
`;

export default RoomList;

const styles = {
    filter: {
        width: '130px',
        height: '300px',
        background: 'black'
    },
    btn: {
        width: '130px',
        height: '90px',
        background: 'black'
    },
    grid: {
        width: '130px',
        height: '90px',
        background: '#251D82',
        marginLeft: '42px'
    },
    roomListContainer: {
        display: 'flex',
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexDirection: 'column',
        width : '700px', 
        height: '330px',
        bg: '#251D82', 
        border: '1px solid #251D82',
        flexFlow: 'column wrap'
    },
    sliderContainer: {
        display: 'flex',
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexDirection: 'column',
        width : '700px', 
        height: '330px',
        bg: '#251D82', 
        border: '1px solid #251D82',
        overflow: 'hidden',
    }
    
};