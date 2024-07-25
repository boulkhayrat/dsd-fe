import React, { useState, useEffect } from 'react';
import { Header, Button, Icon, Table, Grid, Pagination } from 'semantic-ui-react';
import OrderForm from '../misc/OrderForm';

function OrderTable({
  orders,
  orderReference,
  orderNote,
  setOrderNote,
  orderId,
  setOrderId,
  orderDeliveryDate,
  setOrderDeliveryDate,
  orderSupplierId,
  handleInputChange,
  handleCreateOrder,
  handleEditOrder,
  handleSearchOrder,
  orderTextSearch,
  suppliers,
  selectedArticles,
  setSelectedArticles,
  handlePrintBonCommande
}) {
  const [visible, setVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  // const [collapsedGroups, setCollapsedGroups] = useState({}); // Initialize as empty object
  const [expandedOrders, setExpandedOrders] = useState({});
  const itemsPerPage = 5;

    // Initialize collapsedGroups when orders change or on component mount
    useEffect(() => {
      if (orders?.length > 0) {
        const initialCollapsed = {};
        let isFirstGroup = false;
        orders?.forEach(order => {
          const deliveryDate = new Date(order.deliveryDate).toLocaleDateString('en-CA');
          const supplierName = order.supplier?.name || 'Unknown Supplier';
          const groupKey = `${deliveryDate}-${supplierName}`;
          if (!(groupKey in initialCollapsed)) {
            initialCollapsed[groupKey] = isFirstGroup; // Default to expanded for the first group
            isFirstGroup = true;
          }
        });
        setCollapsedGroups(initialCollapsed);
      }
    }, [orders]);
    
  
  const openForm = (order) => {
    if (order) {
      setIsEdit(true);
      setSelectedOrder(order);
      handleInputChange(null, { name: 'orderReference', value: order.reference });
      handleInputChange(null, { name: 'orderNote', value: order.note });
      handleInputChange(null, { name: 'orderDeliveryDate', value: order.deliveryDate });
      handleInputChange(null, { name: 'orderSupplierId', value: order.supplier?.id });
    } else {
      setIsEdit(false);
      setSelectedOrder(null);
      handleInputChange(null, { name: 'orderReference', value: '' });
      handleInputChange(null, { name: 'orderNote', value: '' });
      handleInputChange(null, { name: 'orderDeliveryDate', value: '' });
      handleInputChange(null, { name: 'orderSupplierId', value: '' });
    }
    setVisible(true);
  };


  const handlePageChange = (e, { activePage }) => {
    setCurrentPage(activePage);
  };

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

  const sortedOrders = orders?.sort((a, b) => new Date(b.deliveryDate) - new Date(a.deliveryDate)) || [];
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedOrders = sortedOrders.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA');
  };

 

  const groupOrdersByDateAndSupplier = (orders) => {
    return orders.reduce((acc, order) => {
      const deliveryDate = new Date(order.deliveryDate).toLocaleDateString('en-CA');
      const supplierName = order.supplier?.name || 'Unknown Supplier';
  
      if (!acc[deliveryDate]) {
        acc[deliveryDate] = {};
      }
      if (!acc[deliveryDate][supplierName]) {
        acc[deliveryDate][supplierName] = [];
      }
      acc[deliveryDate][supplierName].push(order);
  
      return acc;
    }, {});
  };

  const sortDatesDescending = (dates) => {
    return dates.sort((a, b) => new Date(b) - new Date(a));
  };

  const groupedOrders = groupOrdersByDateAndSupplier(selectedOrders);
  const sortedDates = sortDatesDescending(Object.keys(groupedOrders));
  console.log(selectedOrders)
  console.log(groupedOrders)
  const [collapsedGroups, setCollapsedGroups] = useState(() => {
    const initialCollapsed = {};
    sortedDates.forEach(date => {
      console.log(date)
      initialCollapsed[date] = true; 
    });
    return initialCollapsed;
  });
  console.log(collapsedGroups)

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  const isAllValid = (orders) => {
    return orders.every(order => order.valid);
  };
  const renderOrders = (orders) => {
    if (orders.length === 0) {
      return (
        <Table.Row key="no-order">
          <Table.Cell collapsing textAlign="center" colSpan="6">
            No order
          </Table.Cell>
        </Table.Row>
      );
    } else {
      return orders.map((order) => (
        <React.Fragment key={order.id}>
          <Table.Row>
            <Table.Cell collapsing>
              <Button icon onClick={() => toggleOrderDetails(order.id)}>
                <Icon name={expandedOrders[order.id] ? 'minus' : 'plus'} />
              </Button>
            </Table.Cell>
            <Table.Cell>{order.reference}</Table.Cell>
            <Table.Cell>{formatDate(order.deliveryDate)}</Table.Cell>
            <Table.Cell>{order.supplier?.name}</Table.Cell>
            <Table.Cell>{formatCreatedAt(order.createdAt)}</Table.Cell>
            <Table.Cell>
              {!order.valid ? (
                <Button icon onClick={() => openForm(order)}>
                  <Icon name="edit" color="black" />
                </Button>
              ) : (
                <span style={{ backgroundColor: 'lightgreen', padding: '0.2em 0.5em', borderRadius: '5px' }}>Validated</span>
              )}
            </Table.Cell>
          </Table.Row>
          {expandedOrders[order.id] && (
            <Table.Row>
              <Table.Cell colSpan="6">
                <Table compact striped celled style={{ backgroundColor: '#EEEEEE' }} >
                  <Table.Header >
                    <Table.Row >
                      <Table.HeaderCell style={{ backgroundColor: '#EEEEEE' }} >Article Name</Table.HeaderCell>
                      <Table.HeaderCell style={{ backgroundColor: '#EEEEEE' }}>Quantity</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {order.orderLines.map((line) => (
                      <Table.Row key={line.id}>
                        <Table.Cell style={{ backgroundColor: '#EEEEEE' }} >{line.articleName}</Table.Cell>
                        <Table.Cell  style={{ backgroundColor: '#EEEEEE' }}>{line.quantity}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </Table.Cell>
            </Table.Row>
          )}
        </React.Fragment>
      ));
    }
  };


  const toggleGroupCollapse = (deliveryDate) => {
    
    setCollapsedGroups((prevCollapsedGroups) => ({
      ...prevCollapsedGroups,
      [deliveryDate]: !prevCollapsedGroups[deliveryDate], // Toggle collapse state
    }));
    console.log(collapsedGroups)
  };

  

  return (
    <>
      <Grid stackable divided>
        <Grid.Row columns="2">
          <Grid.Column>
            <OrderForm
              orderNote={orderNote}
              setOrderNote={setOrderNote}
              orderId={orderId}
              setOrderId={setOrderId}
              orderReference={orderReference}
              orderDeliveryDate={orderDeliveryDate}
              setOrderDeliveryDate={setOrderDeliveryDate}
              orderSupplierId={orderSupplierId}
              handleInputChange={handleInputChange}
              handleSearchOrder={handleSearchOrder}
              handleCreateOrder={handleCreateOrder}
              handleEditOrder={handleEditOrder}
              suppliers={suppliers}
              visible={visible}
              setVisible={setVisible}
              selectedArticles={selectedArticles}
              setSelectedArticles={setSelectedArticles}
              isEdit={isEdit}
              selectedOrder={selectedOrder}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Grid stackable divided>
        <Grid.Row columns="2">
          <Grid.Column>
            <Button icon onClick={() => openForm(null)} style={{ marginBottom: '3em' }}>
              <Icon name="add" color="black" /> Add Order
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      {sortedDates.map((deliveryDate) => (
        <div key={deliveryDate} >
          <Header as="h3" onClick={() => toggleGroupCollapse(deliveryDate)} style={{ cursor: 'pointer', marginBottom: '0.1em' }}>
            {deliveryDate} <Icon name={collapsedGroups[deliveryDate] ? 'angle right' : 'angle down'} />
          </Header>
          
          {!collapsedGroups[deliveryDate] && (
            Object.keys(groupedOrders[deliveryDate]).map((supplierName) => (
              
              <div key={supplierName} style={{ marginLeft: '2em', padding: '1em'}}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Header as="h4" onClick={() => toggleGroupCollapse(`${deliveryDate}-${supplierName}`)} style={{ cursor: 'pointer', flex: '1' }}>
                    <div style={{marginBottom:'6px'}}>
                     {isAllValid(groupedOrders[deliveryDate][supplierName]) && (
                    <Button onClick={() => handlePrintBonCommande(groupedOrders[deliveryDate][supplierName])} icon >
                      <Icon name="file pdf" color="red" /> Bon Commande
                    </Button>
                  )}
                  </div>
                  <div>
                    {supplierName} <Icon name={collapsedGroups[`${deliveryDate}-${supplierName}`] ? 'angle right' : 'angle down'} />
                    </div>
                  </Header>
                 
                </div>
                {!collapsedGroups[`${deliveryDate}-${supplierName}`] && (
                  <>
                    <Table compact striped celled>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell></Table.HeaderCell>
                          <Table.HeaderCell>Reference</Table.HeaderCell>
                          <Table.HeaderCell>Delivery Date</Table.HeaderCell>
                          <Table.HeaderCell>Supplier</Table.HeaderCell>
                          <Table.HeaderCell>Created At</Table.HeaderCell>
                          <Table.HeaderCell width={1}></Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>{renderOrders(groupedOrders[deliveryDate][supplierName])}</Table.Body>
                    </Table>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      ))}

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
    </>
  );
}

export default OrderTable;
