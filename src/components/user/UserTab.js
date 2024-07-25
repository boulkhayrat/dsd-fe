import React from 'react'
import { Tab } from 'semantic-ui-react'
import OrderTable from './OrderTable'


function UserTab(props) {
  const { handleInputChange, isEdit, setIsEdit } = props
 
  const { suppliers,isLoading, orders,orderId, orderNote, orderReference, setOrderNote, setOrderId, orderDeliveryDate, handleCreateOrder, handlePrintBonCommande, handleEditOrder, setOrderDeliveryDate, orderSupplierId,selectedArticles,handleGetSuppliers,setSelectedArticles } = props
  
  const panes = [
    
    {
      menuItem: { key: 'orders', icon: 'laptop', content: 'Orders' },
      render: () => (
        <Tab.Pane loading={isLoading}>
          <OrderTable
           orders={orders}
           suppliers={suppliers}
           isLoading={isLoading}
           orderNote={orderNote}
           setOrderNote={setOrderNote}
           orderId={orderId}
           setOrderId={setOrderId}
           orderReference={orderReference}
           orderDeliveryDate={orderDeliveryDate}
           setOrderDeliveryDate={setOrderDeliveryDate}
           orderSupplierId={orderSupplierId}
           selectedArticles={selectedArticles}
           handleCreateOrder={handleCreateOrder}
           handleEditOrder={handleEditOrder} 
           handleInputChange={handleInputChange}
           handleGetSuppliers={handleGetSuppliers}
           setSelectedArticles={setSelectedArticles} 
           handlePrintBonCommande={handlePrintBonCommande}
            
          />
        </Tab.Pane>
      )
    },
  

 
  ]

  return (
    <Tab menu={{ attached: 'top' }} panes={panes} />
  )
}

export default UserTab