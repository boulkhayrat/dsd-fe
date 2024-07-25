import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import { useAuth } from '../context/AuthContext'
import ManagerTab from './ManagerTab'
import { orderApi } from '../misc/OrderApi'
import { articleApi } from '../misc/ArticleApi'
import { supplierApi } from '../misc/SupplierApi'
import { handleLogError } from '../misc/Helpers'
import { articleSapApi } from '../misc/ArticleSapApi'
import { vendorSapApi } from '../misc/VendorSapApi'
import { orderLineApi } from '../misc/OrderLineApi'
import { storeSapApi } from '../misc/StoreSapApi'
import { uploadApi } from '../misc/UploadPdfApi'
import { storeApi } from '../misc/StoreApi'
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // for table generation

function ManagerPage() {
  const Auth = useAuth()
  const user = Auth.getUser()
  
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [articles, setArticles] = useState([])
  const [articlesSap, setArticlesSap] = useState([])
  const [vendorsSap, setVendorsSap] = useState([])
  const [storesSap, setStoresSap ] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [articleCode, setArticleCode] = useState('')
  const [articleSupplierId, setArticleSupplierId] = useState('')
  const [orderLineArticleId, setOrderLineArticleId] = useState('')
  const [articleName, setArticleName] = useState('')
  const [articleUnitOfMeasure, setArticleUnitOfMeasure] = useState('')
  const [supplierCode, setSupplierCode] = useState('')
  const [supplierName, setSupplierName] = useState('')
  const [supplierAddress, setSupplierAddress ] = useState('')
  const [supplierFiscalIds, setSupplierFiscalIds ] = useState('')
  const [orderNote, setOrderNote] = useState('')
  const [orderReference, setOrderReference] = useState('')
  const [orderStatus, setOrderStatus] = useState('')
  const [orderDate, setOrderDate] = useState('')
  const [storeCode, setStoreCode] = useState('')
  const [storeName, setStoreName] = useState('')
  const [storeAddress, setStoreAddress] = useState('')
  const [storeCity, setStoreCity] = useState('')
  const [orderValidated, setOrderValidated] = useState(false)
  const [orderDeliveryDate, setOrderDeliveryDate] = useState('')
  const [orderValidationDate, setOrderValidationDate] = useState('')
  const [orderTextSearch, setOrderTextSearch] = useState('')
  const [userUsernameSearch, setUserUsernameSearch] = useState('')
  const [isManager, setIsManager] = useState(true)
  const [isUsersLoading, setIsUsersLoading] = useState(false)
  const [isStoresLoading, setIsStoresLoading] = useState(false)
  const [isOrdersLoading, setIsOrdersLoading] = useState(false)
  const [isArticlesLoading, setIsArticlesLoading] = useState(false)
  const [isSuppliersLoading, setIsSuppliersLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editOrder, setEditOrder] = useState(null)
  const [editArticle, setEditArticle] = useState(null)
  const [editSupplier, setEditSupplier] = useState(null) 
  const [editStore, setEditStore] = useState(null)
  const [stores, setStores] = useState(null)

  useEffect(() => {
    setIsManager(user.data.rol[0] === 'MANAGER')
    handleGetUsers()
    handleGetOrders()
    handleGetArticles()
    handleGetSuppliers()
    handleGetStores()
    handleGetArticlesSap()
    handleGetVendorsSap()
    handleGetStoresSap()
  }, [])

  const handleInputChange = (e, { name, value }) => {
    console.log('name et value :',name,value)
    if (name === 'userUsernameSearch') {
      setUserUsernameSearch(value)
    } else if (name === 'orderNote') {
      setOrderNote(value)
    } else if (name === 'orderTextSearch') {
      setOrderTextSearch(value)
    } else if (name === 'orderReference') {
      setOrderReference(value)
    } else if (name === 'orderStatus'){
      setOrderStatus(value)
    } else if (name === 'orderDate'){
      setOrderDate(value)
    } else if (name ===  'articleCode'){
      setArticleCode(value)
    } else if (name ===  'articleName'){
      setArticleName(value)
    } else if (name ===  'articleUnitOfMeasure'){
      setArticleUnitOfMeasure(value)
    } else if (name ===  'supplierCode'){
      setSupplierCode(value)
    } else if (name ===  'supplierName'){
      setSupplierName(value)
    } else if (name ===  'supplier_id'){
      setArticleSupplierId(value)
    } else if (name ===  'supplierAddress'){
      setSupplierAddress(value)
    } else if (name ===  'supplierFiscalIds'){
      setSupplierFiscalIds(value)
    } else if (name === 'storeCode'){
      setStoreCode(value)
    } else if(name === 'storeName'){
      setStoreName(value)
    } else if (name === 'storeAddress'){
      setStoreAddress(value)
    } else if (name === 'storeCity'){
      setStoreCity(value)
    }

  }

  const handleGetUsers = async () => {
    setIsUsersLoading(true)
    try {
      const response = await orderApi.getUsers(user)
      setUsers(response.data)
    } catch (error) {
      handleLogError(error)
    } finally {
      setIsUsersLoading(false)
    }
  }

  const handleDeleteUser = async (username) => {
    try {
      await orderApi.deleteUser(user, username)
      handleGetUsers()
      Swal.fire('Success', 'User deleted successfully', 'success')
    } catch (error) {
      handleLogError(error)
      Swal.fire('Error', 'Failed to delete user', 'error')
    }
  }




  const handleSearchUser = async () => {
    const username = userUsernameSearch
    try {
      const response = await orderApi.getUsers(user, username)
      const data = response.data
      const users = data instanceof Array ? data : [data]
      setUsers(users)
    } catch (error) {
      handleLogError(error)
      setUsers([])
    }
  }

  const handleGetOrders = async () => {
    console.log("fetching orders")
    
    setIsOrdersLoading(true)
    try {
      const response = await orderApi.getOrders(user)
      console.log('response of orders: ',response)
      setOrders(response.data)
    } catch (error) {
      handleLogError(error)
    } finally {
      setIsOrdersLoading(false)
    }
  }

  
  const handleGetArticles = async () => {
    setIsArticlesLoading(true)
    try {
      const response = await articleApi.getArticles(user)
      console.log('response of articles: ',response)
      setArticles(response.data)
    } catch (error) {
      handleLogError(error)
    } finally {
      setIsArticlesLoading(false)
    }
  }

  const handleGetArticlesSap = async () => {
   
    try {
      const response = await articleSapApi.getArticlesSap(user)
      console.log('response of articles from Sap: ',response)
      setArticlesSap(response.data)
    } catch (error) {
      handleLogError(error)
    } 
  }

  const handleGetVendorsSap = async () => {
   
    try {
      const response = await vendorSapApi.getVendorsSap(user)
      console.log('response of vendors from Sap: ',response)
      setVendorsSap(response.data)
    } catch (error) {
      handleLogError(error)
    } 
  }
  const handleGetStoresSap = async () => {
   
    try {
      const response = await storeSapApi.getStoresSap(user)
      console.log('response of stores from Sap: ',response)
      setStoresSap(response.data)
    } catch (error) {
      handleLogError(error)
    } 
  }
  const handleGetSuppliers = async () => {
    setIsSuppliersLoading(true)
    try {
      const response = await supplierApi.getSuppliers(user)
      console.log('response of suppliers: ',response)
      setSuppliers(response.data)
    } catch (error) {
      handleLogError(error)
    } finally {
      setIsSuppliersLoading(false)
    }
  }

  const handleGetStores = async () => {
    setIsStoresLoading(true)
    try {
      const response = await storeApi.getStores(user)
      console.log('response of stores: ',response)
      setStores(response.data)
    } catch (error) {
      handleLogError(error)
    } finally {
      setIsSuppliersLoading(false)
    }
  }


  // const handleDeleteOrder = async (order) => {
  //   try {
  //     await orderApi.deleteOrder(user, order.id)
  //     handleGetOrders()
  //     Swal.fire({
  //       icon: 'success',
  //       title: 'Order Deleted Successfully',
  //       timer: 1500,
  //       showConfirmButton: false,
  //     });
  //   } catch (error) {
  //     handleLogError(error)
  //     Swal.fire('Error', 'Failed to delete order', 'error')
  //   }
  // }
  
  const handleDeleteArticle = async (id) => {
    try {
      await articleApi.deleteArticle(user, id)
      handleGetArticles()
      Swal.fire({
        icon: 'success',
        title: 'Article Deleted Successfully',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      handleLogError(error)
      Swal.fire('Error', 'Failed to delete article', 'error')
    }
  }
  
  const handleDeleteSupplier = async (id) => {
    try {
      await supplierApi.deleteSupplier(user, id)
      handleGetSuppliers()
      Swal.fire({
        icon: 'success',
        title: 'Supplier Deleted Successfully',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      handleLogError(error)
      Swal.fire('Error', 'Failed to delete supplier', 'error')
    }
  }
  
  const handleDeleteStore = async (id) => {
    try {
      await storeApi.deleteStore(user, id)
      handleGetStores()
      Swal.fire({
        icon: 'success',
        title: 'Store Deleted Successfully',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      handleLogError(error)
      Swal.fire('Error', 'Failed to delete store', 'error')
    }
  }

  const [userMe, setUserMe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const fetchUserMeData = async () => {
    setIsLoading(true);

    try {
      const response = await orderApi.getUserMe(user);
      setUserMe(response.data);
    } catch (error) {
      handleLogError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrder = async (orderData) => {
    console.log(orderData);
    let note = orderNote.trim();
    let deliveryDate = orderData.orderDeliveryDate;
    let supplier_id = orderData.selectedSupplier?.id;
    console.log(supplier_id);
    console.log(deliveryDate);
    console.log(note);

    if (!deliveryDate) {
      Swal.fire({
        icon: 'error',
        title: 'Delivery Date Required',
        text: 'Please select a delivery date.',
      });
      return;
    }

    const order = { note, deliveryDate, supplier_id };

    try {
      // Create the order and get the response to capture the order ID
      const response = await orderApi.createOrder(user, order);
      const orderId = response.data.id; // Assuming the response contains the order ID in data.id

      console.log('response', response);
      console.log('selected Articles', orderData.selectedArticles);

      // Loop through selected articles to create order lines
      for (const article of orderData.selectedArticles) {
        const orderLine = {
          order_id: orderId,
          article_id: article.id,
          quantity: article.quantity,
        };
        console.log("orderLine", orderLine);
        await orderLineApi.createOrderLine(user, orderLine);
      }

      // Refresh user data and clear inputs
      await fetchUserMeData();
      setOrderNote('');
      setOrderReference('');
      setSelectedArticles([]); // Clear selected articles after order creation

      Swal.fire({
        icon: 'success',
        title: 'Order Created Successfully',
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (error) {
      handleLogError(error);
      Swal.fire({
        icon: 'error',
        title: 'Order Creation Failed',
        text: error.message,
      });
    }
  };


  const handleCreateArticle = async () => {
    console.log('article code', articleCode)
    let code = articleCode
    let supplier_id = articleSupplierId
    let name = articleName.trim()
    let unitOfMeasure = articleUnitOfMeasure.trim()
  
    if (!code || !name || !unitOfMeasure) {
      return
    }
  
    const article = { code, name, unitOfMeasure, supplier_id }
    console.log('article', article)
    try {
      await articleApi.createArticle(user, article)
      handleGetArticles()
      setArticleCode('')
      setArticleName('')
      setArticleUnitOfMeasure('')
      setArticleSupplierId('')
      Swal.fire({
        icon: 'success',
        title: 'Article Created Successfully',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      handleLogError(error)
      Swal.fire('Error', 'Failed to create article', 'error')
    }
  }
  
  const handleCreateSupplier = async () => {
    let code = supplierCode
    let name = supplierName.trim()
    let address = supplierAddress.trim()
    let fiscalIds = supplierFiscalIds
  
    if (!code || !name || !address) {
      return
    }
  
    const supplier = { code, name, address, fiscalIds }
    try {
      await supplierApi.createSupplier(user, supplier)
      handleGetSuppliers()
      setSupplierCode('')
      setSupplierName('')
      setSupplierAddress('')
      setSupplierFiscalIds('')
      Swal.fire({
        icon: 'success',
        title: 'Supplier Created Successfully',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      handleLogError(error)
      Swal.fire('Error', 'Failed to create supplier', 'error')
    }
  }

  const handleCreateStore = async () => {
    let code = storeCode
    let name = storeName.trim()
    let address = storeAddress.trim()
    let city = storeCity.trim()
  
    if (!code || !name || !city) {
      return
    }
  
    const store = { code, name, address, city }
    try {
      await storeApi.createStore(user, store)
      handleGetStores()
      setStoreCode('')
      setStoreName('')
      setStoreAddress('')
      setStoreCity('')
      Swal.fire({
        icon: 'success',
        title: 'Store Created Successfully',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      handleLogError(error)
      Swal.fire('Error', 'Failed to create store', 'error')
    }
  }
  
  const handleEditSupplier = (supplier) => {
    console.log(isEdit)
    setIsEdit(true)
    console.log(isEdit)
    setEditSupplier(supplier)
    setSupplierCode(supplier.code)
    setSupplierName(supplier.name)
    setSupplierAddress(supplier.address)
    setSupplierFiscalIds(supplier.fiscalIds)
  }
  
  const handleUpdateSupplier = async () => {
    let code = supplierCode
    let name = supplierName.trim()
    let address = supplierAddress.trim()
    let fiscalIds = supplierFiscalIds
  
    if (!code || !name || !address || !fiscalIds) {
      return
    }
  
    const updatedSupplierData = { code, name, address, fiscalIds }
  
    console.log("updatedSupplierData : ", updatedSupplierData)
    try {
      await supplierApi.editSupplier(user, editSupplier.id, updatedSupplierData)
      handleGetSuppliers()
      setSupplierCode('')
      setSupplierName('')
      setSupplierAddress('')
      setSupplierFiscalIds('')
      setIsEdit(false)
      setEditSupplier(null)
      Swal.fire({
        icon: 'success',
        title: 'Supplier Updated Successfully',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      handleLogError(error)
      Swal.fire('Error', 'Failed to update supplier', 'error')
    }
  }

  const handleEditStore = (store) => {
    console.log(isEdit)
    setIsEdit(true)
    console.log(isEdit)
    setEditStore(store)
    setStoreCode(store.code)
    setStoreName(store.name)
    setStoreAddress(store.address)
    setStoreCity(store.city)
  }
  
  const handleUpdateStore = async () => {
    let code = storeCode
    let name = storeName.trim()
    let address = storeAddress.trim()
    let city = storeCity.trim()
  
    if (!code || !name || !address || !city) {
      return
    }
  
    const updatedStoreData = { code, name, address, city }
  
    console.log("updatedStoreData : ", updatedStoreData)
    try {
      await storeApi.editStore(user, editStore.id, updatedStoreData)
      handleGetStores()
      setStoreCode('')
      setStoreName('')
      setStoreAddress('')
      setStoreCity('')
      setIsEdit(false)
      setEditStore(null)
      Swal.fire({
        icon: 'success',
        title: 'Store Updated Successfully',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      handleLogError(error)
      Swal.fire('Error', 'Failed to update store', 'error')
    }
  }
  
  

  // const handleEditOrder = (order) => {
  //   console.log(order)
  //   setIsEdit(true)
  //   console.log(isEdit)
  //   setEditOrder(order)
  //   setOrderNote(order.note)
  //   setOrderReference(order.reference)
  //   setOrderStatus(order.statut)
  //   setOrderDate(order.date)
  // }

  const handleEditOrderLine = async (orderLines) => {
    console.log(orderLines)
    for (const orderLine of orderLines) {
      let article_id = orderLine.articleId
      let order_id = orderLine.orderId
      let quantity = orderLine.quantity

      if (!quantity){
        return
      }

      const updatedOrderLineData = {article_id,order_id,quantity}
      console.log(updatedOrderLineData)
      try {
        const response = await orderLineApi.editOrderLine(user, orderLine.id, updatedOrderLineData);
        handleGetOrders()
        // Handle successful response if needed
        console.log(`Order line ${orderLine.id} updated successfully`);
  
        Swal.fire({
          title: 'Success!',
          text: `Order line ${orderLine.id} updated successfully.`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } catch (error) {
       
        console.error(`Failed to update order line ${orderLine.id}`, error);
  
        Swal.fire({
          title: 'Error!',
          text: `Failed to update order line ${orderLine.id}: ${error.message}`,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };
  
  const handleDeleteOrderLine = async (orderLine) => {
    console.log(orderLine)
    
    try {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
       orderLineApi.deleteOrderLine(user, orderLine.id)
      handleGetOrders()
      Swal.fire({
        icon: 'success',
        title: 'OrderLine Deleted Successfully',
        timer: 1500,
        showConfirmButton: false,
      });
    }
    });} catch (error) {
      handleLogError(error)
      Swal.fire('Error', 'Failed to delete orderLine', 'error')
    }
    
    
  }

  const handleDeleteOrder = async (order) => {
    console.log(order)
    
    try {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
       orderApi.deleteOrder(user, order.id)
      handleGetOrders()
      Swal.fire({
        icon: 'success',
        title: 'Order Deleted Successfully',
        timer: 1500,
        showConfirmButton: false,
      });
    }
    });} catch (error) {
      handleLogError(error)
      Swal.fire('Error', 'Failed to delete order', 'error')
    }
    
    
  }

  const handleUpdateOrder = async (order) => {
    console.log(order)
    let note = order.note.trim()
    let reference = order.reference.trim()
    let supplier_id = order.supplier?.id
    let valid = order.valid
    let deliveryDate = order.deliveryDate
    let validationDate = order.validationDate || null
  
    if (!reference || !deliveryDate || !supplier_id) {
      return
    }
  
    const updatedOrderData = { note, reference, deliveryDate, supplier_id, valid, validationDate }
  
    console.log("updatedOrderData : ", updatedOrderData)
    try {
      await orderApi.editOrder(user, order.id, updatedOrderData)
      handleGetOrders()
      setOrderNote('')
      setOrderReference('')
      setOrderStatus('')
      setIsEdit(false)
      console.log(isEdit)
      setEditOrder(null)
      Swal.fire({
        icon: 'success',
        title: 'Order Updated Successfully',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      handleLogError(error)
      Swal.fire('Error', 'Failed to update order', 'error')
    }
  }
  
  const handleEditArticle = (article) => {
   
    setIsEdit(true)
    console.log(isEdit)
   
    setEditArticle(article)
    console.log('edit Article',editArticle)
    setArticleCode(article.code)
    setArticleName(article.name)
    setArticleUnitOfMeasure(article.unitOfMeasure)
    setArticleSupplierId(article.supplier_id)
    
  }

  

  const handleUpdateArticle = async () => {
  let code = articleCode
  let supplier_id = articleSupplierId
  let name = articleName.trim()
  let unitOfMeasure = articleUnitOfMeasure.trim()

  if (!code || !name || !unitOfMeasure) {
    return
  }

  const updatedArticleData = { code, name, unitOfMeasure, supplier_id }

  console.log("updatedArticleData : ", updatedArticleData)
  try {
    await articleApi.editArticle(user, editArticle.id, updatedArticleData)
    handleGetArticles()
    setArticleCode('')
    setArticleName('')
    setArticleUnitOfMeasure('')
    setArticleSupplierId('')
    setIsEdit(false)
    setEditArticle(null)
    Swal.fire({
      icon: 'success',
      title: 'Article Updated Successfully',
      timer: 1500,
      showConfirmButton: false,
    });  } catch (error) {
    handleLogError(error)
    Swal.fire('Error', 'Failed to update article', 'error')
  }
}

const handleValidation = async (ordersToValidate) => {

  console.log(ordersToValidate)
  ordersToValidate?.forEach(order => {
    // Example validation logic
    if (!order.valid) {
      // Perform validation actions, e.g., mark as valid
      // Update order in the backend, etc.
      console.log(`Validating order with ID ${order.id}`);
      // Example of updating order status
      handleUpdateOrder({ ...order, valid: true, validationDate: new Date().toISOString() });
    }
  });
}

const handlePrintBonCommande = async (orders) => {
  console.log(orders)
  const doc = new jsPDF();

    // Header Section
    doc.setFontSize(10);
    doc.text('BON DE COMMANDE', 105, 20, null, null, 'center');

    // Draw Boxes for Sections
    doc.setLineWidth(0.2);
    doc.rect(10, 30, 100, 50); // Order Info Box
    doc.rect(110, 30, 90, 50); // Company Info Box
    doc.rect(110, 60, 90, 20); // Supplier Info Box

    // Company Info Section
    doc.setFontSize(9);
    doc.text('Nom Société: Kazyon Retail', 115, 35);
    doc.text('ICE: 003213841000068', 115, 40);
    doc.text('N°RC: 570411', 115, 45);
    
    

    // Order Info Section
    doc.text('Date de Commande: ', 15, 45);
    doc.text('N° de Commande:', 15, 50);
    doc.text('Adresse de Livraison:', 15, 55);
    doc.text('Date de Livraison:', 15, 60);
    doc.text('Adresse de Facturation:', 15,65);
    doc.text('N° Téléphone:', 15, 70);

    // Supplier Info Section
    doc.text('Nom du Fournisseur: ', 115, 65);
    doc.text('Code du Fournisseur: ', 115, 70);
    doc.text('Adresse:', 115, 75);
    

    doc.setFontSize(9);
    
   // Table Section
  // Example of dynamically populating data based on fetched orders
  const tableBody = [];
  orders.forEach(order => {
    console.log(order.orderLines)
    // Add order details
    //doc.text(`Order ID: ${order.id}`, 15, doc.previousAutoTable.finalY + 10);
    
    // Add order lines
    order.orderLines.forEach(orderLine => {
      tableBody.push([
        orderLine.articleCode,
        orderLine.articleName.slice(9),
        // orderLine.articleSupplierCode,
        // orderLine.articleEan,
        orderLine.quantity,
        // Add more fields as needed
      ]);
    });
  });
  // Table Section
  autoTable(doc, {
    startY: 90,
    head: [['Code Article Matériel', 'Description', 'Total Unité']],
    body: tableBody,
    styles: { fontSize: 7 },
  });
    // Terms and Conditions Section
    const termsAndConditions = `

      - Les heures de réception sont de 8h à 14 h tous les jours, sauf le Samedi, le Dimanche et les jours fériés.
      - Les commandes de produits seront exécutées conformément aux conditions mentionnées dans le contrat d'achat.
      - Une copie du bon de commande et du bon de livraison en 3 exemplaires sont remises au responsable de la réception des produits en entrepôt par le représentant du fournisseur.
      - La facture est déposée avec une copie du Bon de Reception et du Bon de Livraison cacheté par la Société. 
      - Le numéro du Bon de Commande doit être mentionné sur le bon de livraison et sur la facture.
      - Pour chaque commande, un bon de livraison séparé, et pour chaque bon de livraison, une facture séparée doit être émise. Le bon de livraison doit être émis en trois exemplaires.
      - La commande doit être livrée sur des palettes standard européennes (120 * 80 cm) et américaines (120 * 100 cm).
      - Le déchargement des commandes aura lieu dans l'entrepôt spécifié à la connaissance du représentant du fournisseur. 
      - Les matériaux endommagés ou non standard ne seront pas reçus par le magasin.
      - La date de production de la commande livrée doit être conforme à la dernière série de production.
      - Les matériaux qui ont dépassé plus d'un tiers (1/3) de leur période de validité ne seront pas reçus par le magasin, et la date de production des produits ne doit pas être antérieure à la date de production des produits reçus dans la dernière commande.
      - Le magasin ne recevra aucun produit sans code-barres, ou avec code-barres erroné, ou avec une modification de la résistance ou du poids du carton, ou tout autre élément non validé par la Direction Achat de KAZYON RETAIL.
      - La date du bon de livraison et de la facture doit correspondre à la même année de livraison de la commande afin d'éviter des erreurs de calcul en fin d'année.
    `;
    doc.setFontSize(7);
    const splitText = doc.splitTextToSize(termsAndConditions, 190);
    doc.text(splitText, 10, doc.previousAutoTable.finalY + 10);
  const pdfBlob = doc.output('blob');
  const pdfFile = new File([pdfBlob], "document.pdf", { type: "application/pdf" });

  // Upload the generated PDF
  try {
    const response = await uploadApi.uploadPDF(user, pdfFile);
    console.log('PDF uploaded successfully:', response);

    
    Swal.fire({
      icon: 'success',
      title: 'Article Updated Successfully',
      timer: 1500,
      showConfirmButton: false,
    });
    openBonCommande(response.data.fileUrl); 
   } catch (error) {
    handleLogError(error)
    Swal.fire('Error', 'Failed to update article', 'error')
  }

  
}

const openBonCommande = (fileUrl) => {
  // Open the PDF in a new tab
 window.open(fileUrl, '_blank');

  // OR embed the PDF in an iframe (comment out the above line and uncomment the lines below if you prefer this method)
  // const iframe = document.createElement('iframe');
  // iframe.src = fileUrl;
  // iframe.width = '100%';
  // iframe.height = '600px';
  // document.body.appendChild(iframe);
}


  const handleSearchOrder = async () => {
    const note = orderTextSearch.trim()
    const reference = orderTextSearch.trim()
    const status = orderTextSearch.trim()

  console.log(orderTextSearch.trim())
    try {
      const response = await orderApi.searchOrders(user, note, reference, status)
      setOrders(response.data)
    } catch (error) {
      handleLogError(error)
      setOrders([])
    }
  }

  if (!isManager) {
    return <Navigate to='/' />
  }

  return (
    <Container className="container-ui" >
      <ManagerTab
        isUsersLoading={isUsersLoading}
        users={users}
        userUsernameSearch={userUsernameSearch}
        handleDeleteUser={handleDeleteUser}
        handleSearchUser={handleSearchUser}
        isOrdersLoading={isOrdersLoading}
        orders={orders}
        articles={articles}
        articlesSap={articlesSap}
        articleCode={articleCode}
        articleName={articleName}
        articleUnitOfMeasure={articleUnitOfMeasure}
        vendorsSap={vendorsSap}
        stores={stores}
        storeCode={storeCode}
        storeName={storeName}
        storeAddress={storeAddress}
        storeCity={storeCity}
        storesSap={storesSap}
        suppliers={suppliers}
        supplierCode={supplierCode}
        supplierName={supplierName}
        supplierAddress={supplierAddress}
        supplierFiscalIds={supplierFiscalIds}
        articleSupplierId={articleSupplierId}
        orderNote={orderNote}
        orderReference={orderReference}
        orderStatus={orderStatus}
        orderDate={orderDate}
        orderLineArticleId={orderLineArticleId}
        orderTextSearch={orderTextSearch}
        handleCreateOrder={handleCreateOrder}
        handleCreateSupplier={handleCreateSupplier}
        handleCreateArticle={handleCreateArticle}
        handleDeleteArticle={handleDeleteArticle}
        handleEditArticle={handleEditArticle}
        handleValidation={handleValidation}
        handlePrintBonCommande={handlePrintBonCommande}
        // handleEditOrder={handleEditOrder}
        handleGetOrders={handleGetOrders}
        handleEditOrderLine={handleEditOrderLine}
        handleDeleteOrderLine={handleDeleteOrderLine}
        handleEditSupplier={handleEditSupplier}
        handleUpdateSupplier={handleUpdateSupplier}
        handleCreateStore={handleCreateStore}
        handleEditStore={handleEditStore}
        handleUpdateStore={handleUpdateStore}
        handleDeleteStore={handleDeleteStore}
        handleUpdateOrder={handleUpdateOrder}
        handleUpdateArticle={handleUpdateArticle}
        handleDeleteOrder={handleDeleteOrder}
        handleDeleteSupplier={handleDeleteSupplier}
        handleSearchOrder={handleSearchOrder}
        handleInputChange={handleInputChange}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        editOrder={editOrder}
        editArticle={editArticle}
      />
    </Container>
  )
}

export default ManagerPage
