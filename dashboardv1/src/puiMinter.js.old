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
import axios from 'axios';

import ImageUpload from './ImageUpload'

import logo from './logo.svg';
import './App.css';
import 'pivotal-ui/css/modal';
import moralis from "moralis";

moralis.initialize(process.env.REACT_APP_MORALIS_APPLICATION_ID);
moralis.serverURL = process.env.REACT_APP_MORALIS_SERVER_URL;



const orgaddresses = [];
function App() {

        const [selectedFile, setFile] = useState('');
        const [selectedFileName, setFileName] = useState('');
        const [imageHash, setImageHash] = useState('');
        const [imageUrl, setImageUrl] = useState('profile.jpg');

        const initialUser = moralis.User.current();
        const [user, setUser] = useState(initialUser);
        const [name, setName] = useState('Name');
        const [clist, setList] = useState('');
        const [address, setAddress] = useState('Connect Wallet');
        const [chain, setChain] = useState('');
        const [connect, toggleConnect] = useState(false);
        const [twitter, setTwitter] = useState( 'Twitter' );
        const [instagram, setInstagram] = useState( 'Instagram' );
        const [metadata, setMetadata] = useState(null)

        const Avatar = moralis.Object.extend( "Avatar", 
        {
          // Instance methods
        }, 
        {  
            newAvatar: function(imageHash,address) { 
                                        const avatar = new Avatar();
                                        avatar.set( "image",        imageHash  );
                                        avatar.set( "owneraddress",      address.toLowerCase()    );
                                        return avatar; 
                                    }
        });
       const provider = new ethers.providers.Web3Provider(window.ethereum);

      window.addEventListener( 'load', async function() {    
                                                       if (user) 
                                                       {
                                                            await getNetwork();
                                                            setUser(user);
                                                            setAddress(user.get("ethAddress") );
                                                            if ( user.get("twitter") )
                                                            {
                                                               setTwitter(user.get("twitter") ); 
                                                            }
                                                            if ( user.get("instagram") )
                                                            {
                                                                setInstagram(user.get("instagram") ); 
                                                            }
                                                            if ( user.get("name") )
                                                            {
                                                                setName(user.get("name") ); 
                                                            }
                                                            const queryAvatar = new moralis.Query( Avatar );
                                                            queryAvatar.equalTo( "owneraddress", user.get("ethAddress") );
                                                            const avatarResults = await queryAvatar.find();

                                                            for ( let i = 0; i < avatarResults.length; i++ ) 
                                                            { 
                                                                setImageUrl( 'https://gateway.pinata.cloud/ipfs/' + avatarResults[i].get("image") );    
                                                            }        
                                                       }

                                                  }) ;

        const getFileForUpload = (img) => { setImg(img) }


// On file upload (click the upload button)
	const onFileUpload = async () => {

            const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
            let data = new FormData();
            data.append("file", selectedFile, selectedFile.name );
            const res = await axios.post(url, data, {
            maxContentLength: "Infinity", 
            headers: {
              "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
              pinata_api_key: process.env.REACT_APP_PINATA_PUBLIC, 
              pinata_secret_api_key: process.env.REACT_APP_PINATA_PRIVATE,
            },
        });
            console.log(res.data);
            setImageHash( res.data.IpfsHash );
            setImageUrl( 'https://gateway.pinata.cloud/ipfs/' + res.data.IpfsHash );
            
            const avatar = Avatar.newAvatar( res.data.IpfsHash, user.get( "ethAddress" ) );
            await avatar.save();  
	};

// On file select (from the pop up)
	const onFileChange = event => {
		// Update the state
	    setFile(event.target.files[0]);
	};

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

       const save = async () => {  
                                    if ( document.getElementById( 'name' ).value != '' )
                                    {
                                        user.set( "name", document.getElementById( 'name' ).value );
                                    }
                                    if ( document.getElementById( 'twitter' ).value != '' )
                                    {
                                        user.set( "twitter", document.getElementById( 'twitter' ).value );
                                    }
                                    if ( document.getElementById( 'instagram' ).value != '' )
                                    {
                                        user.set( "instagram", document.getElementById( 'instagram' ).value ); 
                                    }
                                    await user.save(); 

                                };





       return (
                    <div className="App" >
                        <Panel {...{title: 'Overview', titleCols: [<FlexCol fixed><BrandButton href="/" >Home</BrandButton><PrimaryButton onClick={onLogin} >{address + ' - ' + chain}</PrimaryButton></FlexCol>], style: {  padding: '8px', background: '#f2f2f2'}}}>

                        <Grid className="grid-show show-outline">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><Input placeholder="Title" id="title" type="text"/></FlexCol>
                          <FlexCol className="col-grow-2"/>
                        </Grid>
                        <Grid className="grid-show show-outline">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><Input placeholder="Description" id="description" type="text"/></FlexCol>
                          <FlexCol className="col-grow-2"/>
                        </Grid>
<Grid className="grid-show show-outline">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><Input placeholder="Sale" id="sale" type="text"/></FlexCol>
                          <FlexCol className="col-grow-2"/>
                        </Grid>
<Grid className="grid-show show-outline">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><Input placeholder="Eth Price" id="ethPrice" type="text"/></FlexCol>
                          <FlexCol className="col-grow-2"/>
                        </Grid>
<Grid className="grid-show show-outline">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><Input placeholder="Coin Price" id="coinPrice" type="text"/></FlexCol>
                          <FlexCol className="col-grow-2"/>
                        </Grid>

                        <Grid className="grid-show show-outline">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><ImageUpload getFileForUpload={getFileForUpload} />
				                                                    <button onClick={onFileUpload}>Upload!</button></FlexCol>
                          <FlexCol className="col-grow-2"><img className="avatarimage" src={imageUrl} /></FlexCol>
                        </Grid>
                      </Panel>
                    <div>{metadata && (  <Mint metadata={metadata} sale={sale} ethPrice={ethPrice} coinPrice={coinPrice} img={img} /> )}</div>
                 </div>
               );






   

}

export default App;
