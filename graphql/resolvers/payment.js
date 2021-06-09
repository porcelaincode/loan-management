const Loan = require("../../models/Loan");
const checkAuth = require("../../util/checkAuth");
const { UserInputError } = require("apollo-server");

module.exports = {
  Mutation: {
    makePayment: async (_, { id, paymentAmount }, context) => {
      const user = checkAuth(context);

      if (paymentAmount === 0) {
        throw new UserInputError("Empty Payment", {
          errors: {
            payment: "payment amount cant be zero",
          },
        });
      }

      const loan = await Loan.findById(id);

      if (loan) {
        if (loan.status === "APPROVED") {
          if (loan.isRepaid != true) {
            if (loan.balancePayment - paymentAmount >= 0) {
              loan.balancePayment -= paymentAmount;
              if (loan.balancePayment === 0) {
                loan.isRepaid = true;
                loan.repaidAt = new Date().toISOString();
              }

              loan.payments.unshift({
                paymentAmount,
                newBalanceToBePaid: loan.balancePayment,
                createdAt: new Date().toISOString(),
              });
              await loan.save();
              return loan;
            } else {
              throw new Error(
                `Payment request consists of Amount greater than Balance payment Amount ${loan.amount}`
              );
            }
          } else {
            throw new UserInputError(
              "Loan is repaid and closed by your Agent."
            );
          }
        } else {
          throw new Error(
            `Your application is either in process or rejected. Contact your agent for more details`
          );
        }
      } else {
        throw new UserInputError(
          "Loan Information not found. Try again with correct credentials"
        );
      }
    },
  },
};
