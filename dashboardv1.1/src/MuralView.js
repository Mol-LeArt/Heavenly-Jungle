import {DefaultButton, PrimaryButton, DangerButton, BrandButton} from 'pivotal-ui/react/buttons';
import {Grid, FlexCol} from 'pivotal-ui/react/flex-grids';
import {Panel} from 'pivotal-ui/react/panels';
import {Divider} from 'pivotal-ui/react/dividers';
import React, { useState, useEffect } from "react"
import {Image} from 'pivotal-ui/react/images';
import {Input} from 'pivotal-ui/react/inputs';
import { TransitionGroup, Transition } from "react-transition-group";
import { SwitchTransition, CSSTransition } from "react-transition-group";



import 'pivotal-ui/css/alignment';
import 'pivotal-ui/css/box-shadows';
import 'pivotal-ui/css/positioning';

import './App.css';

function App() {

var localAddress = '';
useEffect(() => {   }, [])

const [itemList,setList]=useState([])
const [imageState, setState] = useState(true);


function connect()
{
    window.ethereum.enable().then( async function(accounts)
    {
        localAddress = accounts[0];

    });
}


return (

    <div className="App" className="position-relative" >
<Panel {...{title: 'Overview', titleCols: [<FlexCol fixed><PrimaryButton onClick={connect} >Connect Wallet</PrimaryButton></FlexCol>], style: {  padding: '8px', background: '#f2f2f2'}}}>
<Divider/>

    <Grid className="grid-show ">
        <FlexCol className="box-shadow-amb-3" {...{  style: {height: '250px',  background: '#f8f8f8', margin: '8px 8px', padding: '8px'}}}>
            <div className="bg-light-gray pal" >
                <Image href="/nftview?panel=1" className="box-shadow-3 txt-c" src="/panelsSmall/1.jpg" alt="Iweng"/>
            </div>
        </FlexCol>
        <FlexCol className="box-shadow-amb-3" {...{  style: {height: '250px',  background: '#f8f8f8', margin: '8px 8px', padding: '8px'}}}>
            <div className="bg-light-gray pal" >
                <Image href="/nftview?panel=2" className="box-shadow-3 txt-c" src="/panelsSmall/2.jpg" alt="Iweng"/>
            </div>
        </FlexCol> 
        <FlexCol className="box-shadow-amb-3" {...{  style: {height: '250px',  background: '#f8f8f8', margin: '8px 8px', padding: '8px'}}}>
            <div className="bg-light-gray pal" >
                <Image href="/nftview?panel=3" className="box-shadow-3 txt-c" src="/panelsSmall/3.jpg" alt="Iweng"/>
            </div>
        </FlexCol>  
    </Grid>

<Grid className="grid-show ">
        <FlexCol className="box-shadow-amb-3" {...{  style: {height: '250px',  background: '#f8f8f8', margin: '8px 8px', padding: '8px'}}}>
            <div className="bg-light-gray pal" >
                <Image href="/nftview?panel=4" className="box-shadow-3 txt-c" src="/panelsSmall/4.jpg" alt="Iweng"/>
            </div>
        </FlexCol>
        <FlexCol className="box-shadow-amb-3" {...{  style: {height: '250px',  background: '#f8f8f8', margin: '8px 8px', padding: '8px'}}}>
            <div className="bg-light-gray pal" >
                <Image href="/nftview?panel=5" className="box-shadow-3 txt-c" src="/panelsSmall/5.jpg" alt="Iweng"/>
            </div>
        </FlexCol> 
        <FlexCol className="box-shadow-amb-3" {...{  style: {height: '250px',  background: '#f8f8f8', margin: '8px 8px', padding: '8px'}}}>
            <div className="bg-light-gray pal" >
                <Image href="/nftview?panel=6" className="box-shadow-3 txt-c" src="/panelsSmall/6.jpg" alt="Iweng"/>
            </div>
        </FlexCol>  
    </Grid>

<Grid className="grid-show ">
        <FlexCol className="box-shadow-amb-3" {...{  style: {height: '250px',  background: '#f8f8f8', margin: '8px 8px', padding: '8px'}}}>
            <div className="bg-light-gray pal" >
                <Image href="/nftview?panel=7" className="box-shadow-3 txt-c" src="/panelsSmall/7.jpg" alt="Iweng"/>
            </div>
        </FlexCol>
        <FlexCol className="box-shadow-amb-3" {...{  style: {height: '250px',  background: '#f8f8f8', margin: '8px 8px', padding: '8px'}}}>
            <div className="bg-light-gray pal" >
                <Image href="/nftview?panel=8" className="box-shadow-3 txt-c" src="/panelsSmall/8.jpg" alt="Iweng"/>
            </div>
        </FlexCol> 
        <FlexCol className="box-shadow-amb-3" {...{  style: {height: '250px',  background: '#f8f8f8', margin: '8px 8px', padding: '8px'}}}>
            <div className="bg-light-gray pal" >
                <Image href="/nftview?panel=9" className="box-shadow-3 txt-c" src="/panelsSmall/9.jpg" alt="Iweng"/>
            </div>
        </FlexCol>  
    </Grid>

<Divider/>

</Panel>


    </div>
    
   

  );
}

export default App;
