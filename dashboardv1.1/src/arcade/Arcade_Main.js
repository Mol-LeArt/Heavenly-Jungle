import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

import COIN_ABI from '../COIN_ABI'

const Arcade_Main = ({ signer, account, coin }) => {

  const [balance,       setBalance]      = useState(0)
  const [totalCoins,    setTotalCoins]   = useState(0)
  const [percentage,    setPercentage]   = useState(0)

  const getUserCoinBalance = async () => {
    try {
      const _contract = new ethers.Contract(coin, COIN_ABI, signer)
      _contract.balanceOf(account).then((data) => {
        const balance = ethers.utils.formatEther(data.toString())
        if ( Math.trunc(balance) > 0 )
        {
             setBalance(Math.trunc(balance))
        }
        else
        {
            setBalance(balance);
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  const getCoinSupply = async () => {
    try {
      const _contract = new ethers.Contract(coin, COIN_ABI, signer)
      _contract.totalSupply().then((data) => {
        const balance = ethers.utils.formatEther(data.toString())
        if ( Math.trunc(balance) > 0 )
        {
             setTotalCoins(Math.trunc(balance))
        }
        else
        {
            setTotalCoins(balance);
        }        
      })
    } catch (e) {
      console.log(e)
    }
  }

  const getPercentage = () => {
    const perc = balance / totalCoins * 100
    setPercentage(Math.trunc(perc))
  }

  useEffect(() => {


    getUserCoinBalance()
    getCoinSupply()

    if (balance && totalCoins) {
      getPercentage()
    }
    return () => {}
  }, [balance, totalCoins])

  return (
    <div class='space-y-2'>
      <div class='text-center text-2xl'>Your Balance: {balance} 💵</div>
      <div class='pb-5 text-center text-gray-400'>
        Mint and buy NFT to get community coins. 
      </div>
      <div>Total in Circulation: {totalCoins} 💵</div>
      <div>You have {percentage} % voting power. </div>
    </div>
  )
}

export default Arcade_Main
