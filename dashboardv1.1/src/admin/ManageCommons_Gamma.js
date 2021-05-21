import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import MOLCOMMONS_ABI from '../MOLCOMMONS_ABI'
import GAMMA_ABI from '../GAMMA_ABI'

import {FlexCol} from 'pivotal-ui/react/flex-grids';
import {BrandButton} from 'pivotal-ui/react/buttons';
import {Panel} from 'pivotal-ui/react/panels';
import {Input} from 'pivotal-ui/react/inputs';

const ManageCommons_Gamma = ({ signer, commons, gamma }) => {
  // ----- useState
  const [gammaSupply, setGammaSupply] = useState(0)
  const [royalties, setRoyalties] = useState(0)
  const [updatedRoyalties, setUpdatedRoyalties] = useState('')

  const getGammaRoyalties = async () => {
    const _contract = new ethers.Contract(gamma, GAMMA_ABI, signer)
    _contract
      .royalties()
      .then((data) => {
        const r = ethers.utils.formatUnits(data, 'wei')
        setRoyalties(Math.trunc(r))
      })
      .catch((e) => console.log(e))
  }

  const getGammaSupply = async () => {
    const _contract = new ethers.Contract(gamma, GAMMA_ABI, signer)
    _contract
      .totalSupply()
      .then((data) => {
        const s = ethers.utils.formatUnits(data, 'wei')
        setGammaSupply(Math.trunc(s))
      })
      .catch((e) => console.log(e))
  }

  const updateRoyalties = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      const tx = await _contract.updateRoyalties(updatedRoyalties)
      tx.wait().then(() => {
        window.location.reload()
      })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getGammaRoyalties()
    getGammaSupply()             //TODO -- mismatch with contract
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (

        <div className="panel" >
            <Panel {...{title: 'Gamma', titleCols: [<FlexCol fixed></FlexCol>], style: {  padding: '8px', background: '#f2f2f2'}}}>
                <h2>NFT</h2>
                <h3>Commons mints NFTs</h3>
                <h3>NFT Contract Address: {gamma}</h3>
                <h3>Total minted: {gammaSupply}</h3>
                <h3>Royalties: {royalties} %</h3>
                <Input type='text' value={updatedRoyalties} onChange={(e) => setUpdatedRoyalties(e.target.value)} placeholder='Enter new royalties %' />
                <BrandButton onClick={updateRoyalties} >Update</BrandButton>
            </Panel>
         </div>
  )
}

export default ManageCommons_Gamma
