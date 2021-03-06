import React, { useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";

import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { useForm } from "../utils/hooks";

import { AuthContext } from "../context/auth";

const Login = (props) => {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: "",
  });
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, result) {
      context.login(result.data.login);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function loginUserCallback() {
    loginUser();
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
          label="Password"
          placeholder="Password..."
          value={values.password}
          type="password"
          name="password"
          error={errors.password ? true : false}
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
          Login
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

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
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

export default Login;
