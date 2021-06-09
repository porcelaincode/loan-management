import gql from "graphql-tag";
import React, { useState } from "react";
import { Button, Modal, Form, Message } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import { useForm } from "../utils/hooks";

function CreateLoanModal() {
  const [open, setOpen] = useState(false);
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    username: "",
    amount: "",
    duration: "",
    rateOfInterest: "",
  });

  const [createLoan, { error }] = useMutation(CREATE_LOAN_MUTATION, {
    variables: {
      username: values.username,
      amount: parseFloat(values.amount),
      duration: parseFloat(values.duration),
      rateOfInterest: parseFloat(values.rateOfInterest),
    },
    update(_, result) {
      console.log(result);
      values.username = "";
      values.amount = "";
      values.duration = "";
      values.rateOfInterest = "";
    },
  });

  function createPostCallback() {
    console.log(values);
    setOpen(!open);
    createLoan();
  }
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button size="large">Loan Request</Button>}
    >
      <Modal.Header>New Loan Request</Modal.Header>
      <Modal.Content>
        {error ? (
          <Message negative>
            <Message.Header>{error}</Message.Header>
          </Message>
        ) : (
          <></>
        )}
        <Modal.Description>
          <Form onSubmit={onSubmit}>
            <Form.Field>
              <label>Username</label>
              <input
                placeholder="Enter user's username here"
                name="username"
                inputMode="text"
                value={values.username}
                onChange={onChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Request Amount</label>
              <input
                placeholder="Enter Amount here"
                name="amount"
                inputMode="decimal"
                type="number"
                value={values.amount}
                onChange={onChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Repayment Duration</label>
              <input
                placeholder="Enter duration here"
                name="duration"
                inputMode="numeric"
                value={values.duration}
                onChange={onChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Rate of Interest (/month)</label>
              <input
                placeholder="Enter Rate of Interest here"
                inputMode="decimal"
                name="rateOfInterest"
                value={values.rateOfInterest}
                onChange={onChange}
              />
            </Form.Field>
            <Button type="submit" color="red">
              Submit Request
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

const CREATE_LOAN_MUTATION = gql`
  mutation createLoan(
    $username: String!
    $amount: Int!
    $duration: Int!
    $rateOfInterest: Float!
  ) {
    createLoan(
      amount: $amount
      interestRate: $rateOfInterest
      duration: $duration
      username: $username
    ) {
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

export default CreateLoanModal;
