import express from 'express';
import { sallaOrderWebhook, verifySallaWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// Salla webhook endpoint
router.post('/salla/order', verifySallaWebhook, sallaOrderWebhook);

export default router;
