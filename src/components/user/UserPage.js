import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import OrderTable from './OrderTable';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../misc/OrderApi';
import { supplierApi } from '../misc/SupplierApi';
import { handleLogError } from '../misc/Helpers';
import { orderLineApi } from '../misc/OrderLineApi';
import Swal from 'sweetalert2';
import UserTab from './UserTab';
import { uploadApi } from '../misc/UploadPdfApi'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
function UserPage() {
  const Auth = useAuth();
  const user = Auth.getUser();
  const isUser = user.data.rol[0] === 'STORE';

  const [userMe, setUserMe] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [orderNote, setOrderNote] = useState('');
  const [orderId, setOrderId] = useState('');
  const [orderReference, setOrderReference] = useState('');
  const [orderSupplierId, setOrderSupplierId] = useState('');
  const [orderDeliveryDate, setOrderDeliveryDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toISOString().split('T')[0]; // format as YYYY-MM-DD
  });
  const [selectedArticles, setSelectedArticles] = useState([]); // State to hold selected articles

  async function fetchData() {
    setIsLoading(true);

    try {
      const response = await orderApi.getUserMe(user);
      setUserMe(response.data);
      console.log(userMe)
    } catch (error) {
      handleLogError(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    handleGetSuppliers();
  }, []);

  const handleInputChange = (e, { name, value }) => {
    if (name === 'orderNote') {
      setOrderNote(value);
    } else if (name === 'orderReference') {
      setOrderReference(value);
    } else if (name === 'orderDeliveryDate') {
      setOrderDeliveryDate(value);
    } else if (name === 'orderSupplierId') {
      setOrderSupplierId(value);
    } 
  };

  const handleGetSuppliers = async () => {
    try {
      const response = await supplierApi.getSuppliers(user);
      setSuppliers(response.data);
    } catch (error) {
      handleLogError(error);
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
          orderLine.articleName,
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
        title: 'Bon de Commande Uploaded  Successfully',
        timer: 1500,
        showConfirmButton: false,
      });
      openBonCommande(response.data.fileUrl); 
     } catch (error) {
      handleLogError(error)
      Swal.fire('Error', 'Failed to upload Bon de Commande', 'error')
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

  const handleEditOrder = async (orderData) => {
    console.log(orderData);
    let note = orderNote?.trim();
    let reference = orderData.orderReference;
    let deliveryDate = orderData.orderDeliveryDate;
    let supplier_id = orderData.selectedSupplier?.id;
  
    if (!deliveryDate) {
      Swal.fire({
        icon: 'error',
        title: 'Delivery Date Required',
        text: 'Please select a delivery date.',
      });
      return;
    }
  
    const order = { note, deliveryDate, supplier_id, reference };
  
    try {
      // Update the order
      await orderApi.editOrder(user, orderData.orderId, order);
  
      // Existing order lines from the server
      const existingOrderLines = orderData.orderDetails;
      console.log('existingOrderLines',existingOrderLines);
      console.log(orderData);
   
      
      const updatedOrderLines = [];
   
  
      // Find updated order lines
      for (const article of orderData.selectedArticles) {
        const existingOrderLine = existingOrderLines.find(line => line.articleId === article.id);
        console.log('existingOrderLine',existingOrderLine)
        
        if (existingOrderLine) {
          if (existingOrderLine.quantity !== article.quantity) {
            updatedOrderLines.push({
              ...existingOrderLine,
              article_id: existingOrderLine.articleId,
              order_id: existingOrderLine.orderId,
              quantity: article.quantity,
            });
          }
        } 
      }
  
      console.log('updatedOrderLines',updatedOrderLines);
  
      for (const orderLine of updatedOrderLines) {
        await orderLineApi.editOrderLine(user, orderLine.id, orderLine);
      }
  
     
  
      // Refresh user data
      await fetchUserMeData();
  
      Swal.fire({
        icon: 'success',
        title: 'Order Updated Successfully',
        timer: 1500,
        showConfirmButton: false,
      });
  
    } catch (error) {
      handleLogError(error);
      Swal.fire({
        icon: 'error',
        title: 'Order Update Failed',
        text: error.message,
      });
    }
  };
  
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

  if (!isUser) {
    return <Navigate to="/" />;
  }

  return (
    <Container className="container-ui">
      <UserTab
        orders={userMe && userMe.orders}
        handlePrintBonCommande={handlePrintBonCommande}
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
        handleEditOrder={handleEditOrder} // Pass down the handleEditOrder function
        handleInputChange={handleInputChange}
        handleGetSuppliers={handleGetSuppliers}
        setSelectedArticles={setSelectedArticles} // Pass down function to update selected articles
      />
    </Container>
  );
}

export default UserPage;
