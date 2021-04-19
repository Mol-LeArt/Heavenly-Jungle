import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { TransitionGroup, Transition } from "react-transition-group";
import { play, exit } from './timelines'

import Deploy from "./puiDeploy-updated";
import Profile from "./puiUserProfile";
import Select from "./puiSelectCommons";
import ViewCommons from "./puiViewCommons";
import AboutCommons from "./puiAboutCommons";
import NFTView from "./puiNFTView";
import Minter from "./expMinter";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="app">
         

<Route render={({location}) => 
{
    const { pathname, key } = location

    //const query = new URLSearchParams(location.search);
    
   
    return (

       

                <Switch location={location}>
                    <Route exact path="/"   component={Select}          />
                    <Route path="/deploy"   component={Deploy}          />
                    <Route path="/profile"  component={Profile}         />
                    <Route path="/view"     component={ViewCommons}     />
                    <Route path="/about"    component={AboutCommons}    />
                    <Route path="/nftview"  component={NFTView}         />
                    <Route path="/mint"     component={Minter}          />
                </Switch>

          )
}} />

        </div>
      </BrowserRouter>
    )
  }


}


export default App;



