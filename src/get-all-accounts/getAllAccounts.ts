import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {clusterApiUrl, Connection, PublicKey} from "@solana/web3.js";

(async () => {

  let publicKey = new PublicKey('B3fe93AFXriKDq2Ga5rbiPw6bjPn9qqrnposbzdfSfqp');
  let connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

  let response = await connection.getParsedTokenAccountsByOwner(
    publicKey,
    {
      programId: TOKEN_PROGRAM_ID,
    },
  );

  let accounts = response.value.map(account => account.account);

  console.log(accounts);

})();