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

import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';

import MenuAdmin from '../../components/MenuAdmin';
import Footer from '../../components/Footer';

import api from '../../services/api';

export default function OrdersClient() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const client = location.state.params;

  const [modalAddressClient, setModalAddressClient] = useState(false);
  const [addressClient, setAddressClient] = useState(null);

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
        `Número ${addressClient.number}, Complemento ${addressClient.number}`
      ].join(' ');

      return formatAddress;
    }

    return '';
  };

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
                <h2>Informações do Cliente</h2>
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
                            <TableCell align="center">Sobrenome</TableCell>
                            <TableCell align="center">E-mail</TableCell>
                            <TableCell align="center">Atualizado</TableCell>
                            <TableCell align="center">Endereço</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow key={client.id}>
                          <TableCell component="th" scope="row">
                              {client.id}
                            </TableCell>
                            <TableCell align="center">
                              {client.first_name}
                            </TableCell>
                            <TableCell align="center">
                              {client.last_name}
                            </TableCell>
                            <TableCell align="center">
                              {client.email}
                            </TableCell>
                            <TableCell align="center">
                              {formatTimestampToDate(client.updated_at)}
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                size="medium"
                                variant="contained"
                                color="primary"
                                onClick={() => handleButtonAddressClient(client.addresses[0])}
                              >
                                Endereço
                              </Button>
                            </TableCell>
                          </TableRow>
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
