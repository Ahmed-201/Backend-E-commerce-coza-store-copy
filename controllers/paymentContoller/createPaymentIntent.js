// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { Product } from '../../Models/product.model.js'; // Aapka Mongoose model
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { items } = req.body; // items = [{ productId: "123", quantity: 2 }, ...]
    
// 1. Saare products parallel mein fetch karein
const itemDetails = await Promise.all(
    items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Product ${item.productId} nahi mila`);
        
        // Product ki details ke sath uski requested quantity bhi attach kar dein
        return {
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.productImages[0]?.url, // Agar image bhejni hai
            quantity: item.quantity, // Ye wo quantity hai jo frontend se aayi
            subTotal: product.price * item.quantity
        };
    })
);

// 2. Final Total calculate karein (Stripe ke liye cents mein)
const totalAmountCents = itemDetails.reduce((sum, item) => sum + (item.subTotal * 100), 0);


// return res.status(200).json({
//     message: "Products fetched successfully",
//     items: itemDetails,
//     totalAmount: totalAmountCents / 100 // Frontend pe dikhane ke liye wapis dollars mein
// });


const productNames = itemDetails.map(i => i.name).join(', ');
    // 2. Stripe Payment Intent create karein
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmountCents,
      currency: 'usd', // Ya 'pkr' / 'inr' jo bhi aap use kar rahe hain
      metadata: {
        // Aap yahan extra info save kar sakte hain jo Stripe dashboard pe dikhegi
        userId: req.user?._id?.toString() || "guest",
        productIds: itemDetails.map(i => i.productId).join(','),
        productNames: productNames.substring(0, 500),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // 3. Client Secret frontend ko bhej dein
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      totalAmount: totalAmountCents / 100 // Frontend pe dikhane ke liye wapis dollars mein
    });

  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

