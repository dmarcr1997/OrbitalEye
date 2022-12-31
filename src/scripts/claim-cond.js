import sdk from "./init-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

(async () => {
  try {
    const editionDrop = await sdk.getContract("0xd18a96A539af150646f6E84fAEf0420FD2f1B3e3", "edition-drop");
    const claimConditions = [{
      // When people are gonna be able to start claiming the NFTs (now)
      startTime: new Date(),
      // The maximum number of NFTs that can be claimed.
      maxClaimable: 50_000,
      // The price of our NFT (free)
      price: 0,
      // The amount of NFTs people can claim in one transaction.
      maxClaimablePerWallet: 1,
      // We set the wait between transactions to unlimited, which means
      // people are only allowed to claim once.
      waitInSeconds: MaxUint256,
    }]

    await editionDrop.claimConditions.set("0", claimConditions);
    console.log("✅ Sucessfully set claim condition!");
  } catch (error) {
    console.error("Failed to set claim condition", error);
  }
})();