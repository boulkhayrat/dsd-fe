import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Menu, Dropdown, Icon, Input } from 'semantic-ui-react';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { getUser, userIsAuthenticated, userLogout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const logout = () => {
    userLogout();
    navigate('/login');
  };

  const adminPageStyle = () => {
    const user = getUser();
    return user && user.data.rol[0] === 'ADMIN' ? {} : { display: 'none' };
  };

  const userPageStyle = () => {
    const user = getUser();
    return user && user.data.rol[0] === 'USER' ? {} : { display: 'none' };
  };
  const managerPageStyle = () => {
    const user = getUser();
    return user && user.data.rol[0] === 'MANAGER' ? {} : { display: 'none' };
  };


  if (!userIsAuthenticated()) {
    return null;
  }

  const getUserName = () => {
    const user = getUser();
    return user ? user.data.name : '';
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  const isAdmin = () => {
    const user = getUser();
    return user && user.data.rol[0] === 'ADMIN';
  };

  const isManager = () => {
    const user = getUser();
    return user && user.data.rol[0] === 'MANAGER';
  };

  return (
    <Menu inverted fixed='top' color='teal' style={{ borderRadius: 0, marginBottom: '2em' }}>
      <Container style={{ width: '85vw' }}>
        <Menu.Item header  style={{ fontWeight: 'bold', fontSize: '1.5em' }}>
          <Icon name='truck' /> Kazyon-Dsd
        </Menu.Item>
        {(isAdmin() || isManager()) && <Menu.Item as={Link} exact='true' to="/">Home</Menu.Item>}
        <Menu.Item as={Link} to="/adminpage" style={adminPageStyle()}>Admin Page</Menu.Item>
        <Menu.Item as={Link} to="/userpage" style={userPageStyle()}>User Page</Menu.Item>
        <Menu.Item as={Link} to="/managerpage" style={managerPageStyle()}>Manager Page</Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item style={{ padding: 0, width: "100%" }}>
            <Input
              action={{
                icon: 'search',
                onClick: handleSearchSubmit,
               style: { background: 'rgba(255, 255, 255, 0.7)', color: '#000' }
              }}
              placeholder='Search...'
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit();
                }
              }}
              style={{ background: 'rgba(255, 255, 255, 0.7)', color: '#000' }}
            />
          </Menu.Item>
          <Dropdown item text={`Hi, ${getUserName()}`} style={{ display: userIsAuthenticated() ? 'block' : 'none' }}>
            <Dropdown.Menu>
              <Dropdown.Item onClick={logout}>
                <Icon name='sign-out' /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {!userIsAuthenticated() && (
            <Menu.Item as={Link} to="/login">
              <Icon name='sign-in' /> Login
            </Menu.Item>
          )}
        </Menu.Menu>
      </Container>
    </Menu>
  );
}

export default Navbar;
