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


       const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

       const aboutus = () => {  window.location = '/about?commonsId=' +  window.location.search.substring( 11 ) };

        const editContent = () => {  document.getElementById('paragraph').style='display:block';document.getElementById('header').style='display:block';document.getElementById('airdrop_').style='display:block';document.getElementById('tandc').style='display:block'; };

        const saveContent = async () => {    var commonsId =    window.location.search.substring( 11 );
                                            const query = new moralis.Query( Commons );
                                            query.equalTo( "objectId", commonsId );
                                            const results = await query.find();
                                            var commonsObject;
                                            for ( let i = 0; i < results.length; i++ ) 
                                            { 
                                                const object = await results[i].fetch();
                                                if ( document.getElementById( 'about-header' ).value !== '' )
                                                {
                                                    object.set( "header",       document.getElementById( 'about-header' ).value );
                                                    setAboutHeader( document.getElementById( 'about-header' ).value );
                                                }
                                                if ( document.getElementById( 'about-paragraph' ).value !== '' )
                                                {
                                                    object.set( "paragraph",    document.getElementById( 'about-paragraph' ).value );
                                                    setAboutParagraph( document.getElementById( 'about-paragraph' ).value );
                                                }
                                                if ( document.getElementById( 'tc' ).value !== '' )
                                                {
                                                    object.set( "tandc",    document.getElementById( 'tc' ).value );
                                                    
                                                }
                                                if ( document.getElementById( 'tc' ).value !== '' )
                                                {
                                                    object.set( "airdrop",    document.getElementById( 'airdrop' ).value );
                                                    
                                                }
                                                var resp =  await object.save();
                                                document.getElementById('paragraph').style='display:none';
                                                document.getElementById('header').style='display:none';
                                                document.getElementById('tandc').style='display:none';
                                                document.getElementById('airdrop_').style='display:none';
                                
                                            } 
                                };



        const Organizer = moralis.Object.extend( "Organizer", 
        {
          // Instance methods

        }, 
        {  
            newOrganizer: function(index) { 
                                        const organizer = new Organizer();
                                        alert( 'org ' + document.getElementById( 'organizer' + index ).value );
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
                                        alert( 'tfer ' + document.getElementById( 'transferrable'   ).checked + '' );
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
                    setAboutParagraph( object.get('paragraph'));
                }
                commonsAddress = object.get('contractAddress');
                setCommonsName( object.get('name') );
                await isOwner();
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
    const _contract = new ethers.Contract(commonsAddress, MOLCOMMONS_ABI, signer)
    try {
      signer.getAddress().then((address) => {
        _contract
          .isOrganizer(address)
          .then((data) => {
            setIsAdmin(data)
          })
          .catch((e) => console.log(e))
      }).catch((e) => console.log(e))
    } catch (e) {
      console.log(e)
    }
  }

 useEffect(() => {

    getCommons(); 

  })


        return (
                    <div className="App" >
                        <Panel {...{title: commonsName, titleCols: [<FlexCol fixed><BrandButton href="/heavenly-jungle/select/" >Home</BrandButton><BrandButton onClick={arcade} >Arcade</BrandButton><SignIn callBack={callbackFunction}/></FlexCol>], style: {  padding: '8px', background: '#f2f2f2'}}}>
                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} >{clist}</FlexCol>
                          <FlexCol className="col-grow-2"/>
                        </Grid>

                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><h4>Organizers</h4> {orgList}</FlexCol>
                          <FlexCol className="col-grow-2"/>
                        </Grid>
                      </Panel>
                    <Panel {...{title: 'About', titleCols: [<FlexCol fixed></FlexCol>], style: {  padding: '8px', background: '#f2f2f2'}}}>
                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><h3>{aboutHeader}</h3>
                          </FlexCol>
                          <FlexCol className="col-grow-2">{ isAdmin && (<PrimaryButton onClick={editContent} >Edit</PrimaryButton>)}<div id="header"><br/><h3>About Header</h3><Input id="about-header" type="text"/><br/></div></FlexCol>
                        </Grid>
                    <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><p>{aboutParagraph}</p>
                            
                            </FlexCol>
                          <FlexCol className="col-grow-2"> <div id="paragraph"><h3>About Paragraph</h3><textarea id="about-paragraph"  ></textarea><br/></div>
<div id="tandc"><br/><h3>Terms and Conditions</h3><textarea id="tc"  ></textarea><br/></div>
<div id="airdrop_"><br/><h3>Airdrop Amount</h3><Input id="airdrop" type="text"/><br/><PrimaryButton onClick={saveContent} >Save</PrimaryButton></div></FlexCol>
                        </Grid>

  
                      </Panel>
                    </div>
               );


}

export default App;
