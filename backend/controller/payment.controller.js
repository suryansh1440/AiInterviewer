import { razorpayInstance } from '../lib/razorpay.js';
import User from '../modals/user.modal.js';
import crypto from 'crypto';
import Payment from '../modals/payment.modal.js';

export const processPayment = async (req,res)=>{
    const {amount, plan} = req.body;
    const userId = req.user._id;
    const option = {
        amount: Number(amount*100), 
        currency: 'INR',
    }
    try{
    const order = await razorpayInstance.orders.create(option);
    // Create a payment record
    await Payment.create({
      userId: userId,
      orderId: order.id,
      plan,
      amount,
      status: 'created'
    });
    res.status(200).json({
        success: true,
        order
    })
    }catch(err){
        console.log("error in processPayment",err);
        return res.status(500).json({message:"Internal server Error"});
    }
}

export const getKey = async (req,res)=>{
    res.status(200).json({
        key: process.env.RAZORPAY_API_KEY
    })
}

export const claimFree = async (req,res)=>{
    const userId = req.user._id;
    try{
    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({message:"User not found"});
    }

    if(user.freeInterview === 'claimed'){
        return res.status(400).json({message:"Free interview already claimed"});
    }
    user.interviewLeft +=1;
    user.freeInterview = 'claimed';
    user.interviewLeftExpire = Date.now() + 1000*60*60*24*30;

    await user.save();
    res.status(200).json({message:"Free interview claimed successfully"});
    }catch(err){
        console.log("error in claimFree",err);
        return res.status(500).json({message:"Internal server Error"});
    }
}

export const paymentVerification = async (req,res)=>{
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET).update(body.toString()).digest('hex');

    const payment = await Payment.findOne({ orderId: razorpay_order_id });
    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    if(expectedSignature !== razorpay_signature){
        payment.status = 'failed';
        await payment.save();
        return res.status(400).json({message:"Invalid signature"});
    }

    // Update payment status and user subscription
    payment.status = 'paid';
    await payment.save();
    try {
      const user = await User.findById(payment.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (payment.plan === 'starter') {
        user.subscription = 'starter';
        user.interviewLeft += 2;
        user.interviewLeftExpire = Date.now() + 1000*60*60*24*30; // 1 month
      } else if (payment.plan === 'pro') {
        user.subscription = 'pro';
        user.interviewLeft = 9999; // unlimited for 1 month (or set a high number)
        user.interviewLeftExpire = Date.now() + 1000*60*60*24*30; // 1 month
      }
      await user.save();
    } catch (err) {
        console.log("error in paymentVerification",err);
      return res.status(500).json({ message: "Failed to update user subscription", error: err.message });
    }
    res.redirect(process.env.FRONTEND_URL + "/pricing");
    // res.status(200).json({message:"Payment verification successful"});
}