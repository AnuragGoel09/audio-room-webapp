import Loader from './components/Loader';
import Room from './components/Room';
import RoomForm from './components/RoomForm';
import { useEffect, useRef, useState } from 'react';
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

const Header=styled.div`
    width: 100%;
    display: none;
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

const Box=styled.div`
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

const Box2=styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  display: none;
`;

const Box3=styled.div`
  display: none;
  `;

let join,loader,form,joined_options;
let mic_button;

const token = null
const rtcUid =  Math.floor(Math.random() * 2032)

let audioTracks = {
  localAudioTrack: null,
  remoteAudioTracks: {},
};
let rtcClient;
let micMuted=true;

const initRtc = async (name,roomId) => {
  rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });


  rtcClient.on('user-joined', handleUserJoined)
  rtcClient.on("user-published", handleUserPublished)
  rtcClient.on("user-left", handleUserLeft);
  

  await rtcClient.join(appid, roomId, token, rtcUid)
  audioTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  audioTracks.localAudioTrack.setMuted(micMuted)
  await rtcClient.publish(audioTracks.localAudioTrack);

  join.current.insertAdjacentHTML('beforeend', `<div class="speaker user-rtc-${rtcUid}" id="${rtcUid}"><p>${rtcUid}</p></div>`)
  // document.getElementById('members').insertAdjacentHTML('beforeend', `<div class="speaker user-rtc-${rtcUid}" id="${rtcUid}"><p>${rtcUid}</p></div>`)
  loader.current.style.display='none'
  join.current.style.display='flex'
  joined_options.current.style.display='flex'

  // initVolumeIndicator()
}
let initVolumeIndicator = async () => {

  //1
  AgoraRTC.setParameter('AUDIO_VOLUME_INDICATION_INTERVAL', 200);
  rtcClient.enableAudioVolumeIndicator();
  
  //2
  rtcClient.on("volume-indicator", volumes => {
    volumes.forEach((volume) => {
      console.log(`UID ${volume.uid} Level ${volume.level}`);

      //3
      try{
          let item = document.getElementsByClassName(`user-rtc-${volume.uid}`)[0]

         if (volume.level >= 50){
           item.style.borderColor = '#00ff00'
         }else{
           item.style.borderColor = "#fff"
         }
      }catch(error){
        console.error(error)
      }


    });
  })
}



let handleUserJoined = async (user) => {
  console.log('USER:', user)
 join.current.insertAdjacentHTML('beforeend', `<div class="speaker user-rtc-${user.uid}" id="${user.uid}"><p>${user.uid}</p></div>`)
} 

let handleUserPublished = async (user, mediaType) => {
  await  rtcClient.subscribe(user, mediaType);

  if (mediaType == "audio"){
    audioTracks.remoteAudioTracks[user.uid] = [user.audioTrack]
    user.audioTrack.play();
  }
}

let handleUserLeft = async (user) => {
  delete audioTracks.remoteAudioTracks[user.uid]
  document.getElementById(user.uid).remove()
}


// let lobbyForm = document.getElementById('form')

const enterRoom = async (e) => {
  e.preventDefault()
  console.log("hello")
  initRtc(e.target["name"].value,e.target["room"].value,join)
  form.current.style.display="none";
  loader.current.style.display="flex"
}

let leaveRoom = async () => {
  audioTracks.localAudioTrack.stop()
  audioTracks.localAudioTrack.close()
  rtcClient.unpublish()
  rtcClient.leave()
  form.current.style.display='flex'
  join.current.style.display='none'
  joined_options.current.style.display='none'
  join.current.innerHTML=''
}

const toggleMic = async () => {
  if (micMuted){
    mic_button.current.src = 'icons/mic.svg'
    mic_button.current.style.backgroundColor = 'ivory'
    micMuted = false
  }else{
    mic_button.current.src = 'icons/mic-off.svg'
    mic_button.current.style.backgroundColor = 'indianred'
    micMuted = true
  }
  audioTracks.localAudioTrack.setMuted(micMuted)
}

function App() {

  form=useRef(null)
  loader=useRef(null)
  join=useRef(null)
  joined_options=useRef(null)
  mic_button=useRef(null);

  const [roomId,setRoomId]=useState(null)
  const [displayName,setDisplayName]=useState(null);
  return (  
      <>
        <Container>
            <Title>Audio Chat Room</Title>
            <Box ref={form} >
              <Form onSubmit={(e)=>{
                enterRoom(e);
                setDisplayName(e.target["name"].value);
                setRoomId(e.target["room"].value)
              }}>
              <Label name="name">Display Name :</Label>
              <Input type="text" name="name" placeholder="Enter you name" required />
              <Label name="room">Room Id :</Label>
              <Input type="text" name="room" placeholder="Enter room id"  required/>
              <Input type="submit" name="submit" value="Enter room" style={{fontSize:'17px',cursor:'pointer'}} />
              </Form>
            </Box>
            <Box2 ref={loader}>
              <Loader/>
            </Box2>
            <Header ref={joined_options}>
                    <Left>Room Id - {roomId}<br/>Name - {displayName}</Left>
                    <Right>
                        <Button onClick={toggleMic}><img ref={mic_button} width={'100%'} height={'100%'} src="./icons/mic-off.svg"/></Button>
                        <Button onClick={leaveRoom}><img width={'100%'} height={'100%'} src="./icons/leave.svg"/></Button>
                    </Right>
                </Header>  
            <Box3 ref={join}>

            </Box3>


        </Container>
      </>
  );
}

export default App;
