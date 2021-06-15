import React, { useEffect, useState } from "react";
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
//import MOLCOMMONS_ABI from './MOLCOMMONS_ABI'
import GAMMA_ABI from './GAMMA_ABI'
import SignIn from './puiSignIn'

import MOLCOMMONS_ABI from './CONTROLLER_ABI'


moralis.initialize(process.env.REACT_APP_MORALIS_APPLICATION_ID);
moralis.serverURL = process.env.REACT_APP_MORALIS_SERVER_URL;

const orgaddresses = [];
function App() {

        const initialUser = moralis.User.current();
        const [user,        setUser]        = useState(initialUser);
        const [clist,       setList]        = useState('');
        const [orgList,     setOrgList]     = useState('');
        const [address,     setAddress]     = useState('Connect Wallet');
        const [chain,       setChain]       = useState('');
        const [connect,     toggleConnect]  = useState(false);
        const [gamma,       setGamma]       = useState(null)
        const [commons,     setCommons]     = useState(null)
        const [gammaUris,   setGammaUris]   = useState([])
        const [imageGrid,   setImageGrid]   = useState([])
        const [isCreator,   setIsCreator]   = useState(false)
        const [isAdmin,     setIsAdmin]     = useState(false)

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const callbackFunction = (user,address) => {  setUser(user); setAddress(address);getCommons();}

        const aboutus = () => {  window.location = '/heavenly-jungle/aboutus/?commonsId=' +  window.location.search.substring( 11 ) };

        const Organizer = moralis.Object.extend( "Organizer",{}, {} );

        const Avatar = moralis.Object.extend( "Avatar", {}, {} );

        const Commons = moralis.Object.extend( "Commons", {}, {});

        const NFT = moralis.Object.extend( "NFT", {}, {});
   
        var commonsAddress = '';
        const getCommons = async () =>
        {
            var commonsId =    window.location.search.substring( 11 );
            const query = new moralis.Query( Commons );
            query.equalTo( "objectId", commonsId );
            const results = await query.find();
            var commonsObject;
            if ( results.length > 0 ) // TODO 
            { 
               
                const object = results[0];
                const listItems = <li key={0}>{object.get('name') }</li>;
                setList(listItems);
                commonsAddress = object.get('contractAddress');
                setGamma( object.get('gammaAddress') )
                await getGammaUri( object.get('gammaAddress')  )
                setCommons( object.get('contractAddress')  );
                
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
                const titles = []
                const _contract = new ethers.Contract(gamma, GAMMA_ABI, signer)
                try 
                {
                      var supply = await _contract.totalSupply();
                    for (var i = 1; i <= supply.toNumber(); i++) 
                    {
                        var uri = await _contract.tokenURI(i)
                        uris.push(uri)
                        hashes.push( uri.substring( 21 ) );
                        const queryNFT = new moralis.Query( NFT );
                        queryNFT.equalTo( "fileHash", uri.substring( 21 ) );
                        const NFTResults = await queryNFT.find();
                        if ( NFTResults.length > 0 )
                        {
                            titles.push( NFTResults[0].get( "title" ) + ' - ' + NFTResults[0].get( "description" ));
                        }
                    }
                    setGammaUris(uris)
                                
                        const rows = uris.map((uri,index) => <li className="item" key={index}><TooltipTrigger  key={index} tooltip={titles[index]}><a href={'/heavenly-jungle/nft/?hash=' + hashes[index] }><img className="itemImage" src={uri} /></a></TooltipTrigger></li>  );
                        setImageGrid(rows);
                }
                catch (e) 
                {
                  console.log(e)
                }
              }


 // ----- Check owner status to toggle Admin button
  const isOwner = async () => {
    const _contract = new ethers.Contract(commonsAddress, MOLCOMMONS_ABI, signer)
    try {
      signer.getAddress().then((address) => {
        _contract
          .isController(address)
          .then((data) => {
            setIsAdmin(data)
          })
          .catch((e) => console.log(e))
      }).catch((e) => console.log(e))
    } catch (e) {
      console.log(e)
    }
  }

  // ----- Check whitelist status to toggle Mint button
  const isWhitelisted = async () => {
    const _contract = new ethers.Contract(commonsAddress, MOLCOMMONS_ABI, signer)
    try {
      signer.getAddress().then((address) => {
        _contract.isMinter(address).then((data) => {
          setIsCreator(data)
        }).catch((e) => console.log(e))
      }).catch((e) => console.log(e))
    } catch (e) {
      console.log(e)
    }
  }
       const arcade = () => {  window.location = '/heavenly-jungle/arcade?commonsId=' +  window.location.search.substring( 11 ) };

    useEffect( async () => { await getCommons();
                       if ( commonsAddress )
                       {

                           isOwner()
                           isWhitelisted()
                        }
                     }, [commonsAddress])

     return (
                    <div className="App" > 
                        <Panel {...{title: 'View Commons', titleCols: [<FlexCol fixed><BrandButton href="/heavenly-jungle/select/" >Home</BrandButton><BrandButton onClick={arcade} >Arcade</BrandButton><BrandButton onClick={aboutus} >About Us</BrandButton><SignIn callBack={callbackFunction}/></FlexCol>], style: {  padding: '8px', background: '#f2f2f2'}}}>
                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><h1>{clist}</h1></FlexCol>
                          <FlexCol />
                        </Grid>
                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><h3>Organizers</h3> {orgList} </FlexCol>
                          <FlexCol/>
                        </Grid>
                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} >{isCreator && ( <PrimaryButton href={'/heavenly-jungle/minter/?commonsId=' + window.location.search.substring( 11 ) } >Mint</PrimaryButton>)}&nbsp;&nbsp;{isAdmin && ( <PrimaryButton href={'/heavenly-jungle/admin/?commonsId=' + window.location.search.substring( 11 ) } >Admin</PrimaryButton>)}</FlexCol>
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
