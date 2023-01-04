import { useContract } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import { Box, Button, Card, CardActionArea, CardContent, Grid, Paper } from '@mui/material';
import { AddressZero } from "@ethersproject/constants";
const ProposalList = ({ hasClaimedNFT, address }: any) => {

    const [proposals, setProposals] = useState([]);
    const [isVoting, setIsVoting] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const voteAddress = "0x804FFa7B1B1e1583369162Cb7F5975942eA87C03";
    const tokenAddress = "0xCe3fF8622fa3539F3Be49f9A9A7dD8A46bAAc662";
    const { contract: vote } = useContract(voteAddress, "vote");
    const { contract: token } = useContract(tokenAddress, 'token');
    
    useEffect(() => {
        if (!hasClaimedNFT) {
            return;
        }
        // A simple call to vote?.getAll() to grab the proposals.
        const getAllProposals = async () => {
            try {
                const proposals = await vote?.getAll() || [];
                setProposals(proposals);
                console.log("🌈 Proposals:", proposals);
            } catch (error) {
                console.log("failed to get proposals", error);
            }
        };
        getAllProposals();
    }, [hasClaimedNFT, vote]);

    useEffect(() => {
        if (!hasClaimedNFT) {
            return;
        }
        // If we haven't finished retrieving the proposals from the useEffect above
        // then we can't check if the user voted yet!
        if (!proposals.length) {
            return;
        }
        const checkIfUserHasVoted = async () => {
            try {
                //@ts-ignore
                const hasVoted = await vote?.hasVoted(proposals[0].proposalId, address);
                //@ts-ignore
                setHasVoted(hasVoted);
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
    }, [hasClaimedNFT, proposals, address, vote]);

    async function submitVotes() {
        setIsVoting(true);
        const votes = proposals.map((proposal: any) => {
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
            });
            return voteResult;
        });
        try {
            //we'll check if the wallet still needs to delegate their tokens before they can vote
            const delegation = await token?.getDelegationOf(address);
            // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
            if (delegation === AddressZero) {
              //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                await token?.delegateTo(address);
            }
            // then we need to vote on the proposals
            try {
                await Promise.all(
                    votes.map(async ({ proposalId, vote: _vote }) => {
                    // before voting we first need to check whether the proposal is open for voting
                    // we first need to get the latest state of the proposal
                    const proposal = await vote?.get(proposalId);
                    // then we check if the proposal is open for voting (state === 1 means it is open)
                    if (proposal?.state === 1) {
                        // if it is open for voting, we'll vote on it
                        return vote?.vote(proposalId, _vote);
                    }
                    // if the proposal is not open for voting we just return nothing, letting us continue
                    return;
                    }),
                );
                try {
                    // if any of the propsals are ready to be executed we'll need to execute them
                    // a proposal is ready to be executed if it is in state 4
                    await Promise.all(
                        votes.map(async ({ proposalId }) => {
                            // we'll first get the latest state of the proposal again, since we may have just voted before
                            const proposal = await vote?.get(proposalId);

                            //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                            if (proposal?.state === 4) {
                            return vote?.execute(proposalId);
                            }
                        }),
                    );
                    // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                    setHasVoted(true);
                    // and log out a success message
                    console.log('successfully voted');
                } catch (err) {
                    console.error('failed to execute votes', err);
                }
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

    return (
        <Box component={Paper} sx={{mt: 2, width: '98%', mb: 2, ml: 2}}>
            <Typography sx={{ mt: 4, mb: 2, ml: 2 }} variant="h4" component="div">Active Proposals</Typography>
            <Grid container spacing={2} sx={{ml: 2, width: '98%', mb: 2}}>
            {proposals.map((proposal: any) => (
                <Grid item xs={6} key={proposal.proposalId}>
                    <Card>
                        <CardActionArea>
                            <Typography sx={{ mt: 2, ml: 2 }} variant="body1" component="div">{proposal.description}</Typography>
                            <CardContent>
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
                    </Card>
                </Grid>
            ))}
            <Button sx={{mt: 2, mb: 2, width: '100%', ml: 2 }} variant="contained" disabled={isVoting || hasVoted} onClick={() => submitVotes()}>
            {isVoting
            ? 'Voting...'
            : hasVoted
            ? 'You Already Voted'
            : 'Submit Votes'}
            </Button>
            {!hasVoted && (
                <Typography variant="caption" component="div">
                This will trigger multiple transactions that you will need to
                sign.
                </Typography>
            )}
            </Grid>
        </Box>
    )
}

export default ProposalList;