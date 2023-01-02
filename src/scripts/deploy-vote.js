import sdk from "./init-sdk.js";

(async () => {
    try {
        const voteContractAddress = await sdk.deployer.deployVote({
            name: "OrbitalEye Voting Contract",
            voting_token_address: "0xCe3fF8622fa3539F3Be49f9A9A7dD8A46bAAc662",
            voting_delay_in_blocks: 0,
            voting_period_in_blocks: 6570,
            voting_quorum_fraction: 0,
            proposal_token_threshold: 0,
        });

        console.log(
        "✅ Successfully deployed vote contract, address:",
        voteContractAddress,
        );
    } catch (err) {
        console.error("Failed to deploy vote contract", err);
    }
})();