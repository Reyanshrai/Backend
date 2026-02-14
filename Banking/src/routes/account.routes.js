import express from "express"
import {authMiddleware} from "../middlewares/auth.middleware.js"
import {createAccountController,getUserAccountsController,getAccountBalanceController} from "../controllers/account.controller.js"

const router = express.Router()

/**
 * - POST /api/accounts/
 * - create a new account
 * - protected Route
 */

router.post("/",authMiddleware,createAccountController)

/**
 * -GET
 * - Get all accounts of the logged in user
 */
router.get("/",authMiddleware,getUserAccountsController)

/**
 * -GET
 * - Get all accounts of the logged in user
 */
router.get("/balance/:accountId",authMiddleware,getAccountBalanceController)



export default router