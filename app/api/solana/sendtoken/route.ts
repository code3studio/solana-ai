import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import * as web3 from '@solana/web3.js';
import bs58 from 'bs58';

// MongoDB configuration
const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

export async function POST() {
    try {
        // Connect to MongoDB
        await client.connect();
        const database = client.db('tweetcontest');
        const collection = database.collection('tasks');

        // Fetch the winner from the 'tasks' collection
        const winnerData = await collection.findOne({ status: 'winner' });
        if (!winnerData || !winnerData.walletAddress || !winnerData.prizeAmount) {
            return NextResponse.json(
                { error: 'No valid winner found in the database.' },
                { status: 404 }
            );
        }

        const recipientAddress = winnerData.walletAddress; // Winner's wallet address
        const amount = winnerData.prizeAmount; // Amount in SOL (ensure it's properly stored in the DB)
        const secretKey = process.env.SOLANA_SECRET_KEY; // Secret key for the sender wallet from environment variables

        if (!secretKey) {
            return NextResponse.json(
                { error: 'Sender secret key not configured in environment.' },
                { status: 500 }
            );
        }

        // Connect to the Solana devnet
        const connection = new web3.Connection(
            web3.clusterApiUrl('devnet'),
            'confirmed'
        );

        // Create a wallet from the provided secret key
        const senderKeypair = web3.Keypair.fromSecretKey(
            bs58.decode(secretKey)
        );

        // Create a new transaction with a transfer instruction
        const transaction = new web3.Transaction().add(
            web3.SystemProgram.transfer({
                fromPubkey: senderKeypair.publicKey,
                toPubkey: new web3.PublicKey(recipientAddress),
                lamports: amount * web3.LAMPORTS_PER_SOL, // Convert SOL to lamports
            })
        );

        // Get the latest blockhash and set transaction properties
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = senderKeypair.publicKey;

        // Sign and send the transaction
        const signature = await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [senderKeypair]
        );

        // Respond with the transaction signature
        return NextResponse.json({
            message: 'Transaction successful!',
            signature,
        });
    } catch (error) {
        // Handle errors safely
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        console.error('Error processing the request:', errorMessage);

        return NextResponse.json(
            {
                error: 'Failed to process transaction.',
                details: errorMessage,
            },
            { status: 500 }
        );
    } finally {
        // Close the MongoDB client if it was opened
        if (client) {
            await client.close();
        }
    }
}
