import sdk from "./init-sdk.js";

(async () => {
    try {
        const vote = await sdk.getContract("0x804FFa7B1B1e1583369162Cb7F5975942eA87C03", "vote");
        const token = await sdk.getContract("0xCe3fF8622fa3539F3Be49f9A9A7dD8A46bAAc662", "token");

        await token.roles.grant("minter", vote.getAddress());

        console.log(
        "Successfully gave vote contract permissions to act on token contract"
        );
    } catch (error) {
        console.error(
        "failed to grant vote contract permissions on token contract",
        error
        );
        process.exit(1);
    }

    try {
        const vote = await sdk.getContract("0x804FFa7B1B1e1583369162Cb7F5975942eA87C03", "vote");
        const token = await sdk.getContract("0xCe3fF8622fa3539F3Be49f9A9A7dD8A46bAAc662", "token");
        const ownedTokenBalance = await token.balanceOf(
        process.env.WALLET_ADDRESS
        );

        const ownedAmount = ownedTokenBalance.displayValue;
        const percent90 = Number(ownedAmount) / 100 * 90;

        await token.transfer(
            vote.getAddress(),
            percent90
        ); 

        console.log("✅ Successfully transferred " + percent90 + " tokens to vote contract");
    } catch (err) {
        console.error("failed to transfer tokens to vote contract", err);
    }
})();