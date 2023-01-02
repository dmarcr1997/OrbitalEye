import { Box, Button, Grid, InputLabel, MenuItem, Paper, Select, Slider, TextField, Typography } from "@mui/material";
import { useState } from "react";

const VoteForm = (props: any) => {
    enum voteType {
        MINT = 'Mint',
        SEND = 'Send Tokens',
        BOUNTY = 'Award Bounty'
    };

    const [variant, setVariant] = useState<voteType>(voteType.MINT);
    const [tokenAmount, setTokenAmount] = useState<Number>(1);
    const [selectedWallet, setSelectedWallet] = useState('');
    const [bountyWallet, setBountyWallet] = useState('');

    function getProposalForm(){
        switch (variant) {
            case voteType.MINT:
                return mintForm();
            case voteType.SEND:
                return sendForm();
            case voteType.BOUNTY:
                return bountyForm();
            default: 
                return;
        }
    }

    function updateTokenInput(e: any) {
        if(Number(e.target.value)){
            setTokenAmount(e.target.value)
        }
    }

    function valuetext(value: number) {
        return `$${value}`;
    }

    function sendProposal() {
        switch (variant) {
            case voteType.MINT:
                console.log("Proposal sent: Minting", tokenAmount);
                // creatProposal([variant, {amount: tokenAmount}]);
                setTokenAmount(0);
                break;
            case voteType.SEND:
                console.log("Proposal sent: Sending $", tokenAmount, " to:", selectedWallet);
                setTokenAmount(0);
                setSelectedWallet('');
                break;
            case voteType.BOUNTY:
                console.log("Proposal sent: Awarding Bounty $", tokenAmount, " to:", bountyWallet);
                setTokenAmount(0);
                setBountyWallet('');
                break;
            default:
                return;
        }
    }

    const mintForm = () => (
        <>
            <InputLabel sx={{textAlign: 'left', ml: 2, mb: 4 }} id="demo-simple-select-label">Token Amount</InputLabel>
            <TextField sx={{ ml: 4, mb: 2 }} id="filled-basic" variant="filled" value={tokenAmount} onChange={updateTokenInput} />    
            <Slider 
                sx={{ ml: 4, mb: 2, width: '90%'}} 
                aria-label="Amount" 
                min={1} 
                max={10000} 
                defaultValue={tokenAmount} 
                value={tokenAmount} 
                onChange={updateTokenInput} 
                getAriaValueText={valuetext}
            />
        </>
    )

    const sendForm = () => (
        <>
            <InputLabel sx={{textAlign: 'left', ml: 2 }} id="demo-simple-select-label">Member Address</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedWallet}
                sx={{ml: 4, mt: 5, mb: 5, width:'90%'}}
                onChange={(event) => setSelectedWallet(event.target.value)}
            >
                {props.members.map((member: any) => <MenuItem value={member.address}>{member.address}</MenuItem>)}
            </Select>
            <InputLabel sx={{textAlign: 'left', ml: 2, mb: 4 }} id="demo-simple-select-label">Token Amount</InputLabel>
            <TextField sx={{ ml: 4, mb: 2 }} id="filled-basic" variant="filled" value={tokenAmount} onChange={updateTokenInput} />    
            <Slider 
                sx={{ ml: 4, mb: 2, width: '90%'}} 
                aria-label="Amount" 
                min={1} 
                max={10000} 
                defaultValue={tokenAmount} 
                value={tokenAmount} 
                onChange={updateTokenInput} 
                getAriaValueText={valuetext}
            />
        </>
    )

    const bountyForm = () => (
        <>
            <InputLabel sx={{textAlign: 'left', ml: 2, mb:4 }} id="demo-simple-select-label">Wallet Address</InputLabel>
            <TextField sx={{ ml: 4, mb: 2, width: '90%' }} id="filled-basic" variant="filled" value={bountyWallet} onChange={(event) => setBountyWallet(event.target.value)} />  
            <InputLabel sx={{textAlign: 'left', ml: 2, mb: 4 }} id="demo-simple-select-label">Token Amount</InputLabel>
            <TextField sx={{ ml: 4, mb: 2 }} id="filled-basic" variant="filled" value={tokenAmount} onChange={updateTokenInput} />    
            <Slider 
                sx={{ ml: 4, mb: 2, width: '90%'}} 
                aria-label="Amount" 
                min={1} 
                max={10000} 
                defaultValue={tokenAmount} 
                value={tokenAmount} 
                onChange={updateTokenInput} 
                getAriaValueText={valuetext}
            />
        </>
    )

    return (
        <Box component={Paper} sx={{border: '1px solid #EAEAEA', mt: 2, width: '98%', mb: 2}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography sx={{ mt: 4, mb: 2, ml: 1 }} variant="h6" component="div">
                        Create A Proposal
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <InputLabel sx={{textAlign: 'left', ml: 2 }} id="demo-simple-select-label">Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={variant}
                        sx={{ml: 4, mt: 5, mb: 5, width:'90%'}}
                    >
                        <MenuItem onClick={() => setVariant(voteType.MINT)} value={voteType.MINT}>Add To Treasury</MenuItem>
                        <MenuItem onClick={() => setVariant(voteType.SEND)} value={voteType.SEND}>Send Tokens to Member</MenuItem>
                        <MenuItem onClick={() => setVariant(voteType.BOUNTY)} value={voteType.BOUNTY}>Award Bounty</MenuItem>
                    </Select>
                    {getProposalForm()}
                    <Button onClick={sendProposal} sx={{ mt: 2, mb: 2, ml: 2 }} variant="contained">Create Proposal</Button>
                </Grid>
            </Grid>
        </Box>
    )
}

export default VoteForm