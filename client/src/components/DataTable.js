import moment from "moment";
import React, { useState, useEffect } from "react";
import { Table, Button } from "semantic-ui-react";
import EditLoanModel from "./EditLoanModal";
import PayModal from "./PayModal";
import ApprovalModal from "./ApprovalModal";

function DataTable({ loans, isAgent, isAdmin }) {
  const [loanData, setLoanData] = useState([]);

  const [sortType, setSortType] = useState("duration");

  useEffect(() => {
    setLoanData(JSON.parse(JSON.stringify(loans)));

    const sortArray = (type) => {
      const types = {
        duration: "duration",
        issue: "createdAt",
        balance: "balancePayment",
        approved: "approved",
        new: "new",
      };
      const sortProperty = types[type];
      let sorted;
      const returningArr = JSON.parse(JSON.stringify(loans));
      if (sortProperty === "approved") {
        sorted = [...returningArr].filter(
          (status) => status.status === "APPROVED"
        );
      } else if (sortProperty === "new") {
        sorted = [...returningArr].filter((status) => status.status === "NEW");
      } else {
        sorted = [...returningArr].sort(
          (a, b) => a[sortProperty] - b[sortProperty]
        );
      }
      setLoanData(sorted);
    };
    sortArray(sortType, loans);
  }, [sortType, loans]);

  return (
    <>
      <select onChange={(e) => setSortType(e.target.value)}>
        <option value="duration">Duration (sort)</option>
        <option value="balance">Payable Amount (sort)</option>
        <option value="issue">Issue (sort)</option>
        <option value="approved">Approved (filter)</option>
        <option value="new">New (filter)</option>
      </select>
      <br />

      <Table fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width="300">Loan ID</Table.HeaderCell>
            <Table.HeaderCell>Issued at</Table.HeaderCell>
            <Table.HeaderCell>Over the period of (months)</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Payable Amount</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {loanData.map((item) => (
            <Table.Row>
              <Table.Cell>{item.id}</Table.Cell>
              <Table.Cell>{moment(item.createdAt).fromNow()}</Table.Cell>
              <Table.Cell>{item.duration}</Table.Cell>
              <Table.Cell>{item.status}</Table.Cell>
              <Table.Cell>
                {Math.round((item.balancePayment + Number.EPSILON) * 100) / 100}
              </Table.Cell>

              {!isAdmin && !isAgent ? (
                <Table.Cell>
                  {item.status === "NEW" ? (
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
                        loanid={item.id}
                        amount={item.balancePayment}
                        payments={item.payments}
                      />
                    </div>
                  )}
                </Table.Cell>
              ) : (
                <Table.Cell>
                  <div className="ui two buttons">
                    {isAdmin ? (
                      <>
                        <Button basic color="green">
                          Request Payment
                        </Button>
                        <ApprovalModal
                          loanid={item.id}
                          isApproved={item.isApproved}
                          status={item.status}
                        />
                      </>
                    ) : (
                      <EditLoanModel loanid={item.id} status={item.status} />
                    )}
                  </div>
                </Table.Cell>
              )}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
}

export default DataTable;
