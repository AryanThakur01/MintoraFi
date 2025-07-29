// NOTE: tinybar is the language for contract
import {
  AccountAllowanceApproveTransaction,
  AccountId,
  ContractCallQuery,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  ContractId,
  Hbar,
  NftId,
  PrivateKey,
  TokenAssociateTransaction,
  TokenId,
  TokenNftInfoQuery,
} from '@hashgraph/sdk'
import fs from 'fs'

import {hederaClient, settings} from '../configs/hedera-client'

async function allowContractToTransferNft(
    owner: {accountId: AccountId, accountKey: PrivateKey},
    token: {address: string, serialNumber: number},
    contractId: ContractId,
) {
  const tokenId = TokenId.fromEvmAddress(0, 0, token.address);
  const nftId = new NftId(tokenId, token.serialNumber);
  const allowance =
      new AccountAllowanceApproveTransaction().approveTokenNftAllowance(
          nftId, owner.accountId, contractId)
  const freezeAllowance = allowance.freezeWith(hederaClient);
  const signAllowance = await freezeAllowance.sign(owner.accountKey)
  const allowanceResult = await signAllowance.execute(hederaClient);
  const receipt = await allowanceResult.getReceipt(hederaClient);
  const transactionStatus = receipt.status;
  console.log(`Allowance for contract ${
      contractId.toString()} to transfer NFT ${nftId.toString()} from owner ${
      owner.accountId.toString()} status: ${transactionStatus}`);
}
async function setPriceForNft(
    owner: {accountId: AccountId, accountKey: PrivateKey},
    token: {address: string, serialNumber: number}, contractId: ContractId,
    hbars: number) {
  await allowContractToTransferNft(owner, token, contractId);
  // Transaction to set price for an NFT
  const setPriceParams = new ContractFunctionParameters()
                             .addAddress(token.address)
                             .addUint256(token.serialNumber)
                             .addUint256(new Hbar(hbars).toTinybars())

  const contractQuery = new ContractExecuteTransaction()
                            .setContractId(contractId)
                            .setGas(1_000_000)
                            .setFunction('setPrice', setPriceParams)
  const result = await contractQuery.execute(hederaClient);
  const receipt = await result.getReceipt(hederaClient);
  console.log('Smart contract transaction status:', receipt.toJSON())
}

async function getPriceForNft(contractId: ContractId,
                              token: {address: string, serialNumber: number}) {
  // Transaction to get price for an NFT
  const getPriceParams = new ContractFunctionParameters()
                             .addAddress(token.address)
                             .addUint256(token.serialNumber)
  const contractQueryPrice = new ContractCallQuery()
                                 .setContractId(contractId)
                                 .setGas(1_000_000)
                                 .setFunction('getPriceByKey', getPriceParams)
  const resultPrice = await contractQueryPrice.execute(hederaClient);
  console.log('Price of NFT:', resultPrice.getInt256().toString());
}

async function getContractCallerAddress(contractId: ContractId) {
  // Transaction to get caller address of the smart contract
  const caller = new ContractCallQuery()
                     .setContractId(contractId)
                     .setGas(1_000_000)
                     .setFunction('getCallerAddress')
  const resultCaller = await caller.execute(hederaClient);
  console.log(
      'Address of caller of Smart contract query result:',
      AccountId.fromEvmAddress(0, 0, resultCaller.getAddress()).toString());
}
async function getContractCallerBalance(contractId: ContractId) {
  // Transaction to get caller address of the smart contract
  const caller = new ContractCallQuery()
                     .setContractId(contractId)
                     .setGas(1_000_000)
                     .setFunction('getCallerBalance')
  const resultCaller = await caller.execute(hederaClient);
  console.log('Balance of caller of Smart contract query result:',
              resultCaller.getUint256().div(1e8).toNumber());
}

async function getNftOwner(token: {address: string, serialNumber: number}) {
  const tokenId = TokenId.fromEvmAddress(0, 0, token.address);
  const nftId = new NftId(tokenId, token.serialNumber);
  const nftInfo =
      await new TokenNftInfoQuery().setNftId(nftId).execute(hederaClient);
  console.log('NFT Owner:', nftInfo[0].accountId.toString());
  return nftInfo[0].accountId.toString();
}

async function associateTokenToPurchaser(
    purchaser: {accountId: AccountId, accountKey: PrivateKey},
    tokenAddress: string) {
  const tokenId = TokenId.fromEvmAddress(0, 0, tokenAddress);
  const associateTransaction = new TokenAssociateTransaction()
                                   .setAccountId(purchaser.accountId)
                                   .setTokenIds([ tokenId ])
                                   .freezeWith(hederaClient);

  const signAssociate = await associateTransaction.sign(purchaser.accountKey);
  const associateResult = await signAssociate.execute(hederaClient);
  const receipt = await associateResult.getReceipt(hederaClient);
  console.log(`Token ${tokenId.toString()} associated with account ${
      purchaser.accountId.toString()} status: ${receipt.status}`);
}
// Purchase NFT function
async function purchaseNft(
    purchaser: {accountId: AccountId, accountKey: PrivateKey},
    contractId: ContractId, tokenAddress: string, payableHbars: number) {
  try {
    await associateTokenToPurchaser(purchaser, tokenAddress);
  } catch (error) {
    console.error(
        'Association error proceeding forward. TODO: Need better error handling for already associated token');
  }
  // Transaction to set price for an NFT
  const purchaseNftParam =
      new ContractFunctionParameters().addAddress(tokenAddress).addUint256(1)

  const contractQuery = new ContractExecuteTransaction()
                            .setContractId(contractId)
                            .setGas(1_000_000)
                            .setPayableAmount(new Hbar(payableHbars))
                            .setFunction('purchaseNft', purchaseNftParam)
  const result = await contractQuery.execute(hederaClient);
  const receipt = await result.getReceipt(hederaClient);
  console.log('Smart contract transaction status:', result.toJSON())
}
// Function to test all methods of the contract
async function testAllMethods(contractAddress: string,
                              tokenAddressString: string) {
  const contractId = ContractId.fromEvmAddress(0, 0, contractAddress);
  const tokenAddress = TokenId.fromString(tokenAddressString).toEvmAddress();
  const owner = {
    accountId : settings.hederaOperatorId,
    accountKey : settings.hederaOperatorPvtKey,
  };
  const token = {
    address : tokenAddress,
    serialNumber : 2,
  }

  // await getNftOwner(token);
  // await getContractCallerAddress(contractId);
  // await getContractCallerBalance(contractId);

  // await allowContractToTransferNft(owner, token, contractId);
  // await setPriceForNft(owner, token, contractId, 17);
  // await getPriceForNft(contractId, token);
  await purchaseNft(owner, contractId, token.address, 17);
}

async function main() {
  const contractAddress =
      fs.readFileSync('./test/latest-contract', 'utf8').trim();
  await testAllMethods(contractAddress, '0.0.6350038');
}

main()
    .then(() => console.log('THE END....'))
    .catch((error) => { console.error('Error occurred:', error); })
