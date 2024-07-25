import React, { useState, useEffect } from 'react';
import { Grid, Table, Modal, Segment, Card, CardContent, CardHeader, Button, Input } from 'semantic-ui-react';
import jsPDF from 'jspdf';
function OrderFormDetail({isEdit,setIsEdit, supplierOrders, showDetails, setShowDetails, handleEditOrder, handleCreateOrder, handleEditOrderLine, handleDeleteOrder, handleDeleteOrderLine, handleValidation, handlePrintBonCommande}) {
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editingOrderLineId, setEditingOrderLineId] = useState(null);
  const [editedOrder, setEditedOrder] = useState({});
  const [editedOrderLine, setEditedOrderLine] = useState({});
  const [editedOrderLines, setEditedOrderLines] = useState([])
  const ordersToValidate = supplierOrders.filter(order => order.deliveryDate === selectedDeliveryDate);
  const [filterValidated, setFilterValidated] = useState('all');
  const [creatingOrder, setCreatingOrder] = useState(false);

  console.log(supplierOrders)
  console.log(ordersToValidate)
 
  useEffect(() => {
    if (Array.isArray(selectedOrder?.orderLines)) {
      setEditedOrderLines(selectedOrder?.orderLines);
    }
  }, [selectedOrder]);

  const toggleCreatingOrder = () => {
    setCreatingOrder(!creatingOrder);
  };
  const handleCancel = () => {
    setSelectedDeliveryDate(null);
    setSelectedOrder(null);
    setShowDetails(false);
    setEditingOrderLineId(null); // Reset editing state when closing modal
  };

  const handleDeliveryDateClick = (deliveryDate) => {
    setSelectedDeliveryDate(deliveryDate);
    setSelectedOrder(null); // Reset selected order when a new delivery date is selected
  };

  const handleModifyOrder = (order) => {
    setIsEdit(true)
    setEditingOrderId(order.id);
    setEditedOrder(order);
  };
  const handleValidateOrders = (orders) => {
    console.log(orders)
    handleValidation(orders)
  };

  const handleModifyOrderLine = (orderLine) => {
    setIsEdit(true)
    console.log(orderLine)
    setEditingOrderLineId(orderLine.id);
    setEditedOrderLine({ ...orderLine }); // Set edited order line to current values
    console.log(editedOrderLine)
  };

  const handleOrderInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
  
    if (name === 'valid') {
      parsedValue = value === 'true';
      if (parsedValue) {
        setEditedOrder({ ...editedOrder, [name]: parsedValue, validationDate: new Date().toISOString() });
      } else {
        setEditedOrder({ ...editedOrder, [name]: parsedValue });
      }
    } else {
      setEditedOrder({ ...editedOrder, [name]: parsedValue });
    }
  
    console.log(editedOrder);
  };
  

  const handleOrderLineInputChange = (e, id) => {
    const { name, value } = e.target;
    setEditedOrderLines(prevOrderLines =>
      prevOrderLines.map(orderLine =>
        orderLine.id === id ? { ...orderLine, [name]: value } : orderLine
      )
    );
  };

  const handleShowOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  

  // Extract unique delivery dates from supplierOrders
  const deliveryDates = [...new Set(supplierOrders?.map(order => order.deliveryDate))];

  

  // Function to check if all orders for a given delivery date are validated
  const allOrdersValidated = (deliveryDate) => {
    const ordersForDate = supplierOrders.filter(order => order.deliveryDate === deliveryDate);
    return ordersForDate.every(order => order.valid);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
  };

   // Filter delivery dates based on validation status
   const filteredDeliveryDates = deliveryDates.filter(deliveryDate => {
    if (filterValidated === 'all') return true;
    if (filterValidated === 'validated') return allOrdersValidated(deliveryDate);
    if (filterValidated === 'notValidated') return !allOrdersValidated(deliveryDate);
  });

  const formatDateTime = (dateString) => {
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

 

  return (
    <Modal open={showDetails} onClose={handleCancel} size='fullscreen' closeIcon>
      <Modal.Header>Orders</Modal.Header>
      <Modal.Content>
        <Segment basic>
          <Grid stackable divided>
            <Grid.Row columns={2}>
              <Grid.Column width={3}>
              <div className="grid-column-scrollable">
                  <h4>Delivery Dates</h4>
                  <div style={{ marginBottom: '1em' }}>
                    <Button.Group>
                      <Button onClick={() => setFilterValidated('all')} active={filterValidated === 'all'}>All</Button>
                      <Button onClick={() => setFilterValidated('validated')} active={filterValidated === 'validated'}>Validated</Button>
                      <Button onClick={() => setFilterValidated('notValidated')} active={filterValidated === 'notValidated'}>Not Validated</Button>
                    </Button.Group>
                  </div>
                  {filteredDeliveryDates.map((deliveryDate, index) => (
                    <Card
                      key={index}
                      onClick={() => handleDeliveryDateClick(deliveryDate)}
                      style={{
                        cursor: 'pointer',
                        marginBottom: '0.5em',
                        backgroundColor: allOrdersValidated(deliveryDate) ? 'lightgreen' : ''
                      }}
                    >
                      <CardContent>
                        <CardHeader>{formatDate(deliveryDate)}</CardHeader>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Grid.Column>
              <Grid.Column width={12}>
                <div className="grid-column-scrollable">
                  <h4>Orders</h4>
                  <Table compact striped selectable style={{ marginTop: '1em' }}>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Reference</Table.HeaderCell>
                        <Table.HeaderCell>Note</Table.HeaderCell>
                        <Table.HeaderCell>Delivery Date</Table.HeaderCell>
                        <Table.HeaderCell>Validated</Table.HeaderCell>
                        <Table.HeaderCell>Validation Date</Table.HeaderCell>
                        <Table.HeaderCell>User</Table.HeaderCell>
                        <Table.HeaderCell>CreatedAt</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {supplierOrders?.filter(order => selectedDeliveryDate ? order.deliveryDate === selectedDeliveryDate : true)?.map(order => (
                        <Table.Row key={order.id}>
                          <Table.Cell className={order.valid ? 'green-background' : ''}>
                            {isEdit && editingOrderId === order.id ? (
                              <Input
                                name="reference"
                                value={editedOrder.reference}
                                onChange={handleOrderInputChange}
                                // className={editedOrder.valid ? 'green-backgournd' : ''}
                              />
                            ) : (
                              order.reference
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            {isEdit && editingOrderId === order.id ? (
                              <Input
                                name="note"
                                value={editedOrder.note}
                                onChange={handleOrderInputChange}
                              />
                            ) : (
                              order.note
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            {/* {isEdit && editingOrderId === order.id ? (
                              <input
                                type="date"
                                name="deliveryDate"
                                value={formatDate(editedOrder.deliveryDate)}
                                onChange={handleOrderInputChange}
                              />
                            ) : (
                              formatDate(order.deliveryDate)
                            )} */}{formatDate(order.deliveryDate)}
                          </Table.Cell>
                          <Table.Cell>
                            {/* {isEdit && editingOrderId === order.id ? (
                              <select
                                name="valid"
                                value={editedOrder.valid ? 'true' : 'false'}
                                onChange={handleOrderInputChange}
                              >
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                              </select>
                            ) : (
                              order.valid ? 'Yes' : 'No'
                            )} */}{order.valid ? 'Yes' : 'No'}
                          </Table.Cell>
                          <Table.Cell>{formatDateTime(order.validationDate)}</Table.Cell>
                          <Table.Cell>{order.user?.username}</Table.Cell>
                          <Table.Cell>{formatDateTime(order.createdAt)}</Table.Cell>
                          <Table.Cell>
                            {isEdit && editingOrderId === order.id ? (
                              <Button icon="save" className="p-button-rounded p-button-secondary" onClick={() => handleEditOrder(editedOrder)} />
                            ) : (
                              <Button icon="edit" className="p-button-rounded p-button-secondary" onClick={() => handleModifyOrder(order)} />
                            )}
                            <Button icon="trash" className="p-button-rounded p-button-danger" onClick={() => handleDeleteOrder(order)} />
                            <Button icon="eye" className="p-button-rounded p-button-info" onClick={() => handleShowOrderDetails(order)} />
                          </Table.Cell>
                        </Table.Row>
                      ))}
                      {creatingOrder && (
                        <Table.Row>
                          <Table.Cell>
                            <Input placeholder="Reference" />
                          </Table.Cell>
                          <Table.Cell>
                            <Input placeholder="Note" />
                          </Table.Cell>
                          <Table.Cell>
                            <Input type="date" />
                          </Table.Cell>
                          <Table.Cell>
                            <select>
                              <option value="true">Yes</option>
                              <option value="false">No</option>
                            </select>
                          </Table.Cell>
                          <Table.Cell>{/* Validation Date */}</Table.Cell>
                          <Table.Cell>{/* User */}</Table.Cell>
                          <Table.Cell>{/* Created At */}</Table.Cell>
                          <Table.Cell>
                            <Button icon="save" className="p-button-rounded p-button-secondary" onClick={handleCreateOrder} />
                          </Table.Cell>
                        </Table.Row>
                      )}
                    </Table.Body>
                  </Table>
                </div>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={3}></Grid.Column>
              <Grid.Column width={12}>
                {selectedOrder && (
                  <div>
                  <h4>Details for Order: {selectedOrder.reference}</h4>
                  <Table compact striped selectable style={{ marginTop: '1em' }}>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Article</Table.HeaderCell>
                        <Table.HeaderCell>Quantity</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {editedOrderLines.map(orderLine => (
                    <Table.Row key={orderLine.id}>
                      <Table.Cell>{orderLine.articleName}</Table.Cell>
                      <Table.Cell>
                        <Input
                          name="quantity"
                          value={orderLine.quantity}
                          onChange={e => handleOrderLineInputChange(e, orderLine.id)}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Button icon="trash" className="p-button-rounded p-button-danger" onClick={() => handleDeleteOrderLine(orderLine)} />
                      </Table.Cell>
                    </Table.Row>
                    ))}
                      <Table.Row>
                        <Table.Cell colSpan="3" style={{ textAlign: 'center'}}>
                          <Button icon="save" className="p-button-rounded p-button-secondary" onClick={() => handleEditOrderLine(editedOrderLines)} />
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </div>
                
                )}
              </Grid.Column>
            </Grid.Row>

            {selectedDeliveryDate && (
              <Grid.Row>
              <Grid.Column width={3}></Grid.Column>
              <Grid.Column width={12} textAlign="right">
                {allOrdersValidated(selectedDeliveryDate) ? (
                  
                  <Button primary onClick={() => handlePrintBonCommande(ordersToValidate)}>Print</Button>
                ) : (
                  <Button primary onClick={() => handleValidateOrders(ordersToValidate)}>Validate</Button>
                )}
              </Grid.Column>
            </Grid.Row>
            )}
          </Grid>
        </Segment>
      </Modal.Content>
    </Modal>
  );
}

export default OrderFormDetail;
