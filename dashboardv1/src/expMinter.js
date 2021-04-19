import React, { useState, useContext } from 'react'
import Mint from './Mint'
import ImageUpload from './ImageUpload'
import { GlobalContext } from './GlobalContext'
import {DefaultButton, PrimaryButton, DangerButton, BrandButton} from 'pivotal-ui/react/buttons';
import moralis from "moralis";
import { ethers } from 'ethers'
import axios from 'axios';
import MOLCOMMONS_ABI from './MOLCOMMONS_ABI'

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

const Commons = moralis.Object.extend( "Commons", { /* Instance methods*/ }, 
        {  
            newCommons: function() { 
                                        const commons = new Commons();
                                        commons.set( "name",            document.getElementById( 'commonsname'     ).value  );
                                        commons.set( "vaultsymbol",     document.getElementById( 'vaultsymbol'     ).value  );
                                        commons.set( "organizer",       document.getElementById( 'organizer0'       ).value  ); 
                                        commons.set( "vaultname",       document.getElementById( 'vaultname'       ).value  ); 
                                        commons.set( "confirmations",   document.getElementById( 'confirmations'   ).value  );
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

 window.addEventListener( 'load', async function() {  if (user) { await getNetwork(); setUser(user); setAccount(user.get("ethAddress") ); } }) ;


  const signer = provider.getSigner()

  const onLogin = async () => { await getNetwork(); const user = await moralis.authenticate(); setUser(user); setAccount(user.get("ethAddress") ); };



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
                                                    alert( 'contract params eth price ' + p + ' coin price' + c + ' uri ' + tokenUri + '  address ' + contractaddress );
                                                    molCommons(p, c, tokenUri, contractaddress )
  
                                                } catch (e) { console.log('error is - ' + e ) }
                                        }




 // ----- Mint Gamma with MolVault
  const molCommons = async (price, coins, tokenURI, commonsContractAddress) => {
                                                            console.log('MolVault contract is - ', commonsContractAddress)
                                                            const _contract = new ethers.Contract(commonsContractAddress, MOLCOMMONS_ABI, signer)
                                                            try 
                                                            {
                                                                alert( 'account ' + account );
//                                                                const tx = await _contract.mint(price, coins, tokenURI, sale, account)
                                                                const tx = await _contract.mint( price, coins, tokenURI, sale, 100 )                                                             
                                                                alert( 'post tx' );

                                                                 console.log('tx.hash for minting - ' + tx.hash)

                                                                tx.wait().then((receipt) => { 
                                                                                                if (receipt.confirmations === 1) {
                                                                                                                                      console.log('mint receipt is - ', receipt)
                                                                                                                                     // history.push(`/community`)
                                                                                                                                      // Store user address to Firestore
                                                                                                                                      //addMinterToCoinHolders()
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
    <div class='mx-auto px-4 my-10 max-w-sm space-y-10 font-mono'>
      <div class='text-5xl font-bold text-center'>Mint NFT</div>
        <PrimaryButton onClick={onLogin} >{account + ' - ' + chain}</PrimaryButton>
      <form class='space-y-4' onSubmit={onSubmit}>
        <div>
          <div>Title</div>
          <input
            class='border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900'
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Enter Title'
          />
        </div>

        <div>
          <div>Description</div>
          <input
            class='border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm'
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Enter Description'
          />
        </div>

        <div>
          <label htmlFor='sale'>Put on sale?</label>
          <br />
          <input
            class='border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm'
            type='text'
            value={sale}
            onChange={(e) => setSale(e.target.value)}
            placeholder='Yes = 1, no = 0'
          />
        </div>

        <div>
          <label htmlFor='price'>Price in Ξ</label>
          <br />
          <input
            class='border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm'
            type='text'
            value={ethPrice}
            onChange={(e) => setEthPrice(e.target.value)}
            placeholder='Enter amount in Ξ'
          />
        </div>

        <div>
          <label htmlFor='coins'>No. of Coins</label>
          <br />
          <input
            class='border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm'
            type='text'
            value={coinPrice}
            onChange={(e) => setCoinPrice(e.target.value)}
            placeholder='Enter amount in coins'
          />
        </div>

        <div>
          <input type="file" onChange={onFileChange} />
        </div>

        <div>
            <img src={imageUrl} />
        </div>

        <div class='flex justify-center items-center space-x-2'>
          <input
            type='Checkbox'
            checked={compliance}
            onChange={(e) => setCompliance(e.target.checked)}
          />
          <span>I agree to XYZ.</span>
        </div>

        <div class='flex justify-center'>
          <button class='py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md'>
            Mint
          </button>
        </div>
      </form>
    </div>
  )
}

export default MintNFT
