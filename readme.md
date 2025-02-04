# Transaction API

This project provides an API for sending Ethereum transactions using the ethers.js library. It connects to a MongoDB database to store transaction details and monitors the transaction status (pending, confirmed, or failed).

## Features
- Send Ethereum transactions with validation for the recipient's address and transaction amount.
- Store transaction details in a MongoDB database.
- Monitor the status of transactions (pending, confirmed, failed) using event listeners from the Ethereum network.

## Table of Contents
- Prerequisites
- Installation
- Environment Variables
- Running the Application
- API Endpoints

## Prerequisites
Before setting up this project, ensure you have the following installed:

- Node.js (version 14.x or higher)
- MongoDB (local or remote instance)
- Infura or other Ethereum provider for JSON-RPC (to send transactions)

## Installation
1. go to the directory
   ```bash
   cd ethereum-transaction-api
   ```
1. Install dependencies
   Make sure you have npm or yarn installed. Run the following command to install dependencies:
   ```bash
   npm install
   ```

## Environment Variables
Create a .env file in the root directory and provide the necessary environment variables:

```bash
PROVIDER=<Provider>
PRIVATE_KEY=<private Key>
MONGOOSE_URI=mongodb://localhost:27017/test
```

### Explanation:
- **PROVIDER**: Your Ethereum provider's JSON-RPC URL (e.g., Infura, Alchemy, or a local node).
- **PRIVATE_KEY**: The private key of the wallet from which the transactions will be sent. Important: Keep your private key secure and do not expose it in the code.
- **MONGOOSE_URI**: The connection string for your MongoDB instance.

## Running the Application
Start the server:
```bash
npm start
```
This will start the server on the port defined in your .env file (default is port 3000).

Start the transaction listener:
```bash
node index.js
```
This will listen for pending transactions on the Ethereum network and update their status as they are mined (confirmed or failed).

## API Endpoints
1. **POST /api/sendTransaction**
   This endpoint sends an Ethereum transaction and stores the transaction details in MongoDB.

   ### Request Body:
   ```json
   {
     "to": "0xReceiverAddressHere",
     "amount": 1.0
   }
   ```
   - **to** (string): The Ethereum address of the recipient.
   - **amount** (number): The amount of Ether to send (in Ether, not Wei).

   ### Response:
   ```json
   {
     "txHash": "0xTransactionHashHere",
     "from": "0xYourAddressHere",
     "to": "0xReceiverAddressHere",
     "amount": 1.0
   }
   ```

   ### Error Handling:
   - If the to address is invalid, the API will return a 400 status with the error message "Invalid Ethereum address".
   - If the amount is less than or equal to 0, the API will return a 400 status with the error message "Amount must be greater than 0".
   - If there is a server error, it will return a 500 status with a message detailing the error.
