import { useKeycloak } from '@react-keycloak/web';
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { BsGithub } from "react-icons/bs";

import './App.css';
import Nav from './components/Nav/Nav';

function App() {
  //We use this to access keycloak info such as if the uesr is logged in, and if they are, their information from their token.
  const { keycloak } = useKeycloak();

  useEffect(() => {
    if (keycloak.authenticated) {
      fetch('/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ sub: keycloak.tokenParsed.sub })
      });
    };
  }, []);
  return (
    <div style={{overflowX: "hidden"}}>
      <Nav/>
      <Outlet/>

      
    </div>
  );
}

export default App;
