import { ethers } from 'ethers';
import MarketplaceABI from '../contracts/MarketplaceContract.json';

const MARKETPLACE_ADDRESS = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'; // Amoy deployed address

export function getMarketplaceContract(providerOrSigner: ethers.Provider | ethers.Signer) {
  return new ethers.Contract(MARKETPLACE_ADDRESS, MarketplaceABI.abi, providerOrSigner);
}

export async function getMarketplaceListings(provider: ethers.Provider) {
  const contract = getMarketplaceContract(provider);
  const count = await contract.listingCount();
  const listings = [];
  for (let i = 1; i <= count; i++) {
    const listing = await contract.listings(i);
    listings.push({ ...listing, listingId: i });
  }
  return listings;
}