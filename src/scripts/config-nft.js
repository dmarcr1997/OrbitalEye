import sdk from "./init-sdk.js";
import { readFileSync } from "fs";

(async () => {
  try {
    const editionDrop = await sdk.getContract("0xd18a96A539af150646f6E84fAEf0420FD2f1B3e3", "edition-drop");
    await editionDrop.createBatch([
      {
        name: "Astronaut Membership Card",
        description: "This NFT will give you access to the OrbitalEye DAO!",
        image: readFileSync("src/assets/images/NFTMembershipCard.jpg"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();