import React, { useEffect, useState, useContext } from 'react'

import ImageUpload from './ImageUpload'
import { GlobalContext } from './GlobalContext'
import {DefaultButton, PrimaryButton, DangerButton, BrandButton} from 'pivotal-ui/react/buttons';
import moralis from "moralis";
import { ethers } from 'ethers'
import axios from 'axios';
import MOLCOMMONS_ABI from './CONTROLLER_ABI'
import {Panel} from 'pivotal-ui/react/panels';
import {Grid, FlexCol} from 'pivotal-ui/react/flex-grids';
import {Input} from 'pivotal-ui/react/inputs';
import {Checkbox} from 'pivotal-ui/react/checkbox';
import GAMMA_ABI from './GAMMA_ABI'
import SignIn from './puiSignIn'
import web3 from 'web3';
//import Uppy from '@uppy/core'
//import Tus from '@uppy/tus'
//import { DragDrop } from '@uppy/react'
//import {Dashboard} from '@uppy/react'
import AddCollaboratorModal from './puiCollaboratorModal'

import ReactPlayer from "react-player";
//import '@uppy/core/dist/style.css'
//import '@uppy/dashboard/dist/style.css'



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
  const [imageUrl, setImageUrl] = useState('upload-image.png')
  const [commonsAddress, setCommonsAddress] = useState('') 
  const [message, setMessage] = useState('') 
  const [terms, setTerms] = useState('') 
  const [address,     setAddress]     = useState('')
  const [airdrop,                 setAirdrop              ] = useState(null)
  const [collaboratorRows,setCollaboratorRows] = useState();
  const [collaborators,setCollaborators] = useState([]);
  const [collaboratorAddresses,setCollaboratorAddresses] = useState([]);
  const [collaboratorSplits,setCollaboratorSplits] = useState([]);
  const [splitAmount,setSplit] = useState('');
  const [unlockLink, setUnlockLink] = useState();
  const [extension,     setExtension] = useState();



  const provider = new ethers.providers.Web3Provider(window.ethereum);

const Commons = moralis.Object.extend( "Commons", { /* Instance methods*/ },  {  });

const NFT = moralis.Object.extend( "NFT", { /* Instance methods*/ }, 
        {  
            newNFT: function(dict,fileHash,commonsContractAddress,gammaContractAddress,supply, txHash, fileName, extension) { 
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
                                        nft.set( "unLockLink",      unlockLink              );
                                        nft.set( "txHash",          txHash                  );
                                        nft.set( "fileName",        fileName                );
                                        nft.set( "extension",       extension               );
                                        return nft; 
                                    }
        });
        
        var minters_ = [];
        const addCollaboratorCallbackFunction = (collabAddress,collabSplit) => {  
            
            collaboratorAddresses.push( collabAddress );
            collaboratorSplits.push( collabSplit );
            setCollaboratorAddresses( collaboratorAddresses );
            setCollaboratorSplits( collaboratorSplits );
            collaborators.push( { address : collabAddress, Split : collabSplit } );
            setCollaborators( collaborators );
            setCollaboratorRows( collaborators.map((colaborator,i) =>     
            <div key={i} ><Grid  key={i} className="grid-show">
              <FlexCol fixed {...{style: {width: '35%'}}}/>
              <FlexCol {...{style: {padding: '8px'}}} ><span className="label" >Collaborator {i + 1}</span><Input placeholder="Collaborater Address" id={'collaborater' + i} type="text" defaultValue={colaborator.address} /></FlexCol>
              <FlexCol className=" txt-l"></FlexCol>
            </Grid>
            <Grid  key={'split' + i} className="grid-show">
              <FlexCol fixed {...{style: {width: '35%'}}}/>
              <FlexCol {...{style: {padding: '8px'}}} ><span className="label" >Collaborator Split {i + 1}</span><Input placeholder="Collaborater Split" id={'collaboratorSplit' + i} type="text" defaultValue={colaborator.Split} /></FlexCol>
              <FlexCol className=" txt-l"></FlexCol>
            </Grid></div>
                                )
                       );

         }


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
                                        if ( title != '' && description != '' && ethPrice != ''  && compliance )
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
        setExtension(event.target.files[0].name.substring(event.target.files[0].name.indexOf('.')));
        reader = new FileReader();
        reader.onload = function(e) { setImageUrl( e.target.result ); }
        reader.readAsDataURL(event.target.files[0]);
	};





    const doMint = async () => {
    
                                    setMessage( 'Uploading to IPFS!' );
                                    document.getElementById( 'loading' ).style.display = 'block';
                                    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
                                    let   data = new FormData();
                                    data.append("file", imageFile, imageFile.name );
                                   // alert( imageFile.name );
                                //    setFileName( imageFile.name );
                                //    setExtension( imageFile.name.substring( imageFile.name.indexOf( '.' ) ) );
                                    const res = await axios.post(   url, data, {  maxContentLength: "Infinity", 
                                                                    headers: { "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
                                                                    pinata_api_key: process.env.REACT_APP_PINATA_PUBLIC,
                                                                    pinata_secret_api_key: process.env.REACT_APP_PINATA_PRIVATE,            },   });
                                    console.log(res.data);
                                    setImageHash( res.data.IpfsHash );
                                    setImageUrl( 'https://gateway.pinata.cloud/ipfs/' + res.data.IpfsHash );
                                    setMessage( 'Successfully uploaded to IPFS. Now Minting NFT! Please Wait!' );

                               //     alert( imageFile.name + ' ' + imageFile.name.substring( imageFile.name.indexOf( '.' ) ));

                                    try
                                    {           
                                         uploadAndMint(res.data.IpfsHash,imageFile.name,imageFile.name.substring( imageFile.name.indexOf( '.' ) ))
                                    } 
                                    catch (e) 
                                    { 
                                         console.log('error is - ' + e) 
                                    }
      


    }

  // ----- Upload tokenURI and Mint NFT
  const uploadAndMint = async (hash,filename,extension) => {

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

                                                    molCommons(p, tokenUri, contractaddress, dict, hash,filename,extension )
  
                                                } catch (e) { console.log('error is - ' + e ) }
                                        }




 // ----- Mint Gamma with MolVault
   const molCommons = 
   async (price, tokenURI, commonsContractAddress, dict, fileHash,filename,extension ) => {
    console.log('MolVault contract is - ', commonsContractAddress)
    const _contract = new ethers.Contract(commonsContractAddress, MOLCOMMONS_ABI, signer)
    try{
      const gammaAddress = await _contract.gamma();
      const gamma_contract = new ethers.Contract(gammaAddress, GAMMA_ABI, signer)
      const supply = await gamma_contract.totalSupply();
      const tx = await _contract.mint( price, tokenURI, sale ? 1 :0, await signer.getAddress(), splitAmount, collaboratorAddresses, collaboratorSplits  )                                                    

      console.log('tx.hash for minting - ' + tx.hash)
      setMessage( 'Waiting for confirmation' );
 
     tx.wait().then((receipt) => { 
         console.log('mint receipt is - ', receipt)
         const newNFT = NFT.newNFT( dict, fileHash, commonsContractAddress, gammaAddress, supply, tx.hash, filename, extension );
         newNFT.save();
       }).then(() =>{ 
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


 useEffect(() => {

    getCommons(); 
    

  }, [])







  return (
    <div className="App full-height" >
                        <Panel {...{title: 'Minter', titleCols: [<FlexCol fixed><BrandButton href="/heavenly-jungle/select/" >Home</BrandButton><SignIn callBack={callbackFunction}/></FlexCol>], style: {  height: '100%', padding: '8px', background: '#f2f2f2'}}}>
        <Grid className="grid-show">
            <FlexCol fixed {...{style: {width: '20%'}}}>
                { extension !== '.mp4' &&
                    <div><img id="previewImage" src={imageUrl} /><br/><br/></div>
                }
                { extension === '.mp4' &&
                     <div>
                                    <ReactPlayer
                                     url={imageUrl}
                                      muted={true}
                                      playing={true}
                                      width="400px"
                                      loop={true}
                                    />
                                </div>
                }
            </FlexCol>
            <FlexCol {...{style: {padding: '8px'}}} >
            
        
     
        <Grid className="grid-show">
            <FlexCol fixed {...{style: {width: '35%'}}}/>
            <FlexCol {...{style: {padding: '8px'}}} ><span className="label" >Title</span><Input placeholder='Enter Title' type="text" value={title} onChange={(e) => setTitle(e.target.value)} /></FlexCol>
            <FlexCol />
        </Grid>
        <Grid className="grid-show">
            <FlexCol fixed {...{style: {width: '35%'}}}/>
            <FlexCol {...{style: {padding: '8px'}}} ><span className="label" >Description</span><Input placeholder='Enter Description'  type="text" value={description} onChange={(e) => setDescription(e.target.value)} /></FlexCol>
            <FlexCol />
        </Grid>
        <Grid className="grid-show">
            <FlexCol fixed {...{style: {width: '35%'}}}/>
            <FlexCol {...{style: {padding: '8px'}}} ><Checkbox type='Checkbox' onChange={(e) => setSale(e.target.value)} ><span>Put on sale?</span></Checkbox></FlexCol>
            <FlexCol />
        </Grid>
        <Grid className="grid-show">
            <FlexCol fixed {...{style: {width: '35%'}}}/>
            <FlexCol {...{style: {padding: '8px'}}} ><span className="label" >Price in Ξ</span><Input placeholder='Enter amount in Ξ'  type="text" value={ethPrice} onChange={(e) => setEthPrice(e.target.value)} /></FlexCol>
            <FlexCol />
        </Grid>
        <Grid className="grid-show">
            <FlexCol fixed {...{style: {width: '35%'}}}/>
            <FlexCol {...{style: {padding: '8px'}}} ><span className="label" >Collaborators Split</span><Input placeholder='Enter % for Collaborators'  type="text" value={splitAmount} onChange={(e) => setSplit(e.target.value)} /></FlexCol>
            <FlexCol />
        </Grid>



        <div className="deployButton"><br/>
        <AddCollaboratorModal callBack={addCollaboratorCallbackFunction} /><br/></div>
        {collaboratorRows}

      <Grid className="grid-show">
            <FlexCol fixed {...{style: {width: '35%'}}}/>
            <FlexCol {...{style: {padding: '8px'}}} ><span className="label" >Unlocked Content Link</span><Input placeholder='Unlocked Content Link'  type="text" value={unlockLink} onChange={(e) => setUnlockLink(e.target.value)} /></FlexCol>
            <FlexCol />
        </Grid>

        <Grid className="grid-show">
            <FlexCol fixed {...{style: {width: '35%'}}}/>
            <FlexCol {...{style: {padding: '8px'}}} ><Input type="file" onChange={onFileChange} /></FlexCol>
          

  <FlexCol></FlexCol>




        </Grid>
        <Grid className="grid-show">
            <FlexCol fixed {...{style: {width: '35%'}}}/>
            <FlexCol {...{style: {padding: '8px'}}} ><span>{terms}</span><Input type='Checkbox' onChange={(e) => { setCompliance(e.target.checked);  } } /></FlexCol>
            <FlexCol />
        </Grid>
        <Grid className="grid-show">
            <FlexCol fixed {...{style: {width: '35%'}}}/>
            <FlexCol {...{style: {padding: '8px'}}} ><PrimaryButton onClick={(e) => {checkMintable();} } id="mintButton" >Mint</PrimaryButton></FlexCol>
            <FlexCol />
        </Grid>


          </FlexCol>
            <FlexCol>{message}<br/><br/><div id="loading" ><img  src="loading.gif" /></div></FlexCol>
        </Grid>
     </Panel>
   </div>
  )
}

export default MintNFT
