import gql from "graphql-tag";
import React, { useState } from "react";
import { Button, Modal, Form } from "semantic-ui-react";
import { useMutation, useQuery } from "@apollo/client";
import { useForm } from "../utils/hooks";

function EditLoanModel({ loanid, status }) {
  const [open, setOpen] = useState(false);

  const { loading, data } = useQuery(GET_LOAN_QUERY, {
    variables: {
      id: loanid,
    },
  });

  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    amount: "",
    duration: "",
    interestRate: "",
  });

  const [editLoan] = useMutation(EDIT_LOAN_MUTATION, {
    variables: values,
    update(_, result) {
      console.log(result);
    },
  });

  function createPostCallback() {
    console.log(values);
    editLoan();
  }

  return (
    <>
      {loading && (
        <div>
          <h2>Fetching data!</h2>
        </div>
      )}
      {data && status === "NEW" && (
        <Modal
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          trigger={
            <Button size="large" color="green">
              Edit Loan
            </Button>
          }
        >
          <Modal.Header>Edit Loan Request</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Form onSubmit={onSubmit}>
                <Form.Field>
                  <label>Request Amount</label>
                  <input
                    placeholder="Enter Amount here"
                    name="amount"
                    inputMode="decimal"
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
                <Button type="submit" color="green">
                  Edit loan
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
      )}
      {status !== "NEW" && <Button color="black">Approved</Button>}
    </>
  );
}

const EDIT_LOAN_MUTATION = gql`
  mutation createLoan(
    $username: String!
    $amount: Float!
    $duration: Float!
    $interestRate: Float!
  ) {
    createLoan(
      amount: $amount
      interestRate: $interestRate
      duration: $duration
      userid: $username
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

const GET_LOAN_QUERY = gql`
  query getLoan($id: ID!) {
    getLoan(id: $id) {
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

export default EditLoanModel;
