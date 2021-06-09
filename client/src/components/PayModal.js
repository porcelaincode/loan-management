import React, { useState } from "react";
import { Button, Modal, Header, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/client";

import gql from "graphql-tag";
import moment from "moment";

import { useForm } from "../utils/hooks";

function PayModal({ loanid, amount, payments }) {
  const [open, setOpen] = useState(false);
  const { values, onChange, onSubmit } = useForm(payLoanCallback, {
    id: loanid,
    amount: null,
  });

  const [payLoan] = useMutation(PAY_LOAN_MUTATION, {
    variables: {
      id: values.id,
      amount: parseFloat(values.amount),
    },
    update(_, result) {
      console.log(result);
      values.amount = null;
    },
  });

  function payLoanCallback() {
    console.log(values);
    payLoan();
    setOpen(!open);
  }
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button basic color="red">
          Pay
        </Button>
      }
    >
      <Modal.Header>Loan {loanid}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Payable Amount : ₹ {amount}</Header>
          {payments.length !== 0 ? (
            <>
              Last Payment : {payments[0].paymentAmount}
              <br />
              Last Payment Date :{moment(payments[0].createdAt).fromNow()}
              <br />
            </>
          ) : (
            <></>
          )}

          <Form onSubmit={onSubmit}>
            <Form.Field>
              <label>Payment Amount</label>
              <input
                placeholder="Enter amount to pay here"
                name="amount"
                inputMode="text"
                type="number"
                value={values.amount}
                onChange={onChange}
              />
            </Form.Field>
            <Button type="submit" color="red" size="large">
              Pay amount {values.amount}
            </Button>
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

const PAY_LOAN_MUTATION = gql`
  mutation makePayment($id: ID!, $amount: Float!) {
    makePayment(id: $id, paymentAmount: $amount) {
      id
      amount
      balancePayment
      duration
      loanee
      agentid
      interestRate
      payments {
        paymentAmount
        newBalanceToBePaid
        createdAt
      }
      status
      isApproved
      isRepaid
      createdAt
    }
  }
`;

export default PayModal;
