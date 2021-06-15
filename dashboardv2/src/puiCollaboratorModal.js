import React, { useState } from "react";
import {Modal} from 'pivotal-ui/react/modal';
import {Input} from 'pivotal-ui/react/inputs';
import {DefaultButton} from 'pivotal-ui/react/buttons';
import { ethers } from 'ethers'
import MOLCOMMONS_ABI from './MOLCOMMONS_ABI'
import GAMMA_ABI from './GAMMA_ABI'
import Web3 from 'web3';
import { PrimaryButton, DangerButton, BrandButton} from 'pivotal-ui/react/buttons';
import moralis from "moralis";


const AddCollaboratorModal = (props) => {

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        var web3 = new Web3(Web3.givenProvider);

        const [collaboratorAddress,         setCollaboratorAddress        ] = useState('')
        const [collaboratorSplit,           setCollaboratorSplit          ] = useState('')
        const [show,                        setShow                       ] = useState(false)
        const [addressBook,                 setAddressBook          ] = useState([])

     const UserAddress = moralis.Object.extend( "UserAddress", {}, {
            newUserAddress: function(address) { 
                const userAddress = new UserAddress();
                userAddress.set( "account",     user.get("ethAddress").toLowerCase()  );
                userAddress.set( "address",     address.toLowerCase()  );
                return userAddress; 
                }
        } );

    const user = moralis.User.current();

    const getAddresses = async () => {

//        alert(user.get("ethAddress"));
       var addresses = [];
       
       const query = new moralis.Query( UserAddress);
       query.equalTo( "account", user.get("ethAddress") );
       const results = await query.find();
                     
       for ( var i = 0; i < results.length; i++ ) // TODO 
       { 
             addresses.push( results[i].get("address") ); 
       }
       if ( results.length === 0  )
       {
           addresses.push( user.get("ethAddress") );
       };

       const rows = addresses.map((account,index) => <li className="addressitem txt-m" key={index}>
                                                        <div>
                                                            <button onClick={()=>{ document.getElementById('org').value=account; setCollaboratorAddress( account );}}>{account}</button>
                                                        </div>
                                                      </li>  );
       setAddressBook( rows );
       
    }

 
   const addcollaborator = async () => {
        props.callBack( collaboratorAddress, collaboratorSplit );
        setCollaboratorAddress('');
        setCollaboratorSplit('');
    }
 
    return (
      <div>
      <DefaultButton onClick={() => {setShow(true);getAddresses();}}>Add Collaborator</DefaultButton>
        <Modal 
                title="Add Collaborator"
                size="30%"
                show={show}
                onHide={() => setShow(false)}                >
         <div>
         
          <input
            type='text'
            placeholder='Enter address'
            onChange={(e) => { setCollaboratorAddress(e.target.value); if ( collaboratorSplit ){ document.getElementById( 'addcollaboratorbutton' ).disabled=false; } } }
            id='org'
          /><br/>
        </div>
        <div>

  <div id="abook">
               <img id="abookimg" src='./address-book.png' /><br/>
                <ul>
                    {addressBook}
                </ul>
            </div>
         <br/>
          <input
            type='text'
            placeholder='Enter split %'
            onChange={(e) => { setCollaboratorSplit(e.target.value); if ( collaboratorAddress ){ document.getElementById( 'addcollaboratorbutton' ).disabled=( false ); } } }
            id='split'
          />
        </div>
<br/>
<DefaultButton id='addcollaboratorbutton'  onClick={async (e) => { if ( collaboratorAddress ) { await addcollaborator();setShow(false); } } } >Add</DefaultButton>  
        </Modal>
      </div>
    );
  
}

export default AddCollaboratorModal;
