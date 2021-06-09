import gql from "graphql-tag";
import React from "react";
import { Button } from "semantic-ui-react";
import { useMutation } from "@apollo/client";

function EditLoanModel({ loanid, isApproved, status }) {
  const [approveLoan] = useMutation(LOAN_APPROVE_MUTATION, {
    variables: {
      id: loanid,
    },
    update(_, result) {
      console.log(result);
    },
  });

  const [rejectLoan] = useMutation(LOAN_REJECT_MUTATION, {
    variables: {
      id: loanid,
    },
    update(_, result) {
      console.log(result);
    },
  });

  function approveLoanCallback() {
    approveLoan();
  }

  function rejectLoanCallback() {
    rejectLoan();
  }

  return (
    <>
      {isApproved ? (
        <Button onClick={rejectLoanCallback} color="red">
          Reject loan
        </Button>
      ) : status === "REJECTED" ? (
        <Button color="grey" disabled>
          REJECTED
        </Button>
      ) : (
        <Button onClick={approveLoanCallback} color="green">
          Approve loan
        </Button>
      )}
    </>
  );
}

const LOAN_REJECT_MUTATION = gql`
  mutation rejectLoan($id: ID!) {
    rejectLoan(id: $id) {
      balancePayment
    }
  }
`;

const LOAN_APPROVE_MUTATION = gql`
  mutation approveLoan($id: ID!) {
    approveLoan(id: $id) {
      id
      status
      isApproved
      approvedAt
    }
  }
`;

export default EditLoanModel;
