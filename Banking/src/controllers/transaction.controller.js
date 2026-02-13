import transactionModel from "../models/transaction.model.js";
import ledgerModel from "../models/ledger.model.js";
import accountModel from "../models/account.model.js";
import {sendTransactionEmail} from "../services/email.service.js"
import mongoose, { mongo, startSession } from "mongoose";

/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
     * 1. Validate request
     * 2. Validate idempotency key
     * 3. Check account status
     * 4. Derive sender balance from ledger
     * 5. Create transaction (PENDING)Send Email Notification
     * 6. Create DEBIT ledger entry
     * 7. Create CREDIT ledger entry
     * 8. Mark transaction COMPLETED
     * 9. Commit MongoDB session
     * 10. Send email notification
 */

export const createTransaction = async (req,res)=>{


    /**
     * Validate Request
     */

    const {fromAccount, toAccount,amount,idempotencyKey} = req.body

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message : "FromAccount , toAccount, amount and idempotencyKey are required"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id : fromAccount
    })

    const toUserAccount = await accountModel.findOne({
        _id : toAccount
    })


    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message : "Invalid fromAccount or toAccount"
        })
    }

    /**
     * Validate Idempotency key
     */

    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey : idempotencyKey
    })

    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status === "COMPLETED"){
            return res.status(200).json({
                message : "Transaction is Completed",
                transaction : isTransactionAlreadyExists
            })
        }

        if(isTransactionAlreadyExists.status === "PENDING"){
            return res.status(200).json({
                message : "Transaction is still processing",
            })
        }

        if(isTransactionAlreadyExists.status === "FAILED"){
            return res.status(500).json({
                message : "Transaction processing Failed",
            })
        }

        if(isTransactionAlreadyExists.status === "REVERSED"){
            return res.status(500).json({
                message : "Transaction was reversed , Please try",
            })
        }
    }

    /**
     * Check account Status
     */

    if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
        return res.status(400).json({
            message : "Both account must be ACTIVE to process transaction"
        })
    }

    /**
     * Derive sender balance from ledger
     */

    const balance = await fromUserAccount.getBalance()

    if(balance < amount){
        return res.status(400).json({
            message : `Insufficient balance. Current Balance is ${balance}. Requested amount is ${amount}`
        })
    }

    /**
     * Create transaction (PENDING)
     */

    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = new transactionModel({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status : "PENDING"
    })
    
    const debitLedgerEntry = await ledgerModel.create([{
        account : fromAccount,
        amount : amount,
        transaction : transaction._id,
        type : "DEBIT"
        
    }],{session})

    const creditLedgerEntry = await ledgerModel.create([{
        account : toAccount,
        amount : amount,
        transaction : transaction._id,
        type : "CREDIT"
        
    }],{session})

    transaction.status = "COMPLETED"
    await transaction.save({session})

    /**
     * Send Email Notification
     */

    await sendTransactionEmail(req.user.email,req.user.name,amount , toAccount)

    return res.status(201).json({
        message : "Transaction completed Successfully",
        transaction : transaction
    })
}

export const createInitialsFundsTransaction = async (req,res)=>{

    const {toAccount , amount , idempotencyKey} = req.body

    if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message : "toAccount, amount and idempotencyKey are required"
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id : toAccount
    })

    if(!toUserAccount){
        return res.status(400).json({
            message : "Invalid toAccount"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user : req.user._id,
        
    })

    console.log("s user",fromUserAccount)

    if(!fromUserAccount){
        return res.status(400).json({
            message : "system user account not found"
        })
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = new transactionModel({
        fromAccount : fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status : "PENDING"
    })

    const debitLedgerEntry = await ledgerModel.create([{
        account : fromUserAccount._id,
        amount : amount,
        transaction : transaction._id,
        type : "DEBIT"
    }],{session})

    const creditLedgerEntry = await ledgerModel.create([{
        account : toAccount,
        amount : amount,
        transaction : transaction._id,
        type : "CREDIT"
    }],{session})

    transaction.status = "COMPLETED"
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message : "Initials funds transaction completed successfully",
        transaction : transaction
    })

}