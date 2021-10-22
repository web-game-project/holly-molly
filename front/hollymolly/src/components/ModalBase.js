import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import CreateRoom from './CreateRoom';
import styled from 'styled-components';
import style from '../styles/styles';

export default function ModalBase() {
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            // marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '430px',
            height: '330px',
            overflow: 'hidden',
            borderRadius: 30,
            overflow: 'hidden',
            margin: '0',
            paddingRight: '5px',
            boxShadow: '5px 5px 22px #808080',
            zIndex: 100,
        },
    };
    let subtitle;
    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <div>
            <Button onClick={openModal}>방 만들기</Button>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Create Room Modal"
                shouldCloseOnOverlayClick={false}
                ariaHideApp={false}
            >
                <CloseButton onClick={closeModal}>X</CloseButton>
                <br />
                <CreateRoom />
            </Modal>
        </div>
    );
}

const Button = styled.button`
    background: white;
    color: palevioletred;
    width: 130px;
    height: 40px;
    font-size: 1em;
    font-weight: bolder;
    margin: 5px 0px 0px 0px;
    padding: 0.25px 1px;
    border: 2px solid palevioletred;
    border-radius: 15px;

    &:hover {
        background: palevioletred;
        color: white;
        border: white;
    }
`;

const CloseButton = styled.button`
    font-size: 2em;
    color: ${style.skyblue};
    background-color: transparent;
    border: ${style.white};
    font-weight: bold;
    float: right;
    padding-right: 0.5em;

    &:hover {
        color: ${style.red};
    }
`;
