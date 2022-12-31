import { Box, Paper } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/system';
import { useAddress, ConnectWallet, useContract, useNFTBalance, Web3Button } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';

const DAOMember = () => {
    const address = useAddress();

    const editionDropAddress = "0xd18a96A539af150646f6E84fAEf0420FD2f1B3e3"
    const { contract: editionDrop } = useContract(editionDropAddress, "edition-drop");
    // Hook to check if the user has our NFT
    const { data: nftBalance } = useNFTBalance(editionDrop, address, "0")

    const hasClaimedNFT = useMemo(() => {
        return nftBalance && nftBalance.gt(0)
    }, [nftBalance])
    const notAMember = () => {
        return(
            <>
                <Typography sx={{ mt: 4, mb: 2, ml: 2 }} variant="h6" component="div">Mint your free 🍪DAO Membership NFT</Typography>
                <Button className="btn-hero">
                    <Web3Button 
                    contractAddress={editionDropAddress}
                    action={contract => {
                        contract.erc1155.claim(0, 1)
                    }}
                    onSuccess={() => {
                        console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
                    }}
                    onError={error => {
                        console.error("Failed to mint NFT", error);
                    }}
                    >
                    Mint your NFT (FREE)
                    </Web3Button>
                </Button>
            </>
        )
    }

    const member = () => {
        return (
            <>
                <Typography sx={{ mt: 4, mb: 2, ml: 2 }} variant="h6" component="div">🍪DAO Member Page</Typography>
                <Typography sx={{ mt: 4, mb: 2, ml: 2 }} variant="body1" component="div">Congratulations on being a member</Typography>
            </>
        )
    }
    return (
        <Container>
            <Box component={Paper} sx={{border: '2px solid #27163c', textAlign: 'left', mt: 2 }}>
                {hasClaimedNFT ? member() : notAMember()}
            </Box>
        </Container>
    )
}

export default DAOMember;