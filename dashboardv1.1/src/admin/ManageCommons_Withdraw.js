import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import MOLCOMMONS_ABI from '../MOLCOMMONS_ABI'
import {FlexCol} from 'pivotal-ui/react/flex-grids';
import {BrandButton} from 'pivotal-ui/react/buttons';
import {Panel} from 'pivotal-ui/react/panels';
import {Input} from 'pivotal-ui/react/inputs';

const ManageCommons_Withdraw = ({ signer, commons }) => {
  // ----- useState
  const [numWithdrawalConfirmations, setNumWithdrawalConfirmations] = useState('')
  const [err, setErr] = useState(null)
  const [numConfirmationsRequired, setNumConfirmationsRequired] = useState('')

  const [availableFunds,    setAvailableFunds] = useState(0)
  const [fundsToWithdraw,   setFundsToWithdraw] = useState('')
  const [withdrawalAddress, setWithdrawalAddress] = useState('')


  const provider = new ethers.providers.Web3Provider(window.ethereum)

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

  const getConfirmWithdrawal = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      _contract
        . confirmations(2)
        .then((data) => setNumWithdrawalConfirmations(data))
    } catch (e) {
      console.log(e)
    }
  }

  const getAvailableFunds = async () => {
    const contractBalance = await provider.getBalance(commons)
    const cb = ethers.utils.formatEther(contractBalance)
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      _contract.bid().then((data) => {
        const b = ethers.utils.formatEther(data)
        const funds = cb - b
        setAvailableFunds(funds)
      })
    } catch (e) {
      console.log(e)
    }
  }

  // ----- Execution functions
  const confirmWithdrawal = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      const tx = await _contract.confirmWithdrawal()
      tx.wait().then(() => {
        _contract
          .numWithdrawalConfirmations()
          .then((data) => setNumWithdrawalConfirmations(data))
        setErr('')
      })
    } catch (e) {
      if (e.code === 4001) {
        setErr('User rejected transaction!')
      } else if (e.error.code === 4001) {
        setErr('User rejected transaction!')
      } else if (Math.abs(e.error.code) === 32603) {
        setErr('You have already confirmed to withdraw funds from the commons!')
      } else {
        setErr('Something went wrong!')
      }
    }
  }

  const revokeWithdrawal = async () => {
    try {
      const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
      const tx = await _contract.revokeWithdrawal()
      tx.wait().then(() => {
        _contract
          .numWithdrawalConfirmations()
          .then((data) => setNumWithdrawalConfirmations(data))
        setErr('')
      })
    } catch (e) {
      if (e.code === 4001) {
        setErr('User rejected transaction!')
      } else if (e.error.code === 4001) {
        setErr('User rejected transaction!')
      } else if (Math.abs(e.error.code) === 32603) {
        setErr('Withdrawal is not yet confirmed!')
      } else {
        setErr('Something went wrong!')
      }
    }
  }

  const executeWithdrawal = async () => {
    if (availableFunds > fundsToWithdraw) {
      const f = ethers.utils.parseEther(fundsToWithdraw.toString())

      try {
        const _contract = new ethers.Contract(commons, MOLCOMMONS_ABI, signer)
        const tx = await _contract.executeWithdrawal(f, withdrawalAddress)
        tx.wait().then(() => {
          window.location.reload()
        })
      } catch (e) {
        if (e.code === 4001) {
          setErr('User rejected transaction!')
        } else if (e.error.code === 4001) {
          setErr('User rejected transaction!')
        } else if (Math.abs(e.error.code) === 32603) {
          setErr('You have not confirmed withdrawal!')
        } else {
          setErr('Something went wrong!')
        }
      }
    } else {
      setErr('Please specify an appropriate amount to withdraw!')
    }
    
  }

  useEffect(() => {
    getAvailableFunds()
    getConfirmWithdrawal()
    getNumConfirmationsRequired()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (

             <div className="panel" >
                <Panel {...{title: 'Withdraw', titleCols: [<FlexCol fixed></FlexCol>], style: {  padding: '8px', background: '#f2f2f2'}}}>
                    <h2>Withdraw Funds from Common</h2>
                    <h3>Click 'Confirm' to vote, and withdraw when consensus is reached.</h3>
                    <h4>Funds Available to Withdraw: {availableFunds} Ξ</h4>
                    <h4>No. Confirmations Required: {numConfirmationsRequired}</h4>
                    <h4>No. Withdrawal Confirmations: {numWithdrawalConfirmations}</h4>
                  {err && ( <h4>{err}</h4> )}
                    <BrandButton onClick={confirmWithdrawal} >Confirm</BrandButton>
                    <BrandButton onClick={revokeWithdrawal} >Revoke Confirmation</BrandButton>
                    <Input placeholder='Enter amount in Ξ to withdraw' onChange={(e) => setFundsToWithdraw(e.target.value)} value={fundsToWithdraw} type='text'/>
                    <Input placeholder='Withdrawal Address' onChange={(e) => setWithdrawalAddress(e.target.value)}  type='text'/>
                    <BrandButton onClick={executeWithdrawal} >Withdraw</BrandButton>
                </Panel>
            </div>
  )
}

export default ManageCommons_Withdraw
