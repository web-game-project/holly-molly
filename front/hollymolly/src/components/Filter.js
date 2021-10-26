import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import '../assets/font.css';

function Filter({ result, getResult }) {
    const inputRef = useRef();
    const list = [
        {
            id: 1,
            text: 'Easy Mode',
        },
        {
            id: 2,
            text: 'Hard Mode',
        },
        {
            id: 3,
            text: '4 people',
        },
        {
            id: 4,
            text: '5 people',
        },
        {
            id: 5,
            text: '6 people',
        },
        {
            id: 6,
            text: 'Waiting',
        },
    ];

    const [CheckList, setCheckList] = useState([1, 5, 6]); // 처음 체크되어 있을 체크리스트
    const [IdList, setIdList] = useState([]);

    const data = inputRef.current;

    //배열 state에 전체 id값 넣기
    useEffect(() => {
        let ids = [];

        list.map((item, i) => {
            ids[i] = item.id;
        });

        setIdList(ids);
        getResult(CheckList);
    }, []);

    // 체크박스 전체 선택
    const onChangeAll = (e) => {
        // 체크할 시 CheckList에 id 값 전체 넣기, 체크 해제할 시 CheckList에 빈 배열 넣기
        setCheckList(e.target.checked ? IdList : []);
        getResult(CheckList);
    };

    const onChangeEach = (e, id) => {
        getResult(CheckList);
        // 체크할 시 CheckList에 id값 넣기
        if (e.target.checked) {
            setCheckList([...CheckList, id]);
            // 체크 해제할 시 CheckList에서 해당 id값이 `아닌` 값만 배열에 넣기
        } else {
            setCheckList(CheckList.filter((checkedId) => checkedId !== id));
        }
    };
    getResult(CheckList);

    return (
        <Container>
            <Title>--- Filter ---</Title>
            <div>{/* <button onClick={onClick}>+</button> */}</div>
            <table>
                <tbody>
                    {list &&
                        list.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <ListDiv>
                                        <Context>{item.text}</Context>

                                        <input
                                            type="checkbox"
                                            label={item.id}
                                            onChange={(e) => {
                                                onChangeEach(e, item.id);
                                                getResult(CheckList);
                                            }}
                                            checked={CheckList.includes(item.id)}
                                            ref={inputRef}
                                            label={item.id}
                                        ></input>
                                    </ListDiv>
                                    {item.id == 2 ? <Line></Line> : <></>}
                                    {item.id == 5 ? <Line></Line> : <></>}
                                </td>

                                <tr>
                                    <td></td>
                                </tr>
                            </tr>
                        ))}
                </tbody>
                <tr>
                    <th>
                        <Line></Line>
                        <ListDiv>
                            <Context_all>Check All</Context_all>
                            <input type="checkbox" onChange={onChangeAll} ref={inputRef} checked={CheckList.length === IdList.length} />
                        </ListDiv>
                    </th>
                </tr>
            </table>
        </Container>
    );
}

export default Filter;

const Container = styled.div`
    width: 130px;
    height: 350px;
    background-color: #8676c7;
    padding: 0px 10px;
    margin: 10px auto;
    border-radius: 15px;
    border: 2px solid #ffffff;
    box-shadow: 5px 5px 20px #f0f0f0;
    overflow: hidden;
`;

const ListDiv = styled.div`
    width: 110px;

    margin: 5px;
    flex-direction: row;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:hover {
        background-color: #9684e0;
    }
`;

const Title = styled.h4`
    color: white;
    text-align: center;
    // -webkit-text-stroke: 1px #fff;
    font-weight: bolder;
    margin-top: 10px;
    margin-bottom: 5px;
`;

const Line = styled.hr`
    margin: 10px 0px 2px 0px;
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
    font-size: 15px;
    font-weight: light;
    // -webkit-text-stroke: 1px #c00202;
    margin-top: 5px;
`;
