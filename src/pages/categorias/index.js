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

export default function Categories() {
  const classes = useStyles();
  const history = useHistory();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadCategories() {
      const response = await api.get('/getall/categories');
      setCategories(response.data.docs);
    }

    loadCategories();
  }, []);

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

  const handleNavigateEditCategories = (category) => {
    history.push('/categorias/editar', { params: category });
  };

  const handleNavigateDeleteCategory = async (category) => {
    try {
      const response = await api.delete(`/categories/${category.id}`);
      if (response.data.id) {
        alert('A categoria foi excluída com sucesso');

        const responseCategory = await api.get('/categories');
        setCategories(responseCategory.data.docs);
      }
    } catch (err) {
      alert('Ocorreu um erro ao excluir a categoria ' + JSON.stringify(err));
    }
  };

  return (
    <div className={classes.root}>
      <MenuAdmin title={'CATEGORIAS'} />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item sm={12}>
              <Paper className={classes.paper}>
                <h2>Listagem de Categorias</h2>
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
                            <TableCell align="center">Descrição</TableCell>
                            <TableCell align="center">Criado</TableCell>
                            <TableCell align="center">Ação</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {categories.map((category) => (
                            <TableRow key={category.id}>
                              <TableCell component="th" scope="row">
                                {category.id}
                              </TableCell>
                              <TableCell align="center">
                                {category.name}
                              </TableCell>
                              <TableCell align="center">
                                {category.description}
                              </TableCell>
                              <TableCell align="center">
                                {formatTimestampToDate(category.created_at)}
                              </TableCell>
                              <TableCell align="center">
                                <Button
                                  color="primary"
                                  variant="contained"
                                  style={{ width: '30%', margin: '10px' }}
                                  onClick={() =>
                                    handleNavigateEditCategories(category)
                                  }
                                >
                                  <span className={classes.detailProductText}>
                                    Editar
                                  </span>
                                </Button>
                                <Button
                                  color="primary"
                                  variant="contained"
                                  style={{ width: '30%' }}
                                  onClick={() =>
                                    handleNavigateDeleteCategory(category)
                                  }
                                >
                                  <span className={classes.detailProductText}>
                                    Deletar
                                  </span>
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
    fontSize: 12
  },
  buttonMargin: {
    margin: 10
  }
}));
