import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import MOLCOMMONS_ABI from '../MOLCOMMONS_ABI'

const Arcade_Bid = ({account,commons,signer}) => {
  // ----- useState
  const [bid, setBid] = useState(null)
  const [bidder, setBidder] = useState(null)
  const [newBid, setNewBid] = useState('')
  const [err, setErr] = useState(null)

  // ----- Get bid
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

  // ----- Get bidder
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

  // ----- Bid
  const bidCommons = async () => {
    const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
    try {
      const newOwners = [account]
      const overrides = { value: ethers.utils.parseEther(newBid) }
      console.log(newBid)
      const tx = await _contract.bidCommons(newOwners, overrides)
      tx.wait().then(() => {
        getBid()
        getBidder()
        setErr('')
      })
    } catch (e) {
      console.log(e)
      setErr('You must bid higher than the highest bid!')
    }
  }

  useEffect(() => {    
           
    getBid()
    getBidder()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div >
      <div >
        Bids on Commons
      </div>
      <div >Description</div>
      <div>Highest Bid: {bid} Ξ</div>
      <div>Highest Bidder: {bidder}</div>
      {err && <div>{err}</div>}
      <div>
        <input
          type='text'
          value={newBid}
          onChange={(e) => setNewBid(e.target.value)}
          placeholder='Enter bid in Ξ'
        />

        <button
          onClick={bidCommons}
        >
          Bid on Vault
        </button>
      </div>

      <div>
        *Bid amount will be locked in commons until bid is withdrawn or accepted
      </div>

    </div>
  )
}

export default Arcade_Bid
