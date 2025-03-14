import mongoose from "mongoose";
const billDetailSchema = new mongoose.Schema({
  serialNumber: { type: Number, required: true },
  treatmentName: { type: String },
  session: { type: String},
  quantity: { type: Number},
  mrp: { type: Number },
  rate: { type: Number },
  totalAmount: Number,
});

const BillSchema = new mongoose.Schema({
  // customer: {
  //   customerId: { 
  //     type: String, 
  //     default: () => `CUST-${Date.now()}` 
  //   },
  //   customerName: { type: String, required: true },
  // },
  fromAddress: { type: String, required: true },
  toAddress: { type: String, required: true },
  invoiceNumber: { 
    type: String, 
    default: () => `INV-${Date.now()}`
  },
  invoiceDate: { type: Date, default: Date.now },

  details: [billDetailSchema],
});


BillSchema.pre("save", function (next) {
  if (this.details && Array.isArray(this.details)) {
    this.details.forEach((detail) => {
      detail.totalAmount = detail.quantity * detail.rate;
    });
  }
  next();
});


const Bill = mongoose.model("Bill", BillSchema);
export default Bill;
