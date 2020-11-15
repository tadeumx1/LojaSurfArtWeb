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
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

import Button from '@material-ui/core/Button';

import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';

import api from '../../services/api';

import MenuAdmin from '../../components/MenuAdmin';

export default function OrderProductVariantList() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const [orderProductVariant, setOrderProductVariant] = useState([]);

  const images = [
    {
      original: 'https://picsum.photos/id/1018/1000/600/',
      thumbnail: 'https://picsum.photos/id/1018/250/150/'
    },
    {
      original: 'https://picsum.photos/id/1015/1000/600/',
      thumbnail: 'https://picsum.photos/id/1015/250/150/'
    },
    {
      original: 'https://picsum.photos/id/1019/1000/600/',
      thumbnail: 'https://picsum.photos/id/1019/250/150/'
    }
  ];

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const [modalImageOpen, setModalImageOpen] = useState(false);
  const [variantSelectedImages, setVariantSelectedImages] = useState([]);

  useEffect(() => {
    function loadOrderProductVariant() {
      const orderProductVariant = location.state.params;
      console.log('orderProductVariant');
      console.log(orderProductVariant);
      setOrderProductVariant(orderProductVariant);
    }

    loadOrderProductVariant();
  }, []);

  const formatPrice = (price) => {
    return `R$ ${price.toFixed(2)}`;
  };

  const formatTimestampToDate = (date) => {
    const dateFormat = date.replace(/Z/g, '');
    const dateTime = dateFormat.split('T');

    // Date
    const dateString = dateTime[0];

    // DateTime
    const time = dateTime[1].split('.');
    const timeFormat = time[0];

    const finalDate = `${dateString} ${timeFormat}`;
    const d = new Date(finalDate);

    const formatFinalDate = format(d, 'dd/MM/yyyy HH:mm:ss', {
      timeZone: 'America/Sao_Paulo'
    });

    return formatFinalDate;
  };

  const formatCategoriesToString = (categories) => {
    const categoriesString = categories.map((category) => category.name);

    return categoriesString;
  };

  const handleNavigateEditProductVariant = async (variant) => {
    try {
      const response = await api.get(`/products/${variant.product_id}`);
      const product = response.data;

      history.push('/produtos/editar', {
        params: product,
        productScreen: false,
        variantId: variant.id
      });
    } catch (err) {
      alert(
        'Ocorreu um erro ao iniciar a tela de editar a variante do produto, tente novamente mais tarde ' +
          JSON.stringify(err)
      );
    }
  };

  const onCloseModal = () => {
    setModalImageOpen(false);
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
                <h2>Produtos do Pedido</h2>
                <Grid container spacing={3}>
                  <Grid item sm={12}>
                    <TableContainer component={Paper}>
                      <Table
                        className={classes.table}
                        aria-label="simple table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">ID</TableCell>
                            <TableCell align="center">
                              Quantidade no Pedido
                            </TableCell>
                            <TableCell align="center">Título</TableCell>
                            <TableCell align="center">Preço Anterior</TableCell>
                            <TableCell align="center">Preço</TableCell>
                            <TableCell align="center">Promoção</TableCell>
                            <TableCell align="center">Cor</TableCell>
                            <TableCell align="center">Tamanho</TableCell>
                            <TableCell align="center">Altura</TableCell>
                            <TableCell align="center">Peso</TableCell>
                            <TableCell align="center">Comprimento</TableCell>
                            <TableCell align="center">Largura</TableCell>
                            <TableCell align="center">
                              Imagens do produto
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orderProductVariant.map((order) => (
                            <TableRow>
                              <TableCell component="th" scope="row">
                                {order.item.id}
                              </TableCell>
                              <TableCell align="center">
                                {order.quantity ? order.quantity : 0}{' '}
                                unidades
                              </TableCell>
                              <TableCell align="center">
                                {order.item.title}
                              </TableCell>
                              <TableCell align="center">
                                R$ {order.item.old_price.toFixed(2)}
                              </TableCell>
                              <TableCell align="center">
                                R$ {order.item.price.toFixed(2)}
                              </TableCell>
                              <TableCell align="center">
                                {order.item.promotion && order.item.promotion
                                  ? 'Sim'
                                  : 'Não'}
                              </TableCell>
                              <TableCell align="center">
                                {order.item.color.title}
                              </TableCell>
                              <TableCell align="center">
                                {order.item.size}
                              </TableCell>
                              <TableCell align="center">
                                {order.item.height.toFixed(2)} Centímetros
                              </TableCell>
                              <TableCell align="center">
                                {order.item.weight.toFixed(2)} Gramas
                              </TableCell>
                              <TableCell align="center">
                                {order.item.length.toFixed(2)} Centímetros
                              </TableCell>
                              <TableCell align="center">
                                {order.item.width.toFixed(2)} Centímetros
                              </TableCell>
                              <TableCell align="center">
                                <Button
                                  size="medium"
                                  variant="contained"
                                  color="primary"
                                  style={{ width: '90%', marginBottom: '10px' }}
                                  onClick={() => {
                                    console.log(order.item);
                                    setVariantSelectedImages(order.item.images);
                                    setModalImageOpen(true);
                                  }}
                                >
                                  <span className={classes.detailProductText}>
                                    Imagens
                                  </span>
                                </Button>
                              </TableCell>
                              { /* <TableCell align="center">
                                <Button
                                  color="primary"
                                  variant="contained"
                                  style={{ width: '90%', marginBottom: '10px' }}
                                  onClick={() => alert('Teste')}
                                >
                                  Teste
                                </Button>
                                </TableCell> */}
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
          <Dialog
            onClose={onCloseModal}
            aria-labelledby="simple-dialog-title"
            open={modalImageOpen}
          >
            <DialogTitle id="simple-dialog-title">Imagens</DialogTitle>
            <Box style={{ padding: 30 }} flexWrap="wrap">
              {console.log(variantSelectedImages)}
              {variantSelectedImages.length >= 1
                ? variantSelectedImages.map((image) => (
                    <img style={{ marginRight: 10 }} height={250} src={image} />
                  ))
                : 'Essa Variante do Produto não possui imagens'}
            </Box>
          </Dialog>
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
