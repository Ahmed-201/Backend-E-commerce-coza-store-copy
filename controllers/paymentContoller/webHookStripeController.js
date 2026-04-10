import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // Webhook endpoint jo Stripe Dashboard mein daalna hai
// app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {

export const webhookController = async (req, res) => {

    console.log("heywebhook")
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Verify karo ke request sach mein Stripe se aayi hai
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET, // Ye 'Create destination' ke baad milega
    );
  } catch (err) {
    console.log(`❌ Signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Ab handle karo "payment_intent.succeeded" event ko
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    console.log("💰 Payment was successful!", paymentIntent);

    // Metadata se order details nikaalein (Jo Payment Intent banate waqt bheji thin)
    // const orderData = {
    //     userId: paymentIntent.metadata.userId,
    //     userName: paymentIntent.metadata.userName,
    //     shippingAddress: paymentIntent.metadata.shippingAddress,
    //     orderItems: JSON.parse(paymentIntent.metadata.orderItems),
    //     totalPrice: paymentIntent.amount / 100,
    //     isPaid: true
    // };

    // Yahan apni Order API wala sara logic (DB save + Stock minus) run karein
    // console.log("Processing Order for:", orderData.userName);
    // await saveOrderToDB(orderData);
  }

  // Stripe ko 200 response dena lazmi hai warna wo baar baar request bhejta rahega
  res.json({ received: true });
};
