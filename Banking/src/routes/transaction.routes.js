import express  from "express"
import {authMiddleware,authSystemUserMiddleware} from "../middlewares/auth.middleware.js"
import { createTransaction,createInitialsFundsTransaction } from "../controllers/transaction.controller.js"

const router = express.Router()

router.post("/",authMiddleware,createTransaction)
router.post("/system/initial-funds",authSystemUserMiddleware,createInitialsFundsTransaction)

export default router