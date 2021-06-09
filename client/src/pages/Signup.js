import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";

import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { useForm } from "../utils/hooks";

import { AuthContext } from "../context/auth";

const Signup = (props) => {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
    isAgentBool: false,
  });
  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, result) {
      context.login(result.data.register);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function registerUser() {
    addUser();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <Form.Input
          label="Username"
          placeholder="Username..."
          name="username"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Email"
          placeholder="Email..."
          value={values.email}
          name="email"
          error={errors.email ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password..."
          value={values.password}
          type="password"
          name="password"
          error={errors.password ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Confirm Password..."
          value={values.confirmPassword}
          name="confirmPassword"
          type="password"
          error={errors.confirmPassword ? true : false}
          onChange={onChange}
        />
        {/* <Form.Group inline>
          <label>Sign up for </label>
          <Form.Radio
            label="Agent Role"
            value={values.isAgentBool}
            checked={values.isAgentBool}
            onChange={handleAgentChange}
          />
        </Form.Group> */}
        <Button type="submit" primary>
          Create Account
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
    $isAgentBool: Boolean
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
        isAgentBool: $isAgentBool
      }
    ) {
      id
      email
      token
      username
      createdAt
      isAdmin
      isAgent
    }
  }
`;

export default Signup;
