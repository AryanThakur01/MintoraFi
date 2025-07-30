import { AccountId, Client, Hbar, PrivateKey } from '@hashgraph/sdk'
import { settings } from '../settings'
import { Network } from '../data/enumerators'

const generateHederaClient = (accountId: string | AccountId, privateKey: string | PrivateKey): Client => {
  const network = settings.network
  const hederaClient = network === Network.Testnet ? Client.forTestnet() : Client.forMainnet()
  hederaClient
    .setDefaultMaxQueryPayment(new Hbar(20))
    .setDefaultMaxTransactionFee(new Hbar(20))
    .setRequestTimeout(30_000)
    .setMinBackoff(250)
    .setMaxBackoff(8_000)
    .setAutoValidateChecksums(true)
    .setOperator(accountId, privateKey)
  return hederaClient
}
const hederaClient = generateHederaClient(settings.hederaOperatorId, settings.hederaOperatorPvtKey)

const hederaError = (error: unknown): string | undefined => {
  if (typeof error === 'object' && error !== null) {
    const err = error as { name?: string; status?: { _code?: number; toString?: () => string }; message?: string }

    // Map of Hedera status codes to user-friendly messages
    const statusMessages: Record<string, string> = {
      INSUFFICIENT_TX_FEE: 'The transaction fee provided is insufficient.',
      INSUFFICIENT_PAYER_BALANCE: 'The payer account does not have enough HBAR to cover the transaction fee.',
      INVALID_SIGNATURE: 'The transaction signature is not valid.',
      INVALID_TRANSACTION: 'The transaction is invalid.',
      PAYER_ACCOUNT_NOT_FOUND: 'The payer account does not exist.',
      DUPLICATE_TRANSACTION: 'This transaction ID is a duplicate of a recent transaction.',
      INVALID_NODE_ACCOUNT: 'The node account provided is invalid.',
      TRANSACTION_EXPIRED: 'The transaction has expired.',
      MEMO_TOO_LONG: 'The transaction memo is too long.',
      INVALID_TRANSACTION_ID: 'The transaction ID is invalid.',
      RECEIPT_NOT_FOUND: 'The receipt for the given transaction ID does not exist.',
      RECORD_NOT_FOUND: 'The record for the given transaction ID does not exist.',
      INSUFFICIENT_GAS: 'Not enough gas was supplied to execute the transaction.',
      CONTRACT_REVERT_EXECUTED: 'The contract execution was reverted.',
      CONTRACT_EXECUTION_EXCEPTION: 'A contract execution-related error occurred.',
      FAIL_INVALID: 'A system error occurred due to invalid request parameters.',
      FAIL_FEE: 'A system error occurred during fee calculation.',
      FAIL_BALANCE: 'A system error occurred during balance checks.',
      BUSY: 'The network is busy or throttled.',
      NOT_SUPPORTED: 'The API is not currently supported.',
      UNKNOWN: 'The transaction status is currently unknown.',
    }

    if (err.name && (err.name === 'StatusError' || err.name === 'ReceiptStatusError')) {
      // Try to extract the status code as a string
      let statusStr = ''
      if (err.status) {
        if (typeof err.status === 'string') {
          statusStr = err.status
        } else if (typeof err.status.toString === 'function') {
          statusStr = err.status.toString()
        }
      }
      // Map to user-friendly message if possible
      if (statusStr && statusMessages[statusStr]) {
        return `Hedera error: ${statusMessages[statusStr]}`
      }
      // Fallback to generic message
      return `Hedera SDK error: ${statusStr} ${err.message ?? ''}`.trim()
    }

    // Handle other error types if needed
    if (err.message) return `Error: ${err.message}`
  }
}

export { hederaClient, hederaError, generateHederaClient }
