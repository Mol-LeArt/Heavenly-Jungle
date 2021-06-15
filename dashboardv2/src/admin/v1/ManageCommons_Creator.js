import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import MOLCOMMONS_ABI from '../MOLCOMMONS_ABI'
import {Grid, FlexCol} from 'pivotal-ui/react/flex-grids';
import {BrandButton} from 'pivotal-ui/react/buttons';
import {Panel} from 'pivotal-ui/react/panels';
import {Input} from 'pivotal-ui/react/inputs';
import Web3 from 'web3';
import GAMMA_ABI from '../GAMMA_ABI'

const ManageCommons_Creator = ({ signer, commons, gamma }) => {
  // ----- useState
  const [creators, setCreators] = useState([])
  const [creatorToAdd, setCreatorToAdd] = useState('')
  const [creatorToRemove, setCreatorToRemove] = useState('')

    var web3 = new Web3(Web3.givenProvider);
    
    const getCreators = async () => {
        try {
          const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
          const creators = await _contract.getCreators();
          var legitCreators = [];
            for ( var i = 0; i < creators.length; i++ )
            {
                if ( await _contract.isCreator(creators[i]) )
                {
                    legitCreators.push( creators[i] );
                }
            }      
            setCreators(legitCreators);
        } catch (e) {
          console.log(e)
    }
  }

  // const strikeCreators = async () => {
  //   try {
  //     const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
  //     _contract.getCreators().then((data) => {
  //       setCreators(data)
  //     })
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }


  const approve = async () => {
         try {
        var gammaContract = await new web3.eth.Contract( GAMMA_ABI, gamma,{from:await signer.getAddress()}  ); 
       // const approve = await gammaContract.methods.setApprovalForAll( creatorToAdd, true );
        gammaContract.methods.setApprovalForAll(creatorToAdd,true).send()
            .on("transactionHash",function(hash){
                    console.log(hash);
                })
             .on("confirmation", function(confirmationNr){
                    console.log(confirmationNr);

                 })
             .on("receipt", async function(receipt){
                    console.log(receipt);
                  
                   
                 });
         } catch (e) {
         console.log(e)
        }

    }

  const addCreator = async () => {
    try {

       var commonsContract = await new web3.eth.Contract( MOLCOMMONS_ABI, commons,{from:await signer.getAddress()}  ); 
            commonsContract.methods.addCreator(creatorToAdd).send()
            .on("transactionHash",function(hash){
                    console.log(hash);
                })
             .on("confirmation", function(confirmationNr){
                    console.log(confirmationNr);

                 })
             .on("receipt", async function(receipt){
                    console.log(receipt);
                  
                   
                 });

        
    } catch (e) {
      console.log(e)
    }
  }

  const removeCreator = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      const tx = await _contract.removeCreator(creatorToRemove)
      tx.wait().then(() => {
        window.location.reload()
      })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getCreators()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="panel" >
            <Panel {...{title: 'Creator Roster', titleCols: [<FlexCol fixed></FlexCol>], style: {  padding: '8px', background: '#f2f2f2'}}}>
            <h3>Add or remove a creator by entering her Eth address below.{' '}</h3>
      {creators && (
        <div>
          {creators.map((artist, index) => (
            <p key={index}>{artist}</p>
          ))}
        </div>
      )}
      
        <Input type='text' value={creatorToAdd} onChange={(e) => setCreatorToAdd(e.target.value)} placeholder='Enter artist address' />
        <BrandButton onClick={addCreator}>Add</BrandButton> &nbsp; <BrandButton onClick={approve}>Approve</BrandButton>
      
        <Input type='text' value={creatorToRemove} onChange={(e) => setCreatorToRemove(e.target.value)} placeholder='Enter artist address' />
        <BrandButton onClick={removeCreator}>Remove</BrandButton>

         </Panel>
      </div>
  )
}

export default ManageCommons_Creator
