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

        const PageText = moralis.Object.extend( "PageText", {}, {});

        


        const Commons = moralis.Object.extend( "Commons", 
        {}, 
        {  
            newCommons: function() { 
                                        const commons = new Commons();
                                        commons.set( "name",            document.getElementById( 'commonsname'     ).value  );
                                        commons.set( "vaultsymbol",     document.getElementById( 'vaultsymbol'     ).value  );
                                        commons.set( "organizer",       document.getElementById( 'organizer0'       ).value  ); 
                                        commons.set( "vaultname",       document.getElementById( 'vaultname'       ).value  ); 
                                        commons.set( "confirmations",   document.getElementById( 'confirmations'   ).value  );
                                        commons.set( "transferrable",   document.getElementById( 'transferrable'   ).checked + '' );
                                       
                                        var radios = document.getElementsByName( 'radio-group'   );                                 
                                        for (var i = 0; i < radios.length; i++) 
                                        {
                                            if ( radios[i].checked )
                                            {
                                               commons.set( "use",     radios[i].value  );
                                            }
                                        }
                                        return commons; 
                                    }
        });

        const callbackFunction = (user,address) => {  setUser(user); setAddress(address); setLoggedIn(true); CommonsList();}
        
        const objects =[];
        let cList = <div></div>;
        var itemRows = [];
        const CommonsList = async () => 
        {
            const query = new moralis.Query( Commons );
            const results = await query.find();
            for ( let i = 0; i < results.length; i++ ) 
            { 
                const object = results[i];
                objects.push( object ); 
            }
            const listItems = objects.map((commonsObject,i) =>  <li className="commonsitem" key={i}><PrimaryButton href={'/heavenly-jungle/viewcommons/?commonsId=' + commonsObject.id  } >{commonsObject.get('name') + ' - ' +       commonsObject.get('network') }</PrimaryButton></li> );
            setList(listItems);
        }

        const checkMetaMask = async () => {
    
            web3.eth.getAccounts(function(err, accounts){
                if (err != null) console.error("An error occurred: "+err);
                else if (accounts.length == 0) console.log("User is not logged in to MetaMask");
                else {console.log("User is logged in to MetaMask"); setEthEnabled(true); }
            });

        }

        const checkIfLoggedIn = async () => {
            if ( initialUser )
            {
                setLoggedIn(true);
            }            
        
        }


        const checkPageStatus = async () => {
            await checkMetaMask();
            checkIfLoggedIn();

        }
        
        const waitForMetaMask = async () => {
            setTimeout(function(){ checkPageStatus(); if ( ! ethEnabled || ! loggedIn ) { waitForMetaMask(); } }, 5000);
        }

        const toggleLanguage = async () => {
            var lang = user.get("lang");
            if ( lang === 'IND' ){
                user.set( "lang", "ENG" );
                await user.save();
                window.location.reload();
            }
            else {
                user.set( "lang", "IND" );
               await user.save();
                await getAlternativeText();
            }
             
            
        }

        const getText = async (key) => {
            const query = new moralis.Query( PageText );
            query.equalTo( "key", key );
            const results = await query.find();
            var text = '';
            if ( results.length > 0 )
            {
                const object = results[0];
                text = object.get( "pagetext" );
            }
            return text;
        }

        const getAlternativeText = async () => {

            setLanguage( 'IND' );
            setMainTitle( await getText( 'p1Title' ) );
            document.getElementById('community').innerHTML =    await getText( 'p1Community' );
            document.getElementById('personal').innerHTML =    await getText( 'p1Personal' );      
            document.getElementById('profile').innerHTML =    await getText( 'p1Profile' );              
        }

        const checkLanguage = async () => {
            var lang = user.get("lang");
            if ( lang === 'IND' ){getAlternativeText();}
        }


  useEffect(() => { 
                        checkPageStatus();
                        waitForMetaMask();
                        checkLanguage();
  // eslint-disable-next-line react-hooks/exhaustive-deps 
                      }, [ethEnabled,loggedIn])




        return (
                    <div className="App full-height" >
                   
                { ( loggedIn && ethEnabled &&     <Panel {...{title: mainTitle, titleCols: [<FlexCol fixed><DangerButton onClick={toggleLanguage} id="togglelang" >{language}</DangerButton><BrandButton id="profile" href="/heavenly-jungle/userprofile" >Profile</BrandButton><SignIn callBack={callbackFunction}/></FlexCol>], style: {  height: '100%', padding: '8px', background: '#f2f2f2'}}}>
                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '15%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><h1 id="community">Community</h1>{clist}</FlexCol>
                          <FlexCol {...{style: {padding: '8px'}}} ><h1 id="personal">Personal</h1>
                            <li className="commonsitem"><BrandButton >John Doe</BrandButton></li>
                            <li className="commonsitem"><BrandButton >Hugh Jarse</BrandButton></li>
                          </FlexCol>
                          <FlexCol />
                        </Grid>
                      </Panel> ) }
                
                   { ( ! ethEnabled && <Panel>
                        <Grid className="grid-show ">
<FlexCol  {...{style: {float: 'right'}}}></FlexCol>
                    <FlexCol><div className="txt-r">
                            <img src="./mm.png" />
                            <h1>Sign In To Metamask!</h1></div>
                     </FlexCol>
                            
                        </Grid>
                        </Panel>
                    ) }
                        
                     { ( ethEnabled && ! loggedIn && <Panel>
                        <Grid className="grid-show "><FlexCol  {...{style: {float: 'right'}}}><div className="txt-r">
                            <h1>Sign In With Metamask!</h1><br/><br/>
                            <SignIn callBack={callbackFunction}/><br/><br/>
                            <img src="./mm.png" /></div></FlexCol>
                        </Grid>
                        </Panel>
                    ) }


                    </div>
               );
}

export default App;
