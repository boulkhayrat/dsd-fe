import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import OrderFormDetail from '../misc/OrderFormDetail';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function OrderTable({ 
  orders, 
  orderDescription, 
  orderReference, 
  orderTextSearch,
  orderStatus, 
  orderDate, 
  orderDeliveryDate, 
  orderValidationDate, 
  orderIsValidated = false,
  handleInputChange, 
  handleCreateOrder, 
  handleSearchOrder, 
  handleEditOrder,
  handleGetOrders,
  handleEditOrderLine,
  handleDeleteOrder,
  handleDeleteOrderLine, 
  handleUpdateOrder, 
  handleValidation,
  handlePrintBonCommande,
  isEdit, 
  setIsEdit,
  editOrder 
}) {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState(null);
  const [selectedSupplierOrders, setSelectedSupplierOrders] = useState([]);

  const openForm = (order) => {
    setVisible(true);
    setIsEditing(!!order);
    if (order) {
      handleEditOrder(order);
    }
  }

  const openOrderDetail = (supplierOrders) => {
    setSelectedSupplierOrders(supplierOrders);
    setShowDetails(true);
  }

  const handleSearch = () => {
    handleSearchOrder(searchTerm);
  }

  const groupBySupplier = (orders) => {
    return orders.reduce((groups, order) => {
      const supplierName = order.supplier?.name;
      if (!groups[supplierName]) {
        groups[supplierName] = [];
      }
      groups[supplierName].push(order);
      console.log('group',groups[supplierName])
      return groups;
    }, {});
  };


  // useEffect(() => {
    
  //   const latestGroupedOrders = groupBySupplier(orders);
  //   console.log(latestGroupedOrders)
  //   setSelectedSupplierOrders(latestGroupedOrders);
  // }, [orders]);


  const groupedOrders = groupBySupplier(orders);
  const allOrdersValid = (supplierOrders) => {
    return supplierOrders.every(order => order.valid);
  };
  return (
    <div className="card">
      {/* <div className="p-inputgroup" style={{ display: "flex" }}>
        <InputText
          placeholder="Search..."
          value={orderTextSearch}
          onChange={(e) => handleInputChange(e, { name: 'orderTextSearch', value: e.target.value })}
        />
        <Button icon="pi pi-search" onClick={handleSearch} />
      </div>
      <Button label="Create Order" className="new-order-button" icon="pi pi-plus" onClick={() => openForm(null)} style={{ width: '5vw' }} /> */}
      <DataTable value={Object.keys(groupedOrders).map(supplierName => {
        const supplierOrders = groupedOrders[supplierName];
        
        const firstOrder = supplierOrders[0]; // Take the first order for basic data
        const orderCount = supplierOrders.length; // Count of orders
        const storeCount = new Set(supplierOrders.map(order => order.store)).size; // Count of unique stores
        const valid = allOrdersValid(supplierOrders);
        return {
          ...firstOrder,
          orderCount,
          storeCount,
          valid
        };
      })} paginator rows={10} dataKey="id">
        <Column body={(rowData) => (
        <Button
        icon="pi pi-chevron-circle-right"
        // label="View Orders"
        className="p-button-text p-button-rounded p-button-success"
        onClick={() => openOrderDetail(groupedOrders[rowData.supplier?.name])}
      />
      
        )} />
        <Column field="supplier.code" header="Supplier Code" style={{ minWidth: '12rem' }} body={rowData => rowData.supplier?.code} />
        <Column field="supplier.name" header="Supplier Name" style={{ minWidth: '12rem' }} body={rowData => rowData.supplier?.name} />
        <Column field="orderCount" header="Order Count" style={{ minWidth: '12rem' }} body={rowData => rowData.orderCount} />
        <Column field="storeCount" header="Store Count" style={{ minWidth: '12rem' }} body={rowData => rowData.storeCount} />
        <Column field="valid" header="Validated" style={{ minWidth: '8rem' }} body={rowData => (
          rowData.valid ? 
          <span style={{ backgroundColor: 'lightgreen', padding: '0.2em 0.5em', borderRadius: '5px' }}>Validated</span> :
          'Not Validated'
        )} />
        {/* <Column field="validationDate" header="Validation Date" style={{ minWidth: '12rem' }} /> */}
      </DataTable>

      {showDetails && (
        <OrderFormDetail
          handlePrintBonCommande={handlePrintBonCommande}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          supplierOrders={selectedSupplierOrders}
          showDetails={showDetails}
          setShowDetails={setShowDetails}
          handleEditOrder={handleUpdateOrder}
          handleEditOrderLine={handleEditOrderLine}
          handleDeleteOrder={handleDeleteOrder}
          handleDeleteOrderLine={handleDeleteOrderLine}
          handleValidation={handleValidation}
          
        />
      )}
    </div>
  );
}

export default OrderTable;
