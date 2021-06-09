import React from "react";
import { Card, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";
import PayModal from "./PayModal";

const LoanCard = ({ loan }) => {
  return (
    <Card fluid>
      <Card.Content>
        <Card.Header as={Link} to={`/loans/${loan.id}`}>
          Payable : ₹ {loan.balancePayment}
        </Card.Header>
        <Card.Meta>Issued : {moment(loan.createdAt).fromNow()}</Card.Meta>
        <Card.Description>
          Status : {loan.status}
          <br />
          {loan.payments.length !== 0 ? (
            <>
              <strong>Last Payment : ₹ {loan.payments[0].paymentAmount}</strong>
              <br />
              <strong>
                Last Payment Date :{" "}
                {moment(loan.payments[0].createdAt).fromNow()}
              </strong>
            </>
          ) : (
            <></>
          )}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        {loan.status === "NEW" ? (
          <div className="ui two buttons">
            <Button basic color="green">
              Request Approval
            </Button>
            <Button basic color="grey" disabled>
              Pay
            </Button>
          </div>
        ) : (
          <div className="ui two buttons">
            <Button basic color="green">
              Top-up
            </Button>
            <PayModal
              loanid={loan.id}
              amount={loan.balancePayment}
              payments={loan.payments}
            />
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default LoanCard;
