import { Box, Paper, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Grid, InputLabel, Select, MenuItem, TextField, Slider } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/system';
import { useAddress, ConnectWallet, useContract, useNFTBalance, Web3Button } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';
import VoteForm from '../../components/VoteForm';
import ProposalList from '../../components/ProposalList';
import FileList from '../../components/FileList';

const DAOMember = () => {
    const address = useAddress();

    const editionDropAddress = "0xd18a96A539af150646f6E84fAEf0420FD2f1B3e3"
    const { contract: editionDrop } = useContract(editionDropAddress, "edition-drop");
    const { contract: token } = useContract('0xCe3fF8622fa3539F3Be49f9A9A7dD8A46bAAc662', 'token');

    const { data: nftBalance } = useNFTBalance(editionDrop, address, "0")

    const hasClaimedNFT = useMemo(() => {
        return nftBalance && nftBalance.gt(0)
    }, [nftBalance])

    const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);

    const [memberAddresses, setMemberAddresses] = useState<any>([]);

    const [showFiles, setShowFiles] = useState(false);

    const shortenAddress = (str: string) => {
        return str.substring(0, 6) + '...' + str.substring(str.length - 4);
    };

    // This useEffect grabs all the addresses of our members holding our NFT.
    useEffect(() => {
        if (!hasClaimedNFT) {
            return;
        }
        const getAllAddresses = async () => {
            try {
            const memberAddresses = await editionDrop?.history.getAllClaimerAddresses(
                0,
            );
            setMemberAddresses(memberAddresses);
            console.log('🚀 Members addresses', memberAddresses);
            } catch (error) {
            console.error('failed to get member list', error);
            }
        };
        getAllAddresses();
    }, [hasClaimedNFT, editionDrop?.history]);

    // This useEffect grabs the # of token each member holds.
    useEffect(() => {
        if (!hasClaimedNFT) {
            return;
        }

        const getAllBalances = async () => {
            try {
                const amounts: any = await token?.history.getAllHolderBalances();
                setMemberTokenAmounts(amounts);
            console.log('👜 Amounts', amounts);
            } catch (error) {
                console.error('failed to get member balances', error);
            }
        };
        getAllBalances();
    }, [hasClaimedNFT, token?.history]);

    // Now, we combine the memberAddresses and memberTokenAmounts into a single array
    const memberList = useMemo(() => {
        return memberAddresses.map((address: any) => {
            
            const member: any = memberTokenAmounts?.find(({ holder }) => holder === address);

            return {
                address,
                tokenAmount: member?.balance.displayValue || '0',
            };
        });
    }, [memberAddresses, memberTokenAmounts]);

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
                        console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop?.getAddress()}/0`);
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

    const filesSection = () => {
        const ShowFileButton = () => <Button sx={{width: '95%', ml: 2}} onClick={() => setShowFiles(!showFiles)}>^ Submitted Files ^</Button>;
        if(showFiles) {
            return (
            <>
                <FileList />
                {ShowFileButton()}
            </>
            )
        }
        return ShowFileButton()
    }

    const member = () => {
        return (
            <>
                <Typography sx={{ mt: 4, mb: 2, ml: 2 }} variant="h4" component="div">DAO Member Dashboard</Typography>
                {/* <Typography sx={{ mt: 4, mb: 2, ml: 2 }} variant="body1" component="div">Congratulations on being a member</Typography> */}
                <Typography sx={{ mt: 4, mb: 2, ml: 2 }} variant="h6" component="div">Member List</Typography>
                <Grid container>
                    <Grid item xs={6}>
                        <TableContainer sx={{ maxHeight: 400, border: '1px solid #EAEAEA', mt: 2, width: '95%', ml: 2, mb: 2 }} component={Paper}>
                        <Table stickyHeader aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ADDRESS</TableCell>
                                    <TableCell align="right">TOKEN AMOUNT</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                { memberList.map((member: any) => (
                                    <TableRow
                                    key={`${member.address}`}
                                    sx={{ borderRight: '1px dotted #EAEAEA' }}
                                    >
                                        <TableCell align="left">{shortenAddress(member.address)}</TableCell>
                                        <TableCell align="right">{member.tokenAmount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </TableContainer>
                        {filesSection()}
                    </Grid>
                    <Grid item xs={6}>
                        <VoteForm members={memberList} />
                    </Grid>
                    <Grid item xs={12}>
                        <ProposalList hasClaimedNFT={hasClaimedNFT} address={address} />
                    </Grid>
                </Grid>
            </>
        )
    }

    return (
        <Container maxWidth={false}>
            <Box component={Paper} sx={{border: '2px solid #27163c', textAlign: 'left', mt: 2 }}>
                {hasClaimedNFT ? member() : notAMember()}
            </Box>
        </Container>
    )
}

export default DAOMember;