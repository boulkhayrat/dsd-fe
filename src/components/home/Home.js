import React, { useEffect, useState } from 'react';
import { Statistic, Icon, Grid, Container, Segment, Dimmer, Loader } from 'semantic-ui-react';
import { orderApi } from '../misc/OrderApi';
import { articleApi } from '../misc/ArticleApi';
import { supplierApi } from '../misc/SupplierApi';
import { handleLogError } from '../misc/Helpers';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function Home() {
  const { userIsAuthenticated } = useAuth();
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [numberOfOrders, setNumberOfOrders] = useState(0);
  const [numberOfArticles, setNumberOfArticles] = useState(0);
  const [numberOfVendors, setNumberOfVendors] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const responseUsers = await orderApi.numberOfUsers();
        const responseOrders = await orderApi.numberOfOrders();
        const responseArticles = await articleApi.numberOfArticles();
        const responseVendors = await supplierApi.numberOfSuppliers();

        setNumberOfUsers(responseUsers.data);
        setNumberOfOrders(responseOrders.data);
        setNumberOfArticles(responseArticles.data);
        setNumberOfVendors(responseVendors.data);
      } catch (error) {
        handleLogError(error);
      } finally {
        setIsLoading(false);
      }
    }

    if (userIsAuthenticated()) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [userIsAuthenticated]);

  if (!userIsAuthenticated()) {
    return <Navigate to='/login' />;
  }
  

  if (isLoading) {
    return (
      <Segment basic style={{ marginTop: window.innerHeight / 2 }}>
        <Dimmer active inverted>
          <Loader inverted size='huge'>Loading</Loader>
        </Dimmer>
      </Segment>
    );
  }

  return (
    <Container text style={{ marginTop: '15em' }}>
      <Grid stackable columns={2} doubling>
        <Grid.Row>
          <Grid.Column textAlign='center'>
            <Segment color='teal'>
              <Statistic>
                <Statistic.Value>
                  <Icon name='users' color='grey' />{numberOfUsers}
                </Statistic.Value>
                <Statistic.Label>Users</Statistic.Label>
              </Statistic>
            </Segment>
          </Grid.Column>
          <Grid.Column textAlign='center'>
            <Segment color='blue'>
              <Statistic>
                <Statistic.Value>
                  <Icon name='shop' color='grey' />{numberOfOrders}
                </Statistic.Value>
                <Statistic.Label>Orders</Statistic.Label>
              </Statistic>
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign='center'>
            <Segment color='purple'>
              <Statistic>
                <Statistic.Value>
                  <Icon name='box' color='grey' />{numberOfArticles}
                </Statistic.Value>
                <Statistic.Label>Articles</Statistic.Label>
              </Statistic>
            </Segment>
          </Grid.Column>
          <Grid.Column textAlign='center'>
            <Segment color='orange'>
              <Statistic>
                <Statistic.Value>
                  <Icon name='handshake' color='grey' />{numberOfVendors}
                </Statistic.Value>
                <Statistic.Label>Suppliers</Statistic.Label>
              </Statistic>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default Home;
