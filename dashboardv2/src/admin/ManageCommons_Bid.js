import React, { useState, useEffect } from 'react'

import { ethers } from 'ethers'
import MOLCOMMONS_ABI from '../MOLCOMMONS_ABI'
import {Panel} from 'pivotal-ui/react/panels';
import {FlexCol} from 'pivotal-ui/react/flex-grids';
import {BrandButton} from 'pivotal-ui/react/buttons';

const ManageCommons_Bid = ({ signer, commons }) => {
  // ----- useState
  const [bid, setBid] = useState('')
  const [bidder, setBidder] = useState('')
  const [bidOwners, setBidOwners] = useState([])
  const [numBidConfirmations, setNumBidConfirmations] = useState('')
  const [err, setErr] = useState(null)
  const [numConfirmationsRequired, setNumConfirmationsRequired] = useState('')


  // ----- Get functions
  const getNumConfirmationsRequired = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      _contract
        .confirmations(0)
        .then((data) => setNumConfirmationsRequired(data))
    } catch (e) {
      console.log(e)
    }
  }

  const getBid = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      _contract.bid().then((data) => {
        const b = ethers.utils.formatEther(data)
        setBid(b)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const getBidder = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      _contract.bidder().then((data) => {
        setBidder(data)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const getBidOwners = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      _contract.getBidOwners().then((data) => {
        setBidOwners(data)
      })
    } catch (e) {
      console.log(e)
    }
  }

  // ----- Execution functions
  const confirmSale = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      const tx = await _contract.confirmBid()
      tx.wait().then(() => {
        _contract
          .numBidConfirmations()
          .then((data) => setNumBidConfirmations(data))
          setErr('')
      })
    } catch (e) {
      if (e.code === 4001) {
        setErr('User rejected transaction!')
      } else if (e.error.code === 4001) {
        setErr('User rejected transaction!')
      } else if (Math.abs(e.error.code) === 32603) {
        setErr('You have already confirmed to sell this commons!')
      } else {
        setErr('Something went wrong!')
      }
    }
  }

  const revokeSale = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      const tx = await _contract.revokeBidConfirmation()
      tx.wait().then(() => {
        _contract
          .numBidConfirmations()
          .then((data) => setNumBidConfirmations(data))
        setErr('')
      })
    } catch (e) {
      if (e.code === 4001) {
        setErr('User rejected transaction!')
      } else if (e.error.code === 4001) {
        setErr('User rejected transaction!')
      } else if (Math.abs(e.error.code) === 32603) {
        setErr('Bid is not yet confirmed!')
      } else {
        setErr('Something went wrong!')
      }
    }
  }

  const sellVault = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      const tx = await _contract.executeBid()
      tx.wait().then(() => {
        //history.push(`/community`)
      })
    } catch (e) {
      if (e.code === 4001) {
        setErr('User rejected transaction!')
      } else if (e.error.code === 4001) {
        setErr('User rejected transaction!')
      } else if (Math.abs(e.error.code) === 32603) {
        setErr('You have not confirmed current bid!')
      } else {
        setErr('Something went wrong!')
      }
    }
  }

  const getConfirmSale = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      _contract
        .confirmations(1)
        .then((data) => setNumBidConfirmations(data))
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getNumConfirmationsRequired()
    getConfirmSale()
    getBid()
    getBidder()
    getBidOwners()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
              <div className="panel" >
                <Panel {...{title: 'Sell Commons', titleCols: [<FlexCol fixed></FlexCol>], style: {  padding: '8px', background: '#f2f2f2'}}}>

      
      <h3>Click 'Confirm' to vote, and execute when consensus is reached.</h3>
      <h4>Highest Bid: {bid} Ξ</h4>
      <h4>Highest Bidder: {bidder}</h4>
      <h4>New Organizer(s): {bidOwners}</h4>
      <h4>No. Confirmations Required: {numConfirmationsRequired}</h4>
      <h4>No. Sell Confirmations: {numBidConfirmations}</h4>
      {err && (
        <h3>{err}</h3>
      )}
    
        

        <BrandButton onClick={confirmSale} >Confirm</BrandButton>
        <BrandButton onClick={revokeSale} >Revoke Confirmation</BrandButton>
        <BrandButton onClick={sellVault} >Execute</BrandButton>


</Panel> </div>
  )
}

export default ManageCommons_Bid
