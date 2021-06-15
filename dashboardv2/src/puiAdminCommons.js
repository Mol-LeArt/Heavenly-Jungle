import React, { useEffect, useState } from "react";
import { ethers } from 'ethers'
import ManageCommons_Main from './admin/ManageCommons_Main'
import ManageCommons_Bid from './admin/ManageCommons_Bid'
import ManageCommons_Withdraw from './admin/ManageCommons_Withdraw'
import ManageCommons_Coins from './admin/ManageCommons_Coins'
import ManageCommons_Creator from './admin/ManageCommons_Creator'
//import ManageCommons_Remove from './admin/ManageCommons_Remove'
import ManageCommons_Gamma from './admin/ManageCommons_Gamma'
import ManageCommons_Fee from './admin/ManageCommons_Fee'
import moralis from "moralis";
import SignIn from './puiSignIn'
import {BrandButton} from 'pivotal-ui/react/buttons';
import {FlexCol} from 'pivotal-ui/react/flex-grids';
import {Panel} from 'pivotal-ui/react/panels';

const ManageCommons = () => {
  // ----- Smart Contract Config

moralis.initialize(process.env.REACT_APP_MORALIS_APPLICATION_ID);
moralis.serverURL = process.env.REACT_APP_MORALIS_SERVER_URL;

    const initialUser = moralis.User.current();
    const [user,        setUser         ] = useState(initialUser);
    const [isCreator,   setIsCreator    ] = useState(false)
    const [isAdmin,     setIsAdmin      ] = useState(false)
    const [gamma,       setGamma        ] = useState(null)
    const [commons,     setCommons      ] = useState(null)
    const [address,     setAddress]     = useState('')
    const [commonsName, setCommonsName] = useState('')
    const Commons = moralis.Object.extend( "Commons", {}, {});

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

        const getCommons = async () =>
        {
            var commonsId =    window.location.search.substring( 11 );
            const query = new moralis.Query( Commons );
            query.equalTo( "objectId", commonsId );
            const results = await query.find();
            if ( results.length > 0 ) // TODO 
            { 
                const object = results[0];
                setGamma( object.get('gammaAddress') )
                setCommonsName( object.get('name') );
                setCommons( object.get('contractAddress')  );
              //  await isOwner()
             //   await isWhitelisted()
            }
            else
            {
                alert( 'Commons not found!' );  //TODO handle this properly
            }
        }

       const aboutus = () => {  window.location = '/heavenly-jungle/aboutus?commonsId=' +  window.location.search.substring( 11 ) };

       const arcade = () => {  window.location = '/heavenly-jungle/arcade?commonsId=' +  window.location.search.substring( 11 ) };

        const callbackFunction = (user,address) => {  setUser(user); setAddress(address); }

 useEffect(() => {

    getCommons(); 

  })


  return (

    
    <div className="App">
        <Panel {...{title: commonsName, titleCols: [<FlexCol fixed><BrandButton href="/heavenly-jungle/select/" >Home</BrandButton><BrandButton onClick={aboutus} >About Us</BrandButton><BrandButton onClick={arcade} >Arcade</BrandButton><SignIn callBack={callbackFunction}/></FlexCol>], style: {  padding: '8px', background: '#f2f2f2'}}}>
{ commons && (<div>
      <ManageCommons_Main provider={provider} commons={commons}/>
      <ManageCommons_Withdraw signer={signer} commons={commons} /> 
     
      <ManageCommons_Gamma signer={signer} commons={commons} gamma={gamma} />
      <ManageCommons_Creator signer={signer} commons={commons} gamma={gamma} />
      <ManageCommons_Fee signer={signer} commons={commons} gamma={gamma} />

                      
</div>
        )}
    </Panel>
    </div>
  )
}

export default ManageCommons
