import Stripe from 'stripe';
import config from '../../../config';

/**
 * Stripe instance
 */
export const stripe = new Stripe(config.payment.stripe.secret);
