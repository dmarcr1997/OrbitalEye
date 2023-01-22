import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useContract, Web3Button } from "@thirdweb-dev/react";
import daoBgImage from '../assets/images/OrbitalEyeDao.jpg';
const NotAMemberLandingPage = ({editionDropAddress}: any) => {
    const { contract: editionDrop } = useContract(editionDropAddress, "edition-drop");
    return(
    <Grid container sx={{ height: "100vh", width: '98vw', backgroundImage: `url(${daoBgImage})`, backgroundPosition: 'center'}} spacing={2}>
        <Grid item xs={8}>
            <Typography variant="h2" component="div">Welcome to Our DAO!</Typography>
            <Box component={Paper} sx={{padding: 2}}>
                <Typography variant="h6" component="div">
                    We are a Decentralized Autonomous Organization (DAO) dedicated to leveraging the power of blockchain technology and cryptocurrency to monitor, track, and protect against the threat of asteroids. By joining the OrbitalEye DAO, you can help us to increase our collective intelligence and to make sure that we are prepared for any and all asteroid-related events. 
                    As a member of OrbitalEye, you will be able to participate in a variety of activities, including voting on awarding bounties to people that submit data around asteroids, awarding each other crypto, and voting to add tokens to the treasury. 
                    To become a member of the OrbitalEye DAO, please fill out the sign-up form below. Once you have submitted the form, you will receive a confirmation email with further instructions. 
                    We look forward to having you as part of the OrbitalEye family and thank you for your support!
                </Typography>
            </Box>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="h6" component="div">Mint your free DAO Membership NFT</Typography>
            <Button>
                <Web3Button
                accentColor="#9198e5"
                contractAddress={editionDropAddress}
                action={contract => {
                    contract.erc1155.claim(0, 1)
                }}
                onSuccess={() => {
                    console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop?.getAddress()}/0`);
                }}
                onError={error => {
                    console.error("Failed to mint NFT", error);
                }}
                >
                Mint your NFT (FREE)
                </Web3Button>
            </Button>
        </Grid>
    </Grid>)
}

export default NotAMemberLandingPage;