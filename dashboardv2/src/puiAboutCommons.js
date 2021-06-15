import React, { useEffect, useState } from "react";

import {PrimaryButton,BrandButton} from 'pivotal-ui/react/buttons';
import {Grid, FlexCol} from 'pivotal-ui/react/flex-grids';
import {Panel} from 'pivotal-ui/react/panels';
import {Input} from 'pivotal-ui/react/inputs';
import { ethers } from 'ethers'
import './App.css';
import 'pivotal-ui/css/modal';
import moralis from "moralis";
import MOLCOMMONS_ABI from './MOLCOMMONS_ABI'
import SignIn from './puiSignIn'
import {TooltipTrigger} from 'pivotal-ui/react/tooltip';
import AboutUsModal from './puiAboutUsModal'

moralis.initialize(process.env.REACT_APP_MORALIS_APPLICATION_ID);
moralis.serverURL = process.env.REACT_APP_MORALIS_SERVER_URL;

function App() {

        const initialUser = moralis.User.current();
        const [user, setUser] = useState(initialUser);
        const [clist, setList] = useState('');
        const [orgList, setOrgList] = useState('');
        const [address, setAddress] = useState('Connect Wallet');
        const [connect, toggleConnect] = useState(false);
        const [aboutHeader,     setAboutHeader] = useState('...');
        const [aboutParagraph,  setAboutParagraph] = useState('...');
        const [isAdmin, setIsAdmin] = useState(false);
        const [commonsName, setCommonsName] = useState('');
        const [isSet, setIsSet] = useState(false);
        const [terms, setTerms] = useState();


       const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

       const aboutus = () => {  window.location = '/about?commonsId=' +  window.location.search.substring( 11 ) };

        const editContent = () => {  document.getElementById('paragraph').style='display:block';document.getElementById('header').style='display:block';document.getElementById('airdrop_').style='display:block';document.getElementById('tandc').style='display:block'; };

       



        const Organizer = moralis.Object.extend( "Organizer", 
        {
          // Instance methods

        }, 
        {  
            newOrganizer: function(index) { 
                                        const organizer = new Organizer();
                                        organizer.set( "address",        document.getElementById( 'organizer' + index ).value  );
                                        return organizer; 
                                    }
        });

        const Avatar = moralis.Object.extend( "Avatar", 
        {
          // Instance methods
        }, 
        {  
            newAvatar: function(imageHash,address) { 
                                        const avatar = new Avatar();
                                        avatar.set( "image",        imageHash  );
                                        avatar.set( "owneraddress",      address    );
                                        return avatar; 
                                    }
        });

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
                                        commons.set( "transferrable",   document.getElementById( 'transferrable'   ).checked + '' );
                                       
                                        var radios = document.getElementsByName( 'radio-group'   );                                 
                                        for (var i = 0; i < radios.length; i++) 
                                        {
                                            if ( radios[i].checked )
                                            {
                                               commons.set( "use",     radios[i].value  );
                                            }
                                        }
                                        return commons; 
                                    }
        });
        
        var commonsAddress = '';
        const getCommons = async () =>
        {
            var commonsId =    window.location.search.substring( 11 );
            const query = new moralis.Query( Commons );
            query.equalTo( "objectId", commonsId );
            const results = await query.find();
            var commonsObject;
            for ( let i = 0; i < results.length; i++ ) 
            { 
                const object = results[i];
                commonsObject = object;
                const listItems = <h1>{object.get('name')}</h1>;
                setList(listItems);
                if ( object.get('header')  )
                {
                   setAboutHeader( object.get('header')  );
                }
                if ( object.get('paragraph') )
                {
                    setAboutParagraph( object.get('paragraph') );
                }
                if ( object.get('tandc') )
                {
                    setTerms( object.get('tandc') );
                }
                commonsAddress = object.get('contractAddress');
                setCommonsName( object.get('name') );
               
            }
           
            const queryOrgs = new moralis.Query( Organizer );
            queryOrgs.equalTo( "parentId", commonsId );
            const orgResults = await queryOrgs.find();
            let orglistItems = [];
            let addresses = [];
            for ( let i = 0; i < orgResults.length; i++ ) 
            { 
                const object = orgResults[i];
               
                const queryAvatar = new moralis.Query( Avatar );
                queryAvatar.equalTo( "owneraddress", object.get( 'address' ) );
                const avatarResults = await queryAvatar.find();
                var org;
                if ( avatarResults.length > 0 )
                {
                    org = { address: object.get( 'address' ), url: 'https://gateway.pinata.cloud/ipfs/' + avatarResults[0].get("image") };
                }
                else
                {
                    org = { address: object.get( 'address' ), url: 'profile.jpg' };
                }  
                orglistItems.push( org );          
            }
            const orgsDisplay = orglistItems.map((organizer,index) => <TooltipTrigger tooltip={organizer.address}>&nbsp;<img alt="organizer" src={organizer.url}  className="avatarimage" />&nbsp;</TooltipTrigger> );
            setOrgList(orgsDisplay);
        }

       const arcade = () => {  window.location = '/heavenly-jungle/arcade?commonsId=' +  window.location.search.substring( 11 ) };

       const callbackFunction = (user,address) => {  setUser(user); setAddress(address); }

 // ----- Check owner status to toggle Admin button
  const isOwner = async () => {
 try {
    const _contract = new ethers.Contract(commonsAddress, MOLCOMMONS_ABI, signer)
   
        var address = await signer.getAddress();
        var isOrg =   await _contract.isController(address);
        
        setIsAdmin( isOrg );
    } catch (e) {
      console.log(e)
    }
  }

  const AboutUsEditCallbackFunction = (header,paragraph) => {  
        setAboutHeader(header);
        setAboutParagraph(paragraph);
    }
            

 useEffect( async () => {
   await getCommons(); 
   await isOwner();
  },[isSet])


        return (
                    <div className="App full-height" >{isSet}
                        <Panel {...{title: commonsName, titleCols: [<FlexCol fixed><BrandButton href="/heavenly-jungle/select/" >Home</BrandButton><BrandButton onClick={arcade} >Arcade</BrandButton><SignIn callBack={callbackFunction}/></FlexCol>], style: {   padding: '8px', background: '#f2f2f2'}}}>
                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} >{clist}</FlexCol>
                          <FlexCol />
                        </Grid>

                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><h4>Organizers</h4> {orgList}</FlexCol>
                          <FlexCol />
                        </Grid>
                      </Panel>
                    <Panel {...{title: 'About', titleCols: [<FlexCol fixed></FlexCol>], style: {  height: '100%', padding: '8px', background: '#f2f2f2'}}}>
                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><h3>{aboutHeader}</h3>
                          </FlexCol>
                          <FlexCol >{ isAdmin && <AboutUsModal paragraph={aboutParagraph} header={aboutHeader} terms={terms} callBack={AboutUsEditCallbackFunction} /> }
                            <div id="header"><br/><h3>About Header</h3><Input id="about-header" type="text"/><br/></div></FlexCol>
                        </Grid>
                    <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><p>{aboutParagraph}</p>
                            
                            </FlexCol>
                          <FlexCol>

                            </FlexCol>
                        </Grid>

  
                      </Panel>
                    </div>
               );


}

export default App;
