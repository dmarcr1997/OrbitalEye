import sdk from "./init-sdk.js";
import { ethers } from "ethers";

async function mintTokens(data) {
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
        process.exit(1);
    }
}

async function sendTokens(data) {
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
        "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
        );
    } catch (error) {
        console.error("failed to create second proposal", error);
    }
}

async function awardBounty(data) {
    //Send in wallet address, ipfs link, and bounty amount
    //Get file from ipfs
    //Allow votes
}

async function createProposal (data) {
    switch (data[0]) {
        case 'Mint':
            await mintTokens(data);
            break;
        case 'Send Tokens':
            await sendTokens(data);
            break;
        case 'Award Bounty':
            await awardBounty(data);
            break;
    }
}

exports = {createProposal}