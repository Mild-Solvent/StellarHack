import React, { useState } from 'react';
import StellarSdk from 'stellar-sdk';

const CreateAccount = () => {
  const [account, setAccount] = useState(null);

  const handleCreateAccount = async () => {
    const pair = StellarSdk.Keypair.random();
    const response = await fetch(
      `https://friendbot.stellar.org?addr=${pair.publicKey()}`
    );
    await response.json();
    
    setAccount({
      publicKey: pair.publicKey(),
      secretKey: pair.secret()
    });
  };

  return (
    <div>
      <h2>Create Stellar Account</h2>
      <button onClick={handleCreateAccount}>Create Account</button>
      {account && (
        <div>
          <h3>Account Created!</h3>
          <p>Public Key: {account.publicKey}</p>
          <p>Secret Key: {account.secretKey}</p>
          <p>Funded with 10,000 XLM (Testnet)</p>
        </div>
      )}
    </div>
  );
};

export default CreateAccount; 