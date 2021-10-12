import React, { useState, useRef } from 'react';
import style from '../styles/styles';
import styled from 'styled-components';

export default function FilterContext({ text, all = false }) {
    const [isChecked, setIschecked] = useState(false);
    const inputRef = useRef();
    const data = inputRef.current;
    // console.log(data);

    function toggleDone() {
        setIschecked(!isChecked);
        console.log(!isChecked);
        console.log(data);
    }
    return (
        <>
            <Container>
                {all ? <Context_all>{text}</Context_all> : <Context>{text}</Context>}
                <input type="checkbox" checked={isChecked} onChange={toggleDone} label={text} ref={inputRef} />
                {/* console.log(data);  */}
            </Container>
        </>
    );
}

const Line = styled.hr`
    margin: 16px 0px;
    border: 0.1px solid #ddd;
    border-color: rgba(255, 255, 255, 0.1);
`;

const Context = styled.text`
    color: #4d1596;
    font-size: 12px;
    // font-weight: bolder;
    -webkit-text-stroke: 1px #4d1596;
    // margin-right: 20px
`;

const Context_all = styled.text`
    color: #c11b1b;
    font-size: 12px;
    font-weight: light;
    // -webkit-text-stroke: 1px #c00202;
    // margin-right: 20px
`;

const Container = styled.div`
    margin: 5px;
    flex-direction: row;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:hover {
        background-color: #9684e0;
    }
`;
