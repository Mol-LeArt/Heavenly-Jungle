import React, { useState , useEffect } from "react";
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
import Web3 from 'web3';
import SignIn from './puiSignIn'
import UpdateSaleForm from './puiUpdateSaleForm'
import SaleModal from './SaleInfoModal'


import logo from './logo.svg';
import './App.css';
import 'pivotal-ui/css/modal';
import moralis from "moralis";
import MOLCOMMONS_ABI from './MOLCOMMONS_ABI'

import GAMMA_ABI from './GAMMA_ABI'

var web3 = new Web3(Web3.givenProvider);

moralis.initialize(process.env.REACT_APP_MORALIS_APPLICATION_ID);
moralis.serverURL = process.env.REACT_APP_MORALIS_SERVER_URL;

const orgaddresses = [];
function App() {

        const initialUser = moralis.User.current();
        const [user,            setUser             ] = useState(initialUser);
        const [address,         setAddress          ] = useState('Connect Wallet');
        const [chain,           setChain            ] = useState('');
        const [connect,         toggleConnect       ] = useState(false);
        const [ethPrice,        setEthPrice         ] = useState('')
        const [coinPrice,       setCoinPrice        ] = useState('')
        const [image,           setImage            ] = useState('');
        const [createdAt,       setCreatedAt        ] = useState('');
        const [title,           setTitle            ] = useState('Title');
        const [description,     setDescription      ] = useState('Description');
        const [tokenId,         setTokenIndex       ] = useState('');

        const [royalties,       setRoyalties        ] = useState(null)
        const [creator,         setCreator          ] = useState('')

        const [price,           setPrice            ] = useState(null)
        const [coins,           setCoins            ] = useState(null)
        const [isSale,          setIsSale           ] = useState(0)
        const [owner,           setOwner            ] = useState(null)
        const [commonsAddress,  setCommonsAddress   ] = useState(0)
        const [totalFees,       setTotalFees        ] = useState()
        const [coinAddress,     setCoinAddress      ] = useState(null)
        const [form,                    setForm                 ] = useState(false)
        const [contractToUpdateSale,    setContractToUpdateSale ] = useState(null)
        const [creatorsFee,             setCreatorsFee          ] = useState(null)
        const [organizersFee,           setOrganizersFee        ] = useState(null)
        const [totalPrice,              setTotalPrice           ] = useState(null)
        const [buyError,                setBuyError             ] = useState(null)
        const [ownerMatch,              setOwnerMatch           ] = useState(null)
        const [creatorMatch,            setCreatorMatch         ] = useState(null)
        const [gammaAddress,            setGammaAddress         ] = useState(null)

        const [twitter,                 setTwitter              ] = useState(null)
        const [instagram,               setInstagram            ] = useState(null)
        const [username,                setName                 ] = useState(null)
        const [avatarImage,             setAvatarImage          ] = useState(null)
        const [airdrop,                 setAirdrop              ] = useState(null)
        const [commonsOwner,            setCommonsOwner         ] = useState(false)
        const [txHash,                  setTxHash               ] = useState()

       // var gammaAddress = '';

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const callbackFunction = (user,address) => {  setUser(user); setAddress(address);}

        const User = moralis.Object.extend( "User", {}, {} );

        const Organizer = moralis.Object.extend( "Organizer", {}, {} );

        const Avatar = moralis.Object.extend( "Avatar",  {}, {} );

        const Commons = moralis.Object.extend( "Commons", {}, {} );

        const NFT = moralis.Object.extend( "NFT", {}, {});
        
        const Holder = moralis.Object.extend( "NFTHolder", {}, 
        {
            newHolder: function(tokenId,address,) { 
                                                        const holder = new Holder();
                                                        holder.set( "tokenId",          tokenId        );
                                                        holder.set( "gammaAddress",     gammaAddress   );
                                                        holder.set( "commonsAddress",   commonsAddress );
                                                        holder.set( "accountAddress",   address        );
                                                        return holder; 
                                                  }
        });

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

        const getGammaContract = async () => 
        {
            const _contract = new ethers.Contract(commonsAddress, MOLCOMMONS_ABI, signer)
            var gamma = await _contract.gamma();
            return gamma;
        }
        
        const getCreatorInfo = async () =>
        {
            var gamma = '';
            var tokenId = '';
            var imageHash =    window.location.search.substring( 6 );
            const query = new moralis.Query( User );
            query.equalTo( "ethAddress", creator.toLowerCase() );
            const results = await query.find();
            
            if ( results.length > 0 )
            {
                let image = results[0];
                setTwitter( image.get( "twitter" ) );
                setInstagram( image.get( "instagram" ) );
                setName( image.get( "name" ) );
            }
            const queryAvatar = new moralis.Query( Avatar );
            queryAvatar.equalTo( "owneraddress", creator.toLowerCase() );
            const avatarResults = await queryAvatar.find();
            var org;
            if ( avatarResults.length > 0 )
            {
                let image = avatarResults[0];
                setAvatarImage( 'https://gateway.pinata.cloud/ipfs/' + image.get( "image" ) );
            }
        }

        const getImage = async () =>
        {
            var gamma = '';
            var tokenId = '';
            var imageHash =    window.location.search.substring( 6 );
            const query = new moralis.Query( NFT );
            query.equalTo( "fileHash", imageHash );
            const results = await query.find();
            
            if ( results.length > 0 )
            {
                let image = results[0];
                let metadata = image.get( "metadata" );
                var date = new Date( metadata.createdAt );
                setCreatedAt( date.toString() );
                setImage( metadata.image );
                setTitle( image.get( "title" ) );
                setCommonsAddress( image.get( "commonsAddress" ) );
                setGammaAddress( image.get( "gammaAddress" ) );
                gamma = image.get( "gammaAddress" );
                setDescription( image.get( "description" ) );
                setTokenIndex( image.get( "tokenIndex" ) );
                tokenId = image.get( "tokenIndex" );
                setTxHash( image.get( "txHash" ) );
            }
            else
            {   
                //TODO What?
            }
                
                if ( ! price )
                {
                    await getGammaSaleData(gamma,tokenId)
                }
                if( ! owner )
                {
                    await getGammaOwner(gamma,tokenId)
                }
                if ( owner && ! ownerMatch )
                {
                    await isOwner()
                }
                if ( price )
                {
                    await getCreatorFee()
                }
               
                if ( ! airdrop )
                {
                    await getAirdrop();
                }
                await getGammaRoyalties(gamma)
                await getCreatorInfo();
                await isCreator();
         }

    async function getCommonsAddress()
    {
        var imageHash =    window.location.search.substring( 6 );
        const query = new moralis.Query( NFT );
        query.equalTo( "fileHash", imageHash );
        const results = await query.find();
        var address = ''; 
         if ( results.length > 0 )
         {
             let image = results[0];
            address = image.get( "commonsAddress" );
         }
        return address;
    }

    async function getGammaAddress()
    {
        var imageHash =    window.location.search.substring( 6 );
        const query = new moralis.Query( NFT );
        query.equalTo( "fileHash", imageHash );
        const results = await query.find();
        var address = ''; 
         if ( results.length > 0 )
         {
             let image = results[0];
            address = image.get( "gammaAddress" );
         }
        return address;
    }

const getCreatorFee = async () => {
    const caddress = await getCommonsAddress();
    const _contract = new ethers.Contract(caddress, MOLCOMMONS_ABI, signer)
    var total = 0;
    try {
            const data = await _contract.fees(0);
            setCreatorsFee(data)
            total = data;
            
             const data2 = await _contract.fees(1); 
              setOrganizersFee(data2)
              total += data2;
              console.log( 'setting total ? ' + total )
              const newPrice_ = ethers.utils.parseEther(price)
              const p = parseInt(newPrice_, 10)
              const priceWithFee = p + p * 0.01 * total //TODO should be checking contract for org fees
              console.log('Buyer pays a total of - ', priceWithFee)
              setTotalPrice( web3.utils.fromWei(priceWithFee + ''));
              setTotalFees( web3.utils.fromWei( ( p * 0.01 * total ) + '') );
     
    } catch (e) {
      console.log(e)
    }
  }

// ----- Buy NFT with Commons coins
  const buyWithCoins = async () => {
    setBuyError('')

    const c = ethers.utils.parseEther(coinPrice.toString())
    console.log('Buyer pays a total of - ', c)
    const _contract = new ethers.Contract(commonsAddress, MOLCOMMONS_ABI, signer)

    try {
      const tx = await _contract.coinPurchase(tokenId)
      console.log('this is tx.hash for purchase', tx.hash)

      const receipt = await tx.wait()
      console.log('mint receipt is - ', receipt)
      window.location.reload()
      // contractListener(_contract)
    } catch (e) {
      console.log(e)
      const err = Math.abs(e.error.code)
      const message = e.error.message

      if (err === 32603 && message === 'execution reverted: !price') {
        setBuyError('Insufficient coins!')
      }
    }
  }


const buyWithEth = async () => {
    setBuyError('')

        if (owner === 'Commons') 
        {
           console.log('Buyer pays a total of - ', totalPrice)
           var config = { value: web3.utils.toWei( totalPrice.toString() ) };
           var localAddress = await signer.getAddress();
           var commonsContract = await new web3.eth.Contract( MOLCOMMONS_ABI, commonsAddress,{from:localAddress}  ); 
       
            commonsContract.methods.purchase(tokenId,  ethers.utils.parseEther( airdrop ) ).send(config)
            .on("transactionHash",function(hash){
                    console.log(hash);
                })
             .on("confirmation", function(confirmationNr){
                    console.log(confirmationNr);

                 })
             .on("receipt", async function(receipt){
                    console.log(receipt);
                   await addBuyerToCoinHolders();
                 });
        }
        else
        {
           console.log('Buyer pays a total of - ', totalPrice)
           var config = { value: web3.utils.toWei( price.toString() ) };
           var localAddress = await signer.getAddress();
           var commonsContract = await new web3.eth.Contract( GAMMA_ABI, gammaAddress,{from:localAddress}  ); 
            commonsContract.methods.purchase(tokenId, ethers.utils.parseEther( airdrop ) ).send(config)
            .on("transactionHash",function(hash){
                    console.log(hash);
                })
             .on("confirmation", function(confirmationNr){
                    console.log(confirmationNr);

                 })
             .on("receipt", async function(receipt){
                    console.log(receipt);
                   await addBuyerToCoinHolders();
                 });
        }
  }


  // Add buyer to Firestore
  const addBuyerToCoinHolders = async () => {
    console.log( commonsAddress + 'adding holder' );
    signer.getAddress().then( async (address) => {
    console.log(address)
    let holder = Holder.newHolder(tokenId,address);
    await holder.save();    

    })
  }

  const isOwner = async () => {
    if (owner) { var addy = await signer.getAddress() ; 
      if (owner === await signer.getAddress() ) {
        setOwnerMatch(true)
      } else {
        console.log('Not owner of NFT')
      }
    }
  }

  const isCreator = async () => {
    if (creator) {
      if (creator.toLowerCase() === await signer.getAddress()) {
        setCreatorMatch(true)
      } else {
        console.log('Not creator of NFT')
      }
    }
  }

  const getGammaSaleData = async (gammaAddress__, tokenId_) => {
    const _contract = new ethers.Contract( gammaAddress__, GAMMA_ABI, signer)
    _contract
      .getSale(tokenId_)
      .then((data) => {
        // Creator        
        setCreator(data[3].toString())
        // Sale Price in ETH
        if (owner === 'Commons') {
          // Sale Status
          setIsSale(data[2] == 1 ? true : false)
          const p = ethers.utils.formatEther(data[0].toString())
          setPrice(p)
        } else {
          getGammaPriceAndSale(gammaAddress__, tokenId_)
        }

        // Sale Price in Coins
        const t = ethers.utils.formatEther(data[1].toString())
        setCoinPrice(Math.trunc(t))
        
      })
      .catch((e) => console.log(e))
  }

  // ----- Gamma Functions (for when Gamma is out of MolVault)
  const getGammaPriceAndSale = async (gammaAddress, tokenId_) => {
    const _contract = new ethers.Contract(gammaAddress, GAMMA_ABI, signer)
    _contract
      .getSale(tokenId_)
      .then((data) => {
        const p = ethers.utils.formatEther(data[0].toString())
        setPrice(p)
        setIsSale(data[2]==0 ? false:true)
      })
      .catch((e) => console.log(e))
  }

  const getGammaOwner = async (gammaAddress, tokenId_) => {
    const _contract = new ethers.Contract(gammaAddress, GAMMA_ABI, signer)
    _contract
      .ownerOf(tokenId_)
      .then((data) => {
        if (data === commonsAddress) {
          setOwner('Commons')
          setCommonsOwner(true)
        } else {
          setOwner(data)
        }
      })
      .catch((e) => console.log(e))
  }

  const getGammaRoyalties = async (gammaAddress) => {
    const _contract = new ethers.Contract(gammaAddress, GAMMA_ABI, signer)
    _contract
      .royalties()
      .then((data) => {
        const r = ethers.utils.formatUnits(data, 'wei')
        setRoyalties(Math.trunc(r))
      })
      .catch((e) => console.log(e))
  }


 async function updateSale() {
    setForm(true)
    if (owner !== 'Commons') {
      const _contract = await new ethers.Contract(gammaAddress, GAMMA_ABI, signer)
      setContractToUpdateSale(_contract)
    } else {
      const _contract = await new ethers.Contract(commonsAddress, MOLCOMMONS_ABI, signer)
      setContractToUpdateSale(_contract)
    }
  }


 useEffect( async () => {
    await getImage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner,price,creator])



      return (
                    <div className="App" > {gammaAddress && 
                        <Panel {...{title: 'NFT View', titleCols: [<FlexCol fixed><BrandButton href="/heavenly-jungle/select/" >Home</BrandButton><SignIn callBack={callbackFunction}/></FlexCol>], style: {  padding: '8px', background: '#f2f2f2'}}}>
                        <Grid className="grid-show ">
                            <FlexCol fixed {...{style: {width: '25%'}}}><img className="nftview" src={image} /><br/><br/>{gammaAddress && ( price > 0 ) && <BrandButton onClick={buyWithEth} >Buy with ETH {totalPrice} Ξ</BrandButton>}<br/><br/>{commonsOwner && <BrandButton onClick={buyWithCoins} >Buy with Coins {coinPrice }</BrandButton> }<br/>
{(ownerMatch || (owner === 'Commons' && creatorMatch)) && ( <div><SaleModal  
                                                                                      setForm={setForm}
                                                                                      contract={contractToUpdateSale}
                                                                                      tokenId={tokenId}
                                                                                      gammaAddress={gammaAddress}
                                                                                      commonsAddress={commonsAddress}
                                                                                      owner={owner} 
                                                                                      isSale={isSale}
                                                                                      defEthPrice={price}
                                                                                      defCoinPrice={coinPrice}
                                                                                       />
                                                                                </div> )}

<h5>{createdAt}</h5></FlexCol>
                            <FlexCol {...{style: {padding: '8px'}}} >
                                 <h1>Details</h1>
                                 <h2>{title}</h2>
                                 <h2>{description}</h2><br/><br/>
                                  <h5>{owner}</h5>      
                                 { isSale && 
                                 <div>                   
                                 <h5>Price Ξ {price}</h5> 
                                 <h5>fees Ξ  {totalFees}</h5> 
                                 <h3>Total Ξ {totalPrice}</h3>
                                 <h4>Royalties {royalties}%</h4>
                                 <h4>Airdrop {airdrop}</h4>  
                                 </div>}
                                
                                 <h4>{commonsOwner ? "Owned by commons" : "" }</h4>
                                 <br/>
                                 <TooltipTrigger tooltip={image}>
                                 <BrandButton target="_blank" href={image} >View on IPFS</BrandButton></TooltipTrigger>
                                 <br/><br/><TooltipTrigger tooltip={'https://rinkeby.etherscan.io/tx/' + txHash}>
                                 <BrandButton target="_blank" href={'https://rinkeby.etherscan.io/tx/' + txHash} >View Etherscan TX</BrandButton></TooltipTrigger>
                            </FlexCol>
                            <FlexCol>
                                <h1>Creator</h1><br/>
                                <p className="username">{username} - <span className="creator">{creator}</span></p>
                                <img className="avatarimage" src={avatarImage} /><br/><br/>
                                <BrandButton href={twitter} >Twitter</BrandButton><BrandButton href={instagram} >Instagram</BrandButton>
                          </FlexCol>
                          <FlexCol fixed {...{style: {width: '5%'}}} />
                        </Grid>

                    

                      </Panel> }
                    </div>
               );


}

export default App;
