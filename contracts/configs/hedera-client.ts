import {
  AccountId,
  Client,
  Hbar,
  PrivateKey,
} from '@hashgraph/sdk'
import dotenv from 'dotenv';
dotenv.config();

const settings = {
  network : process.env.NETWORK || 'testnet',
  hederaOperatorId : AccountId.fromString(process.env.HEDERA_OPERATOR_ID || ''),
  hederaOperatorPvtKey :
      PrivateKey.fromStringDer(process.env.HEDERA_OPERATOR_PVT_KEY || ''),
}

const hederaClient =
    settings.network === 'testnet' ? Client.forTestnet() : Client.forMainnet()

hederaClient.setDefaultMaxQueryPayment(new Hbar(20))
    .setDefaultMaxTransactionFee(new Hbar(20))
    .setRequestTimeout(30_000)
    .setMinBackoff(250)
    .setMaxBackoff(8_000)
    .setAutoValidateChecksums(true)
    .setOperator(settings.hederaOperatorId, settings.hederaOperatorPvtKey)

export {
  hederaClient, settings
}
