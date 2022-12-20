import { 
  useAddress, 
  useNetwork,
  ConnectWallet, 
} from '@thirdweb-dev/react';
import { useEffect } from 'react';

//Styles and Images imports
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { landingPageContainer } from './Landing.styles';
import OrbitalEye from '../../assets/images/OrbitalEyeLogo.png';
import { useNavigate } from 'react-router-dom';

const Landing = ({ redirectToDashboard }: any) => {
  const address = useAddress();
  const network = useNetwork();
  const navigate = useNavigate();

  useEffect(() => {
    const goToDashboard = () => navigate('/dashboard');
    if(address){
      console.log('Wallet Connected: ', address);
      goToDashboard();
    }
  }, [address, navigate]);
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