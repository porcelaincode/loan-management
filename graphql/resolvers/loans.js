const Loan = require("../../models/Loan");
const User = require("../../models/User");
const checkAuth = require("../../util/checkAuth");
const { AuthenticationError } = require("apollo-server");

module.exports = {
  Query: {
    async getLoans(_, {}, context) {
      try {
        const user = checkAuth(context);
        console.log(user);
        const loans = await Loan.find().sort({ createdAt: -1 });
        return loans;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getLoan(_, { id }) {
      try {
        const loan = await Loan.findById(id);
        if (loan) {
          return loan;
        } else {
          throw new Error("Loan not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getUserLoans(_, {}, context) {
      // console.log(context);
      const user = checkAuth(context);
      const loggedUser = await User.findById(user.id);
      // console.log(loggedUser);
      try {
        if (!loggedUser.isAgent && !loggedUser.isAdmin) {
          const loans = await Loan.find({ loanee: loggedUser.id });
          return loans;
        } else if (loggedUser.isAgent) {
          const loans = await Loan.find({ agentid: loggedUser.id });
          return loans;
        } else if (loggedUser.isAdmin) {
          const loans = await Loan.find().sort({ createdAt: -1 });
          return loans;
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createLoan(_, { amount, duration, interestRate, username }, context) {
      const user = checkAuth(context);
      console.log(user);

      const agentuser = await User.findById(user.id);
      const useruser = await User.findOne({ username: username });
      // only agent is allowed to make a loan request
      if (agentuser.isAgent === true) {
        const newLoan = new Loan({
          amount,
          interestRate,
          duration,
          balancePayment:
            Math.round(
              (amount + amount / interestRate + Number.EPSILON) * 100
            ) / 100,
          status: "NEW",
          agentid: agentuser.id,
          loanee: useruser.id,
          createdAt: new Date().toISOString(),
        });
        const loan = await newLoan.save();

        return loan;
      } else {
        throw new Error("You are not authorized to create a loan request.");
      }
    },
    async deleteLoan(_, { id }, context) {
      // only admin is allowed to delete this loan
      const user = checkAuth(context);

      const loggedUser = await User.findById(user.id);

      if (loggedUser.isAdmin === true) {
        try {
          const loan = await Loan.findById(id);
          await loan.delete();
          return "Loan deleted successfully";
        } catch (err) {
          throw new Error(err);
        }
      } else {
        throw new AuthenticationError("Action not allowed");
      }
    },
    async editLoan(_, { id, isAgent }, context) {
      // only admin is allowed to delete this loan
      const user = checkAuth(context);

      const loggedUser = await User.findById(user.id);

      if (loggedUser.isAgent === true) {
        try {
          const loan = await Loan.findById(id);

          // edit loan action
        } catch (err) {
          throw new Error(err);
        }
      } else {
        throw new AuthenticationError("Action not allowed");
      }
    },
    async approveLoan(_, { id }, context) {
      // only admin is allowed to approve this loan
      const user = checkAuth(context);

      const loggedUser = await User.findById(user.id);

      if (loggedUser.isAdmin === true) {
        try {
          const loan = await Loan.findById(id);
          if (loan) {
            if (loan.status === "NEW") {
              loan.status = "APPROVED";
              loan.isApproved = true;
              loan.approvedAt = new Date().toISOString();

              const savedLoan = await loan.save();
              return savedLoan;
            } else if (loan.status === "APPROVED") {
              throw new Error("Loan is already approved");
            } else if (loan.status === "REJECTED") {
              throw new Error("Loan is rejected.");
            }
          } else {
            throw new Error("Loan doesnt exist");
          }
        } catch (err) {
          throw new Error(err);
        }
      } else {
        throw new AuthenticationError("Action not allowed");
      }
    },
  },
  async rejectLoan(_, { id }, context) {
    // only admin is allowed to reject this loan
    const user = checkAuth(context);

    const loggedUser = await User.findById(user.id);

    if (loggedUser.isAdmin === true) {
      try {
        const loan = await Loan.findById(id);
        if (loan) {
          loan.status = "REJECTED";
          const savedLoan = await loan.save();
          return savedLoan;
        } else {
          throw new Error("Loan doesnt exist");
        }
      } catch (err) {
        console.log("err");
      }
    } else {
      throw new AuthenticationError("Action not allowed");
    }
  },
};
