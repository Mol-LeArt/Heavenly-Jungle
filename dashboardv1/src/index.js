import React, { useState } from "react";
import ReactDOM from "react-dom";
import moralis from "moralis";

import Profile from "./puiUserProfile";
import Select from "./puiSelectCommons";
import ViewCommons from "./puiViewCommons";

import BrowserApp from "./BrowserApp";

moralis.initialize(process.env.REACT_APP_MORALIS_APPLICATION_ID);
moralis.serverURL = process.env.REACT_APP_MORALIS_SERVER_URL;

const initialUser = moralis.User.current();

const App = () => {
  const [user, setUser] = useState(initialUser);
  const [address, setAddress] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [clist, setList] = useState('');
  const onLogin = async () => {

        const user = await moralis.authenticate();
        setUser(user);
        setAddress(user.get("ethAddress"));
        setInstagram(user.get("instagram"));
        setTwitter(user.get("twitter"));
      };

      const onLogout = () => {
        moralis.User.logOut();
        setUser(null);
      };

      const saveTwitter = async () => {
        user.set( "twitter", document.getElementById('twitter').value);
        await user.save();
      };
        
      const saveInstagram = async () => {
        user.set( "instagram", document.getElementById('instagram').value);
        await user.save();
      };

        const saveCommons = async () => {
        const newCommons = Commons.newCommons();
        await newCommons.save();
      };


      // A complex subclass of Moralis.Object
        const Commons = moralis.Object.extend( "Commons", 
        {
          // Instance methods
             // hasSuperHumanStrength: function () {  return this.get("strength") > 18;  },
              // Instance properties go in an initialize method
             // initialize: function (attrs, options) { this.sound = "Rawr" }
         }, 
        {  // Class methods
          //spawn: function(strength) { const monster = new Monster(); monster.set("strength", strength); return monster;  }
            newCommons: function() { const commons = new Commons(); commons.set("name",document.getElementById('commonsname').value); commons.set("contract",document.getElementById('contract').value); return commons; }
        });

        const objects =[];
        let cList = <div></div>;
        const CommonsList = async () => {
            const query = new moralis.Query( Commons );
            const results = await query.find();
              alert("Successfully retrieved " + results.length + " scores.");
              // Do something with the returned Moralis.Object values
              for (let i = 0; i < results.length; i++) { const object = results[i]; objects.push( object );  cList +=<div>object.get('name')</div>; alert(cList);}
            setList(cList);
            const listItems = objects.map((commonsObject) =>  <li><a href={commonsObject.get('contract')} >{commonsObject.get('name')}</a></li> );
            setList(listItems);
        }


  if (user) {
    return <div><button onClick={onLogout}>Logout {address}</button><br/><br/>Twitter : <input id="twitter" /> | <button onClick={saveTwitter}>Save</button><br/><br/>Instagram : <input id="instagram" /> | <button onClick={saveInstagram}>Save</button><br/><br/><a href={twitter} >Twitter - {twitter}</a><br/><br/><a href={instagram} >Instagram - {instagram} </a><br/><br/><br/><br/>Name : <input id="commonsname" /> <br/><br/>Contract : <input id="contract" />| <button onClick={saveCommons}>Save Commons</button> | <button onClick={CommonsList}>List Commons</button><br/><br/><ul>{clist}</ul></div>;
  }
  return <button onClick={onLogin}>Login</button>;
};

ReactDOM.render(
  <React.StrictMode>
 
 <BrowserApp/>
  </React.StrictMode>,
  document.getElementById("root")
);


//
