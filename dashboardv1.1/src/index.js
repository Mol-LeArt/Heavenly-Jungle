import React, { useState } from "react";
import ReactDOM from "react-dom";
import moralis from "moralis";

import Profile from "./puiUserProfile";
import Select from "./puiSelectCommons";
import ViewCommons from "./puiViewCommons";

import BrowserApp from "./BrowserApp";
import Deploy from "./puiDeploy";
import NFTView from "./puiNFTView";
import Minter from "./puiMinter";
import About from "./puiAboutCommons";
import Admin from "./puiAdminCommons";
import Arcade from "./puiArcade";
import LP from "./Landing-Page.js";


moralis.initialize(process.env.REACT_APP_MORALIS_APPLICATION_ID);
moralis.serverURL = process.env.REACT_APP_MORALIS_SERVER_URL;

const initialUser = moralis.User.current();


ReactDOM.render(
  <React.StrictMode>
 
 <Minter/>

  </React.StrictMode>,
  document.getElementById("root")
);


//
