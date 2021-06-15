import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import MOLCOMMONS_ABI from '../MOLCOMMONS_ABI'
import {FlexCol} from 'pivotal-ui/react/flex-grids';
import {BrandButton} from 'pivotal-ui/react/buttons';
import {Panel} from 'pivotal-ui/react/panels';
import {Input} from 'pivotal-ui/react/inputs';

const ManageCommons_Fee = ({ signer, commons, coin }) => {
  // ----- useState
  const [fee, setFee] = useState(0)
  const [feeContributors, setFeeContributors] = useState(0)
  const [updatedFee, setUpdatedFee] = useState('')
  const [updatedContributorsFee, setUpdatedContributorsFee] = useState('')

  const getCreatorsFee = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      _contract.fees(0).then((data) => {
        const f = ethers.utils.formatUnits(data, 'wei')
        setFee(f)
      })
    } catch (e) {
      console.log(e)
    }
  }


    const getContributorsFee = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      _contract.fees(1).then((data) => {
        const f = ethers.utils.formatUnits(data, 'wei')
        setFeeContributors(f)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const updateFee = async () => {
   // const f = updatedFee * 10
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      const tx = await _contract.updateFeeDistribution(updatedFee,updatedContributorsFee)
      tx.wait().then(() => {
        window.location.reload()
      })
    } catch (e) {
      console.log(e)
    }
  }


  useEffect(() => {
    getCreatorsFee()
    getContributorsFee()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
            <div className="panel" >
                <Panel {...{title: 'Transaction Fee', titleCols: [<FlexCol fixed></FlexCol>], style: {  padding: '8px', background: '#f2f2f2'}}}>
                <h3>All sale includes a transaction fee that is split between creators.</h3> 
                <h4> Default Creator transaction fee is 1%.</h4>
                <h4> Default Contributor transaction fee is 1%.</h4>
                <h4>Current Creator Transaction Fee: {fee} %</h4>
                <h4>Current Contributor Transaction Fee: {feeContributors}</h4>
                <Input type='text' value={updatedFee} onChange={(e) => setUpdatedFee(e.target.value)} placeholder='Enter new Creators fee percentage' />

                <Input type='text' value={updatedContributorsFee} onChange={(e) => setUpdatedContributorsFee(e.target.value)} placeholder='Enter new Contributors fee percentage' />
                <BrandButton  onClick={updateFee} >Update</BrandButton>
</Panel> 
    </div>
  )
}

export default ManageCommons_Fee
