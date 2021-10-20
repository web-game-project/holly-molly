import React, { useRef } from 'react';
import style from '../styles/styles';

function CreateRoom() {
    const inputRef = useRef();

    // 난이도 useState
    const [isChecked, setIschecked] = React.useState(true);
    const isHard = () => {
        if (isChecked === true) setIschecked(!isChecked);
        console.log('선택) 난이도 상');
    };
    const isEasy = () => {
        if (isChecked === false) setIschecked(!isChecked);
        console.log('선택) 난이도 하');
    };

    // 인원 useState
    const [people, setPeople] = React.useState(4); // 4명이 디폴트
    const click4 = () => {
        setPeople((people) => (people = 4));
        console.log('선택) 인원수 4명');
    };

    const click5 = () => {
        setPeople((people) => (people = 5));
        console.log('선택) 인원수 5명');
    };

    const click6 = () => {
        setPeople((people) => (people = 6));
        console.log('선택) 인원수 6명');
    };

    // 공개범위 useState
    const [ispublic, setIsPublic] = React.useState(true);
    const isPrivate = () => {
        if (ispublic == true) setIsPublic(!ispublic);
        console.log('선택) 공개범위 전체');
    };
    const isPublic = () => {
        if (ispublic == false) setIsPublic(!ispublic);
        console.log('선택) 공개범위 개인');
    };

    const result = () => {
        console.log(':::최종결과:::');
        console.log('방이름은? ' + inputRef.current.value);
        if (isChecked) {
            // easy
            console.log('모드는? easy');
        } else console.log('모드는? hard');

        console.log('인원수는? ' + people + '명');

        if (ispublic) {
            // public
            console.log('공개범위는? public');
        } else console.log('공개범위는? private');
    };

    const close = () => {
        console.log('일단 창 닫기');
    };

    return (
        <div style={styles.container}>
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
                    <button style={people == 4 ? styles.button_on : styles.button_off} onClick={click4}>
                        {' '}
                        4명{' '}
                    </button>
                    <button style={people == 5 ? styles.button_on : styles.button_off} onClick={click5}>
                        {' '}
                        5명{' '}
                    </button>
                    <button style={people == 6 ? styles.button_on : styles.button_off} onClick={click6}>
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
        border: '2px solid #fff',
        width: '400px',
        hieght: '250px',
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
