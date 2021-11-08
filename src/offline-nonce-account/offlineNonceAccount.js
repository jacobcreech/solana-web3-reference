const web3 = require('@solana/web3.js');
const nacl = require('tweetnacl');

(async () => {

  // Create connection
  const connection = new web3.Connection(
    "http://127.0.0.1:8899",
    'confirmed',
  );

  // Generate accounts
  const onlineAccount = web3.Keypair.generate();
  const nonceAccount = web3.Keypair.generate();

  // Fund account
  const airdropSignature = await connection.requestAirdrop(
    onlineAccount.publicKey,
    web3.LAMPORTS_PER_SOL,
  );

  await connection.confirmTransaction(airdropSignature);

  // Get Minimum amount for rent exemption
  const minimumAmount = await connection.getMinimumBalanceForRentExemption(
    web3.NONCE_ACCOUNT_LENGTH,
  );

  // Form CreateNonceAccount transaction
  const transaction = new web3.Transaction({
    recentBlockhash: await connection.getRecentBlockhash()
  }).add(
    web3.SystemProgram.createNonceAccount({
      fromPubkey: onlineAccount.publicKey,
      noncePubkey: nonceAccount.publicKey,
      authorizedPubkey: onlineAccount.publicKey,
      lamports: minimumAmount,
    }),
  );

  await web3.sendAndConfirmTransaction(connection, transaction, [onlineAccount, nonceAccount])

  const nonceAccountData = await connection.getNonce(
    nonceAccount.publicKey,
    'confirmed',
  );

  console.log(nonceAccountData);

  const nonceAccountInfo = await connection.getAccountInfo(
    nonceAccount.publicKey,
    'confirmed'
  );

  const nonceAccountFromInfo = web3.NonceAccount.fromAccountData(nonceAccountInfo.data);

  console.log(nonceAccountFromInfo);

  const nonce = nonceAccountFromInfo.nonce;

  const offlineAccount = web3.Keypair.generate();
  const offlineNonceAccount = web3.Keypair.generate();

  // Offline account must have some lamports to be initialized
  let transferTransaction = new web3.Transaction()
    .add(web3.SystemProgram.transfer({
      fromPubkey: onlineAccount.publicKey,
      toPubkey: offlineAccount.publicKey,
      lamports: minimumAmount,
    }));

  await web3.sendAndConfirmTransaction(connection, transferTransaction, [onlineAccount])

  const nonceInstruction = web3.SystemProgram.nonceAdvance({
    authorizedPubkey: onlineAccount.publicKey,
    noncePubkey: nonceAccount.publicKey
  });

  const manualTransaction = new web3.Transaction({
    feePayer: onlineAccount.publicKey,
    nonceInfo: {nonce, nonceInstruction},
  }).add(
    web3.SystemProgram.createNonceAccount({
      fromPubkey: offlineAccount.publicKey,
      noncePubkey: offlineNonceAccount.publicKey,
      authorizedPubkey: offlineAccount.publicKey,
      lamports: minimumAmount,
    }),
  );

  let transactionBuffer = manualTransaction.serializeMessage();

  // You can sign the transaction buffer offline
  let offlineNonceAccountSignature = nacl.sign.detached(transactionBuffer, offlineNonceAccount.secretKey);
  let offlineSignature = nacl.sign.detached(transactionBuffer, offlineAccount.secretKey);

  manualTransaction.addSignature(offlineNonceAccount.publicKey, offlineNonceAccountSignature);
  manualTransaction.addSignature(offlineAccount.publicKey, offlineSignature);

  // Take manualTransaction back to online wallet for last signing
  let payerSignature = nacl.sign.detached(transactionBuffer, onlineAccount.secretKey);
  manualTransaction.addSignature(onlineAccount.publicKey, payerSignature);

  let rawTransaction = manualTransaction.serialize();

  await web3.sendAndConfirmRawTransaction(connection, rawTransaction);

  const offlineNonceAccountData = await connection.getNonce(
    offlineNonceAccount.publicKey,
    'confirmed',
  );

  console.log(offlineNonceAccountData);

  const offlineNonceAccountInfo = await connection.getAccountInfo(
    offlineNonceAccount.publicKey,
    'confirmed'
  );

  const offlineNonceAccountFromInfo = web3.NonceAccount.fromAccountData(offlineNonceAccountInfo.data);

  console.log(offlineNonceAccountFromInfo);
})();

