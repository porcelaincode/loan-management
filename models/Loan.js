const { model, Schema } = require("mongoose");

const loanSchema = new Schema({
  // loan details
  amount: Number,
  duration: Number,
  interestRate: Number,
  balancePayment: Number,
  // to whom loan belongs to
  loanee: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  // loan made by whom (agent)
  agentid: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  // log of payments
  payments: [
    {
      paymentAmount: Number,
      newBalanceToBePaid: Number,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  // status of the loan
  status: String,
  // date of request
  createdAt: String,
  // approval schema
  isApproved: {
    type: Boolean,
    default: false,
  },
  approvedAt: { type: Date, default: null },
  // repayment schema
  isRepaid: {
    type: Boolean,
    default: false,
  },
  repaidAt: { type: Date, default: null },
});

module.exports = model("Loan", loanSchema);
