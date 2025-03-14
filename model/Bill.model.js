import mongoose from "mongoose";
// import { v4 as uuidv4 } from "uuid";
let customerCounter = 1000;
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
  customerName : {
    type: String,
    required: true
  },
  customerId : {
    type : String,
    unique : true,
    // default : uuidv4()
  },
  fromAddress: { type: String, required: true },
  toAddress: { type: String, required: true },
  invoiceNumber: { 
    type: String, 
    default: () => `INV-${Date.now()}`
  },
  invoiceDate: { type: Date, default: Date.now()},

  details: [billDetailSchema],  
});


BillSchema.pre("save", async function (next) {
  if(!this.customerId)
  {
    let count = await mongoose.model('Bill').countDocuments();
    this.customerId = `CUST-${customerCounter + count+1}`;
  }
  if (this.details && Array.isArray(this.details)) {
    this.details.forEach((detail) => {
      detail.totalAmount = detail.quantity * detail.rate;
    });
  }
  next();
});


const Bill = mongoose.model("Bill", BillSchema);
export default Bill;
