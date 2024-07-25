import React, { useState } from 'react';
import { Button, Icon, Table, Grid, Pagination } from 'semantic-ui-react';
import SupplierForm from '../misc/SupplierForm';
import Swal from 'sweetalert2';

function SupplierTable({
  suppliers,
  vendorsSap,
  supplierCode,
  supplierName,
  supplierAddress,
  supplierFiscalIds,
  supplierTextSearch,
  handleInputChange,
  handleCreateSupplier,
  handleDeleteSupplier,
  handleSearchSupplier,
  handleEditSupplier,
  handleUpdateSupplier,
  isEdit,
  setIsEdit
}) {
  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const itemsPerPage = 10;

  const openForm = (supplier) => {
    setVisible(true);
    setIsEditing(!!supplier);
    if (supplier) {
      handleEditSupplier(supplier);
    }
  };

  const handleSupplierChange = (selectedOption) => {
    console.log(selectedOption)
    const supplier = vendorsSap.find((supplier) => supplier.id === selectedOption?.value)
    setSelectedSupplier(supplier);
    console.log(supplier)
    handleInputChange(null, { name: 'supplierCode', value: selectedOption ? supplier.code : '' });
    handleInputChange(null, { name: 'supplierName', value: selectedOption ? supplier.name : '' });
    handleInputChange(null, { name: 'supplierAddress', value: selectedOption ? supplier.address : '' });
  };

  const supplierOptions = vendorsSap.map(supplier => ({
    value: supplier.id,
    label: supplier.name
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

  const confirmDeleteSupplier = (supplierId) => {
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
        handleDeleteSupplier(supplierId);
       
      }
    });
  };

  console.log('suppliers', suppliers);
  const totalPages = Math.ceil(suppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedSuppliers = suppliers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (e, { activePage }) => {
    setCurrentPage(activePage);
  };

  let supplierList;
  if (selectedSuppliers.length === 0) {
    supplierList = (
      <Table.Row key='no-supplier'>
        <Table.Cell collapsing textAlign='center' colSpan='5'>No supplier</Table.Cell>
      </Table.Row>
    );
  } else {
    supplierList = selectedSuppliers.map(supplier => (
      <Table.Row key={supplier.id}>
        <Table.Cell>{supplier.code}</Table.Cell>
        <Table.Cell>{supplier.name}</Table.Cell>
        <Table.Cell>{supplier.address}</Table.Cell>
        <Table.Cell>{supplier.fiscalIds}</Table.Cell>
        <Table.Cell>{supplier.user.username}</Table.Cell>
        <Table.Cell>{formatCreatedAt(supplier.createdAt)}</Table.Cell>
        <Table.Cell collapsing>
        <Button icon onClick={() => openForm(supplier)}>
             <Icon name="edit" color="black"/>
           </Button>
           <Button icon onClick={() => confirmDeleteSupplier(supplier.id)}>
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
              <Icon name='add' /> Create Supplier
            </Button> */}
            <Button icon onClick={() => openForm(null)} style={{ marginTop: '1em' }}>
                <Icon name='add' color="black" /> Add Supplier
              </Button>
          
          </Grid.Column>
          {/* <Grid.Column width='5'>
            <Form onSubmit={handleSearchSupplier}>
              <Input
                action={{ icon: 'search' }}
                name='supplierTextSearch'
                placeholder='Search '
                value={supplierTextSearch}
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
            <Table.HeaderCell>Fiscal Ids</Table.HeaderCell>
            <Table.HeaderCell>User</Table.HeaderCell>
            <Table.HeaderCell>CreatedAt</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {supplierList}
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

      <SupplierForm
        supplierTextSearc={supplierTextSearch}
        supplierCode={supplierCode}
        supplierName={supplierName}
        supplierAddress={supplierAddress}
        supplierFiscalIds={supplierFiscalIds}
        handleInputChange={handleInputChange}
        handleCreateSupplier={handleCreateSupplier}
        handleEditSupplier={handleUpdateSupplier}
        handleDeleteSupplier={handleDeleteSupplier}
        handleUpdateSupplier={handleUpdateSupplier}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        visible={visible}
        setVisible={setVisible}
        supplierOptions={supplierOptions}
        handleSupplierChange={handleSupplierChange}
        selectedSupplier={selectedSupplier}
      />
    </>
  );
}

export default SupplierTable;
