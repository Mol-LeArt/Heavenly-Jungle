import React, { useState } from "react";
import {Modal} from 'pivotal-ui/react/modal';
import {Input} from 'pivotal-ui/react/inputs';
import {DefaultButton} from 'pivotal-ui/react/buttons';
import { ethers } from 'ethers'
import MOLCOMMONS_ABI from './MOLCOMMONS_ABI'
import GAMMA_ABI from './GAMMA_ABI'

const AddOrganzizerModal = (props) => {

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const [orgAddress,                 setOrgAddress     ] = useState('')
        const [show,                    setShow                 ] = useState(false)
 
   const addOrganizer = async () => {
        props.callBack( orgAddress );
        setOrgAddress('');
    }
 
    return (
      <div>
      <DefaultButton onClick={() => {setShow(true);}}>Add Organizer</DefaultButton>
        <Modal 
                
                title="Add Another Organizer"
                size="30%"
                show={show}
                onHide={() => setShow(false)}                >
         <div>
         
          <input
            type='text'
            placeholder='Enter address'
            onChange={(e) => { setOrgAddress(e.target.value); document.getElementById( 'addbutton' ).disabled=false;  } }
            id='org'
          />
        </div>
<br/>
<DefaultButton id='addbutton'  onClick={async (e) => { if ( orgAddress ) { await addOrganizer();setShow(false); } } } >Add</DefaultButton>  
        </Modal>
      </div>
    );
  
}

export default AddOrganzizerModal;
