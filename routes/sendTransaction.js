const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const ethers = require('ethers');
const transactionModel = require('../model/transaction');

// Environment variables
const providerUrl = process.env.PROVIDER;
const privateKey = process.env.PRIVATE_KEY;

const validateTransaction = [
    check('to').isEthereumAddress().withMessage('Invalid Ethereum address'),
    check('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
];

router.post('/sendTransaction', validateTransaction, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { to, amount } = req.body;
    try {
        const provider = new ethers.JsonRpcProvider(providerUrl);
        const wallet = new ethers.Wallet(privateKey, provider);

        const valueInWei = ethers.utils.parseEther(amount.toString());

        const tx = {
            to: to,
            value: valueInWei,
        };

        const transactionData = await wallet.sendTransaction(tx);
        const { hash: txHash, from } = transactionData;
        const transaction = await transactionModel.create({ txHash, from, to, amount });
        const receipt = await provider.waitForTransaction(txHash);
        const status = receipt.status === 1 ? 'confirmed' : 'failed';
        await transactionModel.updateOne({ txHash }, { status });
        
        return res.status(200).json({
            txHash,
            from,
            to,
            amount
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error while processing transaction', details: error.message });
    }
});

module.exports = router;
