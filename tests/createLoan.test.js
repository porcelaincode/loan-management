const db = require("./db");
const Loan = require("../models/Loan");
const User = require("../models/User");

const loanAction = require("../graphql/resolvers/loans");
const usersAction = require("../graphql/resolvers/users");

beforeAll(async () => await db.connect);

afterEach(async () => await db.clearDatabase);

afterAll(async () => await db.closeDatabase);

var test_token;

describe("User login test", () => {
	it("Login User", async (done) => {
		const { id, token } = await usersAction.Mutation.login(
			"oneagent",
			"agent12345"
		);
		test_token = token;
		const user = await User.findById(id);

		expect(user.id).toEqual(id);
		done();
	});
});

describe("Loan creation test", () => {
	it("First loan", async (done) => {
		const { id } = await loanAction.Mutation.createLoan(
			_,
			(1000, 12, 1.2, "oneuser"),
			{
				Authorization: `Bearer ${test_token}`,
			}
		);

		const loan = await Loan.findById(id);

		expect(loan.amount).toEqual(1000);
		expect(loan.duration).toEqual(12);
		expect(loan.interestRate).toEqual(1.2);
		expect(loan.username).toEqual("oneuser");
		done();
	});
});
