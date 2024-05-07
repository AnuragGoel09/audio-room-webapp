import BounceLoader from "react-spinners/BounceLoader";
import React from 'react'
import styled from 'styled-components'

const Container=styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Loader() {
  return (
    <Container>
        <BounceLoader color="#378CE7" />
    </Container>
  )
}
