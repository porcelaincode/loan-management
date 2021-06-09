const gql = require("graphql-tag");

module.exports = gql`
  type Loan {
    id: ID!
    amount: Float!
    duration: Int!
    balancePayment: Float!
    loanee: ID!
    agentid: ID!
    interestRate: Float!
    payments: [Payment]!
    status: String!
    isApproved: Boolean!
    approvedAt: String
    isRepaid: Boolean!
    repaidAt: String
    createdAt: String!
  }
  type Payment {
    id: ID!
    payee: ID!
    paymentAmount: Float!
    newBalanceToBePaid: Float!
    createdAt: String!
  }
  type User {
    id: ID!
    username: String!
    email: String!
    token: String!
    isAdmin: Boolean!
    isAgent: Boolean!
    createdAt: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
    isAgentBool: Boolean
    isAdminBool: Boolean
  }
  type Query {
    getLoans: [Loan]
    getLoan(id: ID!): Loan
    getUsers: [User]
    getUser: User
    getUserLoans: [Loan]
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    # editUser(id: ID!): User!
    createLoan(
      amount: Int!
      interestRate: Float!
      username: String!
      duration: Int!
    ): Loan!
    editLoan(id: ID!, isAgent: Boolean!): Loan!
    rejectLoan(id: ID!, isAdmin: Boolean): Loan!
    approveLoan(id: ID!, isAdmin: Boolean): Loan!
    deleteLoan(id: ID!): Loan!
    makePayment(id: ID!, paymentAmount: Float!): Loan!
  }
`;
