import React, { useEffect } from 'react';
import { Form, Button, Icon, Modal, Segment } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import Select from 'react-select';

function StoreForm({ 
  storeName, 
  storeCode,
  storeAddress,
  storeCity, 
  handleInputChange, 
  handleCreateStore, 
  handleEditStore, 
  isEdit,
  setIsEdit,
  editStore, 
  visible, 
  setVisible,
  storeOptions,
  handleStoreChange,
  selectedStore 
}) {

  useEffect(() => {
    if (editStore) {
      handleInputChange(null, { name: 'storeCode', value: editStore.code });
      handleInputChange(null, { name: 'storeName', value: editStore.name });
      handleInputChange(null, { name: 'storeAddress', value: editStore.address });
      handleInputChange(null, { name: 'storeCity', value: editStore.city });
    }
  }, [editStore]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isEdit) {
      handleEditStore();
      if (event.nativeEvent.submitter.textContent === 'Update') {
        
      }
    } else {
      handleCreateStore();
      if (event.nativeEvent.submitter.textContent === 'Create') {
       
      }
    }
    setVisible(false);  // Hide the modal after submit
  }

  const handleCancel = () => {
    setIsEdit(false);
    setVisible(false);  // Hide the modal when cancel is clicked
    handleInputChange(null, { name: 'storeCode', value: '' });
    handleInputChange(null, { name: 'storeName', value: '' });
    handleInputChange(null, { name: 'storeAddress', value: '' });
    handleInputChange(null, { name: 'storeCity', value: '' });
  }

  return (
    <Modal
      open={visible}
      onClose={handleCancel}
      size='large'
      closeIcon
    >
      <Modal.Header>{isEdit ? 'Edit Store' : 'Create Store'}</Modal.Header>
      <Modal.Content>
        <Segment basic>
          <Form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <Form.Field style={{ width: "60%" }}>
                <label>Store from Sap </label>
                <Select
                  name='articleStoreId'
                  options={storeOptions}
                  // value={selectedStore.name}
                  onChange={handleStoreChange}
                  placeholder='Select Store'
                  isSearchable
                />
              </Form.Field>
              <Form.Field style={{ width: "60%" }}>
                <Form.Input
                  name='storeCode'
                  label='Code *'
                  placeholder='Code'
                  value={storeCode}
                  onChange={handleInputChange}
                  disabled 
                />
              </Form.Field>
              <Form.Field style={{ width: "60%" }}>
                <Form.Input
                  name='storeName'
                  label='Name *'
                  placeholder='Name'
                  value={storeName}
                  onChange={handleInputChange}
                />
              </Form.Field>
              <Form.Field style={{ width: "60%" }}>
                <Form.Input
                  name='storeAddress'
                  label='Address *'
                  placeholder='Address'
                  value={storeAddress}
                  onChange={handleInputChange}
                />
              </Form.Field>
              <Form.Field style={{ width: "60%" }}>
                <Form.Input
                  name='storeCity'
                  label='City '
                  placeholder='City'
                  value={storeCity}
                  onChange={handleInputChange}
                />
              </Form.Field>
            </div>
            <div style={{ textAlign: 'center', marginTop: "5em" }}>
              <Button.Group>
                <Button icon labelPosition='left' onClick={handleCancel}>
                  Cancel<Icon name='cancel' />
                </Button>
                <Button.Or />
                <Button positive icon labelPosition='left' type='submit'>
                  {isEdit ? 'Update' : 'Create'}<Icon name={isEdit ? 'edit' : 'add'} />
                </Button>
              </Button.Group>
            </div>
          </Form>
        </Segment>
      </Modal.Content>
    </Modal>
  );
}

export default StoreForm;
