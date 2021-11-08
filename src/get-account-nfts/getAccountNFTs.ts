import {decodeMetadata, getMetadataAccount} from "../../helper/Metadata.service";
import {clusterApiUrl, Connection, PublicKey} from "@solana/web3.js";

const {TOKEN_PROGRAM_ID} = require('@solana/spl-token');

(async () => {

  let publicKey = new PublicKey('BeTs1yXy4JzLSmg674qkBzxoCNhp2KZFTn8qqDgi5mVJ');
  let connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

  let response = await connection.getParsedTokenAccountsByOwner(
    publicKey,
    {
      programId: TOKEN_PROGRAM_ID,
    },
  );

  let mints = await Promise.all(response.value
    .filter(accInfo => accInfo.account.data.parsed.info.tokenAmount.uiAmount !== 0)
    .map(accInfo => getMetadataAccount(accInfo.account.data.parsed.info.mint))
  );

  let mintPubkeys = mints.map(m => new PublicKey(m));

  let multipleAccounts = await connection.getMultipleAccountsInfo(mintPubkeys);

  let nftMetadata = multipleAccounts.filter(account => account !== null).map(account => decodeMetadata(account!.data));

  console.log(nftMetadata);

})();

