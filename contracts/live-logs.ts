import {ContractId} from "@hashgraph/sdk";
import {Interface} from "ethers";
import fs from "fs";
import fetch from "node-fetch";

// Read contract address from file
const contractAddress =
    fs.readFileSync("./test/latest-contract", "utf8").trim();
const contractId = ContractId.fromEvmAddress(0, 0, contractAddress);
const CONTRACT_ID = contractId.toString();
const NETWORK = "testnet";
const MIRROR_NODE_URL =
    `https://${NETWORK}.mirrornode.hedera.com/api/v1/contracts/${
        CONTRACT_ID}/results/logs?order=asc`;

console.log(`Using Contract ID: ${CONTRACT_ID}`);

// ABI for decoding
const abi = [
  "event NFTPurchased(address indexed token, uint256 serial, address indexed buyer, uint256 price, uint256 value)"
];
const iface = new Interface(abi);

let pollCounter = 0;
let lastSeenTimestamp = "0";

async function pollEvents() {
  pollCounter++;
  console.log(`\nPolling cycle: ${pollCounter}`);

  try {
    const response = await fetch(MIRROR_NODE_URL);
    const result: any = await response.json();

    const logs = result?.logs;
    if (!logs || logs.length === 0) {
      console.log("No events found yet.");
      return;
    }

    // Only logs with a newer timestamp than the last seen one
    const newLogs =
        logs.filter((log: any) => log.timestamp > lastSeenTimestamp);

    if (newLogs.length === 0) {
      console.log("No new events found.");
      return;
    }

    for (let idx = 0; idx < newLogs.length; idx++) {
      const log = newLogs[idx];
      try {
        const decoded = iface.parseLog({data : log.data, topics : log.topics});

        console.log(`Event #${idx + 1}`);
        console.log(`  Token:  ${decoded?.args.token}`);
        console.log(`  Serial: ${decoded?.args.serial.toString()}`);
        console.log(`  Buyer:  ${decoded?.args.buyer}`);
        console.log(`  Price:  ${decoded?.args.price.toString()} tinybars`);
        console.log(`  Value:  ${decoded?.args.value.toString()} tinybars`);
      } catch (err) {
        console.log(`  Raw Topics: ${log.topics.join(", ")}`);
        console.log(`  Raw Data:   ${log.data}`);
      }
    }

    // Update lastSeenTimestamp to the most recent log
    lastSeenTimestamp = newLogs[newLogs.length - 1].timestamp;
  } catch (err: any) {
    console.error("❌ Error fetching logs:", err.message);
  }
}

setInterval(pollEvents, 5000);
