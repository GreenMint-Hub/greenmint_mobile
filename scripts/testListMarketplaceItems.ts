import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
dotenv.config();

import { MARKETPLACE_ITEMS } from '../mocks/marketplace';
import MarketplaceABI from '../contracts/MarketplaceContract.json';

// Amoy testnet RPC and private key from .env
const AMOY_RPC = process.env.AMOY_RPC || '';
const PRIVATE_KEY = process.env.TEST_PRIVATE_KEY || '';
const MARKETPLACE_ADDRESS = process.env.MARKETPLACE_ADDRESS || '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707';

async function main() {
  if (!AMOY_RPC || !PRIVATE_KEY || !MARKETPLACE_ADDRESS) {
    throw new Error('Missing env vars: AMOY_RPC, TEST_PRIVATE_KEY, or MARKETPLACE_ADDRESS');
  }
  const provider = new ethers.JsonRpcProvider(AMOY_RPC);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(MARKETPLACE_ADDRESS, MarketplaceABI.abi, wallet);

  for (const item of MARKETPLACE_ITEMS) {
    const tx = await contract.publicListItem(item.title, ethers.parseEther(item.price.toString()));
    console.log(`Listing ${item.title}... TX: ${tx.hash}`);
    await tx.wait();
    console.log(`Listed: ${item.title}`);
  }
}

main().catch(console.error);
