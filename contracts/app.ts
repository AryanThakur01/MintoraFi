import {
  ContractCreateTransaction,
  ContractId,
  FileCreateTransaction,
  FileId,
  Hbar
} from '@hashgraph/sdk'
import fs from 'fs'

import {hederaClient, settings} from './configs/hedera-client';

function validateSettings() {
  if (!settings.hederaOperatorId || !settings.hederaOperatorPvtKey) {
    throw new Error(
        'Hedera operator ID and private key must be set in .env file.')
  }
}

function loadContractBytecode(filePath: string):
    Buffer{return fs.readFileSync(filePath)}

async function uploadContractBytecode(bytecode: Buffer):
    Promise<FileId> {
      const fileCreateTx = new FileCreateTransaction()
                               .setContents(bytecode)
                               .setKeys([ settings.hederaOperatorPvtKey ])
                               .setMaxTransactionFee(new Hbar(2000))
                               .freezeWith(hederaClient)

      const signedTx = await fileCreateTx.sign(settings.hederaOperatorPvtKey)
      const submitTx = await signedTx.execute(hederaClient)
      const receipt = await submitTx.getReceipt(hederaClient)

      if (!receipt.fileId) {
        throw new Error('Bytecode file ID is not defined.')
      }

      return receipt.fileId
    }

async function deploySmartContract(bytecodeFileId: FileId):
    Promise<ContractId> {
      const contractCreateTx = new ContractCreateTransaction()
                                   .setBytecodeFileId(bytecodeFileId)
                                   .setGas(1_000_000)

      const response = await contractCreateTx.execute(hederaClient)
      const receipt = await response.getReceipt(hederaClient)

      if (!receipt.contractId) {
        throw new Error('Contract ID is not defined.')
      }

      return receipt.contractId
    }

function saveContractAddress(filePath: string, address: string):
    void { fs.writeFileSync(filePath, address) }

async function main() {
  try {
    validateSettings()
    console.log('Deploying smart contract to Hedera network...')

    const bytecode = loadContractBytecode('./build/contracts_nft_sol_NFT.bin')
    const bytecodeFileId = await uploadContractBytecode(bytecode)

    console.log('Bytecode file created with ID:', bytecodeFileId.toString())

    const contractId = await deploySmartContract(bytecodeFileId)
    const contractAddress = contractId.toEvmAddress()

    console.log('Smart contract deployed with ID:', contractId.toString())
    console.log('Smart contract deployed at address:', contractAddress)

    saveContractAddress('./test/latest-contract', contractAddress)

    console.log('THE END....')
  } catch (error) {
    console.error('Error occurred:', error)
  }
}

main()
