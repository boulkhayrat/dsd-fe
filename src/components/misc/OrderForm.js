import React, { useState, useEffect } from 'react';
import { Form, Button, Icon, Modal, Segment, Table } from 'semantic-ui-react';
import Select from 'react-select';

function OrderForm({ 
  orderNote, 
  setOrderNote,
  orderId,
  setOrderId,
  orderReference, 
  orderSupplierId,
  handleInputChange, 
  handleCreateOrder, 
  handleEditOrder, 
  isEdit, 
  visible, 
  setVisible,
  suppliers,
  selectedOrder, 
}) {
  const [orderDeliveryDate, setOrderDeliveryDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toISOString().split('T')[0];
  });

  const [articleRows, setArticleRows] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedArticles, setSelectedArticles] = useState([]); 
  const [orderDetails, setOrderDetails] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit && selectedOrder) {
      setOrderNote(selectedOrder.note);
      setOrderId(selectedOrder.id);
      setOrderDetails(selectedOrder.orderLines);
      setOrderDeliveryDate(selectedOrder.deliveryDate.split('T')[0]);
      const supplier = suppliers.find(supplier => supplier?.name === selectedOrder?.supplier?.name);
      setSelectedSupplier(supplier);
      // Map orderLines to articleRows format
      const mappedArticles = selectedOrder.orderLines.map(orderLine => ({
        id: orderLine.articleId,
        name: orderLine.articleName,
        code: orderLine.articleCode,
        quantity: orderLine.quantity,
        unitOfMeasure: orderLine.unitOfMeasure
      }));
      setArticleRows(mappedArticles);
      setSelectedArticles(mappedArticles);
    } else {
      // Reset or initialize articleRows if needed for new order creation
      setArticleRows([]);
      const date = new Date();
      date.setDate(date.getDate() + 2);
      setOrderDeliveryDate(date.toISOString().split('T')[0]);
    }
  }, [selectedOrder, isEdit]);

  useEffect(() => {
    if (selectedSupplier && !isEdit) {
      // Automatically populate articleRows with articles from selectedSupplier
      const mappedArticles = selectedSupplier.articles.map(article => ({
        id: article.id,
        name: article.name,
        code: article.code,
        quantity: '',
        unitOfMeasure: article.unitOfMeasure
      }));
      setArticleRows(mappedArticles);
      setSelectedArticles(mappedArticles);
    } else if (!selectedSupplier) {
      setArticleRows([]);
      setSelectedArticles([]);
    }
  }, [selectedSupplier, isEdit]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      const orderData = {
        orderId,
        orderNote,
        orderReference,
        orderDeliveryDate,
        selectedSupplier,
        selectedArticles,
        orderDetails,
      };

      console.log('saving order : ', orderData);
      if (isEdit) {
        handleEditOrder(orderData);
      } else {
        handleCreateOrder(orderData);
      }
      handleCancel();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    articleRows.forEach((article, index) => {
      if (!article.quantity) {
        newErrors[`quantity-${index}`] = 'Quantity is required';
      } else if (article.unitOfMeasure.toLowerCase() === 'PC' && (article.quantity.includes(',') ||article.unitOfMeasure.toLowerCase() === 'PC' && article.quantity.includes('.'))) {
        newErrors[`quantity-${index}`] = 'Quantity for pcs cannot contain a comma or a period';
      } else if (article.unitOfMeasure.toLowerCase() === 'KG') {
        article.quantity = article.quantity.replace(',', '.');
        if (isNaN(parseFloat(article.quantity))) {
          newErrors[`quantity-${index}`] = 'Quantity for kgs must be a number';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    setVisible(false);
    handleInputChange(null, { name: 'orderReference', value: '' });
    handleInputChange(null, { name: 'orderNote', value: '' });
    handleInputChange(null, { name: 'orderDeliveryDate', value: '' });
    setArticleRows([]);
    setErrors({});
  };

  const handleDeleteArticleRow = (index) => {
    const newArticleRows = articleRows.filter((_, i) => i !== index);
    setArticleRows(newArticleRows);
    const newSelectedArticles = selectedArticles.filter((_, i) => i !== index);
    setSelectedArticles(newSelectedArticles);
  };

  const handleArticleChange = (index, field, value) => {
    const newArticleRows = [...articleRows];
    newArticleRows[index][field] = value;
    setArticleRows(newArticleRows);
    setSelectedArticles(newArticleRows);
  };

  const handleSupplierChange = (selected) => {
    const supplier = suppliers.find(supplier => supplier.id === selected?.value);
    setSelectedSupplier(supplier);
    handleInputChange(null, { name: 'orderSupplier', value: supplier?.id });
  };

  const articleOptions = selectedSupplier?.articles?.map(article => ({
    value: article.id,
    label: article.name,
    code: article.code,
  })) || [];

  return (
    <Modal
      open={visible}
      onClose={handleCancel}
      size='large'
      closeIcon
    >
      <Modal.Header>{isEdit ? 'Edit Order' : 'Create Order'}</Modal.Header>
      <Modal.Content>
        <Segment basic>
          <Form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
              <Form.Field style={{ width: "60%" }}>
                <Form.Input
                  name='orderNote'
                  label='Note '
                  placeholder='Note'
                  value={orderNote}
                  onChange={handleInputChange}
                />
              </Form.Field>
              <Form.Field style={{ width: "60%" }}>
                <Form.Input
                  type="date"
                  name='orderDeliveryDate'
                  label='Delivery Date *'
                  placeholder='Delivery Date'
                  value={orderDeliveryDate}
                  onChange={(e, { name, value }) => {
                    setOrderDeliveryDate(value);
                    handleInputChange(e, { name, value });
                  }}
                  disabled={isEdit}
                />
              </Form.Field>
            
              <Form.Field style={{ width: "60%" }}>
                <label>Supplier *</label>
                <Select
                  name='orderSupplier'
                  placeholder='Select Supplier'
                  options={suppliers?.map(supplier => ({
                    value: supplier.id,
                    label: supplier.name
                  }))}
                  value={selectedSupplier ? { value: selectedSupplier?.id, label: selectedSupplier?.name } : null}
                  onChange={handleSupplierChange}
                  isDisabled={isEdit} // Disable the supplier select during edit
                />
              </Form.Field>
             
              <Table celled style={{ width: "60%", marginTop: "2em" }}>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Name </Table.HeaderCell>
                    <Table.HeaderCell>Code </Table.HeaderCell>
                    <Table.HeaderCell>Unit Of Measure </Table.HeaderCell>
                    <Table.HeaderCell>Quantity</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {articleRows?.map((article, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>
                        {article.name}
                      </Table.Cell>
                      <Table.Cell>{article.code}</Table.Cell>
                      <Table.Cell>{article.unitOfMeasure}</Table.Cell>
                      <Table.Cell>
                        <Form.Input
                          name='quantity'
                          placeholder='Quantity'
                          value={article.quantity}
                          onChange={(e, { value }) => handleArticleChange(index, 'quantity', value)}
                          error={errors[`quantity-${index}`] ? { content: errors[`quantity-${index}`], pointing: 'below' } : null}
                        />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
              
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

export default OrderForm;
