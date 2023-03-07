const { Account, PublicKey, Connection, Transaction, SystemProgram } = require('@solana/web3.js');
const bs58 = require('bs58');


async function checkBalance(walletAddress) {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const publicKey = new PublicKey(walletAddress);
  const balance = await connection.getBalance(publicKey);
  return balance;
}

async function main(){
    const walletAddress = 'AfLPDwKTG3CUEzcWEwWSdZJeYFVJck3RmkBheSdCDGzM';
    const balance = await checkBalance(walletAddress);
    console.log(`Wallet ${walletAddress} has a balance of ${balance} SOL`);
    const fromWalletSecretKey = '2VckPpaPxNuzQrwzFf6NPFNh8dB9qGzoGBEJi9QRFNrGhPWYvPuUcBnDJbVwHEgkPUtwvoTxdKpjLh3wzUEGXQ3A';
    const toWalletAddress = '3R9zwizFGE7seURD2H8MuAigmCRgRLj7zh8HZaXqU7fE';
    const amount = 100000000; // 0.1 SOL
    await sendSol(fromWalletSecretKey, toWalletAddress, amount);
}

async function sendSol(fromWalletSecretKey, toWalletAddress, amount) {
    const connection = new Connection('https://api.devnet.solana.com');
  
    const secretKeyBase58 = fromWalletSecretKey;
    const secretKeyBytes = bs58.decode(secretKeyBase58);
    const secretKeyHex = Buffer.from(secretKeyBytes).toString('hex');
    const fromWalletAccount = new Account(Buffer.from(secretKeyHex, 'hex'));
  
    // Get the public key for the recipient's address
    const toWalletPublicKey = new PublicKey(toWalletAddress);
  
    // Get the sender's account info
    const fromWalletPublicKey = fromWalletAccount.publicKey;
    const fromWalletAccountInfo = await connection.getAccountInfo(fromWalletPublicKey);
    
    // Create a new transaction
    const transaction = new Transaction().add(
      // Transfer SOL from sender to recipient
      SystemProgram.transfer({
        fromPubkey: fromWalletPublicKey,
        toPubkey: toWalletPublicKey,
        lamports: amount,
      }),
    );
    
    // Sign and send the transaction
    const signature = await connection.sendTransaction(transaction, [fromWalletAccount]);
    
    console.log(`Transaction ${signature} successful!`);
}
main()

