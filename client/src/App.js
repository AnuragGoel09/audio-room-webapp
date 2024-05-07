import './App.css';
import Loader from './components/Loader';
import Room from './components/Room';
import RoomForm from './components/RoomForm';
import { useEffect, useState } from 'react';
import styled from 'styled-components'

const Container=styled.div`
  background-color: white;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const Title=styled.div`
  width: 100%;
  font-size: 25px;
  font-weight: bold;
  display: flex;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  color: #5356FF;
  padding: 30px;
`;



function App() {
  
  const [clientStatus,setClientStatus]=useState("not joined");
  const [displayName,setDisplayName]=useState(null);
  const [roomName,setRoomName]=useState(null);
  useEffect(()=>{
    console.log(clientStatus)
  },[clientStatus,setClientStatus])
  return (
    <Container>
      <Title>Audio Chat Room</Title>
      {clientStatus=="not joined"?
        <RoomForm setClient={setClientStatus} setName={setDisplayName} setRoom={setRoomName} />:
        clientStatus=="joining"?
          <Loader/>:
          <Room/>}
    </Container>
  );
}

export default App;
