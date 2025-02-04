const ethers = require('ethers');
const Transaction = require('./models/transaction');
const providerUrl = process.env.PROVIDER;
const provider = new ethers.JsonRpcProvider(providerUrl);

async function monitorTransactionStatus() {
    provider.on('pending', async (txHash) => {
        try {
            const receipt = await provider.waitForTransaction(txHash);
            const transaction = await Transaction.findOne({ txHash });

            if (transaction) {
                const status = receipt.status === 1 ? 'confirmed' : 'failed';
                await Transaction.updateOne({ txHash }, { status });
                console.log(`Transaction ${txHash} status updated to ${status}`);
            }
        } catch (error) {
            console.error(`Error while monitoring transaction ${txHash}:`, error.message);
        }
    });
}

module.exports = monitorTransactionStatus
