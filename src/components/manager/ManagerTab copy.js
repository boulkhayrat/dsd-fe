import React from 'react'
import { Tab } from 'semantic-ui-react'
import OrderTable from './OrderTable'
import ArticleTable from './ArticleTable'
import SupplierTable from './SupplierTable'
import StoreTable from './StoreTable'

function ManagerTab(props) {
  const { handleInputChange, isEdit, setIsEdit } = props
  const { isUsersLoading, users, userUsernameSearch, handleDeleteUser, handleSearchUser } = props
  const { editOrder,isOrdersLoading, orders, orderDescription, orderReference, orderStatus, orderDate, orderTextSearch,handleValidation, handlePrintBonCommande, handleCreateOrder, handleEditOrder, handleDeleteOrder, handleSearchOrder,handleUpdateOrder,handleEditOrderLine,handleDeleteOrderLine, handleGetOrders} = props
  const { editArticle,isArticlesLoading, articles, articlesSap, articleCode, articleName, articleUnitOfMeasure, articleSupplierId, articleTextSearch, handleCreateArticle, handleEditArticle, handleDeleteArticle, handleSearchArticle,handleUpdateArticle } = props
  const { editSupplier,isSuppliersLoading, suppliers, vendorsSap, supplierCode, supplierName, supplierAddress, supplierFiscalIds, supplierTextSearch, handleCreateSupplier, handleEditSupplier, handleDeleteSupplier, handleSearchSupplier,handleUpdateSupplier } = props
  const { editStore,isStoresLoading, stores, storesSap, storeCode, storeName, storeAddress, storeCity, storeTextSearch, handleCreateStore, handleEditStore, handleDeleteStore, handleSearchStore,handleUpdateStore } = props
  const panes = [
    {
      menuItem: { key: 'orders', icon: 'laptop', content: 'Orders' },
      render: () => (
        <Tab.Pane loading={isOrdersLoading}>
          <OrderTable
            orders={orders}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            editOrder={editOrder}
            orderDescription={orderDescription}
            orderReference={orderReference}
            orderStatus={orderStatus}
            orderDate={orderDate}
            orderTextSearch={orderTextSearch}
            handleInputChange={handleInputChange}
            handleGetOrders={handleGetOrders}
            handleCreateOrder={handleCreateOrder}
            handleEditOrder={handleEditOrder}
            handleUpdateOrder={handleUpdateOrder}
            handleValidation={handleValidation}
            handlePrintBonCommande={handlePrintBonCommande}
            handleDeleteOrder={handleDeleteOrder}
            handleSearchOrder={handleSearchOrder}
            handleEditOrderLine={handleEditOrderLine}
            handleDeleteOrderLine={handleDeleteOrderLine}
          />
        </Tab.Pane>
      )
    },
    {
      menuItem: { key: 'articles', icon: 'shopping basket', content: 'Articles' },
      render: () => (
        <Tab.Pane loading={isArticlesLoading}>
          <ArticleTable
            suppliers={suppliers}
            articles={articles}
            articlesSap={articlesSap}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            editArticle={editArticle}
            articleName={articleName}
            articleUnitOfMeasure={articleUnitOfMeasure}
            articleCode={articleCode}
            articleSupplierId={articleSupplierId}
            articleTextSearch={articleTextSearch}
            handleInputChange={handleInputChange}
            handleCreateArticle={handleCreateArticle}
            handleEditArticle={handleEditArticle}
            handleUpdateArticle={handleUpdateArticle}
            handleDeleteArticle={handleDeleteArticle}
            handleSearchArticle={handleSearchArticle}
          />
        </Tab.Pane>
      )
    },
    {
      menuItem: { key: 'vendors', icon: 'user outline', content: 'Vendors' },
      render: () => (
        <Tab.Pane loading={isSuppliersLoading}>
          <SupplierTable
            suppliers={suppliers}
            vendorsSap={vendorsSap}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            editSupplier={editSupplier}
            supplierCode={supplierCode}
            supplierName={supplierName}
            supplierAddress={supplierAddress}
            supplierFiscalIds={supplierFiscalIds}
            supplierTextSearch={supplierTextSearch}
            handleInputChange={handleInputChange}
            handleCreateSupplier={handleCreateSupplier}
            handleEditSupplier={handleEditSupplier}
            handleUpdateSupplier={handleUpdateSupplier}
            handleDeleteSupplier={handleDeleteSupplier}
            handleSearchSupplier={handleSearchSupplier}
          />
        </Tab.Pane>
      )
    },
    {
      menuItem: { key: 'stores', icon: 'shop', content: 'Stores' },
      render: () => (
        <Tab.Pane loading={isStoresLoading}>
          <StoreTable
            stores={stores}
            storesSap={storesSap}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            editStore={editStore}
            storeCode={storeCode}
            storeName={storeName}
            storeAddress={storeAddress}
            storeCity={storeCity}
            storeTextSearch={storeTextSearch}
            handleInputChange={handleInputChange}
            handleCreateStore={handleCreateStore}
            handleEditStore={handleEditStore}
            handleUpdateStore={handleUpdateStore}
            handleDeleteStore={handleDeleteStore}
            handleSearchStore={handleSearchStore}
          />
        </Tab.Pane>
      )
    }
  ]

  return (
    <Tab menu={{ attached: 'top' }} panes={panes} />
  )
}

export default ManagerTab