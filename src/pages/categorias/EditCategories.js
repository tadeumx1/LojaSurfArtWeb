import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { useHistory } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuAdmin from '../../components/MenuAdmin';
import Footer from '../../components/Footer';

import Button from '@material-ui/core/Button';

import { useLocation } from 'react-router-dom';

import { useForm } from 'react-hook-form';

import api from '../../services/api';

export default function EditCategories() {
  const classes = useStyles();

  const history = useHistory();
  const location = useLocation();

  let category = {};

  if (location.state != null) {
    category = location.state.params;
  }

  const { register, handleSubmit, watch, errors, setValue, reset } = useForm();

  useEffect(() => {
    function loadCategoryInputValues() {
      if (category != null) {
        setValue('categoryId', category.id);
        setValue('name', category.name);
        setValue('description', category.description);
      }
    }

    loadCategoryInputValues();
  }, []);

  const onSubmitCategory = async (data) => {

    const categoryData = {
      name: data.name,
      description: data.description
    }

    try {
      const response = await api.put(`/categories/${data.categoryId}`, categoryData);

      if (response.status == 200) {
        alert(
          'Categoria atualizada com sucesso, o ID da categoria é ' +
            response.data.id
        );

        reset();

        history.push('/categorias');
      }
    } catch (err) {
      alert('Erro ao atualizar a categoria ' + JSON.stringify(err.message));
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
                <h2>Editar Categorias</h2>
                <form onSubmit={handleSubmit(onSubmitCategory)}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        required
                        id="categoryId"
                        name="categoryId"
                        label="ID da Categoria"
                        fullWidth
                        inputRef={register()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        required
                        id="name"
                        name="name"
                        label="Nome"
                        fullWidth
                        inputRef={register()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        required
                        id="description"
                        name="description"
                        label="Descrição"
                        fullWidth
                        inputRef={register()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Button
                        variant="contained"
                        onClick={handleSubmit}
                        color="primary"
                        type="submit"
                      >
                        Salvar
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            <Footer />
          </Box>
        </Container>
      </main>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: { display: 'flex' },
  title: { flexGrow: 1 },
  appBarSpacer: theme.mixins.toolbar,
  content: { flexGrow: 1, height: '100vh', overflow: 'auto' },
  container: { paddingTop: theme.spacing(4), paddingBottom: theme.spacing(4) },
  paper: {
    padding: 35,
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  formControl: { width: '100%' }
}));
