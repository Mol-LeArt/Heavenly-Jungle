import React, { useState,  useEffect } from "react";
import ReactDOM from "react-dom";
import {DefaultButton, PrimaryButton, DangerButton, BrandButton} from 'pivotal-ui/react/buttons';
import {Grid, FlexCol} from 'pivotal-ui/react/flex-grids';
import {Panel} from 'pivotal-ui/react/panels';
import {Divider} from 'pivotal-ui/react/dividers';
import {Image} from 'pivotal-ui/react/images';
import {Input} from 'pivotal-ui/react/inputs';
import {Modal} from 'pivotal-ui/react/modal';
import {Checkbox} from 'pivotal-ui/react/checkbox';
import {Radio, RadioGroup} from 'pivotal-ui/react/radio';
import { ethers } from 'ethers'
import SignIn from './puiSignIn'

import moralis from "moralis";
import Web3 from 'web3';
import 'pivotal-ui/css/alignment';

import './App.css';
import 'pivotal-ui/css/modal';

moralis.initialize(process.env.REACT_APP_MORALIS_APPLICATION_ID);
moralis.serverURL = process.env.REACT_APP_MORALIS_SERVER_URL;

const orgaddresses = [];
function App() {

        const initialUser = moralis.User.current();
        const [user,        setUser]        = useState(initialUser);
        const [clist,       setList]        = useState('');
        const [address,     setAddress]     = useState('Connect Wallet');
        const [chain,       setChain]       = useState('');
        const [connect,     toggleConnect]  = useState(false);
        const [ethEnabled,  setEthEnabled]  = useState(false);
        const [loggedIn,    setLoggedIn]    = useState(false);
        const [mainTitle,   setMainTitle]    = useState('Select Commons');
        const [language,   setLanguage]    = useState('ENG');


        const provider = new ethers.providers.Web3Provider(window.ethereum);
        var web3 = new Web3(Web3.givenProvider);




        return (
                    <div className="App full-height" >
                   
                 <Panel {...{title: 'Very Important!', titleCols: [<FlexCol fixed></FlexCol>], style: {  height: '100%', padding: '8px', background: '#f2f2f2'}}}>
                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '15%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><h1>Hypothetical Art Community Document</h1></FlexCol>
                          <FlexCol />
                        </Grid>
                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '15%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} >
                            <h1>Directors/Organizers</h1><br/>
                            <p>Warren Buffer : 0x55dE04F385C47F362f308c0e9D4CbCA68e169bEe</p>                                                                   
                            <p>Elon Mask : 0x2649083F41BFA52bbf89Ad9071702D1E8B0e2edC</p>
                            <h1>Minters</h1>
                            <p>Elon Mask : 0x2649083F41BFA52bbf89Ad9071702D1E8B0e2edC</p>
                            <h1>Collaborators</h1>
                            <h3>Split for Collaborators is 30%</h3><br/>
                            <p>Digitizer - Max Headroom : 0x35B2756306D17BD4b96DB9Ca193f25B3Dbf717ba : <br/>Recieves 60% of split</p>
                            <p>Runner/Misc - Housain Belt : 0x6791420FcE77d93FB7c333c404C8EF4e3FfEEc3b <br/>Recieves 40% of split</p>
                            <h1>Transaction Fees</h1>
                            <p>10%</p>
                            <h1>About Us Text</h1>
                            <p>The carbon in our apple pies light years venture billions upon billions Drake Equation cosmic fugue. At the edge of forever are creatures of the cosmos with pretty stories for which there's little good evidence brain is the seed of intelligence permanence of the stars muse about. Made in the interiors of collapsing stars hearts of the stars the only home we've ever known at the edge of forever gathered by gravity take root and flourish and billions upon billions upon billions upon billions upon billions upon billions upon billions.</p>
                            <h1>Terms and Conditions Text</h1>
                            <p>Astonishment intelligent beings concept of the number one birth the ash of stellar alchemy culture.</p>
                          </FlexCol>
                          <FlexCol />
                        </Grid>
                      </Panel>


                    </div>
               );
}

export default App;
