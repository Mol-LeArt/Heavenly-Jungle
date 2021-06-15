import React, { useState, useEffect } from 'react'
import Arcade_Bid from './arcade/Arcade_Bid'
import Arcade_Main from './arcade/Arcade_Main'
import Arcade_Leaderboard from './arcade/Arcade_Leaderboard'
import { ethers } from 'ethers'
import { ArcadeContext } from './GlobalContext'
import moralis from "moralis";
import SignIn from './puiSignIn'
import {BrandButton} from 'pivotal-ui/react/buttons';
import {FlexCol} from 'pivotal-ui/react/flex-grids';
import {Panel} from 'pivotal-ui/react/panels';

const Arcade = () => {

moralis.initialize(process.env.REACT_APP_MORALIS_APPLICATION_ID);
moralis.serverURL = process.env.REACT_APP_MORALIS_SERVER_URL;

  // ----- Smart Contract Interaction Config
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer_ = provider.getSigner()
    const Commons = moralis.Object.extend( "Commons", {}, {});
    const initialUser = moralis.User.current();
    const [user,        setUser         ] = useState(initialUser);
    const [gamma,       setGamma        ] = useState(null)
    const [commons,     setCommons      ] = useState(null)
    const [coins,       setCoins        ] = useState(null)
    const [account,     setAccount      ] = useState(null)
    const [signer,      setSigner       ] = useState(null)
    const [address,     setAddress]     = useState('')
    
        var commonsAddress = '';
        const getCommons = async () =>
        {
//             const provider = new ethers.providers.Web3Provider(window.ethereum)
            setSigner( signer_ );
            setAccount( await signer_.getAddress() );
            var commonsId =    window.location.search.substring( 11 );
            const query = new moralis.Query( Commons );
            query.equalTo( "objectId", commonsId );
            const results = await query.find();
            var commonsObject;
            if ( results.length > 0 ) // TODO 
            { 
                const object = results[0];
                commonsAddress = object.get('contractAddress');
                setGamma( object.get('gammaAddress') );
                setCoins( object.get('coinAddress') );
                setCommons( object.get('contractAddress')  );
            }
            else
            {
                alert( 'Commons not found!' );  //TODO handle this properly
            }
        }

useEffect(() => {
    getCommons()

  }, [])

        const aboutus = () => {  window.location = '/heavenly-jungle/aboutus?commonsId=' +  window.location.search.substring( 11 ) };

        const callbackFunction = (user,address) => {  setUser(user); setAddress(address); }
  
  return (
    <div>
        <Panel {...{title: 'Arcade', titleCols: [<FlexCol fixed><BrandButton href="/heavenly-jungle/select/" >Home</BrandButton><BrandButton onClick={aboutus} >About Us</BrandButton><SignIn callBack={callbackFunction}/></FlexCol>], style: {  padding: '8px', background: '#f2f2f2'}}}>
      {commons && signer &&
      <ArcadeContext.Provider value={{ signer }}>

          <Arcade_Bid account={account} commons={commons} signer={signer} />
      </ArcadeContext.Provider> }
    </Panel>
    </div>
  )
}

export default Arcade
