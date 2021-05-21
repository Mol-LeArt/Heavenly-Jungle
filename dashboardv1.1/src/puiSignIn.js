import React, { useState,  useEffect } from "react";
import {PrimaryButton} from 'pivotal-ui/react/buttons';
import { ethers } from 'ethers'
import moralis from "moralis";

moralis.initialize(process.env.REACT_APP_MORALIS_APPLICATION_ID);
moralis.serverURL = process.env.REACT_APP_MORALIS_SERVER_URL;

const SignIn = (props) =>
{

        const initialUser = moralis.User.current();
        const [user, setUser] = useState(initialUser);
        const [address, setAddress] = useState('Connect Wallet');
        const [chain, setChain] = useState('');
        const [connect, toggleConnect] = useState(false);
        const [account, setAccount] = useState(false);

      useEffect(() => {  if ( user) 
                                    { 
                                        getNetwork()
                                        setAddress(user.get("ethAddress")) 
                                        props.callBack( user, user.get("ethAddress") );
                                    }
                          else
                         {
                            alert('here');
                            getAccount()
                        }


  // eslint-disable-next-line react-hooks/exhaustive-deps 
                      }, [])

    const getAccount = async () => {
        window.ethereum
          .request({ method: 'eth_requestAccounts' })
          .then((result) => {
            console.log('Account connected - ' + result[0])
            setAccount(result[0])
           })
  }

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const onLogin = async () => {                                        
                                        await getNetwork();
                                        const user = await moralis.authenticate();
                                        props.callBack( user, user.get("ethAddress") );
                                };

    const onLogout = () => {  moralis.User.logOut(); setUser(null); };

    const getNetwork = () => {
                                    provider
                                      .getNetwork()
                                      .then((network) => {
                                        console.log('current chainId - ' + network.chainId)
                                        if (network.chainId === 100) {
                                          setChain('xDAI')
                                          toggleConnect(true)
                                        } else if (network.chainId === 4) {
                                          setChain('Rinkeby') 
                                          toggleConnect(true)
                                        } else if (network.chainId === 1) {
                                          setChain('Mainnet')
                                          toggleConnect(true)
                                        } else if (network.chainId === 3) {
                                          setChain('Ropsten')
                                          toggleConnect(true)
                                        } else if (network.chainId === 42) {
                                          setChain('Kovan')
                                          toggleConnect(true)
                                        } else {
                                          console.log('Pick a supported blockchain!')
                                        }
                                      })
                                      .catch((err) => { alert( 'err ' + err ); console.log(err); })
                                };

      return ( <PrimaryButton onClick={onLogin} >{address + ' - ' + chain}</PrimaryButton> );
}
export default SignIn;
