import React, { useState } from "react";
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
import {Tooltip, TooltipTrigger} from 'pivotal-ui/react/tooltip';

import logo from './logo.svg';
import './App.css';
import 'pivotal-ui/css/modal';
import moralis from "moralis";



moralis.initialize(process.env.REACT_APP_MORALIS_APPLICATION_ID);
moralis.serverURL = process.env.REACT_APP_MORALIS_SERVER_URL;

const orgaddresses = [];
function App() {

        const initialUser = moralis.User.current();
        const [user, setUser] = useState(initialUser);
        const [clist, setList] = useState('');
        const [orgList, setOrgList] = useState('');
        const [address, setAddress] = useState('Connect Wallet');
        const [chain, setChain] = useState('');
        const [connect, toggleConnect] = useState(false);
        const [aboutHeader,     setAboutHeader] = useState('About - click edit to change');
        const [aboutParagraph,  setAboutParagraph] = useState('About - click edit to change');

        window.addEventListener( 'load', async function() { if (user) { await getNetwork(); setUser(user); setAddress(user.get("ethAddress") ); getCommons(); } }) ;
       const provider = new ethers.providers.Web3Provider(window.ethereum);


const getNetwork = () => {
    provider
      .getNetwork()
      .then((network) => {
        console.log('current chainId - ' + network.chainId)
        if (network.chainId === 100) {
          setChain('xDAI')
          toggleConnect(true)
        } else if (network.chainId === 4) {
          setChain('Rinkeby') 
          toggleConnect(true)
        } else if (network.chainId === 1) {
          setChain('Mainnet')
          toggleConnect(true)
        } else if (network.chainId === 3) {
          setChain('Ropsten')
          toggleConnect(true)
        } else if (network.chainId === 42) {
          setChain('Kovan')
          toggleConnect(true)
        } else {
          console.log('Pick a supported blockchain!')
        }
      })
      .catch((err) => {
        alert( 'err ' + err );
        console.log(err)
      })
  }

       const onLogin = async () => {                                        
                                        await getNetwork();
                                        const user = await moralis.authenticate();
                                        setUser(user);
                                        setAddress(user.get("ethAddress") );
                                   };

       const onLogout = () => {  moralis.User.logOut(); setUser(null); };

       const aboutus = () => {  window.location = '/about?commonsId=' +  window.location.search.substring( 11 ) };

        const editContent = () => {  document.getElementById('paragraph').style='display:block';document.getElementById('header').style='display:block'; };

        const saveContent = async () => {    var commonsId =    window.location.search.substring( 11 );
                                            const query = new moralis.Query( Commons );
                                            query.equalTo( "objectId", commonsId );
                                            const results = await query.find();
                                            var commonsObject;
                                            for ( let i = 0; i < results.length; i++ ) 
                                            { 
                                                const object = await results[i].fetch();
                                                if ( document.getElementById( 'about-header' ).value != '' )
                                                {
                                                    object.set( "header",       document.getElementById( 'about-header' ).value );
                                                    setAboutHeader( document.getElementById( 'about-header' ).value );
                                                }
                                                if ( document.getElementById( 'about-paragraph' ).value != '' )
                                                {
                                                    object.set( "paragraph",    document.getElementById( 'about-paragraph' ).value );
                                                    setAboutParagraph( document.getElementById( 'about-paragraph' ).value );
                                                }
                                                var resp =  await object.save();
                                                document.getElementById('paragraph').style='display:none';
                                                document.getElementById('header').style='display:none';
                                
                                            } 
                                };



        const Organizer = moralis.Object.extend( "Organizer", 
        {
          // Instance methods

        }, 
        {  
            newOrganizer: function(index) { 
                                        const organizer = new Organizer();
                                        alert( 'org ' + document.getElementById( 'organizer' + index ).value );
                                        organizer.set( "address",        document.getElementById( 'organizer' + index ).value  );
                                        return organizer; 
                                    }
        });

        const Avatar = moralis.Object.extend( "Avatar", 
        {
          // Instance methods
        }, 
        {  
            newAvatar: function(imageHash,address) { 
                                        const avatar = new Avatar();
                                        avatar.set( "image",        imageHash  );
                                        avatar.set( "owneraddress",      address    );
                                        return avatar; 
                                    }
        });

        const Commons = moralis.Object.extend( "Commons", 
        {
          // Instance methods

        }, 
        {  
            newCommons: function() { 
                                        const commons = new Commons();
                                        commons.set( "name",            document.getElementById( 'commonsname'     ).value  );
                                        commons.set( "vaultsymbol",     document.getElementById( 'vaultsymbol'     ).value  );
                                        commons.set( "organizer",       document.getElementById( 'organizer0'       ).value  ); 
                                        commons.set( "vaultname",       document.getElementById( 'vaultname'       ).value  ); 
                                        commons.set( "confirmations",   document.getElementById( 'confirmations'   ).value  );
                                        alert( 'tfer ' + document.getElementById( 'transferrable'   ).checked + '' );
                                        commons.set( "transferrable",   document.getElementById( 'transferrable'   ).checked + '' );
                                       
                                        var radios = document.getElementsByName( 'radio-group'   );                                 
                                        for (var i = 0; i < radios.length; i++) 
                                        {
                                            if ( radios[i].checked )
                                            {
                                               commons.set( "use",     radios[i].value  );
                                       //        alert( 'elements ' + i + ' ' + radios[i].checked );
                                            }
                                        }
                                        return commons; 
                                    }
        });

        const getCommons = async () =>
        {
            var commonsId =    window.location.search.substring( 11 );
          //  alert( commonsId );
            const query = new moralis.Query( Commons );
            query.equalTo( "objectId", commonsId );
            const results = await query.find();
            var commonsObject;
            for ( let i = 0; i < results.length; i++ ) 
            { 
                const object = results[i];
                commonsObject = object;
                const listItems = <h1>{object.get('name')}</h1>;
                setList(listItems);
                if ( object.get('header')  )
                {
                   setAboutHeader( object.get('header')  );
                }
                if ( object.get('paragraph') )
                {
                    setAboutParagraph( object.get('paragraph'));
                }
            }
            const queryOrgs = new moralis.Query( Organizer );
            queryOrgs.equalTo( "parentId", commonsId );
            const orgResults = await queryOrgs.find();
            let orglistItems = [];
            let addresses = [];
            for ( let i = 0; i < orgResults.length; i++ ) 
            { 
                const object = orgResults[i];
               
                const queryAvatar = new moralis.Query( Avatar );
                queryAvatar.equalTo( "owneraddress", object.get( 'address' ) );
                const avatarResults = await queryAvatar.find();
                var org;
                if ( avatarResults.length > 0 )
                {
                    org = { address: object.get( 'address' ), url: 'https://gateway.pinata.cloud/ipfs/' + avatarResults[0].get("image") };
                }
                else
                {
                    org = { address: object.get( 'address' ), url: 'profile.jpg' };
                }  
                orglistItems.push( org );          
            }
            const orgsDisplay = orglistItems.map((organizer,index) => <TooltipTrigger tooltip={organizer.address}>&nbsp;<img src={organizer.url}  className="avatarimage" />&nbsp;</TooltipTrigger> );
            setOrgList(orgsDisplay);
        }

        return (
                    <div className="App" >
                        <Panel {...{title: 'Overview', titleCols: [<FlexCol fixed><BrandButton href="/" >Home</BrandButton><BrandButton onClick={aboutus} >About Us</BrandButton><PrimaryButton onClick={onLogin} >{address + ' - ' + chain}</PrimaryButton></FlexCol>], style: {  padding: '8px', background: '#f2f2f2'}}}>
                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} >{clist}</FlexCol>
                          <FlexCol className="col-grow-2"/>
                        </Grid>

                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><h4>Organizers</h4> {orgList}</FlexCol>
                          <FlexCol className="col-grow-2"/>
                        </Grid>
                      </Panel>
                    <Panel {...{title: 'About', titleCols: [<FlexCol fixed></FlexCol>], style: {  padding: '8px', background: '#f2f2f2'}}}>
                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><h3>{aboutHeader}</h3>
                          </FlexCol>
                          <FlexCol className="col-grow-2"><PrimaryButton onClick={editContent} >Edit</PrimaryButton><div id="header"><br/><Input id="about-header" type="text"/><br/></div></FlexCol>
                        </Grid>
                    <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><p>{aboutParagraph}</p>
                            
                            </FlexCol>
                          <FlexCol className="col-grow-2"><div id="paragraph"><textarea id="about-paragraph"  ></textarea><br/><PrimaryButton onClick={saveContent} >Save</PrimaryButton></div></FlexCol>
                        </Grid>

  
                      </Panel>
                    </div>
               );


}

export default App;
