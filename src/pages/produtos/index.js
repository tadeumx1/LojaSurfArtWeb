import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { useHistory } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Button from '@material-ui/core/Button';

import { format } from 'date-fns';

import MenuAdmin from '../../components/MenuAdmin';
import Footer from '../../components/Footer';

import api from '../../services/api';

export default function Produtos() {
  const classes = useStyles();
  const history = useHistory();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get('/getall/products');
      setProducts(response.data.docs);
    }

    loadProducts();
  }, []);

  const handleCreateProduct = () => {
    history.push('/produtos/cadastrar');
  }

  const handleEditProduct = () => {
    history.push('/produtos/editar');
  }

  const handleDeleteProduct = () => {
    history.push('/produtos');
  }

  const formatTimestampToDate = (date) => {
    const dateFormat = date.replace(/Z/g, '');
    const dateTime = dateFormat.split('T');

    // Date
    const dateString = dateTime[0];

    // DateTime
    const time = dateTime[1].split('.');
    const timeFormat = time[0];

    const finalDate = `${dateString} ${timeFormat}`;
    const finalDateFormat = finalDate.replace(/ /g,"T")
    const d = new Date(finalDateFormat);

    const formatFinalDate = format(d, 'dd/MM/yyyy HH:mm:ss', {
      timeZone: 'America/Sao_Paulo'
    });

    return formatFinalDate;
  };

  const formatCategoriesToString = (categories) => {
    const categoriesString = categories.map((category) => category.name);

    return categoriesString;
  };

  const handleNavigateDetailProduct = (product) => {
    history.push('/produtos/detail', { params: product });
  };

  const handleNavigateEditProduct = (product) => {
    history.push('/produtos/editar', { params: product, productScreen: true });
  };

  const handleNavigateDeleteProduct = async (product) => {
    try {
      const response = await api.delete(`/products/${product.id}`);
      if(response.data.id) {
        alert('O produto foi excluído com sucesso')

        const responseProduct = await api.get('/getall/products');
        setProducts(responseProduct.data.docs)
      }
    } catch(err) {
      alert('Ocorreu um erro ao excluir o produto ' + JSON.stringify(err))
    }
  };

  return (
    <div className={classes.root}>
      <MenuAdmin title={'PRODUTOS'} />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item sm={12}>
              <Paper className={classes.paper}>
                <h2>Listagem de Produtos</h2>
                <Grid container spacing={3}>
                  <Grid item sm={12}>
                    <TableContainer component={Paper}>
                      <Table
                        className={classes.table}
                        aria-label="simple table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="center">Nome</TableCell>
                            <TableCell align="center">Categoria</TableCell>
                            <TableCell align="center">Criado</TableCell>
                            { /* <TableCell align="center">Atualizado</TableCell> */ }
                            <TableCell align="center">Tags</TableCell>
                            <TableCell align="center">Avaliação</TableCell>
                            <TableCell align="center">
                              Detalhes do produto
                            </TableCell>
                            <TableCell align="center">Ação</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {products.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell component="th" scope="row">
                                {product.id}
                              </TableCell>
                              <TableCell align="center">
                                {product.title}
                              </TableCell>
                              <TableCell align="center">
                                {product.category.name}
                              </TableCell>
                              <TableCell align="center">
                                {formatTimestampToDate(product.created_at)}
                              </TableCell>
                              { /* <TableCell align="center">
                                {formatTimestampToDate(product.updated_at)}
                                </TableCell> */ }
                              <TableCell width="5%" align="center">
                                {product.tags != ''
                                  ? product.tags.toString()
                                  : 'O produto não possui tags'}
                              </TableCell>
                              <TableCell align="center">
                                {product.rate_stars}
                              </TableCell>
                              <TableCell align="center">
                                <Button
                                  size="medium"
                                  variant="contained"
                                  color="primary"
                                  onClick={() =>
                                    handleNavigateDetailProduct(product)
                                  }
                                >
                                  <span className={classes.detailProductText}>
                                    Detalhes
                                  </span>
                                </Button>
                              </TableCell>
                              <TableCell align="center">
                                <Button
                                  color="primary"
                                  variant="contained"
                                  style={{ width: "90%", marginBottom: "10px" }}
                                  onClick={() => 
                                    handleNavigateEditProduct(product)
                                  }
                                >
                                  Editar
                                </Button>
                                <Button
                                  color="primary"
                                  variant="contained"
                                  style={{ width: "90%" }}
                                  onClick={() =>
                                    handleNavigateDeleteProduct(product)
                                  }
                                >
                                  Deletar
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
          <div>
            <Button
              className={classes.buttonMargin}
              size="medium"
              variant="contained"
              color="primary"
              onClick={handleCreateProduct}
            >
              Criar Produto
            </Button>
            <Button
              className={classes.buttonMargin}
              size="medium"
              variant="contained"
              color="primary"
              onClick={handleEditProduct}
            >
              Atualizar Produto
            </Button>
            <Button
              className={classes.buttonMargin}
              size="medium"
              variant="contained"
              color="primary"
              onClick={handleDeleteProduct}
            >
              Deletar Produto
            </Button>
          </div>
          <Box pt={4}>{/* <Footer /> */}</Box>
        </Container>
      </main>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  title: {
    flexGrow: 1
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  detailProductText: {
    fontSize: 14
  },
  buttonMargin: {
    margin: 10
  }
}));
