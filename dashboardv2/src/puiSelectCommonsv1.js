import React, { useState } from "react";
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
import SignIn from './puiSignIn'
import logo from './logo.svg';
import moralis from "moralis";

import './App.css';
import 'pivotal-ui/css/modal';

moralis.initialize(process.env.REACT_APP_MORALIS_APPLICATION_ID);
moralis.serverURL = process.env.REACT_APP_MORALIS_SERVER_URL;

const orgaddresses = [];
function App() {

        const initialUser = moralis.User.current();
        const [user,        setUser]        = useState(initialUser);
        const [clist,       setList]        = useState('');
        const [address,     setAddress]     = useState('Connect Wallet');
        const [chain,       setChain]       = useState('');
        const [connect,     toggleConnect]  = useState(false);

        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const Commons = moralis.Object.extend( "Commons", 
        {}, 
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

        const callbackFunction = (user,address) => {  setUser(user); setAddress(address); CommonsList();}
        
        const objects =[];
        let cList = <div></div>;
        var itemRows = [];
        const CommonsList = async () => 
        {
            const query = new moralis.Query( Commons );
            const results = await query.find();
            for ( let i = 0; i < results.length; i++ ) 
            { 
                const object = results[i];
                objects.push( object ); 
            }
            const listItems = objects.map((commonsObject,i) =>  <li className="commonsitem" key={i}><PrimaryButton href={'/heavenly-jungle/viewcommons/?commonsId=' + commonsObject.id  } >{commonsObject.get('name') + ' - ' +       commonsObject.get('network') }</PrimaryButton></li> );
            setList(listItems);
        }


        return (
                    <div className="App" >
                        <Panel {...{title: 'Select Commons', titleCols: [<FlexCol fixed><BrandButton href="/heavenly-jungle/userprofile" >Profile</BrandButton><SignIn callBack={callbackFunction}/></FlexCol>], style: {  padding: '8px', background: '#f2f2f2'}}}>
                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '15%'}}}/>
                          <FlexCol {...{style: {padding: '8px'}}} ><h1>Community</h1>{clist}</FlexCol>
                          <FlexCol {...{style: {padding: '8px'}}} ><h1>Personal</h1>
                            <li className="commonsitem"><BrandButton >John Doe</BrandButton></li>
                            <li className="commonsitem"><BrandButton >Hugh Jarse</BrandButton></li>
                          </FlexCol>
                          <FlexCol />
                        </Grid>
                      </Panel>
                    </div>
               );
}

export default App;
