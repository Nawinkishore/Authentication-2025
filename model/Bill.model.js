import mongoose from "mongoose";
const billDetailSchema = new mongoose.Schema({
  serialNumber: {
    type: Number,
    required: true,
  },
  treatmentName: {
    type: String,
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  mrp: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  totalAmount: Number,
});
const BillSchema = new mongoose.Schema({
  fromAddress: {
    type: String,
    required: true,
  },
  toAddress: {
    type: String,
    required: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
  },
  invoiceDate: {
    type: Date,
    required: true,
  },
  details: [billDetailSchema],
});

BillSchema.pre("save", function (next) {
  this.details.forEach((detail, index) => {
    this.details[index].totalAmount = detail.quantity * detail.rate;
    next();
  });
});
const Bill = mongoose.model("Bill", BillSchema);
export default Bill;
