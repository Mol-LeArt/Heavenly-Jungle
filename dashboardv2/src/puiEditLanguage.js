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

        const [p1title, setP1Title] = useState('Select Commons');
        const [p1titleInd, setP1TitleInd] = useState('');
        const [p1CommunityInd, setP1CommunityInd] = useState('');
        const [p1PersonalInd, setP1PersonalInd] = useState('');
        const [p1ProfileInd, setP1ProfileInd] = useState('');

        const [p2Title,         setP2Title      ] = useState('');
        const [p2Organizer,     setP2Organizer  ] = useState('');
        const [p2Mint,          setP2Mint       ] = useState('');
        const [p2Admin,         setP2Admin      ] = useState('');
        const [p2Home,          setP2Home       ] = useState('');
        const [p2Arcade,        setP2Arcade     ] = useState('');
        const [p2AboutUs,       setP2AboutUs    ] = useState('');


       const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();


       const callbackFunction = (user,address) => {  setUser(user); setAddress(address); }


        const PageText = moralis.Object.extend( "PageText", {}, {
            newPageText: function(pagekey,text) { 
                const pageText = new PageText();
                pageText.set( "key",      pagekey    );
                pageText.set( "pagetext",     text   );
                return pageText; 
                }
        } );

        const save = async () => { 
         
              if ( document.getElementById( 'p1titleInd' ).value !== p1titleInd )
              {     
                 await updateText('p1Title',  document.getElementById( 'p1titleInd' ).value );
              }
              if ( document.getElementById( 'p1titleInd' ).value !== p1titleInd )
              {     
                 await updateText('p1Community',  document.getElementById( 'p1CommunityInd' ).value );
              }
              if ( document.getElementById( 'p1titleInd' ).value !== p1titleInd )
              {     
                 await updateText('p1Personal',  document.getElementById( 'p1PersonalInd' ).value );
              }
              if ( document.getElementById( 'p1titleInd' ).value !== p1titleInd )
              {     
                 await updateText('p1Profile',  document.getElementById( 'p1ProfileInd' ).value );
              }

              if ( document.getElementById( 'p2Title' ).value !== p2Title )
              {     
                 await updateText('p2Title',  document.getElementById( 'p2Title' ).value );
              }
              if ( document.getElementById( 'p2Organizer' ).value !== p2Organizer )
              {     
                 await updateText('p2Organizer',  document.getElementById( 'p2Organizer' ).value );
              }
              if ( document.getElementById( 'p2Mint' ).value !== p2Mint )
              {     
                 await updateText('p2Mint',  document.getElementById( 'p2Mint' ).value );
              }
              if ( document.getElementById( 'p2Admin' ).value !== p2Admin )
              {      
                 await updateText('p2Admin',  document.getElementById( 'p2Admin' ).value );
              }
              if ( document.getElementById( 'p2Home' ).value !== p2Home )
              {     
                 await updateText('p2Home',  document.getElementById( 'p2Home' ).value );
              }
              if ( document.getElementById( 'p2Arcade' ).value !== p2Arcade )
              {     
                 await updateText('p2Arcade',  document.getElementById( 'p2Arcade' ).value );
              }


              if ( document.getElementById( 'p2AboutUs' ).value !== p2AboutUs )
            {
                 await updateText('p2AboutUs',  document.getElementById( 'p2AboutUs' ).value );
              }
              alert( 'All Saved' );
              window.location.reload();

        }

        const getText = async (key) => {
            const query = new moralis.Query( PageText );
            query.equalTo( "key", key );
            const results = await query.find();
            var text = '';
            if ( results.length > 0 )
            {
                const object = results[0];
                text = object.get( "pagetext" );
            }
            return text;
        }

        const updateText = async (key,value) => {
            const query = new moralis.Query( PageText );
            query.equalTo( "key", key );
            const results = await query.find();
            var text = '';

            if ( results.length > 0 )
            {
                var object = await results[0].fetch();
                object.set( 'pagetext', value );
                await object.save();
            }
            else
            {
                await PageText.newPageText( key, value ).save();
            }
        }

        const init = async () => {
         
         setP1CommunityInd( await getText('p1Community' ) );
         setP1PersonalInd( await getText('p1Personal' ) );
         setP1ProfileInd( await getText('p1Profile' ) );
        setP1TitleInd( await getText('p1Title' ) );

        setP2Title( await getText('p2Title' ) );
         setP2Organizer( await getText('p2Organizer' ) );
         setP2Mint( await getText('p2Mint' ) );
        setP2Admin( await getText('p2Admin' ) );
        setP2Home( await getText('p2Home' ) );
         setP2Arcade( await getText('p2Arcade' ) );
         setP2AboutUs( await getText('p2AboutUs' ) );

    }

 useEffect(() => {

   init();

  },[p1titleInd])



        return (
                    <div className="App" >
                        <Panel {...{title: 'Language Editor', titleCols: [<FlexCol fixed><BrandButton href="/heavenly-jungle/select/" >Home</BrandButton><SignIn callBack={callbackFunction}/></FlexCol>], style: {  padding: '8px', background: '#f2f2f2'}}}>
                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><h1>Select Commons</h1></FlexCol>
                          <FlexCol />
                        </Grid>

                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} >
                            <h2>Title</h2>
                            <h3>Default : Select Commons</h3> 
                            <h3>IND : {p1titleInd}</h3>
                            <Input defaultValue={p1titleInd} id='p1titleInd'  type='text'/></FlexCol>
                          <FlexCol/>
                        </Grid>


                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} >
                            <h2>Community</h2>
                            <h3>Default : Community</h3> 
                            <h3>IND : {p1CommunityInd}</h3>
                            <Input defaultValue={p1CommunityInd} id='p1CommunityInd'  type='text'/></FlexCol>
                          <FlexCol/>
                        </Grid>

                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} >
                            <h2>Personal</h2>
                            <h3>Default : Personal</h3> 
                            <h3>IND : {p1PersonalInd}</h3>
                            <Input defaultValue={p1PersonalInd} id='p1PersonalInd'   type='text'/></FlexCol>
                          <FlexCol/>
                        </Grid>
                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} >
                            <h2>Profile</h2>
                            <h3>Default : Profile</h3> 
                            <h3>IND : {p1ProfileInd}</h3>
                            <Input defaultValue={p1ProfileInd} id='p1ProfileInd' type='text'/></FlexCol>
                          <FlexCol/>
                        </Grid>

                      

<hr/>


                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><h1>View Commons</h1></FlexCol>
                          <FlexCol />
                        </Grid>

                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} >
                            <h2>Title</h2>
                            <h3>Default : View Commons</h3> 
                            <h3>IND : {p2Title}</h3>
                            <Input defaultValue={p2Title} id='p2Title'  type='text'/></FlexCol>
                          <FlexCol/>
                        </Grid>


                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} >
                            <h2>Organizer</h2>
                            <h3>Default : Organizer</h3> 
                            <h3>IND : {p2Organizer}</h3>
                            <Input defaultValue={p2Organizer} id='p2Organizer'  type='text'/></FlexCol>
                          <FlexCol/>
                        </Grid>

                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} >
                            <h2>Mint</h2>
                            <h3>Default : Mint</h3> 
                            <h3>IND : {p2Mint}</h3>
                            <Input defaultValue={p2Mint} id='p2Mint'   type='text'/></FlexCol>
                          <FlexCol/>
                        </Grid>
                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} >
                            <h2>Admin</h2>
                            <h3>Default : Admin</h3> 
                            <h3>IND : {p2Admin}</h3>
                            <Input defaultValue={p2Admin} id='p2Admin' type='text'/></FlexCol>
                          <FlexCol/>
                        </Grid>
                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} >
                            <h2>Home</h2>
                            <h3>Default : Home</h3> 
                            <h3>IND : {p2Home}</h3>
                            <Input defaultValue={p2Home} id='p2Home' type='text'/></FlexCol>
                          <FlexCol/>
                        </Grid>
                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} >
                            <h2>Arcade</h2>
                            <h3>Default : Arcade</h3> 
                            <h3>IND : {p2Arcade}</h3>
                            <Input defaultValue={p2Arcade} id='p2Arcade' type='text'/></FlexCol>
                          <FlexCol/>
                        </Grid>
                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} >
                            <h2>About Us</h2>
                            <h3>Default : About Us</h3> 
                            <h3>IND : {p2AboutUs}</h3>
                            <Input defaultValue={p2AboutUs} id='p2AboutUs' type='text'/></FlexCol>
                          <FlexCol/>
                        </Grid>

                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '35%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} >
                            <PrimaryButton onClick={save} >Save</PrimaryButton>
                            </FlexCol>
                          <FlexCol ></FlexCol>
                        </Grid>


  
                      </Panel>
                    </div>
               );


}

export default App;
