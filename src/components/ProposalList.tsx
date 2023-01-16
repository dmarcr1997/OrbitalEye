import { useContract } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';

import Proposal from "./Proposal";

const ProposalList = ({ hasClaimedNFT, address, numMembers }: any) => {
    const [proposals, setProposals] = useState([]);
    
    const voteAddress = "0x804FFa7B1B1e1583369162Cb7F5975942eA87C03";
    const { contract: vote } = useContract(voteAddress, "vote");

    useEffect(() => {
        if (!hasClaimedNFT) {
            return;
        }
        // A simple call to vote?.getAll() to grab the proposals.
        const getAllProposals = async () => {
            try {
                let proposals = await vote?.getAll() || [];
                // proposals.filter((proposal) => proposal.state !== 3);
                proposals = proposals.filter((proposal) => proposal.state !== 3 )
                //@ts-ignore
                setProposals(proposals);
                console.log("🌈 Proposals:", proposals);
            } catch (error) {
                console.log("failed to get proposals", error);
            }
        };
        getAllProposals();
    }, [hasClaimedNFT, vote]);

    return ( 
        <Grid container spacing={2} sx={{ml: 2, width: '98%', mb: 2}}>
            <Grid item xs={12}>
                <Typography sx={{ mt: 4, mb: 2, ml: 2 }} variant="h4" component="div">Active Proposals</Typography>
            </Grid>
            {proposals.map((proposal: any) => (
                <Proposal proposal={proposal} numMembers={numMembers} />
            ))}
        </Grid>
    )
}

export default ProposalList;