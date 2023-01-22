import { 
  useAddress, 
  ConnectWallet, 
} from '@thirdweb-dev/react';
import { useEffect } from 'react';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import backgroundImg from '../../assets/images/asteroidBG.jpg';

const Landing = () => {
  const address = useAddress();
  const navigate = useNavigate();

  useEffect(() => {
    const goToDashboard = () => navigate('/dashboard');
    if(address){
      console.log('Wallet Connected: ', address);
      goToDashboard();
    }
  }, [address, navigate]);
  return (
    <Container maxWidth={false} sx={{ backgroundImage: `url(${backgroundImg})`, backgroundSize: 'cover', height: '100vh', width: '100vw' }}>
       {/* @ts-ignore */}
      <Grid container spacing={2}>
          {/* @ts-ignore */}
          <Grid item xs={12} className="card">
            <Typography 
              variant="h1"
              sx={{
              textAlign: 'center',
              fontWeight: 700,
              color: 'inherit',
              wordSpacing: '10px',
              textDecoration: 'none',
              mt: 6
            }}>
              Protect the Earth,
            </Typography>
            <Typography 
              variant="h1"
              sx={{
              textAlign: 'center',
              fontWeight: 700,
              color: 'inherit',
              wordSpacing: '10px',
              textDecoration: 'none',
            }}>
              Earn Crypto
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="h4"
              sx={{
                textAlign: 'center',
                fontWeight: 350,
                color: 'inherit',
                textDecoration: 'none',
                mt: 6,
                ml: 50,
                mr: 50
              }}
            >
              Near Earth Object Bounty Board. Submit asteroid observations, and earn bounties
            </Typography>
          </Grid>
        <Grid item xs={12}>
            <p>
              
            </p>
            <Container sx={{width: '20%'}}>
              <ConnectWallet/>
              <Typography variant="caption" className="read-the-docs" sx={{ mt: 2 }}>
                Connect Wallet On Goerli Network to Continue to the App
              </Typography>
            </Container>
        </Grid>
      </Grid>
    </Container>
  )
}

  export default Landing;