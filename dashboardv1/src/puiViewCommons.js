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
import MOLCOMMONS_ABI from './MOLCOMMONS_ABI'

import GAMMA_ABI from './GAMMA_ABI'





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
        const [gamma, setGamma] = useState(null)
        const [commons, setCommons] = useState(null)
        const [gammaUris, setGammaUris] = useState([])
        const [imageGrid, setImageGrid] = useState([])

        window.addEventListener( 'load', async function() { if (user) { await getNetwork(); setUser(user); setAddress(user.get("ethAddress") ); getCommons(); } }) ;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

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

        const Organizer = moralis.Object.extend( "Organizer",{}, {} );

        const Avatar = moralis.Object.extend( "Avatar", {}, {} );

        const Commons = moralis.Object.extend( "Commons", {}, {});


        

        const getCommons = async () =>
        {
            var commonsId =    window.location.search.substring( 11 );
          //  alert( commonsId );
            const query = new moralis.Query( Commons );
            query.equalTo( "objectId", commonsId );
            const results = await query.find();
            var commonsObject;
            if ( results.length > 0 ) // TODO 
            { 
                const object = results[0];
                const listItems = <li key={0}>{object.get('name') }</li>;
                setList(listItems);
                setCommons( object.get('contractAddress')  );
                setGamma( object.get('gammaAddress') )
                await getGammaUri( object.get('gammaAddress')  )
            }
            else
            {
                alert( 'Commons not found!' );  //TODO handle this properly
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

            const orgsDisplay = orglistItems.map((organizer,index) => <TooltipTrigger key={index} tooltip={organizer.address}>&nbsp;<img src={organizer.url}  className="avatarimage" />&nbsp;</TooltipTrigger> );
            setOrgList(orgsDisplay);
        }

           // ----- Get Gamma tokens
              const getGammaUri = async (gamma) => {
                
                const uris = []
                const hashes = []
               
                const _contract = new ethers.Contract(gamma, GAMMA_ABI, signer)
                try 
                {

                        var supply = await _contract.totalSupply();
                        for (var i = 1; i <= supply.toNumber(); i++) 
                        {
                            var uri = await _contract.tokenURI(i)
                            uris.push(uri)
                            hashes.push( uri.substring( 21 ) );
                        }
                            
                        setGammaUris(uris)

                   
                //https://ipfs.io/ipfs/QmbZbL7RMxowUzFm8tPxxi6FuYkAuWiAj1eP1Bwsw1haRM
//                        const fileHash =    window.location.search.substring( 11 )                         
            
                        const rows = uris.map((uri,index) => <li className="item" key={index}><TooltipTrigger  key={index} tooltip={uri}><a href={'/nftview?hash=' + hashes[index]}><img className="itemImage" src={uri} /></a></TooltipTrigger></li>  );



                   setImageGrid(rows);
                  
                }
                catch (e) 
                {
                  console.log(e)
                }
              }




        return (
                    <div className="App" >
                        <Panel {...{title: 'Overview', titleCols: [<FlexCol fixed><BrandButton href="/" >Home</BrandButton><BrandButton onClick={aboutus} >About Us</BrandButton><PrimaryButton onClick={onLogin} >{address + ' - ' + chain}</PrimaryButton></FlexCol>], style: {  padding: '8px', background: '#f2f2f2'}}}>
                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><h1>{clist}</h1></FlexCol>
                          <FlexCol />
                        </Grid>

                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} >Organizers {orgList}</FlexCol>
                          <FlexCol/>
                        </Grid>
                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><PrimaryButton href={'/mint?commonsId=' + window.location.search.substring( 11 )} >Mint</PrimaryButton></FlexCol>
                          <FlexCol />
                        </Grid>
                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '5%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><ul>
                         {imageGrid}</ul></FlexCol>
                          <FlexCol fixed {...{style: {width: '5%'}}} />
                        </Grid>
                        
      
                       

                      </Panel>
                    </div>
               );


}

export default App;
