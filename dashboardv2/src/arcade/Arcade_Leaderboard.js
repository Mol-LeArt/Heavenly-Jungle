import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import COIN_ABI from '../COIN_ABI'
import moralis from "moralis";

const Arcade_Leaderboard = ({commons,coins}) => {


moralis.initialize(process.env.REACT_APP_MORALIS_APPLICATION_ID);
moralis.serverURL = process.env.REACT_APP_MORALIS_SERVER_URL;

 const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer_ = provider.getSigner()
  // ----- useState
  const [holders, setHolders] = useState(null)
  //const [
  const Holder = moralis.Object.extend( "NFTHolder", {},{});

  const getCoinHolders = async () => {

            var addresses = [];
            const query = new moralis.Query( Holder );
            query.equalTo( "commonsAddress", commons );
//            query.distinct( "accountAddress" )
            const results = await query.find();
            for ( var i = 0; i < results.length;  i++ ) // TODO 
            { 
                addresses.push( results[0].get( "accountAddress" ) );
            }
            if ( addresses.length > 0  )
            {
                getUserCoinBalance(addresses);
            }
  }

  const getUserCoinBalance = async (addresses) => {
    const _holders = []
    const _contract = new ethers.Contract(coins, COIN_ABI, signer_ )

    for (let i = 0; i < addresses.length; i++) {
      try {
        _contract.balanceOf(addresses[i]).then((data) => {
          const balance = ethers.utils.formatEther(data.toString())
          const _holder = {
            address: addresses[i],
            balance: balance,
          }
          _holders.push(_holder)
          _holders.sort((a, b) => b.balance - a.balance)
          setHolders([..._holders])
        })
      } catch (e) {
        console.log(e)
      }
    }
  }

  useEffect(() => {
    getCoinHolders()
    
  })

  return (
    <div class='space-y-2'>
      <div class='mt-14 mb-5 text-4xl font-semibold text-semibold text-center'>
        Leaderboard
      </div>
      <div class='pb-5 text-center text-gray-400'>
        Ranking of holders by coin balance
      </div>
      {!holders && (
        <div class='text-center'>🔎 Cannot find any coin holders 🔎 </div>
      )}
      {holders &&
        holders.map((holder, index) => (
          <div key={index} class='flex items-center mx-auto'>
            <div class='flex-1'>
              {index + 1}.{' '}
              {holder.address}
            </div>
            <div class='flex-2'>{holder.balance}</div>
          </div>
        ))}
      <div class='text-center text-gray-300'>--------------</div>
    </div>
  )
}

export default Arcade_Leaderboard
