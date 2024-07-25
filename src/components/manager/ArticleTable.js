import React, { useState } from 'react';
import { Button, Icon, Table, Grid, Pagination } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import ArticleForm from '../misc/ArticleForm';

function ArticleTable({
  articles,
  articlesSap,
  articleCode,
  articleName,
  articleSupplierId,
  articleUnitOfMeasure,
  articleTextSearch,
  handleInputChange,
  handleCreateArticle,
  handleDeleteArticle,
  handleSearchArticle,
  handleEditArticle,
  handleUpdateArticle,
  isEdit,
  setIsEdit,
  editArticle,
  suppliers // Assuming suppliers is passed as a prop
}) {
  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedArticleSap, setSelectedArticleSap] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const supplierOptions = suppliers.map(supplier => ({
    value: supplier.id,
    label: supplier.name
  }));



  const articleSapOptions = articlesSap.filter(article => article.vendorCode === selectedSupplier?.code).map(article => ({
    value: article.code,
    label: article.name.slice(9)
  }));

  const openForm = (article) => {
    setVisible(true);
    setIsEditing(!!article);

    if (article) {
      handleEditArticle(article);
      //setSelectedSupplier({ value: article.supplier?.id, label: article.supplier?.name });
    }
  };

  const handleSupplierChange = (selectedOption) => {
    const supplier = suppliers.find((supplier)=>supplier.id === selectedOption?.value)

    setSelectedSupplier(supplier);
    handleInputChange(null, { name: 'supplier_id', value: selectedOption ? selectedOption.value : '' });
  };
  const handleArticleSapChange = (selectedOption) => {
    console.log(selectedOption);
    const article = articlesSap.find((article)=>article.code === selectedOption?.value)
    console.log(article)
    setSelectedArticleSap(article);
    console.log(selectedArticleSap)
    handleInputChange(null, { name: 'articleCode', value: selectedOption ? article?.code : '' });
    handleInputChange(null, { name: 'articleName', value: selectedOption ? article?.name : '' });
    handleInputChange(null, { name: 'articleUnitOfMeasure', value: selectedOption ? article?.unitOfMeasure : '' });
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

  const confirmDeleteArticle = (articleId) => {
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
        handleDeleteArticle(articleId);
        Swal.fire(
          'Deleted!',
          'Your article has been deleted.',
          'success'
        );
      }
    });
  };

  console.log('editArticle in ArticleTable ', editArticle);
  console.log('articles from Sap : ',articlesSap)
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedArticles = articles.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (e, { activePage }) => {
    setCurrentPage(activePage);
  };

  let articleList;
  console.log('articles', articles);
  if (selectedArticles.length === 0) {
    articleList = (
      <Table.Row key='no-article'>
        <Table.Cell collapsing textAlign='center' colSpan='7'>No article</Table.Cell>
      </Table.Row>
    );
  } else {
    articleList = selectedArticles.map(article => (
      <Table.Row key={article.id}>
        <Table.Cell>{article.code}</Table.Cell>
        <Table.Cell>{article.name.slice(9)}</Table.Cell>
        <Table.Cell>{article.unitOfMeasure}</Table.Cell>
        <Table.Cell>{article.supplier?.name}</Table.Cell>
        <Table.Cell>{article.user.username}</Table.Cell>
        <Table.Cell>{formatCreatedAt(article.createdAt)}</Table.Cell>
        <Table.Cell collapsing>
        
           <Button icon onClick={() => openForm(article)}>
             <Icon name="edit" color="black" />
           </Button>
           <Button icon onClick={() => confirmDeleteArticle(article.id)}>
             <Icon name="trash"  color="black" />
           </Button>
         
        </Table.Cell>
      </Table.Row>
    ));
  }

  return (
    <>
      <Grid stackable divided>
        <Grid.Row columns='2'>
          <Grid.Column>
            {/* <Button icon labelPosition='left' primary onClick={() => openForm(null)}>
              <Icon name='add' /> Create Article
            </Button> */}
            <Button icon onClick={() => openForm(null)} style={{ marginTop: '1em' }}>
                <Icon name='add' color="black" /> Add Article
              </Button>
          </Grid.Column>
          {/* <Grid.Column width='5'>
            <Form onSubmit={handleSearchArticle}>
              <Input
                action={{ icon: 'search' }}
                name='articleTextSearch'
                placeholder='Search '
                value={articleTextSearch}
                onChange={handleInputChange}
              />
            </Form>
          </Grid.Column> */}
        </Grid.Row>
      </Grid>
      <Table compact striped celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Code</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Unit Of Measure</Table.HeaderCell>
            <Table.HeaderCell>Supplier</Table.HeaderCell>
            <Table.HeaderCell>User</Table.HeaderCell>
            <Table.HeaderCell>CreatedAt</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {articleList}
        </Table.Body>
      </Table>

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

      <ArticleForm
        articleSapOptions={articleSapOptions}
        articleCode={articleCode}
        articleName={articleName}
        articleUnitOfMeasure={articleUnitOfMeasure}
        articleSupplierId={articleSupplierId}
        articleTextSearch={articleTextSearch}
        handleInputChange={handleInputChange}
        handleDeleteArticle={handleDeleteArticle}
        handleUpdateArticle={handleUpdateArticle}
        handleCreateArticle={handleCreateArticle}
        handleEditArticle={handleUpdateArticle}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        editArticle={editArticle}
        visible={visible}
        setVisible={setVisible}
        supplierOptions={supplierOptions}
        selectedSupplier={selectedSupplier}
        selectedArticleSap={selectedArticleSap}
        setSelectedSupplier={setSelectedSupplier}
        setSelectedArticleSap={setSelectedArticleSap}
        handleSupplierChange={handleSupplierChange}
        handleArticleSapChange={handleArticleSapChange}
      />
    </>
  );
}

export default ArticleTable;
