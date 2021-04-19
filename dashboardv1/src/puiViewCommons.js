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
                const listItems = <li key={i}>{object.get('name') }</li>;
                setList(listItems);
            }
            const queryOrgs = new moralis.Query( Organizer );
            queryOrgs.equalTo( "parentId", commonsId );
            const orgResults = await queryOrgs.find();
            let orglistItems = [];
            let addresses = [];
            
            
            for ( let j = 0; j < orgResults.length; j++ ) 
            { 
                const object = orgResults[j];
                await object.fetch();
              //  alert( 'org' + object.get( 'address' ) );

                const queryAvatar = new moralis.Query( Avatar );
                queryAvatar.equalTo( "owneraddress", object.get( 'address' ) );
                const avatarResults = await queryAvatar.find();
                var org;
              //  alert( 'avatars' + avatarResults.length );

                if ( avatarResults.length > 0 )
                {
                    if ( object && avatarResults[0] )
                    {
                           org = { address: object.get( 'address' ), url: 'https://gateway.pinata.cloud/ipfs/' + avatarResults[0].get("image") };
                    }
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
                          <FlexCol {...{style: {padding: '8px'}}} ><h1>{clist}</h1></FlexCol>
                          <FlexCol className="col-grow-2"/>
                        </Grid>

                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} >Organizers {orgList}</FlexCol>
                          <FlexCol className="col-grow-2"/>
                        </Grid>
                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><PrimaryButton href={'/mint?commonsId=' + window.location.search.substring( 11 )} >Mint</PrimaryButton></FlexCol>
                          <FlexCol className="col-grow-2"/>
                        </Grid>



                         <Grid className="grid-show ">
                                <FlexCol   {...{  style: {  background: '##f8f8f8', margin: '8px 8px', padding: '8px'}}}>
                                               
                                            </FlexCol> 
                                <FlexCol className="box-shadow-amb-3" fixed {...{  style: { width: '1025px',  background: '#fff8f8', margin: '16px 16px', padding: '16px'}}}>    
                                   
                                    <Grid className="grid-show ">
                                            <FlexCol className="box-shadow-amb-3" {...{  style: {  background: '#f8f8f8', margin: '8px 8px', padding: '8px'}}}>
                                                <div className="bg-light-gray pal" >
                                                    <Image href="/nftview?panel=1" className="box-shadow-3 txt-c" src="/panelsSmall/1.jpg" alt="Iweng"/>
                                                </div>
                                            </FlexCol>
                                            <FlexCol className="box-shadow-amb-3" {...{  style: {  background: '#f8f8f8', margin: '8px 8px', padding: '8px'}}}>
                                                <div className="bg-light-gray pal" >
                                                    <Image href="/nftview?panel=2" className="box-shadow-3 txt-c" src="/panelsSmall/2.jpg" alt="Iweng"/>
                                                </div>
                                            </FlexCol> 
                                            <FlexCol className="box-shadow-amb-3" {...{  style: {  background: '#f8f8f8', margin: '8px 8px', padding: '8px'}}}>
                                                <div className="bg-light-gray pal" >
                                                    <Image href="/nftview?panel=3" className="box-shadow-3 txt-c" src="/panelsSmall/3.jpg" alt="Iweng"/>
                                                </div>
                                            </FlexCol>  
                                        </Grid>

                                    <Grid className="grid-show ">
                                            <FlexCol className="box-shadow-amb-3" {...{  style: {height: '250px',  background: '#f8f8f8', margin: '8px 8px', padding: '8px'}}}>
                                                <div className="bg-light-gray pal" >
                                                    <Image href="/nftview?panel=4" className="box-shadow-3 txt-c" src="/panelsSmall/4.jpg" alt="Iweng"/>
                                                </div>
                                            </FlexCol>
                                            <FlexCol className="box-shadow-amb-3" {...{  style: {height: '250px',  background: '#f8f8f8', margin: '8px 8px', padding: '8px'}}}>
                                                <div className="bg-light-gray pal" >
                                                    <Image href="/nftview?panel=5" className="box-shadow-3 txt-c" src="/panelsSmall/5.jpg" alt="Iweng"/>
                                                </div>
                                            </FlexCol> 
                                            <FlexCol className="box-shadow-amb-3" {...{  style: {height: '250px',  background: '#f8f8f8', margin: '8px 8px', padding: '8px'}}}>
                                                <div className="bg-light-gray pal" >
                                                    <Image href="/nftview?panel=6" className="box-shadow-3 txt-c" src="/panelsSmall/6.jpg" alt="Iweng"/>
                                                </div>
                                            </FlexCol>  
                                        </Grid>

                                    <Grid className="grid-show ">
                                            <FlexCol className="box-shadow-amb-3" {...{  style: {height: '250px',  background: '#f8f8f8', margin: '8px 8px', padding: '8px'}}}>
                                                <div className="bg-light-gray pal" >
                                                    <Image href="/nftview?panel=7" className="box-shadow-3 txt-c" src="/panelsSmall/7.jpg" alt="Iweng"/>
                                                </div>
                                            </FlexCol>
                                            <FlexCol className="box-shadow-amb-3" {...{  style: {height: '250px',  background: '#f8f8f8', margin: '8px 8px', padding: '8px'}}}>
                                                <div className="bg-light-gray pal" >
                                                    <Image href="/nftview?panel=8" className="box-shadow-3 txt-c" src="/panelsSmall/8.jpg" alt="Iweng"/>
                                                </div>
                                            </FlexCol> 
                                            <FlexCol className="box-shadow-amb-3" {...{  style: {height: '250px',  background: '#f8f8f8', margin: '8px 8px', padding: '8px'}}}>
                                                <div className="bg-light-gray pal" >
                                                    <Image href="/nftview?panel=9" className="box-shadow-3 txt-c" src="/panelsSmall/9.jpg" alt="Iweng"/>
                                                </div>
                                            </FlexCol>  
                                        </Grid>
                                    </FlexCol> 
                                     <FlexCol   {...{  style: {  background: '##f8f8f8', margin: '8px 8px', padding: '8px'}}}>
                                                
                                            </FlexCol>   
                                 </Grid>

                      </Panel>
                    </div>
               );


}

export default App;
