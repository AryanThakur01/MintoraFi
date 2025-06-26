import { Client, Hbar } from '@hashgraph/sdk'
import { settings } from '../settings'
import { Network } from '../data/enumerators'

const hederaClient = settings.network === Network.Testnet ? Client.forTestnet() : Client.forMainnet()
hederaClient
  .setDefaultMaxTransactionFee(new Hbar(2))
  .setDefaultMaxQueryPayment(new Hbar(1))
  .setRequestTimeout(30_000)
  .setMinBackoff(250)
  .setMaxBackoff(8_000)
  .setAutoValidateChecksums(true)
  .setOperator(settings.hederaOperatorId, settings.hederaOperatorPvtKey)

export { hederaClient }
