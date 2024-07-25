import React, { useState } from 'react';
import { Button, Icon, Table, Grid, Pagination } from 'semantic-ui-react';
import StoreForm from '../misc/StoreForm';
import Swal from 'sweetalert2';

function StoreTable({
  stores,
  storesSap,
  storeCode,
  storeName,
  storeAddress,
  storeCity,
  storeTextSearch,
  handleInputChange,
  handleCreateStore,
  handleDeleteStore,
  handleSearchStore,
  handleEditStore,
  handleUpdateStore,
  isEdit,
  setIsEdit
}) {
  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStore, setSelectedStore] = useState(null)
  const itemsPerPage = 10;

  const openForm = (store) => {
    setVisible(true);
    setIsEditing(!!store);
    if (store) {
      handleEditStore(store);
    }
  };
  console.log(storesSap)

  const handleStoreChange = (selectedOption) => {
    console.log(selectedOption)
    const store = storesSap.find((store) => store.id === selectedOption?.value)
    setSelectedStore(store);
    console.log(store)
    handleInputChange(null, { name: 'storeCode', value: selectedOption ? store.code : '' });
    handleInputChange(null, { name: 'storeName', value: selectedOption ? store.name : '' });
    handleInputChange(null, { name: 'storeAddress', value: selectedOption ? store.address : '' });
    handleInputChange(null, { name: 'storeCity', value: selectedOption ? store.city : '' });
  };

  const storeOptions = storesSap?.map(store => ({
    value: store.id,
    label: store.code
  }));

  const formatCreatedAt = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('en-CA', options).replace(',', '');
  };

  const confirmDeleteStore = (storeId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteStore(storeId);
       
      }
    });
  };

  console.log('stores', stores);
  const totalPages = Math.ceil(stores?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedStores = stores?.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (e, { activePage }) => {
    setCurrentPage(activePage);
  };

  let storeList;
  if (selectedStores?.length === 0) {
    storeList = (
      <Table.Row key='no-store'>
        <Table.Cell collapsing textAlign='center' colSpan='5'>No store</Table.Cell>
      </Table.Row>
    );
  } else {
    storeList = selectedStores?.map(store => (
      <Table.Row key={store.id}>
        <Table.Cell>{store.code}</Table.Cell>
        <Table.Cell>{store.name}</Table.Cell>
        <Table.Cell>{store.address}</Table.Cell>
        <Table.Cell>{store.city}</Table.Cell>
        <Table.Cell>{store.user?.username}</Table.Cell>
        <Table.Cell>{formatCreatedAt(store.createdAt)}</Table.Cell>
        <Table.Cell collapsing>
        <Button icon onClick={() => openForm(store)}>
             <Icon name="edit" color="black"/>
           </Button>
           <Button icon onClick={() => confirmDeleteStore(store.id)}>
             <Icon name="trash" color="black" />
           </Button>
        </Table.Cell>
      </Table.Row>
    ));
  }

  return (
    <>
      <Grid stackable divided>
        <Grid.Row columns='2'>
          <Grid.Column>
            {/* <Button icon labelPosition='left' primary onClick={() => openForm(null)}>
              <Icon name='add' /> Create Store
            </Button> */}
            <Button icon onClick={() => openForm(null)} style={{ marginTop: '1em' }}>
                <Icon name='add' color="black" /> Add Store
              </Button>
          
          </Grid.Column>
          {/* <Grid.Column width='5'>
            <Form onSubmit={handleSearchStore}>
              <Input
                action={{ icon: 'search' }}
                name='storeTextSearch'
                placeholder='Search '
                value={storeTextSearch}
                onChange={handleInputChange}
              />
            </Form>
          </Grid.Column> */}
        </Grid.Row>
      </Grid>
      <Table compact striped celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Code</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Address</Table.HeaderCell>
            <Table.HeaderCell>City</Table.HeaderCell>
            <Table.HeaderCell>User</Table.HeaderCell>
            <Table.HeaderCell>CreatedAt</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {storeList}
        </Table.Body>
      </Table>

      <Grid centered style={{ marginTop: '2em' }}>
        <Pagination
          activePage={currentPage}
          onPageChange={handlePageChange}
          totalPages={totalPages}
          ellipsisItem={null}
          firstItem={null}
          lastItem={null}
        />
      </Grid>

      <StoreForm
        storeTextSearc={storeTextSearch}
        storeCode={storeCode}
        storeName={storeName}
        storeAddress={storeAddress}
        storeCity={storeCity}
        handleInputChange={handleInputChange}
        handleCreateStore={handleCreateStore}
        handleEditStore={handleUpdateStore}
        handleDeleteStore={handleDeleteStore}
        handleUpdateStore={handleUpdateStore}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        visible={visible}
        setVisible={setVisible}
        storeOptions={storeOptions}
        handleStoreChange={handleStoreChange}
        selectedStore={selectedStore}
      />
    </>
  );
}

export default StoreTable;
