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
  TransactionReceipt,
  Client
} from '@hashgraph/sdk'
import { hederaClient } from '../../utils/hedera';
import logger from '../../utils/logger/logger';

export interface IAccount {
  accountId: AccountId;
  accountKey: PrivateKey;
}

export interface IToken {
  address: string;
  serialNumber: number;
}

export class NftTransactionContract {
  private client: Client;
  private contractId: ContractId;

  constructor(client: Client = hederaClient, contractAddress: string) {
    this.client = client;
    this.contractId = ContractId.fromEvmAddress(0, 0, contractAddress);
  }

  private _getTokenId(tokenAddress: string): TokenId {
    return TokenId.fromSolidityAddress(tokenAddress);
  }

  private _getNftId(token: IToken): NftId {
    return new NftId(this._getTokenId(token.address), token.serialNumber);
  }

  private async _allowContractToTransferNft(owner: IAccount, token: IToken): Promise<TransactionReceipt> {
    const nftId = this._getNftId(token);

    const allowanceTx = new AccountAllowanceApproveTransaction()
      .approveTokenNftAllowance(nftId, owner.accountId, this.contractId)
      .freezeWith(this.client);

    const signedTx = await allowanceTx.sign(owner.accountKey);
    const result = await signedTx.execute(this.client);
    const receipt = await result.getReceipt(this.client);

    console.log(`Allowance granted: ${receipt.status}`);
    return receipt;
  }

  async setPriceForNft(owner: IAccount, token: IToken, hbars: number): Promise<TransactionReceipt> {
    await this._allowContractToTransferNft(owner, token);

    const setPriceParams = new ContractFunctionParameters()
      .addAddress(token.address)
      .addUint256(token.serialNumber)
      .addUint256(new Hbar(hbars).toTinybars());

    const tx = new ContractExecuteTransaction()
      .setContractId(this.contractId)
      .setGas(1_000_000)
      .setFunction('setPrice', setPriceParams);

    const result = await tx.execute(this.client);
    const receipt = await result.getReceipt(this.client);

    console.log('Set price tx status:', receipt.status);
    return receipt;
  }

  async getPriceForNft(token: IToken): Promise<BigNumber> {
    const params = new ContractFunctionParameters()
      .addAddress(token.address)
      .addUint256(token.serialNumber);

    const query = new ContractCallQuery()
      .setContractId(this.contractId)
      .setGas(1_000_000)
      .setFunction('getPriceByKey', params);

    const result = await query.execute(this.client);
    const price = result.getInt256();
    console.log(`NFT Price: ${price.toString()}`);
    return price;
  }

  async getContractCallerAddress(): Promise<string> {
    const query = new ContractCallQuery()
      .setContractId(this.contractId)
      .setGas(1_000_000)
      .setFunction('getCallerAddress');

    const result = await query.execute(this.client);
    const address = AccountId.fromEvmAddress(0, 0, result.getAddress()).toString();
    console.log('Caller address:', address);
    return address;
  }

  async getContractCallerBalance(): Promise<number> {
    const query = new ContractCallQuery()
      .setContractId(this.contractId)
      .setGas(1_000_000)
      .setFunction('getCallerBalance');

    const result = await query.execute(this.client);
    const balanceHbar = result.getUint256().div(1e8).toNumber();
    console.log('Caller balance:', balanceHbar);
    return balanceHbar;
  }

  async getNftOwner(token: IToken): Promise<string> {
    const nftId = this._getNftId(token);

    const nftInfo = await new TokenNftInfoQuery()
      .setNftId(nftId)
      .execute(this.client);

    const ownerId = nftInfo[0].accountId.toString();
    console.log('NFT Owner:', ownerId);
    return ownerId;
  }

  private async _associateTokenToPurchaser(purchaser: IAccount, tokenAddress: string): Promise<TransactionReceipt> {
    const tokenId = this._getTokenId(tokenAddress);

    const associateTx = new TokenAssociateTransaction()
      .setAccountId(purchaser.accountId)
      .setTokenIds([tokenId])
      .freezeWith(this.client);

    const signed = await associateTx.sign(purchaser.accountKey);
    const result = await signed.execute(this.client);
    const receipt = await result.getReceipt(this.client);

    console.log(`Token associated: ${receipt.status}`);
    return receipt;
  }

  async purchaseNft(purchaser: IAccount, token: IToken, hbars: number): Promise<TransactionReceipt> {
    try {
      await this._associateTokenToPurchaser(purchaser, token.address);
    } catch (err) {
      logger.error('Account already associated with token, skipping association:');
    }

    const params = new ContractFunctionParameters()
      .addAddress(token.address)
      .addUint256(token.serialNumber);

    const tx = new ContractExecuteTransaction()
      .setContractId(this.contractId)
      .setGas(1_000_000)
      .setPayableAmount(new Hbar(hbars))
      .setFunction('purchaseNft', params);

    const result = await tx.execute(this.client);
    const receipt = await result.getReceipt(this.client);

    console.log('Purchase tx status:', receipt.status);
    return receipt;
  }
}
