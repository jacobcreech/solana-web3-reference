import { createMint, getAccountInfo, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID, transfer, transferChecked } from "@solana/spl-token";
import { Keypair, clusterApiUrl, Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

(async () => {

  const connection = new Connection(
    'http://127.0.0.1:8899',
    'confirmed'
  );
  
  const payer = Keypair.generate();
  const fromWallet = Keypair.generate();
  const toWallet  = Keypair.generate();
  const freezeAuthority = Keypair.generate();
  const mintAuthority = Keypair.generate();
  
  const airdropSignature = await connection.requestAirdrop(
    payer.publicKey,
    LAMPORTS_PER_SOL,
  );
  await connection.confirmTransaction(airdropSignature);

  const mint = await createMint(
      connection,
      payer,
      mintAuthority.publicKey,
      freezeAuthority.publicKey,
      9
  )

  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      fromWallet.publicKey
  );

  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      toWallet.publicKey
  );

  await mintTo(
      connection,
      payer,
      mint,
      fromTokenAccount.address,
      mintAuthority,
      1000000000
  );

  const toTokenAccountInfoPreTransfer = await getAccountInfo(
      connection,
      toTokenAccount.address
  )

  await transfer(
      connection,
      payer,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet,
      1000000000
  );

  const toTokenAccountInfoPostTransfer = await getAccountInfo(
      connection,
      toTokenAccount.address
  )

  await transferChecked(
      connection,
      payer,
      toTokenAccount.address,
      mint,
      fromTokenAccount.address,
      toWallet,
      1,
      9
  );

  const fromTokenAccountInfoPostTransferChecked = await getAccountInfo(
      connection,
      fromTokenAccount.address
  )

})();