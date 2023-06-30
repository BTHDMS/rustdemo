import * as anchor from "@coral-xyz/anchor";

const main = async () => {
    console.log("Staring ....");
    const provider = anchor.AnchorProvider.env()
    anchor.setProvider(provider);
    const idl = JSON.parse(
        require("fs").readFileSync("../target/idl/hello_world.json", "utf8")
    );
    const programId = new anchor.web3.PublicKey("H6v3DVHdLfu5GMrKtJKGgC1tBYBejP2U1wA8yNofRPcZ");
    const program = new anchor.Program(idl, programId);
    // 1 - Generate a new Keypair for the Counter Account
    const counter = new anchor.web3.PublicKey("D4nvkBXv9kYP5nCEiaB8hutxVYQxVF7kkbG5DpQe7fS5");
    console.log('creating counter: ', counter.toString());

    //2 - Fetch latest blockhash
    let connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl("devnet"));
    let latestBlockhash = await connection.getLatestBlockhash('finalized');

    // 3 - Call initialize_counter and send the transaction to the network
    const tx = await program.methods
        .sayHello()
        // 3a - Pass the counter public key into our accounts context
        .accounts({ counter: counter})
        // 3b - Append the counter keypair's signature to transfer authority to our program
        .rpc();

    //4 - Confirm the transaction
    await connection.confirmTransaction({
        signature: tx,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
    });
    console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`);
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
runMain()
