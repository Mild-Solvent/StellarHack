const { Job, createEscrow, releaseFunds } = require('./contracts/FreelanceContract');
const StellarSdk = require('stellar-sdk');

// Initialize Stellar SDK
StellarSdk.Network.useTestNetwork();
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

// Example usage
async function main() {
  // Create keypairs for client and freelancer
  const clientKeypair = StellarSdk.Keypair.random();
  const freelancerKeypair = StellarSdk.Keypair.random();
  
  // Create escrow account
  const escrowKeypair = await createEscrow(clientKeypair, freelancerKeypair, '10');
  
  // Create job
  const job = new Job(
    clientKeypair.publicKey(),
    freelancerKeypair.publicKey(),
    '10',
    escrowKeypair,
    { completed: true } // Example condition
  );
  
  // Release funds when conditions are met
  if (job.conditions.completed) {
    await releaseFunds(job);
    console.log('Funds released to freelancer');
  }
}

main().catch(console.error); 