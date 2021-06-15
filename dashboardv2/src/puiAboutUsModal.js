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

const AboutUsModal = (props) => {

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        var web3 = new Web3(Web3.givenProvider);

        const user = moralis.User.current();

  const Commons = moralis.Object.extend( "Commons", 
        {
          // Instance methods

        }, 
        {  
            newCommons: function() { 
                                        const commons = new Commons();
                                        commons.set( "name",            document.getElementById( 'commonsname'     ).value  );
                                        commons.set( "vaultsymbol",     document.getElementById( 'vaultsymbol'     ).value  );
                                        commons.set( "organizer",       document.getElementById( 'organizer0'       ).value  ); 
                                        commons.set( "vaultname",       document.getElementById( 'vaultname'       ).value  ); 
                                        commons.set( "confirmations",   document.getElementById( 'confirmations'   ).value  );
                                        commons.set( "transferrable",   document.getElementById( 'transferrable'   ).checked + '' );
                                       
                                        var radios = document.getElementsByName( 'radio-group'   );                                 
                                        for (var i = 0; i < radios.length; i++) 
                                        {
                                            if ( radios[i].checked )
                                            {
                                               commons.set( "use",     radios[i].value  );
                                            }
                                        }
                                        return commons; 
                                    }
        });

        const [minterAddress,               setMinterAddress        ] = useState('')
        const [show,                        setShow                 ] = useState(false)
        const [addressBook,                 setAddressBook          ] = useState([])
 
        const saveContent = async () => {    

                                            const header = document.getElementById( 'about-header' ).value;
                                            const paragraph = document.getElementById( 'about-paragraph' ).value;
                                            const tandc = document.getElementById( 'tc' ).value;

                                            var commonsId =    window.location.search.substring( 11 );
                                            const query = new moralis.Query( Commons );
                                            query.equalTo( "objectId", commonsId );
                                            const results = await query.find();
                                            var commonsObject;
                                            for ( let i = 0; i < results.length; i++ ) 
                                            { 
                                                const object = await results[i].fetch();
                                             //   var header = document.getElementById( 'about-header' ).value;
                                                if ( header !== '' )
                                                {
                                                    object.set( "header",        header );
                                                  //  setAboutHeader( document.getElementById( 'about-header' ).value );
                                                }
                                                if ( paragraph !== '' )
                                                {
                                                    object.set( "paragraph",    paragraph );
                                              //      setAboutParagraph( document.getElementById( 'about-paragraph' ).value );
                                                }
                                                if ( tandc !== '' )
                                                {
                                                    object.set( "tandc",    tandc );
                                                    
                                                }
                                              
                                                var resp =  await object.save();
                                                props.callBack( header, paragraph );
                                                                               
                                            } 
                                };

    return (
      <div>
      <DefaultButton onClick={() => {setShow(true);}}>Edit</DefaultButton>
        <Modal 
                title="Edit Commons Info"
                size="30%"
                show={show}
                onHide={() => setShow(false)}                >
         <div>
         <br/><h3>About Header</h3><Input defaultValue={props.header} id="about-header" type="text"/><br/></div>
         <div><h3>About Paragraph</h3><textarea id="about-paragraph"  >{props.paragraph}</textarea><br/></div>
        <div ><br/><h3>Terms and Conditions - Minting Page</h3><textarea id="tc"  >{props.terms}</textarea><br/></div>
        
<br/>
<DefaultButton   onClick={async () => { saveContent(); setShow(false);} } >Save</DefaultButton>  
        </Modal>
      </div>
    );
  
}

export default AboutUsModal;
