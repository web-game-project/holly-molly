import React, { useState, useRef } from 'react';
import style from '../styles/styles';

function CreateRoom() {
    const hi = () => {
        console.log('hi');
    };

    const inputRef = useRef();

    // 난이도 useState
    const [isChecked, setIschecked] = React.useState(true);
    const isHard = () => {
        if (isChecked == true) setIschecked(!isChecked);
        console.log('난이도 상');
    };
    const isEasy = () => {
        if (isChecked == false) setIschecked(!isChecked);
        console.log('난이도 하');
    };

    // 인원 useState
    const [people, setPeople] = React.useState([true, false, false]); // 4명이 디폴트
    const select4 = () => {
        if (people == true)
            // 4명 선택
            setPeople(people[(true, false, false)]);
        console.log(people);

        //     if (isChecked == true) setIschecked(!isChecked);
        // };
        // const isEasy = () => {
        //     if (isChecked == false) setIschecked(!isChecked);
    };

    // 공개범위 useState
    const [ispublic, setIsPublic] = React.useState(true);
    const isPrivate = () => {
        if (ispublic == true) setIsPublic(!ispublic);
        console.log('공개범위 전체');
    };
    const isPublic = () => {
        if (ispublic == false) setIsPublic(!ispublic);
        console.log('공개범위 개인');
    };

    const result = () => {
        console.log('방이름은? ' + inputRef.current.value);
        if (isChecked) {
            // easy
            console.log('모드는? easy');
        } else console.log('모드는? hard');
        if (ispublic) {
            // public
            console.log('공개범위는? public');
        } else console.log('공개범위는? private');

        // + '인원수는?' + '공개범위는?' + ispublic);
    };

    return (
        <div style={styles.container}>
            <button style={{ ...styles.button_close, float: 'right' }}>X</button>
            <br />

            <h1 style={{ textAlign: 'center' }}>방 생성</h1>
            <div style={{ marginLeft: '50px' }}>
                <div style={styles.div}>
                    <text style={styles.text}>방 이름 : </text>
                    <input style={styles.input} type="text" placeholder="입력하세요..." ref={inputRef} />
                </div>
                <div style={styles.div}>
                    <text style={styles.text}>MODE : </text>
                    <button style={isChecked ? styles.button_on : styles.button_off} onClick={isEasy}>
                        easy
                    </button>
                    <button style={!isChecked ? styles.button_on : styles.button_off} onClick={isHard}>
                        hard
                    </button>
                </div>
                <div style={styles.div}>
                    <text style={styles.text}>인원 수 : </text>
                    <button style={styles.button_on} onClick={select4}>
                        {' '}
                        4명{' '}
                    </button>
                    <button style={styles.button_on} onClick={select4}>
                        {' '}
                        5명{' '}
                    </button>
                    <button style={styles.button_on} onClick={select4}>
                        {' '}
                        6명{' '}
                    </button>
                </div>
                <div style={styles.div}>
                    <text style={styles.text}>공개범위 : </text>
                    <button style={ispublic ? styles.button_on : styles.button_off} onClick={isPublic}>
                        public
                    </button>
                    <button style={!ispublic ? styles.button_on : styles.button_off} onClick={isPrivate}>
                        private
                    </button>
                </div>
            </div>
            <p>
                <button style={{ ...styles.button_OK, float: 'right' }} onClick={result}>
                    {' '}
                    OK{' '}
                </button>
                <br />
            </p>
        </div>
    );
}

export default CreateRoom;

const styles = {
    container: {
        border: '2px solid #000',
        width: '500px',
        padding: '20px',
        hieght: '310px',
        flexDirection: 'column',
        borderRadius: 10,
    },
    div: {
        margin: '20px',
    },
    text: {
        fontSize: 20,
    },
    button_on: {
        // isChecked? style={styles.button_on} : style={styles.button_off}
        // style={isChecked? styles.button_on: styles.button_off}
        fontSize: 20,
        color: style.lightblue,
        backgroundColor: 'transparent',
        borderRadius: 20,
        border: '2px solid',
        borderColor: style.skyblue,
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 10,
    },

    button_off: {
        fontSize: 20,
        color: style.black,
        backgroundColor: 'transparent',
        border: style.white,
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 10,
    },
    input: {
        borderColor: style.skyblue,
        border: '2px solid',
        borderRadius: 20,
        color: style.skyblue,
        height: '20px',
        marginLeft: 10,
        paddingLeft: 10,
        fontSize: 14,
    },
    button_close: {
        fontSize: 30,
        color: style.skyblue,
        backgroundColor: 'transparent',
        border: style.white,
    },
    button_OK: {
        fontSize: 20,
        color: style.white,
        backgroundColor: style.skyblue,
        // border: style.white,
        borderRadius: 7,
        paddingLeft: 20,
        paddingRight: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.12,
        shadowRadius: 60,
    },
};
