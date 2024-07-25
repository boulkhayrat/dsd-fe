import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button, Form, Grid, Message, Segment } from 'semantic-ui-react';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../misc/OrderApi';
import { parseJwt, handleLogError } from '../misc/Helpers';

function Login() {
  const Auth = useAuth();
  const isLoggedIn = Auth.userIsAuthenticated();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);

  const handleInputChange = (e, { name, value }) => {
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async () => {
    if (!(username && password)) {
      setIsError(true);
      return;
    }

    try {
      const response = await orderApi.authenticate(username, password);
      const { accessToken } = response.data;
      const data = parseJwt(accessToken);
      const authenticatedUser = { data, accessToken };

      Auth.userLogin(authenticatedUser);

      setUsername('');
      setPassword('');
      setIsError(false);

      // Navigate based on user role
      if (data.rol[0] === 'ADMIN') {
        navigate('/');
      } else {
        navigate('/userpage');
      }
    } catch (error) {
      handleLogError(error);
      setIsError(true);
    }
  };

  if (isLoggedIn) {
    const user = Auth.getUser();
    if (user && user.data.rol[0] === 'ADMIN') {
      return <Navigate to="/" />;
    } else if (user && user.data.rol[0] === 'Manager') {
      return <Navigate to="/userpage" />;
    } else {
      return <Navigate to="/userpage" />;
    }
  }

  return (
    <Grid textAlign='center' style={{ height: '90vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Form size='large' error={isError} onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              placeholder='Username'
              name='username'
              value={username}
              onChange={handleInputChange}
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              name='password'
              value={password}
              onChange={handleInputChange}
            />
            <Button color='teal' fluid size='large' type='submit'>Login</Button>
            {isError && (
              <Message error>
                <Message.Header>Error</Message.Header>
                <p>The username or password provided are incorrect!</p>
              </Message>
            )}
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
}

export default Login;
