import React from "react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

import { Grid, Header } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import CreateLoanModal from "../components/CreateLoanModal";

import DataTable from "../components/DataTable";

const Home = () => {
  const { loading, data } = useQuery(FETCH_USER_LOANS_QUERY, {
    context: AuthContext,
  });

  if (data) {
    console.log(data);
  } else {
    console.log("Data not received");
  }

  if (loading) {
    console.log(loading);
  }

  return (
    <Grid columns={3}>
      <Grid.Row></Grid.Row>

      {data ? (
        data.getUser.isAgent ? (
          <Grid.Column textAlign="center" style={{ width: "100%" }}>
            <Header size="large">Create a new loan request</Header>
            <CreateLoanModal />
          </Grid.Column>
        ) : (
          <></>
        )
      ) : (
        <div style={{ width: "100%", textAlign: "center" }}>
          <h2 style={{ color: "red" }}>Welcome.</h2>
          <h2>Login/Signup to get started.</h2>
        </div>
      )}
      <Grid.Row>
        {data ? (
          <DataTable
            loans={data.getUserLoans}
            isAdmin={data.getUser.isAdmin}
            isAgent={data.getUser.isAgent}
          />
        ) : (
          <></>
        )}
      </Grid.Row>
    </Grid>
  );
};

const FETCH_USER_LOANS_QUERY = gql`
  {
    getUserLoans {
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
    getUser {
      isAgent
      isAdmin
    }
  }
`;

export default Home;
