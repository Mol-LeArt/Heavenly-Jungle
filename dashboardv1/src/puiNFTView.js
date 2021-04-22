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
        const [user,        setUser]        = useState(initialUser);
        const [address,     setAddress]     = useState('Connect Wallet');
        const [chain,       setChain]       = useState('');
        const [connect,     toggleConnect]  = useState(false);

        const [image,       setImage]       = useState('');
        const [createdAt,   setCreatedAt]   = useState('');
        const [title,       setTitle]       = useState('Title');
        const [description, setDescription] = useState('Description');

        window.addEventListener( 'load', async function() { if (user) { await getNetwork(); setUser(user); setAddress(user.get("ethAddress") ); getImage(); } }) ;
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

        const Organizer = moralis.Object.extend( "Organizer", {}, {} );

        const Avatar = moralis.Object.extend( "Avatar",  {}, {} );

        const Commons = moralis.Object.extend( "Commons", {}, {} );

        const NFT = moralis.Object.extend( "NFT", {}, {});
        
        const getImage = async () =>
        {
            //nftview?hash=QmbZbL7RMxowUzFm8tPxxi6FuYkAuWiAj1eP1Bwsw1haRM
            var imageHash =    window.location.search.substring( 6 );
            //alert( 'hash ' + imageHash + '\n' + window.location.search );
            const query = new moralis.Query( NFT );
            query.equalTo( "fileHash", imageHash );
            const results = await query.find();
            
            if ( results.length > 0 )
            {
                let image = results[0];
                //alert( image.get( "metadata" ) );
                let metadata = image.get( "metadata" );
                var date = new Date( metadata.createdAt );
                setCreatedAt( date.toString() );
                setImage( metadata.image );
                setTitle( image.get( "title" ) );
                setDescription( image.get( "description" ) );
            }
            else
            {   
                //TODO What?
            }
        }

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
                const listItems = <h1>{object.get('name') + ' - ' + object.get('vaultname')}</h1>;
            //    setList(listItems);

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
                    org = { address: object.get( 'address' ), url: 'https://gateway.pinata.cloud/ipfs/' + avatarResults[i].get("image") };
                }
                else
                {
                    org = { address: object.get( 'address' ), url: 'profile.jpg' };
                }  
                orglistItems.push( org );          
            }
            const orgsDisplay = orglistItems.map((organizer,index) => <TooltipTrigger tooltip={organizer.address}>&nbsp;<img src={organizer.url}  className="avatarimage" />&nbsp;</TooltipTrigger> );
           // setOrgList(orgsDisplay);
        }

      



      return (
                    <div className="App" >
                        <Panel {...{title: 'Overview', titleCols: [<FlexCol fixed><BrandButton href="/" >Home</BrandButton><BrandButton onClick={aboutus} >About Us</BrandButton><PrimaryButton onClick={onLogin} >{address + ' - ' + chain}</PrimaryButton></FlexCol>], style: {  padding: '8px', background: '#f2f2f2'}}}>
                        <Grid className="grid-show ">
                            <FlexCol fixed {...{style: {width: '5%'}}}/>
                            <FlexCol {...{style: {padding: '8px'}}} ><img src={image} /><br/><br/>{title}<br/><br/>{description}<br/><br/>{createdAt}</FlexCol>
                          <FlexCol fixed {...{style: {width: '5%'}}} />
                        </Grid>

                      </Panel>
                    </div>
               );


}

export default App;
