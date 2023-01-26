const mongodb = require('mongoose')
const Schema = mongodb.Schema
const paymentOrderSchema = new Schema(
    {
        userid: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            // required: true
        }],
        date_paid: {
            type: Date
        },
        invoice_id:
        [{
            type: Schema.Types.ObjectId,
            ref: "Invoice",
            // required: true
        }],
        payment_id: {
            type: Schema.Types.ObjectId,
            ref: "Payment",
            // required: true
        }
        
    }
)
// userSchema.methods.addToCart = function(product) {
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];
  
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: product._id,
//         quantity: newQuantity
//       });
//     }
//     const updatedCart = {
//       items: updatedCartItems
//     };
//     this.cart = updatedCart;
//     return this.save();
//   };

  
module.exports = mongodb.model("PaymentOrder", paymentOrderSchema)