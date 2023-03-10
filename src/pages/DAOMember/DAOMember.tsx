import { Box, Paper, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/system';
import { useAddress, useContract, useNFTBalance } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';
import VoteForm from '../../components/VoteForm';
import ProposalList from '../../components/ProposalList';
import FileList from '../../components/FileList';
import NotAMemberLandingPage from '../../components/NotAMemberLandingPage';

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

    const [files, setFiles] = useState([]);

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
            } catch (error) {
                console.error('failed to get member balances', error);
            }
        };
        getAllBalances();
    }, [hasClaimedNFT, token?.history]);

    useEffect(() => {
        async function getFiles() {
            const response = await fetch('https://orbital-eye-back-end.vercel.app/files')
            const fetchedFiles = await response.json();
            setFiles(fetchedFiles);
        }
        getFiles();
    }, [])


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
        return <NotAMemberLandingPage editionDropAddress={editionDropAddress} />
    }

    const filesSection = () => {
        if(showFiles) {
            return (
            <>
                <FileList files={files} />
                <Button sx={{width: '95%', ml: 2}} onClick={() => setShowFiles(!showFiles)}>^ Hide Files ^</Button>
            </>
            )
        }
        return <Button sx={{width: '95%', ml: 2}} onClick={() => setShowFiles(!showFiles)}>^ Show Submitted Files ^</Button>
    }

    const member = () => {
        return (
            <>
                <Typography sx={{ mt: 4, mb: 2, ml: 2 }} variant="h4" component="div">DAO Member Dashboard</Typography>
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
                        <VoteForm members={memberList} bounties={files} />
                    </Grid>
                    <Grid item xs={12}>
                        <ProposalList hasClaimedNFT={hasClaimedNFT} address={address} numMembers={memberList.length || 0} />
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