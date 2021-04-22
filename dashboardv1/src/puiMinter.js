import React, { useState, useContext } from 'react'
import Mint from './Mint'
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
  const [account, setAccount] = useState(null)
  const [chain, setChain] = useState('')
  const initialUser = moralis.User.current()
  const [user, setUser] = useState(initialUser)
  const [connect, toggleConnect] = useState(false)
  const [imageHash, setImageHash] = useState('');
  const [imageUrl, setImageUrl] = useState('profile.jpg');
  const [commonsAddress, setCommonsAddress] = useState(''); 
  const provider = new ethers.providers.Web3Provider(window.ethereum);

const Commons = moralis.Object.extend( "Commons", { /* Instance methods*/ },  {  });

const NFT = moralis.Object.extend( "NFT", { /* Instance methods*/ }, 
        {  
            newNFT: function(dict,fileHash) { 
                                        const nft = new NFT();
                                    
                                        nft.set( "fileHash",     fileHash       );
                                        nft.set( "metadata",     dict           );
                                        nft.set( "title",        title          );
                                        nft.set( "description",  description    );
                                        nft.set( "onsale",       sale           );
                                        return nft; 
                                    }
        });


 window.addEventListener( 'load', async function() {  if (user) { await getNetwork(); setUser(user); setAccount(user.get("ethAddress") ); } }) ;


  const signer = provider.getSigner()

  const onLogin = async () => { await getNetwork(); const user = await moralis.authenticate(); setUser(user); setAccount(user.get("ethAddress") ); };

  const checkMintable = async () => { 

                                        //alert('check mintable' ); 
                                        if ( title != '' && description != '' && ethPrice != '' && coinPrice != '' && compliance )
                                        {
                                            alert( 'mintable...............' ); 
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
	    setImageFile(event.target.files[0]);
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
                                                                 //   alert( 'contract params eth price ' + price + ' coin price' + coins + ' uri ' + tokenURI + '  address ' + commonsContractAddress );

                                                                    const tx = await _contract.mint( price, coins, tokenURI, sale ? 1 : 0, price )                                                             
                                                                 //   alert( 'post tx' );

                                                                     console.log('tx.hash for minting - ' + tx.hash)

                                                                    tx.wait().then((receipt) => { 
                                                                                                    if (receipt.confirmations === 1) 
                                                                                                    {
                                                                                                        console.log('mint receipt is - ', receipt)
                                                                                                        const newNFT = NFT.newNFT(dict, fileHash );
                                                                                                        newNFT.save();     
                                                                                                    }
                                                                                                 })
                                                                } catch (e) {  console.log(e)  }
                                                       }

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


  return (
    <div className="App" >
                        <Panel {...{title: 'Overview', titleCols: [<FlexCol fixed><BrandButton href="/" >Home</BrandButton><PrimaryButton onClick={onLogin} >{account + ' - ' + chain}</PrimaryButton></FlexCol>], style: {  padding: '8px', background: '#f2f2f2'}}}>

        
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
            <FlexCol />
        </Grid>
        <Grid className="grid-show">
            <FlexCol fixed {...{style: {width: '35%'}}}/>
            <FlexCol {...{style: {padding: '8px'}}} ><span>I agree to XYZ.</span><Input type='Checkbox' onChange={(e) => { setCompliance(e.target.checked);  } } /></FlexCol>
            <FlexCol />
        </Grid>
        <Grid className="grid-show">
            <FlexCol fixed {...{style: {width: '35%'}}}/>
            <FlexCol {...{style: {padding: '8px'}}} ><PrimaryButton onClick={(e) => checkMintable() } id="mintButton" >Mint</PrimaryButton></FlexCol>
            <FlexCol />
        </Grid>
        <div>
            <img src={imageUrl} />
        </div>
      </form>
     </Panel>
   </div>
  )
}

export default MintNFT
