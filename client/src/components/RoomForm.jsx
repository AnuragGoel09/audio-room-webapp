import React from 'react'
import styled from 'styled-components'

const Container=styled.div`
    font-size: 16px;
    width: 80%;
    max-width: 400px;
    
    margin: 0 auto;
    padding: 1em;
    background-color: #5356FF;
    border-radius: 25px;
    margin-top: 5%;
`;

const Form=styled.form`
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 10px;
    color: white;
`;

const Label=styled.div`
    width: 100%;
    margin: 5px 0px;
`;

const Input=styled.input`
    width: 100%;
    border-radius: 20px;
    background-color: #E1F7F5;
    outline: none;
    border: none;
    padding: 1em;
    color:#5356FF;
    margin-bottom:2em;
    box-sizing: border-box;
    margin-bottom: 30px;
    transition: all 0.3s ease;
    font-size: 16px;
    &:hover{
        transform: scale(1.05);
    };
`;


export default function RoomForm(props) {
    const setClientStatus=props.setClient;
    const setName=props.setName;
    const setRoom=props.setRoom;

    const handle_enter_room=(event)=>{
        event.preventDefault()
        let displayName=event.target["name"].value
        let roomName=event.target["room"].value
        setName(displayName);
        setRoom(roomName);
        setClientStatus("joining")
    }
  return (
    <Container>
        <Form onSubmit={handle_enter_room}>
            <Label name="name">Display Name :</Label>
            <Input type="text" name="name" placeholder="Enter you name" />
            <Label name="room">Room Id :</Label>
            <Input type="text" name="room" placeholder="Enter room id" />
            <Input type="submit" name="submit" value="Enter room" style={{fontSize:'17px',cursor:'pointer'}} />
        </Form>
    </Container>
  )
}
