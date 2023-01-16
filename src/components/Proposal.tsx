import { Button, Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material';
import { AddressZero } from "@ethersproject/constants";
import { LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAddress, useContract } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const Proposal = ({ proposal, numMembers }: any) => {
    const address = useAddress();
    const [isVoting, setIsVoting] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [voteCount, setVoteCount] = useState(0);
    const voteAddress = "0x804FFa7B1B1e1583369162Cb7F5975942eA87C03";
    const tokenAddress = "0xCe3fF8622fa3539F3Be49f9A9A7dD8A46bAAc662";
    const { contract: vote } = useContract(voteAddress, "vote");
    const { contract: token } = useContract(tokenAddress, 'token');
    
    useEffect(() => {
        // If we haven't finished retrieving the proposals from the useEffect above
        // then we can't check if the user voted yet!
        if (!proposal) {
            return;
        }
        const checkIfUserHasVoted = async () => {
            try {
                //@ts-ignore
                const hasVoted = await vote?.hasVoted(proposal.proposalId, address);
                //@ts-ignore
                setHasVoted(hasVoted);
                
                await getVoteValue(proposal);
                if (hasVoted) {
                    console.log("🥵 User has already voted");
                } else {
                    console.log("🙂 User has not voted yet");
                }
            } catch (error) {
            console.error("Failed to check if wallet has voted", error);
            }

        };

        checkIfUserHasVoted();
    }, [proposal, address, vote]);

    async function submitVotes() {
        setIsVoting(true);
        const voteResult = {
            proposalId: proposal.proposalId,
            //abstain by default
            vote: 2,
        };
        proposal.votes.forEach((vote: any) => {
            const elem = document.getElementById(
                proposal.proposalId + '-' + vote?.type,
            );
            //@ts-ignore
            if (elem.checked) {
                voteResult.vote = vote?.type;
                return;
            }
        })
        try {
            if(address){
                //we'll check if the wallet still needs to delegate their tokens before they can vote
                const delegation = await token?.getDelegationOf(address);
                // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                if (delegation === AddressZero) {
                //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                    await token?.delegateTo(address);
                }
            } else {
                return;
            }
            // then we need to vote on the proposals
            try {
                if (proposal?.state === 1) {
                    // if it is open for voting, we'll vote on it
                    setHasVoted(true);
                    return vote?.vote(proposal?.proposalId, voteResult.vote);
                }
                // if the proposal is not open for voting we just return nothing, letting us continue
                    // if any of the propsals are ready to be executed we'll need to execute them
                    // a proposal is ready to be executed if it is in state 4
                            //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                if (proposal?.state === 4) {
                    return vote?.execute(proposal?.proposalId);
                }
                    // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                // and log out a success message
                console.log('successfully voted');
            } catch (err) {
                console.error('failed to vote', err);
            }
        } catch (err) {
            console.error('failed to delegate tokens');
        } finally {
            // in *either* case we need to set the isVoting state to false to enable the button again
            setIsVoting(false);
        }
    }

    async function getVoteValue(proposal: any) {
        const propObject = await vote?.getProposalVotes(proposal.proposalId)
        if(propObject){
            let value = propObject[1].count._hex
            //@ts-ignore
            let ans = Math.ceil(ethers.utils.formatUnits(value, 26))
            setVoteCount((ans / numMembers) * 100)
        }
    }

    return (
        <Grid item xs={6} key={proposal.proposalId}>
            <Card>
                <CardActionArea>
                    <Typography sx={{ mt: 2, ml: 2., width: '95%' }} variant="body1" component="div">{proposal.description}</Typography>
                    <LinearProgress sx={{ width: '95%', ml: 2 }} variant='determinate' value={voteCount} />
                    <CardContent>
                        {/* @ts-ignore */}
                        {proposal.votes.map(({ type, label }) => (
                        <div key={type}>
                            <input
                            type="radio"
                            id={proposal.proposalId + '-' + type}
                            name={proposal.proposalId}
                            value={type}
                            //default the "abstain" vote to checked
                            defaultChecked={type === 2}
                            />
                            <label htmlFor={proposal.proposalId + '-' + type}>
                            {label}
                            </label>
                        </div>
                        ))}
                    </CardContent>
                </CardActionArea>
                <Button sx={{mt: 2, mb: 2, width: '95%', ml: 2 }} variant="contained" disabled={isVoting || hasVoted } onClick={() => submitVotes()}>
                { isVoting
                ? 'Voting...'
                : hasVoted
                ? 'You Already Voted'
                : 'Submit Vote'}
                </Button>
                {!hasVoted && (
                    <Typography variant="caption" component="div">
                    This will trigger multiple transactions that you will need to
                    sign.
                    </Typography>
                )}
            </Card>
            
        </Grid>
    )
}

export default Proposal;