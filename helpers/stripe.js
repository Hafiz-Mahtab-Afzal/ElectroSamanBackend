import dotenv from "dotenv";
dotenv.config();

import Stripe from 'stripe'
// import { STRIPE_SECRET_KEY } from '../config/config.js'

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)


const stripePaymentIntent = async (amount) => {
    return await stripeInstance.paymentIntents.create({
        amount:   amount * 100, //    convert dollar into cents 
        currency: 'usd'
    })
}

const retrieveStripePayment = async (paymentId) => {
    try {
        const payment = await stripeInstance.paymentIntents.retrieve(paymentId)     
        return payment
    } catch (error) {
        console.error("Error retrieving payment :", error)
        throw error
    }
}

const confirmStripePayment = async (paymentId) => {
    try {
        const payment = await stripeInstance.paymentIntents.confirm(paymentId)      
        return payment
    } catch (error) {
        console.error("Error confirming payment :", error)
        throw error
    }

}

export {
    stripePaymentIntent,
    retrieveStripePayment,
    confirmStripePayment
}