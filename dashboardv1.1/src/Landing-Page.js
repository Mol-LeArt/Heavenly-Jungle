

import './App.css';
import './landingpage.css';

import {Grid, FlexCol} from 'pivotal-ui/react/flex-grids';
import {Panel} from 'pivotal-ui/react/panels';



function App() {


        return (
                    <div className="App">
                    <Panel {...{title: 'Heavenly Jungle NFT', titleCols: [<FlexCol fixed></FlexCol>], style: {  padding: '8px', background: '#f2f2f2'}}}>

                        <Grid className="grid-show ">
                          <FlexCol fixed {...{style: {width: '10%'}}}>
                                                 

                            </FlexCol>
                          <FlexCol {...{style: {padding: '8px'}}} >

    <section className="carousel" aria-label="Gallery">
  <ol className="carousel__viewport">
    <li id="carousel__slide1"
        tabindex="0"
        className="carousel__slide"><img width="100%" src='hj1.jpg' alt='Heavenly Jungle'/>
      <div className="carousel__snapper">
        <a href="#carousel__slide4"
           className="carousel__prev">Go to last slide</a>
        <a href="#carousel__slide2"
           className="carousel__next">Go to next slide</a>
      </div>
    </li>
    <li id="carousel__slide2"
        tabindex="0"
        className="carousel__slide"><img width="100%" src='page1.jpg' alt='Heavenly Jungle' />
      <div className="carousel__snapper"></div>
      <a href="#carousel__slide1"
         className="carousel__prev">Go to previous slide</a>
      <a href="#carousel__slide3"
         className="carousel__next">Go to next slide</a>
    </li>
    <li id="carousel__slide3"
        tabindex="0"
        className="carousel__slide"><img width="100%" src='page2.jpg'  alt='Heavenly Jungle' />
      <div className="carousel__snapper"></div>
      <a href="#carousel__slide2"
         className="carousel__prev">Go to previous slide</a>
      <a href="#carousel__slide4"
         className="carousel__next">Go to next slide</a>
    </li>
    <li id="carousel__slide4"
        tabindex="0"
        className="carousel__slide"><img width="100%" src='page3.jpg'  alt='Heavenly Jungle'/>
      <div className="carousel__snapper"></div>
      <a href="#carousel__slide3"
         className="carousel__prev">Go to previous slide</a>
      <a href="#carousel__slide1"
         className="carousel__next">Go to first slide</a>
    </li>
  </ol>
  <aside className="carousel__navigation">
    <ol className="carousel__navigation-list">
      <li className="carousel__navigation-item">
        <a href="#carousel__slide1"
           className="carousel__navigation-button">Go to slide 1</a>
      </li>
      <li className="carousel__navigation-item">
        <a href="#carousel__slide2"
           className="carousel__navigation-button">Go to slide 2</a>
      </li>
      <li className="carousel__navigation-item">
        <a href="#carousel__slide3"
           className="carousel__navigation-button">Go to slide 3</a>
      </li>
      <li className="carousel__navigation-item">
        <a href="#carousel__slide4"
           className="carousel__navigation-button">Go to slide 4</a>
      </li>
    </ol>
  </aside>
</section></FlexCol>
                          <FlexCol fixed {...{style: {width: '10%'}}} />

                        </Grid>
                </Panel> 


                <Panel {...{title: 'About', titleCols: [<FlexCol fixed></FlexCol>], style: {  padding: '8px', background: '#f2f2f2'}}}>
                       <div className="info" >
                            <h1>Heavenly Jungle NFT</h1>
                             <h2>DAO NFT Platform</h2>
                             <ul>
                                <li>Strong Community Focus</li>
                                <li>Fractional Ownership</li>
                                <li>Residuals for Creators</li>
                                <li>Social Coins</li>
                                <li>Rage Quit Functionality</li>
                                <li>Licensing</li>
                          
                               </ul>
                                
                            </div>
                            <div  className="info" >
                             
                             <h2>Development Road Map</h2>
                             <h3>Current</h3>
                             <ul>
                                <li>Platform Building</li>
                                <li>Commons Vault functions</li>
                                <li>Auctions</li>
                                <li>Minting process</li>
                                <li>Social Media integration</li>
                             </ul>
                             <h3>Future Release</h3>
                             <ul>
                                <li>Asian Art Week Release - ??/??/2021</li>
                             </ul>
                           </div>
                        <div className="info" >
                            <h2>Technology Involved</h2>
                            <ul>
                                <li>React</li>
                                <li>Pivotal UI</li>
                                <li>Moralis</li>
                                <li>IPFS - Pinata</li>
                                <li>Ethereum,xDai.... more chains coming!</li>
                            </ul> </div>
                         
                    </Panel>
                    </div>
               );
}

export default App;
