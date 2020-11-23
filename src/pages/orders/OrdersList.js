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
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';

import { format } from 'date-fns';

import MenuAdmin from '../../components/MenuAdmin';
import Footer from '../../components/Footer';

import api from '../../services/api';

const ordersArray = [
  {
    _id: '5f891ec9d3a6c11f1880ae17',
    items: [
      {
        color: {
          title: 'Azul',
          code: '#0000fe'
        },
        promotion: false,
        images: [
          'https://mk0wantedindcomlam5w.kinstacdn.com/wp-content/uploads/2020/08/118-600x870.jpg'
        ],
        deleted: false,
        _id: {
          $oid: '5f8149c0d2f27c288c289d72'
        },
        size: 'M',
        product_id: 11,
        title: 'POLO HAT - BLUE',
        price: 79.9,
        old_price: 79.9,
        height: 1,
        weight: 1,
        quantity: 10,
        id: 2,
        __v: 0,
        availableStock: 9,
        created_at: {
          $date: '2020-10-10T05:42:24.011Z'
        },
        length: 15,
        width: 15
      },
      {
        color: {
          title: 'Verde',
          code: '#03fd00'
        },
        promotion: false,
        images: [
          'https://mk0wantedindcomlam5w.kinstacdn.com/wp-content/uploads/2020/08/17-600x870.jpg'
        ],
        deleted: false,
        _id: {
          $oid: '5f8149c0d2f27c288c289d73'
        },
        size: 'PP',
        product_id: 11,
        title: 'POLO HAT - BEIGE',
        price: 79.9,
        old_price: 79.9,
        height: 1,
        weight: 1,
        quantity: 10,
        id: 3,
        __v: 0,
        availableStock: 9,
        created_at: {
          $date: '2020-10-10T05:42:24.012Z'
        },
        length: 15,
        width: 15
      }
    ],
    hasDiscount: false,
    toDelivery: false,
    deleted: false,
    value: 159.8,
    billing_address: {
      _id: '5f83681abd62340f94b4e6b1',
      cep: '03589001',
      address: 'Avenida Waldemar Tietz',
      number: '1404',
      complement: '133',
      neighborhood: 'Arthur Alvim',
      location: 'São Paulo',
      state: 'São Paulo'
    },
    customer: {
      admin: false,
      deleted: false,
      _id: '5f891ec9d3a6c11f1880ae16',
      first_name: 'Surf',
      last_name: 'Art',
      email: 'surfarttech@gmail.com',
      addresses: [
        {
          _id: '5f83681abd62340f94b4e6b1',
          cep: '03589001',
          address: 'Avenida Waldemar Tietz',
          number: '1404',
          complement: '133',
          neighborhood: 'Arthur Alvim',
          location: 'São Paulo',
          state: 'São Paulo'
        }
      ],
      id: 1
    },
    created_at: '2020-10-16T04:17:13.630Z',
    id: 1,
    __v: 0
  }
];

export default function OrdersList() {
  const classes = useStyles();
  const history = useHistory();

  const [orders, setOrders] = useState([]);
  const [modalAddressClient, setModalAddressClient] = useState(false);
  const [addressClient, setAddressClient] = useState(null);

  useEffect(() => {
    async function loadOrders() {
      const response = await api.get('/getall/orders/');
      setOrders(response.data);
    }

    loadOrders();
  }, []);

  // Pedido Aberto
  // Mostrar o botão de cancelar

  // Pedido Pago
  // Mostrar o botão de separar ou cancelar

  // Pedido Separado
  // Mostrar o botão de Enviado ou cancelar

  // Pedido em entrega
  // Mostrar o botão de finalizar ou cancelar

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

  const formatStatus = (status) => {
    // OPEN -> PAID -> SEPARATED -> SHIPPED -> FINALIZED
    let statusText = '';

    if (status == 'OPEN') {
      statusText = 'Aberto';
    } else if (status == 'PAID') {
      statusText = 'Pago';
    } else if (status == 'SEPARATED') {
      statusText = 'Separado';
    } else if (status == 'SHIPPED') {
      statusText = 'Em entrega';
    } else if(status == 'CANCELED') {
      statusText = 'Cancelado';
    } else {
      statusText = 'Finalizado';
    }

    return statusText;
  };

  const handleButtonAddressClient = (addressClientValue) => {
    if (addressClientValue != null) {
      setAddressClient(addressClientValue);
      setModalAddressClient(true);
    }
  };

  const formatBillingAddress = () => {
    if (addressClient != null) {
      const formatAddress = [
        `Rua ${addressClient.address}, Bairro ${addressClient.neighborhood},`,
        `Cidade ${addressClient.location}, Estado ${addressClient.state},`,
        `Número ${addressClient.number}, Complemento ${addressClient.complement}`
      ].join(' ');

      return formatAddress;
    }

    return '';
  };

  const handleNavigateOrderClient = (client) => {
    history.push('/pedidos/cliente', { params: client });
  };

  const handleSeparateOrder = async (orderId) => {
    try {
      const response = await api.put(`/orders/status/separated/${orderId}`);

      console.log(response);

      if (response.status == 200) {
        alert(
          'O status do produto foi alterado com sucesso'
        );

        const responseOrders = await api.get('/getall/orders/');
        setOrders(responseOrders.data);
      }
    } catch (err) {
      alert(
        'Erro ao alterar o status do produto ' + JSON.stringify(err.message)
      );
    }
  }

  const handleSendOrder = async (orderId) => {
    try {
      const response = await api.put(`/orders/status/shipped/${orderId}`);

      console.log(response);

      if (response.status == 200) {
        alert(
          'O status do produto foi alterado com sucesso'
        );

        const responseOrders = await api.get('/getall/orders/');
        setOrders(responseOrders.data);
      }
    } catch (err) {
      alert(
        'Erro ao alterar o status do produto ' + JSON.stringify(err.message)
      );
    }
  }

  const handleEndOrder = async (orderId) => {
    try {
      const response = await api.put(`/orders/status/finalized/${orderId}`);

      console.log(response);

      if (response.status == 200) {
        alert(
          'O status do produto foi alterado com sucesso'
        );

        const responseOrders = await api.get('/getall/orders/');
        setOrders(responseOrders.data);
      }
    } catch (err) {
      alert(
        'Erro ao alterar o status do produto ' + JSON.stringify(err.message)
      );
    }
  }

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await api.put(`/orders/status/canceled/${orderId}`);

      console.log(response);

      if (response.status == 200) {
        alert(
          'O status do produto foi alterado com sucesso'
        );

        const responseOrders = await api.get('/getall/orders/');
        setOrders(responseOrders.data);
      }
    } catch (err) {
      alert(
        'Erro ao alterar o status do produto ' + JSON.stringify(err.message)
      );
    }
  }

  const onCloseModal = () => {
    setModalAddressClient(false);
  };

  const handleNavigateOrderProduct = (products) => {
    history.push('/pedidos/produtos', { params: products });
  };

  return (
    <div className={classes.root}>
      <MenuAdmin title={'PEDIDOS'} />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item sm={12}>
              <Paper className={classes.paper}>
                <h2>Listagem de Pedidos</h2>
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
                            <TableCell align="center">Cliente</TableCell>
                            <TableCell align="center">Desconto</TableCell>
                            <TableCell align="center">Entrega</TableCell>
                            {/* <TableCell align="center">Atualizado</TableCell> */}
                            <TableCell align="center">Valor</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Criado</TableCell>
                            <TableCell align="center">
                              Endereço de cobrança
                            </TableCell>
                            <TableCell align="center">
                              Informações do Cliente
                            </TableCell>
                            <TableCell align="center">Produtos</TableCell>
                            <TableCell align="center">Ação</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell component="th" scope="row">
                                {order.id}
                              </TableCell>
                              <TableCell align="center">
                                {order.customer.email}
                              </TableCell>
                              <TableCell align="center">
                                {order.hasDiscount && order.hasDiscount
                                  ? 'Sim'
                                  : 'Não'}
                              </TableCell>
                              <TableCell align="center">
                                {order.toDelivery && order.toDelivery
                                  ? 'Sim'
                                  : 'Não'}
                              </TableCell>
                              <TableCell align="center">
                                R$ {order.value.toFixed(2)}
                              </TableCell>
                              <TableCell align="center">
                                {formatStatus(order.status)}
                              </TableCell>
                              <TableCell align="center">
                                {formatTimestampToDate(order.created_at)}
                              </TableCell>
                              {/* <TableCell align="center">
                                {formatTimestampToDate(order.updated_at)}
                                </TableCell> */}
                              <TableCell align="center">
                                <Button
                                  size="medium"
                                  variant="contained"
                                  color="primary"
                                  onClick={() =>
                                    handleButtonAddressClient(
                                      order.billing_address
                                    )
                                  }
                                >
                                  Endereço
                                </Button>
                              </TableCell>
                              <TableCell align="center">
                                <Button
                                  size="medium"
                                  color="primary"
                                  variant="contained"
                                  onClick={() =>
                                    handleNavigateOrderClient(order.customer)
                                  }
                                >
                                  Cliente
                                </Button>
                              </TableCell>
                              <TableCell align="center">
                                <Button
                                  size="medium"
                                  variant="contained"
                                  color="primary"
                                  onClick={() =>
                                    handleNavigateOrderProduct(order.items)
                                  }
                                >
                                  Produtos
                                </Button>
                              </TableCell>
                              <TableCell align="center">
                                {order.status == 'OPEN' && (
                                  <Button
                                    color="primary"
                                    variant="contained"
                                    /* style={{
                                      width: '90%',
                                      marginBottom: '10px'
                                    }} */
                                    onClick={() => handleCancelOrder(order.id)}
                                  >
                                    Cancelar
                                  </Button>
                                )}
                                {order.status == 'PAID' && (
                                  <div>
                                    <Button
                                      color="primary"
                                      variant="contained"
                                      style={{
                                        width: '90%',
                                        marginBottom: '10px'
                                      }}
                                      onClick={() =>
                                        handleSeparateOrder(order.id)
                                      }
                                    >
                                      Separar
                                    </Button>
                                    <Button
                                      color="primary"
                                      variant="contained" 
                                      style={{
                                        width: '90%',
                                        marginBottom: '10px'
                                      }}
                                      onClick={() =>
                                        handleCancelOrder(order.id)
                                      }
                                    >
                                      Cancelar
                                    </Button>
                                  </div>
                                )}
                                {order.status == 'SEPARATED' && (
                                  <div>
                                    <Button
                                      color="primary"
                                      variant="contained"
                                      style={{
                                        width: '90%',
                                        marginBottom: '10px'
                                      }}
                                      onClick={() =>
                                        handleSendOrder(order.id)
                                      }
                                    >
                                      Enviar
                                    </Button>
                                    <Button
                                      color="primary"
                                      variant="contained"
                                      style={{
                                        width: '90%',
                                        marginBottom: '10px'
                                      }}
                                      onClick={() =>
                                        handleCancelOrder(order.id)
                                      }
                                    >
                                      Cancelar
                                    </Button>
                                  </div>
                                )}
                                {order.status == 'SHIPPED' && (
                                  <div>
                                  <Button
                                    color="primary"
                                    variant="contained"
                                    style={{
                                      width: '90%',
                                      marginBottom: '10px'
                                    }}
                                    onClick={() =>
                                      handleEndOrder(order.id)
                                    }
                                  >
                                    Finalizar
                                  </Button>
                                  <Button
                                    color="primary"
                                    variant="contained"
                                    style={{
                                      width: '90%',
                                      marginBottom: '10px'
                                    }}
                                    onClick={() =>
                                      handleCancelOrder(order.id)
                                    }
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                                )}
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
          <Dialog
            onClose={onCloseModal}
            aria-labelledby="simple-dialog-title"
            open={modalAddressClient}
          >
            <DialogTitle id="simple-dialog-title">Endereço</DialogTitle>
            <Box style={{ padding: 30 }} flexWrap="wrap">
              {formatBillingAddress()}
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
