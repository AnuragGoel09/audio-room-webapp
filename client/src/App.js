import Loader from './components/Loader';
import Room from './components/Room';
import RoomForm from './components/RoomForm';
import { useEffect, useState } from 'react';
import styled from 'styled-components'
import AgoraRTC from "agora-rtc-sdk-ng"
import appid from './appId.js'

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

const token = null
const rtcUid =  Math.floor(Math.random()*2054)

const Header=styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Left=styled.div`
    font-size: 20px;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
`;

const Right=styled.div`
    display: flex;
    gap: 20px;
`;

const Button=styled.div`
    width: 30px;
    height: 30px;
    padding: 8px;
    cursor: pointer;
    border-radius: 10px;
    &:hover{
        background-color: rgba(0,0,0,0.2);
    }
`;
const User=styled.div`
    color: black;
    font-size: 20px;
    background-color: red;
`;



function App() {
  
  const [clientStatus,setClientStatus]=useState("not joined");
  const [displayName,setDisplayName]=useState(null);
  const [roomName,setRoomName]=useState(null);
  useEffect(()=>{
    console.log(clientStatus)
  },[clientStatus,setClientStatus])


  let num=1;
  let audioTracks = {
      localAudioTrack: null,
      remoteAudioTracks: {},
  };
  const [rtcClient,setRtcClient]=useState(null)
  const [clients,setClients]=useState([])

  const initRtc=async()=>{
      let rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      setRtcClient(rtcClient)
      rtcClient.on('user-joined', handleUserJoined)
      // rtcClient.on("user-published", handleUserPublished)
      // rtcClient.on("user-left", handleUserLeft);
      await rtcClient.join(appid, roomName, token, rtcUid)
      audioTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      await rtcClient.publish(audioTracks.localAudioTrack);
      let updates_client=clients;
    updates_client.push({"uid":rtcUid})
      console.log("CURR: ",updates_client)
      setClients(updates_client)
      setClientStatus("joined")

      // initVolumeIndicator()

  }
  const handleUserJoined=async(user)=>{
    let updates_client=clients;
    updates_client.push({"uid":user.uid})
    console.log("OTHERS:",updates_client)
    setClients(updates_client)
}
const enterRoom=()=>{
    initRtc();
}
const leaveRoom = async()=>{
    setClientStatus("not joined")
    // if(audioTracks.localAudioTrack){
      audioTracks.localAudioTrack.stop();
      audioTracks.localAudioTrack.close();
    // }
    rtcClient.unpublish();
    rtcClient.leave();
}
useEffect(()=>{
  if(clientStatus=="joining" && roomName!=null && num==1 ){
    num++;
    enterRoom();
  }
},[clientStatus,roomName])
  
return (  
    <Container>
      <Title>Audio Chat Room</Title>
      {clientStatus==="not joined"?
        <RoomForm setClient={setClientStatus} setName={setDisplayName} setRoom={setRoomName}/>:
        clientStatus==="joining"? <Loader/>:
        <Room displayName={displayName} roomName={roomName} clients={clients} handleLeave={leaveRoom} />
        }
    </Container>
  );
}

export default App;
