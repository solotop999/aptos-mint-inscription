import { Aptos, Network, AptosConfig, Account, Ed25519PrivateKey, U64, Serializer } from "@aptos-labs/ts-sdk";

// edit here
const PRIVATE_KEY = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
const TOTAL_TX = 1000

const GAS_UNIT_PRICE = 100
const MAX_GAS_LIMIT = 1515//Max Gas Limit
////////////

const mint_function = "0x1fc2f33ab6b624e3e632ba861b755fd8e61d2c2e6cf8292e415880b4c198224d::apts::mint"

const aptosConfig = new AptosConfig({ network: Network.MAINNET });
const aptos = new Aptos(aptosConfig);

function reStoreAccount(_privateKey: string) {
  const privateKey = new Ed25519PrivateKey(_privateKey);
  const account = Account.fromPrivateKey({ privateKey });
  return account;
}

async function start() {
  for (let count = 0; count <= TOTAL_TX; count++) {
    const myAccount = reStoreAccount(PRIVATE_KEY);
    const myPubkey = myAccount.accountAddress.toString();

    const transaction = await aptos.transaction.build.simple({
      sender: myAccount.accountAddress,
      data: {
        function: mint_function,
        typeArguments: [],
        functionArguments: ['APTS'], 
      },
      options: {
        maxGasAmount: MAX_GAS_LIMIT,
        gasUnitPrice: GAS_UNIT_PRICE,
      },
    });

    const sendTx = aptos.transaction.signAndSubmitTransaction({
      signer: myAccount,
      transaction: transaction,
    });

    console.log(`${count}. https://explorer.aptoslabs.com/txn/${(await sendTx).hash}`);
    const response = await aptos.waitForTransaction({
      transactionHash: (await sendTx).hash,
    });
  }

}

start();
