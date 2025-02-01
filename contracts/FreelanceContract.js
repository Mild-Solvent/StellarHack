const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

// Job details structure
class Job {
  constructor(client, freelancer, amount, escrowAccount, conditions) {
    this.client = client;
    this.freelancer = freelancer;
    this.amount = amount;
    this.escrowAccount = escrowAccount;
    this.conditions = conditions;
  }
}

// Create escrow account
async function createEscrow(clientKeypair, freelancerKeypair, amount) {
  const escrowKeypair = StellarSdk.Keypair.random();
  const clientAccount = await server.loadAccount(clientKeypair.publicKey());
  
  const transaction = new StellarSdk.TransactionBuilder(clientAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET
  })
    .addOperation(StellarSdk.Operation.createAccount({
      destination: escrowKeypair.publicKey(),
      startingBalance: amount
    }))
    .setTimeout(0)
    .build();
  
  transaction.sign(clientKeypair);
  await server.submitTransaction(transaction);
  
  return escrowKeypair;
}

// Release funds when conditions are met
async function releaseFunds(job) {
  const escrowAccount = await server.loadAccount(job.escrowAccount.publicKey());
  
  const transaction = new StellarSdk.TransactionBuilder(escrowAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET
  })
    .addOperation(StellarSdk.Operation.payment({
      destination: job.freelancer.publicKey(),
      asset: StellarSdk.Asset.native(),
      amount: job.amount
    }))
    .setTimeout(0)
    .build();
  
  transaction.sign(job.escrowAccount);
  await server.submitTransaction(transaction);
}

module.exports = { Job, createEscrow, releaseFunds }; 