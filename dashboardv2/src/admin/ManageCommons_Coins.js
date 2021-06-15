/*import React, { useState, useEffect, useContext } from 'react'
import { ethers } from 'ethers'
import MOLCOMMONS_ABI from './CONTROLLER_ABI'
import COIN_ABI from './COIN_ABI'
import { CommunityContext } from '../GlobalContext'
import DeployCoinForm from './DeployCoinForm'


const ManageCommons_Coins = ({ signer, commons }) => {
  // ----- useState
  const [airdrop, setAirdrop] = useState(0)
  const [updatedAirdrop, setUpdatedAirdrop] = useState('')
  const [coinSupply, setCoinSupply] = useState(0)
  const [form, setForm] = useState(false)

  // ----- useContext
  //const { commons, coin } = useContext(CommunityContext)

  const updateAirdrop = async () => {
    try {
      const a = ethers.utils.parseEther(updatedAirdrop)
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      const tx = await _contract.updateAirdrop(a)
      tx.wait().then(() => {
        window.location.reload()
      })
    } catch (e) {
      console.log(e)
    }
  }

  const getCoins = async () => {
    try {
      const _contract = new ethers.Contract(coin, COIN_ABI, signer)
      _contract.totalSupply().then((data) => {
        const c = ethers.utils.formatEther(data)
        setCoinSupply(c)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const toggleForm = async () => {
    setForm(true)
  }

  useEffect(() => {
    // getCoins()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (

            <div className="panel" >
                <Panel {...{title: 'Coins', titleCols: [<FlexCol fixed></FlexCol>], style: {  padding: '8px', background: '#f2f2f2'}}}>
                    <h3>Coins</h3>
                    <p>Collectors get designated airdrop amount for buying NFTs <br/> Creators get amount x 2</p>
                    <h4>Commons Coin Contract Address: {coinAddress} </h4>
                    <h4>Total Coins in Circulation: {Math.trunc(coins)} 💵</h4>
                    <h4>Current Airdrop Amount Minting: {Math.trunc(airdrop)} 💵</h4>
                    <h4>Current Airdrop Amount Purchase: {Math.trunc(airdrop)} 💵</h4>
                    <Input type='text' value={updatedAirdrop} onChange={(e) => setUpdatedAirdrop(e.target.value)} placeholder='Enter amount to airdrop for minting NFTs' />
                    <Input type='text' value={updatedAirdrop} onChange={(e) => setUpdatedAirdrop(e.target.value)} placeholder='Enter amount to airdrop for buying NFTs' />
                    <BrandButton onClick={updateAirdrop} >Update</BrandButton>
                </Panel>
           </div>
    
    <div class='space-y-4'>
      <div class='mt-14 mb-5 text-4xl font-bold text-semibold text-center'>
        Coins
      </div>
      <div class='pb-5 text-center text-gray-400'>
        Collectors get designated airdrop amount for buying NFTs <br /> Creators
        get amount x 2
      </div>
      <div>Commons Coin Contract Address: {coin} </div>
      <div>Total Coins in Circulation: {Math.trunc(coinSupply)} 💵</div>
      <div class='flex space-x-4'>
      <button class='flex-1 py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md tracking-wider'>
          Import Social Coin
        </button>
        <button
          class='flex-1 py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md tracking-wider'
          onClick={toggleForm}
        >
          Deploy Social Coin
        </button>
      </div>
      <div class='flex space-x-4'>
        <input
          class='flex-2 border border-gray-400 py-2 px-4 w-full rounded focus:outline-none focus:border-gray-900 max-w-sm tracking-wider'
          type='text'
          value={updatedAirdrop}
          onChange={(e) => setUpdatedAirdrop(e.target.value)}
          placeholder='Enter new amount to airdrop'
        />
        <button
          class='flex-1 py-2 px-4 text-white bg-gray-800 hover:bg-gray-500 w-max rounded-md tracking-wider'
          onClick={updateAirdrop}
        >
          Update
        </button>
        {form && <DeployCoinForm setForm={setForm}></DeployCoinForm>}
      </div>
    </div>
  )
}

export default ManageCommons_Coins











*/



import React, { useState, useEffect} from 'react'

import { ethers } from 'ethers'
import MOLCOMMONS_ABI from '../CONTROLLER_ABI'
import COIN_ABI from '../COIN_ABI'
import {Panel} from 'pivotal-ui/react/panels';
import {FlexCol} from 'pivotal-ui/react/flex-grids';
import { BrandButton} from 'pivotal-ui/react/buttons';
import {Input} from 'pivotal-ui/react/inputs';

const ManageCommons_Coins = ({ signer, commons }) => {
  // ----- useState
  const [airdrop, setAirdrop] = useState(0)
  const [updatedAirdrop, setUpdatedAirdrop] = useState('')
  const [coins, setCoins] = useState(0)
  const [coinAddress, setCoinAddress] = useState('')


  const getAirdrop = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      _contract.airdrop().then((data) => {
        const a = ethers.utils.formatEther(data)
        setAirdrop(a)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const updateAirdrop = async () => {
    try {
      const a = ethers.utils.parseEther(updatedAirdrop)
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      const tx = await _contract.updateAirdrop(a)
      tx.wait().then(() => {
        window.location.reload()
      })
    } catch (e) {
      console.log(e)
    }
  }

  const getCoins = async () => {
    
    var coinContract = '';
    try {
            const _contractCommons = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
            coinContract = await _contractCommons.coin();
            setCoinAddress( coinContract );
             const _contract = new ethers.Contract(coinAddress, COIN_ABI, signer)
             _contract.totalSupply().then((data) => {
             const c = ethers.utils.formatEther(data)
             setCoins(c)
      })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getAirdrop()
    getCoins()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
            <div className="panel" >
                <Panel {...{title: 'Coins', titleCols: [<FlexCol fixed></FlexCol>], style: {  padding: '8px', background: '#f2f2f2'}}}>
                    <h3>Coins</h3>
                    <p>Collectors get designated airdrop amount for buying NFTs <br/> Creators get amount x 2</p>
                    <h4>Commons Coin Contract Address: {coinAddress} </h4>
                    <h4>Total Coins in Circulation: {Math.trunc(coins)} 💵</h4>
                    <h4>Current Airdrop Amount Minting: {Math.trunc(airdrop)} 💵</h4>
                    <h4>Current Airdrop Amount Purchase: {Math.trunc(airdrop)} 💵</h4>
                    <Input type='text' value={updatedAirdrop} onChange={(e) => setUpdatedAirdrop(e.target.value)} placeholder='Enter amount to airdrop for minting NFTs' />
                    <Input type='text' value={updatedAirdrop} onChange={(e) => setUpdatedAirdrop(e.target.value)} placeholder='Enter amount to airdrop for buying NFTs' />
                    <BrandButton onClick={updateAirdrop} >Update</BrandButton>
                </Panel>
           </div>
  )
}

export default ManageCommons_Coins
