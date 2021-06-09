const loanResolvers = require("./loans");
const usersResolvers = require("./users");
const paymentResolvers = require("./payment");

module.exports = {
  Query: {
    ...loanResolvers.Query,
    ...usersResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...loanResolvers.Mutation,
    ...paymentResolvers.Mutation,
  },
};
