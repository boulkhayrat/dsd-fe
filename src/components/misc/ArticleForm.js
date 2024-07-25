import React, { useEffect } from 'react';
import { Form, Button, Icon, Modal, Segment } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import Select from 'react-select';

function ArticleForm({ 
  articleSapOptions,
  articleCode, 
  articleName, 
  articleUnitOfMeasure,  
  articleSupplierId,
  handleInputChange, 
  handleCreateArticle, 
  handleEditArticle, 
  isEdit,
  setIsEdit,
  visible, 
  setVisible,
  editArticle,
  supplierOptions,
  selectedSupplier,
  selectedArticleSap,
  handleSupplierChange,
  handleArticleSapChange,
  setSelectedSupplier,
  setSelectedArticleSap
}) {

  useEffect(() => {
    if (editArticle) {
      handleInputChange(null, { name: 'articleCode', value: editArticle.code });
      handleInputChange(null, { name: 'articleName', value: editArticle.name });
      handleInputChange(null, { name: 'articleUnitOfMeasure', value: editArticle.unitOfMeasure });
      handleInputChange(null, { name: 'articleSupplierId', value: editArticle.supplier_id });
      handleSupplierChange({ value: editArticle.supplier_id, label: editArticle.supplier?.name });
    } else {
      // Set default values for creating new article
      handleInputChange(null, { name: 'articleUnitOfMeasure', value: 'PC' }); // Select 'Piece' by default
    }
  }, [editArticle]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isEdit) {
      handleEditArticle();
     
    } else {
      handleCreateArticle();
      
    }
    setVisible(false);  // Hide the modal after submit
  }

  const handleCancel = () => {
    setIsEdit(false);
    setVisible(false);  // Hide the modal when cancel is clicked
    handleInputChange(null, { name: 'articleUnitOfMeasure', value: '' }); // Select 'Piece' by default
    handleInputChange(null, { name: 'articleCode', value: '' });
    handleInputChange(null, { name: 'articleName', value: '' });
   
    handleSupplierChange(null);
    handleArticleSapChange(null);// Reset supplier and article
    setSelectedArticleSap(null)
    setSelectedSupplier(null)
  }

  return (
    <Modal open={visible} onClose={handleCancel} size='large' closeIcon>
      <Modal.Header>{isEdit ? 'Edit Article' : 'Create Article'}</Modal.Header>
      <Modal.Content>
        <Segment basic>
          <Form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
              <Form.Field style={{ width: "60%" }}>
                <label>Supplier *</label>
                <Select
                  name='articleSupplierId'
                  options={supplierOptions}
                  // value={selectedSupplier?.name}
                  onChange={handleSupplierChange}
                  placeholder='Select Supplier'
                  isSearchable
                />
              </Form.Field>
              <Form.Field style={{ width: "60%" }}>
                <label>Article *</label>
                <Select
                  name='articleCode'
                  options={articleSapOptions}
                  // value={selectedArticleSap?.name}
                  onChange={handleArticleSapChange}
                  placeholder='Select Article'
                  isSearchable
                />
              </Form.Field>
              <Form.Field style={{ width: "60%" }}>
                <Form.Input
                  name='articleCode'
                  label='Code *'
                  placeholder='Code'
                  value={articleCode}
                  onChange={handleInputChange}
                  disabled
                />
              </Form.Field>
              <Form.Field style={{ width: "60%" }}>
                <Form.Input
                  name='articleName'
                  label='Name *'
                  placeholder='Name'
                  value={articleName}
                  onChange={handleInputChange}
                />
              </Form.Field>
              <Form.Field style={{ width: "60%" }}>
                <label>Unit Of Measure *</label>
                <Form.Group inline>
                  <Form.Radio
                    label='Piece'
                    name='articleUnitOfMeasure'
                    value='PC'
                    checked={articleUnitOfMeasure === 'PC'}
                    onChange={handleInputChange}
                    disabled
                  />
                  <Form.Radio
                    label='Kg'
                    name='articleUnitOfMeasure'
                    value='KG'
                    checked={articleUnitOfMeasure === 'KG'}
                    onChange={handleInputChange}
                    disabled
                  />
                  {/* Add more radio buttons as needed */}
                </Form.Group>
              </Form.Field>
            </div>
            
            <div style={{ textAlign: 'center',marginTop: "5em" }}>
              <Button.Group>
                <Button icon labelPosition='left' onClick={handleCancel}>
                  Cancel<Icon name='cancel'  />
                </Button>
                <Button.Or />
                <Button positive icon labelPosition='left' type='submit'>
                  {isEdit ? 'Update' : 'Create'}<Icon name={isEdit ? 'edit' : 'add'}  />
                </Button>
              </Button.Group>
            </div>
          </Form>
        </Segment>
      </Modal.Content>
    </Modal>
  );
}

export default ArticleForm;
