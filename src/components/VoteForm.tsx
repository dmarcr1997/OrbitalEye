import { Box, Button, Grid, InputLabel, MenuItem, Paper, Select, Slider, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { ethers } from "ethers";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
const VoteForm = (props: any) => {
    enum voteType {
        MINT = 'Mint',
        SEND = 'Send Tokens',
        BOUNTY = 'Award Bounty'
    };

    interface BountyData {
        walletId: string;
        amount: number;
        fileHash: string;
        fileName: string;
        subject: string;
    }

    const [variant, setVariant] = useState<voteType>(voteType.MINT);
    const [tokenAmount, setTokenAmount] = useState<Number>(1);
    const [selectedWallet, setSelectedWallet] = useState('');
    const [bountyObj, setBountyObj] = useState<BountyData>();

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

    async function sendProposal() {
        switch (variant) {
            case voteType.MINT:
                console.log("Proposal sent: Minting", tokenAmount);
                await createProposal([variant, {amount: tokenAmount}]);
                setTokenAmount(0);
                break;
            case voteType.SEND:
                console.log("Proposal sent: Sending $", tokenAmount, " to:", selectedWallet);
                await createProposal([variant, {amount: tokenAmount, walletAddress: selectedWallet}]);
                setTokenAmount(0);
                setSelectedWallet('');
                break;
            case voteType.BOUNTY:
                if(bountyObj !== undefined) {
                    console.log("Proposal sent: Awarding Bounty $", bountyObj?.amount, " to:", bountyObj?.walletId);
                    await createProposal([variant, {bountyObj}])
                    setBountyObj(undefined);
                }
                break;
            default:
                return;
        }
    }

    function setSelectedBounty(item: any) {
        const bounty = props.bounties.find((b: any) => b.ipfsHash === item.ipfsHash);
        const bountyObject: BountyData = {
            walletId: bounty.creator,
            amount: bounty.bountyAmt,
            fileHash: bounty.ipfsHash,
            fileName: bounty.fileName,
            subject: bounty.subject
        };
        console.log(bountyObj);
        setBountyObj(bountyObject);
    }

    const mintForm = () => (
        <>
            <InputLabel sx={{textAlign: 'left', ml: 2, mb: 4 }} id="demo-simple-select-label">Token Amount</InputLabel>
            <TextField sx={{ ml: 4, mb: 2 }} id="filled-basic" variant="filled" value={tokenAmount} onChange={updateTokenInput} />    
            {/* @ts-ignore */}
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
             {/* @ts-ignore */}
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
            <InputLabel sx={{textAlign: 'left', ml: 2 }} id="demo-simple-select-label">Select Bounty</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={bountyObj}
                sx={{ml: 4, mt: 5, mb: 5, width:'90%'}}
                onChange={(event) => setSelectedBounty(event.target.value)}
            >
                {props.bounties.map((bounty: any) => <MenuItem value={bounty}>{bounty.fileName} - {bounty.bountyAmt}</MenuItem>)}
            </Select>
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

async function mintTokens(data: any, sdk: any) {
    try {
        // This is our governance contract.
        const vote = await sdk.getContract("0x804FFa7B1B1e1583369162Cb7F5975942eA87C03", "vote");
        // This is our ERC-20 contract.
        const token = await sdk.getContract("0xCe3fF8622fa3539F3Be49f9A9A7dD8A46bAAc662", "token");
        // Create proposal to mint 420,000 new token to the treasury.
        const amount = data.amount;
        const description = "Should the DAO mint an additional " + amount + " tokens into the treasury?";
        const executions = [
        {
            // Our token contract that actually executes the mint.
            toAddress: token.getAddress(),
            // Our nativeToken is ETH. nativeTokenValue is the amount of ETH we want
            // to send in this proposal. In this case, we're sending 0 ETH.
            // We're just minting new tokens to the treasury. So, set to 0.
            nativeTokenValue: 0,
            // We're doing a mint! And, we're minting to the vote, which is
            // acting as our treasury.
            // in this case, we need to use ethers.js to convert the amount
            // to the correct format. This is because the amount it requires is in wei.
            transactionData: token.encoder.encode(
            "mintTo", [
            vote.getAddress(),
            ethers.utils.parseUnits(amount.toString(), 18),
            ]
            ),
        }
        ];

        await vote.propose(description, executions);

        console.log("✅ Successfully created proposal to mint tokens");
    } catch (error) {
        console.error("failed to create first proposal", error);
    }
}

async function sendTokens(data: any, sdk: any) {
    try {
        // This is our governance contract.
        const vote = await sdk.getContract("0x804FFa7B1B1e1583369162Cb7F5975942eA87C03", "vote");
        // This is our ERC-20 contract.
        const token = await sdk.getContract("0xCe3fF8622fa3539F3Be49f9A9A7dD8A46bAAc662", "token");
        // Create proposal to transfer ourselves 6,900 tokens for being awesome.
        const amount = data.amount;
        const wallet = data.walletAddress;
        const description = "Should the DAO transfer " + amount + " tokens from the treasury to " +
        wallet + " for being awesome?";
        const executions = [
        {
            // Again, we're sending ourselves 0 ETH. Just sending our own token.
            nativeTokenValue: 0,
            transactionData: token.encoder.encode(
            // We're doing a transfer from the treasury to our wallet.
            "transfer",
            [
                wallet,
                ethers.utils.parseUnits(amount.toString(), 18),
            ]
            ),
            toAddress: token.getAddress(),
        },
        ];

        await vote.propose(description, executions);

        console.log(
        "✅ Successfully created proposal to Member!"
        );
    } catch (error) {
        console.error("failed to create second proposal", error);
    }
}

async function awardBounty(data: any, sdk: any) {
    try {
        // This is our governance contract.
        const vote = await sdk.getContract("0x804FFa7B1B1e1583369162Cb7F5975942eA87C03", "vote");
        // This is our ERC-20 contract.
        const token = await sdk.getContract("0xCe3fF8622fa3539F3Be49f9A9A7dD8A46bAAc662", "token");
        // Create proposal to transfer ourselves 6,900 tokens for being awesome.
        const { amount, walletId, fileName, subject } = data.bountyObj;
    
        const description = "Should the DAO award the bounty of " + amount + " tokens from the treasury to " +
        walletId + " for the following data: " + fileName + " around " + subject;
        console.log(description)
        const executions = [
        {
            // Again, we're sending ourselves 0 ETH. Just sending our own token.
            nativeTokenValue: 0,
            transactionData: token.encoder.encode(
            // We're doing a transfer from the treasury to our wallet.
            "transfer",
            [
                walletId,
                ethers.utils.parseUnits(amount.toString(), 18),
            ]
            ),
            toAddress: token.getAddress(),
        },
        ];

        await vote.propose(description, executions);

        console.log(
        "✅ Successfully created proposal to reward Bounty!"
        );
    } catch (error) {
        console.error("failed to create second proposal", error);
    }
}

async function createProposal (data: any) {
    const PRIVATE_KEY: string = import.meta.env.VITE_PRIVATE_KEY || '';
    const ALCHEMY_API_URL: string = import.meta.env.VITE_ALCHEMY_API_URL || '';
    const WALLET_ADDRESS: string = import.meta.env.VITE_WALLET_ADDRESS || '';

    if (!PRIVATE_KEY || PRIVATE_KEY === "") {
        console.log("🛑 Private key not found.");
        return;
    }
    
    if (!ALCHEMY_API_URL || ALCHEMY_API_URL === "") {
        console.log("🛑 Alchemy API URL not found.");
        return;
    }
    
    if (!WALLET_ADDRESS || WALLET_ADDRESS === "") {
        console.log("🛑 Wallet Address not found.");
        return;
    }
    
    const sdk = ThirdwebSDK.fromPrivateKey(
        // Your wallet private key. ALWAYS KEEP THIS PRIVATE, DO NOT SHARE IT WITH ANYONE, add it to your .env file and do not commit that file to github!
        PRIVATE_KEY,
        // RPC URL, we'll use our QuickNode API URL from our .env file.
        ALCHEMY_API_URL
    );
    
    try {
        const address = await sdk.getSigner()?.getAddress();
        console.log("👋 SDK initialized by address:", address)
    } catch (err) {
        console.error("Failed to get apps from the sdk", err);
        return;
    }
    switch (data[0]) {
        case 'Mint':
            await mintTokens(data[1], sdk);
            break;
        case 'Send Tokens':
            await sendTokens(data[1], sdk);
            break;
        case 'Award Bounty':
            await awardBounty(data[1], sdk);
            break;
    }
}


export default VoteForm