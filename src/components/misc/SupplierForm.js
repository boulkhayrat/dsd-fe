import React, { useEffect } from 'react';
import { Form, Button, Icon, Modal, Segment } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import Select from 'react-select';

function SupplierForm({ 
  supplierName, 
  supplierCode,
  supplierAddress,
  supplierFiscalIds, 
  handleInputChange, 
  handleCreateSupplier, 
  handleEditSupplier, 
  isEdit,
  setIsEdit,
  editSupplier, 
  visible, 
  setVisible,
  supplierOptions,
  handleSupplierChange,
  selectedSupplier 
}) {

  useEffect(() => {
    if (editSupplier) {
      handleInputChange(null, { name: 'supplierCode', value: editSupplier.code });
      handleInputChange(null, { name: 'supplierName', value: editSupplier.name });
      handleInputChange(null, { name: 'supplierAddress', value: editSupplier.address });
      handleInputChange(null, { name: 'supplierFiscalIds', value: editSupplier.fiscalIds });
    }
  }, [editSupplier]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isEdit) {
      handleEditSupplier();
      if (event.nativeEvent.submitter.textContent === 'Update') {
        
      }
    } else {
      handleCreateSupplier();
      if (event.nativeEvent.submitter.textContent === 'Create') {
       
      }
    }
    setVisible(false);  // Hide the modal after submit
  }

  const handleCancel = () => {
    setIsEdit(false);
    setVisible(false);  // Hide the modal when cancel is clicked
    handleInputChange(null, { name: 'supplierCode', value: '' });
    handleInputChange(null, { name: 'supplierName', value: '' });
    handleInputChange(null, { name: 'supplierAddress', value: '' });
    handleInputChange(null, { name: 'supplierFiscalIds', value: '' });
  }

  return (
    <Modal
      open={visible}
      onClose={handleCancel}
      size='large'
      closeIcon
    >
      <Modal.Header>{isEdit ? 'Edit Supplier' : 'Create Supplier'}</Modal.Header>
      <Modal.Content>
        <Segment basic>
          <Form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <Form.Field style={{ width: "60%" }}>
                <label>Supplier from Sap </label>
                <Select
                  name='articleSupplierId'
                  options={supplierOptions}
                  // value={selectedSupplier.name}
                  onChange={handleSupplierChange}
                  placeholder='Select Supplier'
                  isSearchable
                />
              </Form.Field>
              <Form.Field style={{ width: "60%" }}>
                <Form.Input
                  name='supplierCode'
                  label='Code *'
                  placeholder='Code'
                  value={supplierCode}
                  onChange={handleInputChange}
                  disabled 
                />
              </Form.Field>
              <Form.Field style={{ width: "60%" }}>
                <Form.Input
                  name='supplierName'
                  label='Name *'
                  placeholder='Name'
                  value={supplierName}
                  onChange={handleInputChange}
                />
              </Form.Field>
              <Form.Field style={{ width: "60%" }}>
                <Form.Input
                  name='supplierAddress'
                  label='Address *'
                  placeholder='Address'
                  value={supplierAddress}
                  onChange={handleInputChange}
                />
              </Form.Field>
              <Form.Field style={{ width: "60%" }}>
                <Form.Input
                  name='supplierFiscalIds'
                  label='Fiscal Ids '
                  placeholder='Fiscal Ids'
                  value={supplierFiscalIds}
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

export default SupplierForm;
