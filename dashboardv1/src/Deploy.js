import React, { useState } from "react";
import ReactDOM from "react-dom";
import logo from './logo.svg';
import './App.css';
import moralis from "moralis";

moralis.initialize(process.env.REACT_APP_MORALIS_APPLICATION_ID);
moralis.serverURL = process.env.REACT_APP_MORALIS_SERVER_URL;

function App() {

          const [clist, setList] = useState('');
  
        const Commons = moralis.Object.extend( "Commons", 
        {
          // Instance methods
             // hasSuperHumanStrength: function () {  return this.get("strength") > 18;  },
              // Instance properties go in an initialize method
             // initialize: function (attrs, options) { this.sound = "Rawr" }
        }, 
        {  
            newCommons: function() { 
                                        const commons = new Commons();
                                        commons.set( "name",        document.getElementById( 'commonsname' ).value  );
                                        commons.set( "vaultsymbol", document.getElementById( 'vaultsymbol' ).value  );
                                        commons.set( "organizer",   document.getElementById( 'organizer'   ).value  ); 
                                        commons.set( "vaultname",   document.getElementById( 'vaultname'   ).value  ); 
                                        return commons; 
                                    }
        });


         const saveCommons = async () => {    
                                              const newCommons = Commons.newCommons();
                                              await newCommons.save();  
                                         };

        
        const objects =[];
        let cList = <div></div>;
        const CommonsList = async () => 
        {
            const query = new moralis.Query( Commons );
            const results = await query.find();
            for ( let i = 0; i < results.length; i++ ) 
            { 
                const object = results[i];
                objects.push( object ); 
                const listItems = objects.map((commonsObject) =>  <li><a href={commonsObject.get('contract')} >{commonsObject.get('name')}</a></li> );
                setList(listItems);
            }
        }


        return (
                    <div className="App">
                      Name : <input id="commonsname" /> <br/><br/>
                      Organizer : <input id="organizer" /> <br/><br/>
                      Vault Name : <input id="vaultname" /> <br/><br/>
                      Vault Symbol : <input id="vaultsymbol" /> <br/><br/>
                     <button onClick={saveCommons}>Save Commons</button> <br/><br/> 
                     <button onClick={CommonsList}>List Commons</button><br/><br/><ul>{clist}</ul>
                    </div>
               );
}

export default App;
