// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MilestoneNFT.sol";

contract DeployNFT is Script {
    function run() external {
        uint256 pk = vm.envUint("PK");
        vm.startBroadcast(pk);

        string memory baseURI = "https://gray-improved-whitefish-326.mypinata.cloud/ipfs/bafybeihnb5z3mf4q437xusfznf7cpegmgvk4bzdxjf22oqd2rbyno2oaai/";

        MilestoneNFT nft = new MilestoneNFT(
            "Polkadot Cats Milestone",
            "PCM",
            baseURI
        );

        console.log("NFT DEPLOYED TO:", address(nft));
        console.log("BASE URI SET TO:", baseURI);

        vm.stopBroadcast();
    }
}