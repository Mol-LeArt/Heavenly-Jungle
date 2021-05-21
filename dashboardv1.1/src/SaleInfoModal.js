import React, { useState } from "react";
import {Modal} from 'pivotal-ui/react/modal';
import {Input} from 'pivotal-ui/react/inputs';
import {DefaultButton} from 'pivotal-ui/react/buttons';
import { ethers } from 'ethers'
import MOLCOMMONS_ABI from './MOLCOMMONS_ABI'
import GAMMA_ABI from './GAMMA_ABI'

const SaleInfoModal = ({ setForm, contract, tokenId, gammaAddress, commonsAddress, owner, isSale, defEthPrice, defCoinPrice }) => {

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const [show,                    setShow                 ] = useState(false)
        const [contractToUpdateSale,    setContractToUpdateSale ] = useState(null)
        const [sale,                    setSale                 ] = useState(false)
        const [ethPrice,                setEthPrice             ] = useState('')
        const [coinPrice,               setCoinPrice            ] = useState('')
        const [waitingMessage,          setWaitingMessage       ] = useState('')


  const doUpdate = async (e) => {
    
    console.log(contractToUpdateSale.address, gammaAddress)
    if (contractToUpdateSale.address === gammaAddress) {
      console.log('update gamma from vault')
      updateGammaSale()
    } else {
      console.log('update commons')
      updateCommonsGammaSale()
    }
  }

  // ----- Update sale for when Gamma leaves MolCommons
  const updateGammaSale = async () => {
    try {
      const p = ethers.utils.parseEther(ethPrice)
      const c = ethers.utils.parseEther(coinPrice)
      const tx = await contractToUpdateSale.updateSale(p, c, tokenId, sale?1:0)
      console.log('this is tx.hash for updating sale', tx.hash)

      const receipt = await tx.wait()
      console.log('update sale receipt is - ', receipt)
      window.location.reload()
    } catch (e) {
      console.log(e.message)
    }
  }

  // ----- Update sale with MolCommons
  const updateCommonsGammaSale = async () => {
    try {
      const p = ethers.utils.parseEther(ethPrice)
      const c = ethers.utils.parseEther(coinPrice)
      const tx = await contractToUpdateSale.updateSale(tokenId, p, c, sale?1:0)

      console.log('this is tx.hash for updating sale', tx.hash)

      const receipt = await tx.wait()
      console.log('update sale receipt is - ', receipt)
      window.location.reload()
    } catch (e) {
      console.log(e)
    }
  }



    async function updateSale() {
        
        if (owner !== 'Commons') {
          const _contract = await new ethers.Contract(gammaAddress, GAMMA_ABI, signer)
          setContractToUpdateSale(_contract)
        } else {
          const _contract = await new ethers.Contract(commonsAddress, MOLCOMMONS_ABI, signer)
          setContractToUpdateSale(_contract)
        }
    }

 
    return (
      <div>
      <DefaultButton onClick={() => { updateSale();setShow(true);}}>Update Sale</DefaultButton>
        <Modal 
                
                title="Update Sales Data!"
                size="30%"
                show={show}
                onHide={() => setShow(false)}                >
         <div>
          {waitingMessage}<br/>
          <label htmlFor='sale'>Put on sale?</label>
          <br />
         <Input type='Checkbox' 
                       defaultChecked={isSale}
                       onChange={(e) => {
                                            setSale(e.target.checked);
                                            if ( ! e.target.checked ){setEthPrice('0');
                                            document.getElementById('eth').value=0;setCoinPrice('0');             
                                            document.getElementById('coin').value=0;}
                                         else{document.getElementById('coin').value='';document.getElementById('eth').value='';}
                                         }
                                }
          />
        </div>

        <div>
          <label htmlFor='price'>Price in Ξ</label>
          <br />
          <input
            type='text'
            placeholder='Enter amount in Ξ'
            onChange={(e) => setEthPrice(e.target.value)}
            id='eth'
          />
        </div>

        <div>
          <label htmlFor='coins'>Price in coins</label>
          <br />
          <input
            type='text'
            placeholder='Enter number of coins'
            onChange={(e) => setCoinPrice(e.target.value)}
            id='coin'
          />
        </div><br/>
<DefaultButton onClick={async (e) => {  setWaitingMessage( 'Updating! Waiting for confirmation!' ); await doUpdate(); } } >Update</DefaultButton>  
        </Modal>
      </div>
    );
  
}

export default SaleInfoModal;
