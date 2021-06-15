import React, { useEffect, useState, useContext } from 'react'

import ImageUpload from './ImageUpload'
import { GlobalContext } from './GlobalContext'
import {DefaultButton, PrimaryButton, DangerButton, BrandButton} from 'pivotal-ui/react/buttons';
import moralis from "moralis";
import { ethers } from 'ethers'
import axios from 'axios';
import MOLCOMMONS_ABI from './MOLCOMMONS_ABI'
import {Panel} from 'pivotal-ui/react/panels';
import {Grid, FlexCol} from 'pivotal-ui/react/flex-grids';
import {Input} from 'pivotal-ui/react/inputs';
import {Checkbox} from 'pivotal-ui/react/checkbox';
import GAMMA_ABI from './GAMMA_ABI'
import SignIn from './puiSignIn'
import web3 from 'web3';

import Uppy from '@uppy/core'
import Tus from '@uppy/tus'
import { DragDrop } from '@uppy/react'

//const { Dashboard } = require('@uppy/react')

import {Dashboard} from '@uppy/react'

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'



moralis.initialize(process.env.REACT_APP_MORALIS_APPLICATION_ID);
moralis.serverURL = process.env.REACT_APP_MORALIS_SERVER_URL;

const MintNFT = () => {
  // ----- useState
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sale, setSale] = useState('')
  const [ethPrice, setEthPrice] = useState('')
  const [coinPrice, setCoinPrice] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [compliance, setCompliance] = useState(false)
  const [metadata, setMetadata] = useState(null)
  const [account, setAccount] = useState('')
  const [chain, setChain] = useState('')
  const initialUser = moralis.User.current()
  const [user, setUser] = useState(initialUser)
  const [connect, toggleConnect] = useState(false)
  const [imageHash, setImageHash] = useState('');
  const [imageUrl, setImageUrl] = useState('profile.jpg');
  const [commonsAddress, setCommonsAddress] = useState(''); 
  const [message, setMessage] = useState(''); 
  const [terms, setTerms] = useState(''); 
    const [address,     setAddress]     = useState('')
        const [airdrop,                 setAirdrop              ] = useState(null)



  const provider = new ethers.providers.Web3Provider(window.ethereum);

const Commons = moralis.Object.extend( "Commons", { /* Instance methods*/ },  {  });

const NFT = moralis.Object.extend( "NFT", { /* Instance methods*/ }, 
        {  
            newNFT: function(dict,fileHash,commonsContractAddress,gammaContractAddress,supply, txHash) { 
                                        const nft = new NFT();
                                        nft.set( "fileHash",        fileHash                );
                                        nft.set( "metadata",        dict                    );
                                        nft.set( "title",           title                   );
                                        nft.set( "description",     description             );
                                        nft.set( "onsale",          sale                    );
                                        nft.set( "commonsAddress",  commonsContractAddress  );
                                        nft.set( "gammaAddress",    gammaContractAddress    );
                                        nft.set( "tokenIndex",      ( supply.toNumber() + 1 )  + ''   );
                                        nft.set( "ethPrice",        ethPrice                );
                                        nft.set( "coinPrice",       coinPrice               );
                                        nft.set( "txHash",          txHash                  );
                                        return nft; 
                                    }
        });



        const getCommons = async () =>
        {
            var commonsId =    window.location.search.substring( 11 );
            const query = new moralis.Query( Commons );
            query.equalTo( "objectId", commonsId );
            const results = await query.find();
            var commonsObject;
            if ( results.length > 0 ) 
            { 
                const object = results[0];
                setTerms( object.get('tandc') );
            }
        }

  const signer = provider.getSigner()

 

  const checkMintable = async () => { 

                                        //alert('check mintable' ); 
                                        if ( title != '' && description != '' && ethPrice != '' && coinPrice != '' && compliance )
                                        {
                                            //alert( 'mintable...............' ); 
                                            doMint();
                                        }
                                        else
                                        {
                                            alert( 'not mintable, need more info' );        
                                        }
                                    }



//On file select (from the pop up)
	const onFileChange = event => {
		// Update the state
        var reader;
	    setImageFile(event.target.files[0]);
        reader = new FileReader();
        reader.onload = function(e) { setImageUrl( e.target.result ); }
        reader.readAsDataURL(event.target.files[0]);
	};


  const onSubmit = (e) => {
    e.preventDefault()

    if (compliance) {
      const nft = {
        account: account,
        title: title,
        description: description,
        compliance: compliance,
      }
      setMetadata(nft);
      doMint();
    } else {
      alert('You must accept!')
    }
  }

    const doMint = async () => {
                                    setMessage( 'Uploading to IPFS!' );
                                    document.getElementById( 'loading' ).style.display = 'block';
                                    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
                                    let   data = new FormData();
                                    data.append("file", imageFile, imageFile.name );
                                    const res = await axios.post(   url, data, {  maxContentLength: "Infinity", 
                                                                    headers: { "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
                                                                    pinata_api_key: process.env.REACT_APP_PINATA_PUBLIC,
                                                                    pinata_secret_api_key: process.env.REACT_APP_PINATA_PRIVATE,            },   });
                                    console.log(res.data);
                                    setImageHash( res.data.IpfsHash );
                                    setImageUrl( 'https://gateway.pinata.cloud/ipfs/' + res.data.IpfsHash );
                                    setMessage( 'Successfully uploaded to IPFS. Now Minting NFT! Please Wait!' );


                                    try
                                    {           
                                         uploadAndMint(res.data.IpfsHash)
                                    } 
                                    catch (e) 
                                    { 
                                         console.log('error is - ' + e) 
                                    }
      


    }

  // ----- Upload tokenURI and Mint NFT
  const uploadAndMint = async (hash) => {

                                                const baseUrl = 'https://ipfs.io/ipfs/'

                                                // Add timestamp to metadata
                                                const date = new Date()
                                                const timestamp = date.getTime()
                                                const dict = { ...metadata, image: baseUrl + hash, createdAt: timestamp }
                                                console.log('tokenURI at mint is - ', dict)
                                            
                                                var commonsId =    window.location.search.substring( 11 );
                                                const query = new moralis.Query( Commons );
                                                query.equalTo( "objectId", commonsId );
                                                const results = await query.find();
                                                if ( results.length == 0 )
                                                {                                         
                                                    alert( 'Commons not found' );
                                                }
                                                var contractaddress = results[0].get('contractAddress');
                                                                                  

                                                
                                            try {
                                                    // Mint NFT
                                                    const tokenUri = baseUrl + hash
                                                    console.log(tokenUri)
                                                    const p = ethers.utils.parseEther(ethPrice)
                                                    const c = ethers.utils.parseEther(coinPrice)
                                                  //  alert( 'contract params eth price ' + p + ' coin price' + c + ' uri ' + tokenUri + '  address ' + contractaddress );
                                                    molCommons(p, c, tokenUri, contractaddress, dict, hash )
  
                                                } catch (e) { console.log('error is - ' + e ) }
                                        }




 // ----- Mint Gamma with MolVault
   const molCommons = 
   async (price, coins, tokenURI, commonsContractAddress, dict, fileHash ) => {
                                                           
                                                                console.log('MolVault contract is - ', commonsContractAddress)
                                                                const _contract = new ethers.Contract(commonsContractAddress, MOLCOMMONS_ABI, signer)
                                                                try 
                                                                {
                                                                    const gammaAddress = await _contract.gamma();

                                                                    const gamma_contract = new ethers.Contract(gammaAddress, GAMMA_ABI, signer)
                                                                    const supply = await gamma_contract.totalSupply();

                                                                 //   alert( 'price ' + price + ' airdrop ' + ethers.utils.parseEther( airdrop ) );
                                                                  
                                                                    const tx = await _contract.mint( price, coins, tokenURI, sale ? 1 : 0, ethers.utils.parseEther( airdrop ) )//<<TODO!!                                                    
                                                                 
                                                                    console.log('tx.hash for minting - ' + tx.hash)
                                                                    setMessage( 'Waiting for confirmation' );

                                                                    tx.wait().then((receipt) => { 
                                                                                                    if (receipt.confirmations === 1) 
                                                                                                    {
                                                                                                        
                                                                                                        console.log('mint receipt is - ', receipt)
                                                                                                        //alert( 'save nft ' + tx.hash );
                                                                                                        const newNFT = NFT.newNFT( dict, fileHash, commonsContractAddress, gammaAddress, supply, tx.hash );
                                                                                                        newNFT.save();     

                                                                                                    }
                                                                                                    document.getElementById( 'loading' ).style.display = 'none';
                                                                                                    setMessage( <BrandButton href={ '/heavenly-jungle/nft/?hash=' + fileHash } >NFT Minted! View Here</BrandButton> );
                                                                                                 })
                                                                } catch (e) {  console.log(e)  }
                                                       }



        const callbackFunction = (user,address) => {  setUser(user); setAddress(address); }

async function getCommonsAddress()
    {
        var commonsId =    window.location.search.substring( 11 );
        const query = new moralis.Query( Commons );
        query.equalTo( "objectId", commonsId );
        const results = await query.find();
        var address = ''; 
         if ( results.length > 0 )
         {
             let image = results[0];
            address = image.get( "contractAddress" );
         }
        return address;
    }

 const getAirdrop = async () => {
            try {
              const _contract = new ethers.Contract(await getCommonsAddress(), MOLCOMMONS_ABI, signer)
              _contract.airdrop().then((data) => {
                const a = ethers.utils.formatEther(data)
                setAirdrop(a)
              })
            } catch (e) {
              console.log(e)
            }
          }

 useEffect(() => {

    getCommons(); 
    getAirdrop();

  }, [])



const uppy = new Uppy({
  meta: { type: 'avatar' },
  restrictions: { maxNumberOfFiles: 1 },
  autoProceed: true
})



  return (
    <div className="App" >
                        <Panel {...{title: 'Minter', titleCols: [<FlexCol fixed><BrandButton href="/heavenly-jungle/select/" >Home</BrandButton><SignIn callBack={callbackFunction}/></FlexCol>], style: {  padding: '8px', background: '#f2f2f2'}}}>
        <Grid className="grid-show">
            <FlexCol fixed {...{style: {width: '20%'}}}><img id="previewImage" src={imageUrl} /></FlexCol>
            <FlexCol {...{style: {padding: '8px'}}} >
            
        
      <form class='space-y-4' onSubmit={onSubmit}>
        <Grid className="grid-show">
            <FlexCol fixed {...{style: {width: '35%'}}}/>
            <FlexCol {...{style: {padding: '8px'}}} ><Input placeholder='Enter Title' type="text" value={title} onChange={(e) => setTitle(e.target.value)} /></FlexCol>
            <FlexCol />
        </Grid>
        <Grid className="grid-show">
            <FlexCol fixed {...{style: {width: '35%'}}}/>
            <FlexCol {...{style: {padding: '8px'}}} ><Input placeholder='Enter Description'  type="text" value={description} onChange={(e) => setDescription(e.target.value)} /></FlexCol>
            <FlexCol />
        </Grid>
        <Grid className="grid-show">
            <FlexCol fixed {...{style: {width: '35%'}}}/>
            <FlexCol {...{style: {padding: '8px'}}} ><Checkbox type='Checkbox' onChange={(e) => setSale(e.target.value)} ><span>Put on sale?</span></Checkbox></FlexCol>
            <FlexCol />
        </Grid>
        <Grid className="grid-show">
            <FlexCol fixed {...{style: {width: '35%'}}}/>
            <FlexCol {...{style: {padding: '8px'}}} ><Input placeholder='Enter amount in Ξ'  type="text" value={ethPrice} onChange={(e) => setEthPrice(e.target.value)} /></FlexCol>
            <FlexCol />
        </Grid>
        <Grid className="grid-show">
            <FlexCol fixed {...{style: {width: '35%'}}}/>
            <FlexCol {...{style: {padding: '8px'}}} ><Input placeholder='Enter amount in coins'  type="text" value={coinPrice} onChange={(e) => { setCoinPrice(e.target.value);   } } /></FlexCol>
            <FlexCol />
        </Grid>
        <Grid className="grid-show">
            <FlexCol fixed {...{style: {width: '35%'}}}/>
            <FlexCol {...{style: {padding: '8px'}}} ><Input type="file" onChange={onFileChange} /></FlexCol>
          

  <FlexCol><Dashboard uppy={uppy} /></FlexCol>




        </Grid>
        <Grid className="grid-show">
            <FlexCol fixed {...{style: {width: '35%'}}}/>
            <FlexCol {...{style: {padding: '8px'}}} ><span>{terms}</span><Input type='Checkbox' onChange={(e) => { setCompliance(e.target.checked);  } } /></FlexCol>
            <FlexCol />
        </Grid>
        <Grid className="grid-show">
            <FlexCol fixed {...{style: {width: '35%'}}}/>
            <FlexCol {...{style: {padding: '8px'}}} ><PrimaryButton onClick={(e) => checkMintable() } id="mintButton" >Mint</PrimaryButton></FlexCol>
            <FlexCol />
        </Grid>


          </form></FlexCol>
            <FlexCol>{message}<br/><br/><div id="loading" ><img  src="loading.gif" /></div></FlexCol>
        </Grid>
     </Panel>
   </div>
  )
}

export default MintNFT
