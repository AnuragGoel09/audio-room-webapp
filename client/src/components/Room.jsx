import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Loader from './Loader';
import AgoraRTC from "agora-rtc-sdk-ng"
import appid from '../appId.js'
console.log(appid)

const token = null
const rtcUid =  Math.floor(Math.random()*2054)

const Container=styled.div`
    width: 90%;
    margin: auto;
`;
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
`;

export default function Room(props) {
    const leaveRoom=props.handleLeave;
  return (
    <Container>
                <Header>
                    <Left>Room Id - {props.roomName}<br/>Name - {props.displayName}</Left>
                    <Right>
                        <Button><img width={'100%'} height={'100%'} src="./icons/mic-off.svg"/></Button>
                        <Button onClick={leaveRoom}><img width={'100%'} height={'100%'} src="./icons/leave.svg"/></Button>
                    </Right>
                </Header>   
                {props.clients.map((item,index)=>(
                    <p key={index} style={{color:'black'}}>HELo</p>
                ))}
    </Container>
    
  )
}
