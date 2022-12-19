import { 
  useAddress, 
  useNetwork,
  ConnectWallet, 
  Web3Button, 
  useContract, 
  useNFTBalance 
} from '@thirdweb-dev/react';
// import { ChainId } from '@thirdweb-dev/sdk';
import { useState, useEffect, useMemo } from 'react';
// import { AddressZero } from "@ethersproject/constants";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { landingPageContainer } from './Landing.styles';
import OrbitalEye from '../../assets/images/OrbitalEyeLogo.png';
const Landing = () => {
  const address = useAddress();
  const network = useNetwork();

  return (
    <Container maxWidth='xl' sx={landingPageContainer}>
      <Box>
        <img src={OrbitalEye} className="logo" alt="OrbitalEye logo" />
      </Box>
      <h1>OrbitalEye</h1>
      <div className="card">
        <p>
          Connect Wallet On Goerli Network to Continue to the App
        </p>
        <Container maxWidth='sm'>
          <ConnectWallet />
        </Container>
        <p className="read-the-docs">
          Select your wallet
        </p>
      </div>
    </Container>
  )
}

  export default Landing;