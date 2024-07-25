import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Form, Button, Icon, Table } from 'semantic-ui-react'

function UserTable({ users, userUsernameSearch, handleInputChange, handleDeleteUser, handleSearchUser,handleEditUser }) {
  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const openForm = (user) => {
    setVisible(true);
    setIsEditing(!!user);

    if (user) {
      handleEditUser(user);
      //setSelectedSupplier({ value: article.supplier?.id, label: article.supplier?.name });
    }
  };

  const confirmDeleteUser = (username) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteUser(username);
        Swal.fire(
          'Deleted!',
          'User has been deleted.',
          'success'
        );
      }
    });
  };
  let userList
  if (users.length === 0) {
    userList = (
      <Table.Row key='no-user'>
        <Table.Cell collapsing textAlign='center' colSpan='6'>No user</Table.Cell>
      </Table.Row>
    )
  } else {
    userList = users?.map(user => {
      return (
        
        <Table.Row key={user.id}>
          {/* <Table.Cell collapsing>
            <Button
              circular
              color='red'
              size='small'
              icon='trash'
              disabled={user.username === 'admin'}
              onClick={() => handleDeleteUser(user.username)}
            />
          </Table.Cell> */}
          
          <Table.Cell>{user.username}</Table.Cell>
          <Table.Cell>{user.name}</Table.Cell>
          <Table.Cell>{user.email}</Table.Cell>
          <Table.Cell>{user.role}</Table.Cell>
          <Table.Cell collapsing>
          <Button icon onClick={() => openForm(user)}>
             <Icon name="edit" color="black"/>
           </Button>
           <Button icon onClick={() => confirmDeleteUser(user.username)}>
             <Icon name="trash" color="black" />
           </Button>
           </Table.Cell>
        </Table.Row>
      )
    })
  }

  return (
    <>
      {/* <Form onSubmit={handleSearchUser}>
        <Input
          action={{ icon: 'search' }}
          name='userUsernameSearch'
          placeholder='Search by Username'
          value={userUsernameSearch}
          onChange={handleInputChange}
        />
      </Form> */}
       <Button icon onClick={() => openForm(null)} style={{ marginTop: '1em' }}>
                <Icon name='add' color="black" /> Add User
              </Button>
      <Table compact striped celled selectable>

        <Table.Header>
          <Table.Row>
          
           
            <Table.HeaderCell >Username</Table.HeaderCell>
            <Table.HeaderCell >Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {userList}
        </Table.Body>
      </Table>
    </>
  )
}

export default UserTable