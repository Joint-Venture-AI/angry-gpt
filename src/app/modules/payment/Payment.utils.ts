import Stripe from 'stripe';
import config from '../../../config';

/**
 * Stripe instance
 */
const stripe = new Stripe(config.payment.stripe.secret);

export default stripe;
