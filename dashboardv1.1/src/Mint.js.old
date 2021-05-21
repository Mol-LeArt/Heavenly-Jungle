import React, { useEffect, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import MOLCOMMONS_ABI from './MOLCOMMONS_ABI'
import { ethers } from 'ethers'

import axios from 'axios';
import moralis from "moralis";


moralis.initialize(process.env.REACT_APP_MORALIS_APPLICATION_ID);
moralis.serverURL = process.env.REACT_APP_MORALIS_SERVER_URL;


const Mint = ({ metadata, sale, ethPrice, coinPrice, img }) => {
  // ----- useContext

  const [imageHash, setImageHash] = useState('');
  const [imageUrl, setImageUrl] = useState('profile.jpg');
  const [commonsAddress, setCommonsAddress] = useState(''); 

  // ----- Reaect Router Config
  const history = useHistory()



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
                                            const query = new moralis.Query( Commons );
                                            query.equalTo( "objectId", commonsId );
                                            const results = await query.find();
                                            var commonsObject;
                                            for ( let i = 0; i < results.length; i++ ) // wtf??? only expecting one result. gotta find acceptable solution for this
                                            { 
                                                const object = results[i];
                                                commonsObject = object;
                                                setCommonsAddress( object.get('contractaddress') );
                                                alert( 'commons '  + object.get('contractaddress') );
                                            }
                                        }


  // ----- Smart Contract Config
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
  const signer = provider.getSigner()

  // ----- Upload image to Fleek Storage
  const upload = async () => {

    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    let   data = new FormData();
    data.append("file", img, img.name );
    const res = await axios.post( url, data, {  maxContentLength: "Infinity", 
                                                headers: { "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
                                                            pinata_api_key: process.env.REACT_APP_PINATA_PUBLIC,
                                                            pinata_secret_api_key: process.env.REACT_APP_PINATA_PRIVATE,            },
                                              });
    console.log(res.data);
    setImageHash( res.data.IpfsHash );
    setImageUrl( 'https://gateway.pinata.cloud/ipfs/' + res.data.IpfsHash );


  /*  const input = {
      apiKey: process.env.REACT_APP_FLEEK_API_KEY,
      apiSecret: process.env.REACT_APP_FLEEK_API_SECRET,
      bucket: 'audsssy-team-bucket',
      key: metadata.title,
      data,
    }*/

    try {
      //const result = await fleek.upload(input)
      //console.log('this is image hash from fleek - ' + result.hash)
      // Prepare to mint NFT

            uploadAndMint(res.data.IpfsHash)
        } 
        catch (e) { console.log('error is - ' + e) }
  }

  // ----- Upload tokenURI and Mint NFT
  const uploadAndMint = async (hash) => {
    alert( 'get commons ' );
    await getCommons();
    alert( 'get commons ' + commonsAddress );
    const baseUrl = 'https://ipfs.io/ipfs/'

    // Add timestamp to metadata
    const date = new Date()
    const timestamp = date.getTime()
    const dict = { ...metadata, image: baseUrl + hash, createdAt: timestamp }
    console.log('tokenURI at mint is - ', dict)
    alert('tokenURI at mint is - ', dict)

  /*  const data = JSON.stringify(dict)
    const i = {
      apiKey: process.env.REACT_APP_FLEEK_API_KEY,
      apiSecret: process.env.REACT_APP_FLEEK_API_SECRET,
      bucket: 'audsssy-team-bucket',
      key: hash,
      data,
    }
*/
    try {
      // Uplaod tokenUri to Fleek
  //    const result = await fleek.upload(i)
  //    console.log('this is tokenUri hash from fleek - ' + result.hash)

      // Mint NFT
      const tokenUri = baseUrl + hash
      console.log(tokenUri)
      const p = ethers.utils.parseEther(ethPrice)
      const c = ethers.utils.parseEther(coinPrice)
      molCommons(p, c, tokenUri)
  
    } catch (e) {
      console.log('error is - ' + e )
    }
  }

  // ----- Mint Gamma with MolVault
  const molCommons = async (price, coins, tokenURI) => {
    console.log('MolVault contract is - ', commonsAddress)
    const _contract = new ethers.Contract(commonsAddress, MOLCOMMONS_ABI, signer)
    try {
      const tx = await _contract.mint(price, coins, tokenURI, sale)
      console.log('tx.hash for minting - ' + tx.hash)

      tx.wait().then((receipt) => {
        if (receipt.confirmations === 1) {
          console.log('mint receipt is - ', receipt)
          history.push(`/community`)

          // Store user address to Firestore
          addMinterToCoinHolders()
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  // ----- Listen to contract events
  // function contractListener(contract) {
  //   contract.on('Transfer', (from, to, tokenId) => {
  //     console.log('Token minted - ', from, to)
  //     console.log('NFT tokenId minted - ' + tokenId)
  //   })

  //   contract.on('gRoyaltiesMinted', (contractAddress) => {
  //     console.log('gRoyalties minted at contract address  - ', contractAddress)
  //   })
  // }

  // Add minter to Firestore
  const addMinterToCoinHolders = async () => {
    console.log(commonsAddress)
   // const docRef = projectFirestore.collection('vault').doc(commons)   
    
 /*   signer.getAddress().then(address => {
      console.log(address)
       docRef.update({
         holders: firebaseFieldValue.arrayUnion(address),
       }) 
    })*/
  }

 /*useEffect(() => {
    upload(img)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])*/

  return <div></div>
}

export default Mint
