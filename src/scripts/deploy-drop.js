import { AddressZero } from "@ethersproject/constants";
import sdk from "./init-sdk.js";
import { readFileSync } from "fs";

(async () => {
    try {
        const editionDropAddress = await sdk.deployer.deployEditionDrop({
            name: "OrbitalEye Membership",
            description: "A DAO for Orbital Governing Body.",
            image: readFileSync("src/assets/images/OrbitalEyeDao.jpg"),
            primary_sale_recipient: AddressZero,
        });

        // this initialization returns the address of our contract
        // we use this to initialize the contract on the thirdweb sdk
        const editionDrop = await sdk.getContract(editionDropAddress, "edition-drop");

        // with this, we can get the metadata of our contract
        const metadata = await editionDrop.metadata.get();

        console.log(
        "✅ Successfully deployed editionDrop contract, address:",
        editionDropAddress,
        );
        console.log("✅ editionDrop metadata:", metadata);
    } catch (error) {
        console.log("failed to deploy editionDrop contract", error);
    }
})();