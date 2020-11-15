import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { useHistory } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import MenuAdmin from '../../components/MenuAdmin';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Footer from '../../components/Footer';

import ColorPicker from 'material-ui-color-picker';
// import { ColorPicker } from 'material-ui-color';
import ntc from 'ntcjs';

import FormControlLabel from '@material-ui/core/FormControlLabel';

import Button from '@material-ui/core/Button';

import { useForm } from 'react-hook-form';

import api from '../../services/api';

export default function ProdutoCadastrar() {
  const classes = useStyles();

  const history = useHistory();

  const { register, handleSubmit, watch, errors, reset } = useForm();
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [loadingImages, setLoadingImages] = useState(false);
  const [imagesError, setImagesError] = useState(false);
  const [imagesArray, setImagesArray] = useState([]);

  const {
    register: registerProductVariant,
    errors: errorProductVariant,
    handleSubmit: handleSubmitProductVariant,
    setValue: setValueProductVariant,
    reset: resetProductVariant
  } = useForm();

  const onSubmitProduct = async (data) => {
    const dataProduct = {
      title: data.titleProduct,
      category: data.categoryProduct,
      tags: data.tagProduct.replace(/\s/g, '').split(',')
    };

    try {
      const response = await api.post('/products', dataProduct);

      console.log(response);

      if (response.status == 200) {
        alert(
          'Produto criado com sucesso, o ID do produto é ' + response.data.id
        );

        reset();

        history.push('/produtos');
      }
    } catch (err) {
      alert('Erro ao criar o produto ' + JSON.stringify(err.message));
    }
  };

  const handleColor = (color) => {
    // setColor(color.css.backgroundColor)
    setColor(color);
  };

  const handleFiles = async (event) => {
    const files = event.target.files;
    const imagesProduct = [];
    setLoadingImages(true);

    for (let i = 0; i < files.length; i++) {
      const imageURL = await handleUploadImage(files[i]);
      imagesProduct.push(imageURL);
    }

    setImagesArray([...imagesArray, ...imagesProduct]);
    setLoadingImages(false);
  };

  const onSubmitVariantProduct = async (data) => {
    console.log('data');
    console.log(data);

    /* const regex = new RegExp('^\d+(\.\d{1,2})?$')

    if(!regex.test(parseFloat(data.price))) {
      alert("Valor do preço inválido, por favor digite o valor correto")
      
      return;
    } else if (!regex.test(parseFloat(data.oldPrice))) {
      alert("Valor do preço anterior inválido, por favor digite o valor correto")
      
      return;
    } else if (!regex.test(parseFloat(data.height))) {
      alert("Valor da altura inválida, por favor digite o valor correto")
      
      return;
    } else if (!regex.test(parseFloat(data.weight))) {
      alert("Valor do peso inválido, por favor digite o valor correto")
      
      return;
    } */

    // Form Data

    /* const formData = new FormData();
    const images = [];

    const files = data.productImages;
    for (let i = 0; i < files.length; i++) {
      // console.log('file')
      // console.log(files[i])

      const imageURL = await handleUploadImage(files[i]);
      images.push(imageURL);
    }

    console.log('images');
    console.log(images);
    // formData.append('image', data.productImage[0])

    // const response = await api.post('/skus/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

    // console.log(response) */

    if (size == '') {
      alert('Por favor selecione um tamanho');

      return;
    }

    if (color == '') {
      alert('Por favor selecione uma cor');

      return;
    }

    const colorDetail = ntc.name(color);

    const dataVariantProduct = {
      title: data.title,
      old_price: parseFloat(data.oldPrice),
      price: parseFloat(data.price),
      product_id: parseInt(data.productId),
      images: data.images.replace(/\s/g, '').split(','),
      // images: imagesArray,
      height: parseFloat(data.height),
      weight: parseFloat(data.weight),
      promotion: data.promotion,
      size: size,
      color: {
        title: colorDetail[1],
        code: color
      },
      length: parseInt(data.productLength),
      width: parseInt(data.width),
      availableStock: parseInt(data.quantity),
      quantity: parseInt(data.quantity)
    };

    // productImage

    console.log('dataVariantProduct');
    console.log(dataVariantProduct);

    try {
      const response = await api.post('/skus', dataVariantProduct);

      console.log(response);

      if (response.status == 200) {
        alert(
          'A variante do produto foi criada com sucesso, o ID da variante é ' +
            response.data.id
        );

        resetProductVariant();

        history.push('/produtos');
      }
    } catch (err) {
      alert(
        'Erro ao criar a variante do produto ' + JSON.stringify(err.message)
      );
    }
  };

  const handleUploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/skus/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return response.data.Location;
    } catch (err) {
      setImagesError(true);
      return '';
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
                <h2>Cadastro de Produtos</h2>
                <form onSubmit={handleSubmit(onSubmitProduct)}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        required
                        id="titleProduct"
                        name="titleProduct"
                        label="Título do produto"
                        fullWidth
                        inputRef={register()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        required
                        id="categoryProduct"
                        name="categoryProduct"
                        label="ID da Categoria do produto"
                        fullWidth
                        type="number"
                        inputRef={register()}
                      />
                      {/* <span style={{ color: '#757575' }}>
                        (Separar os ID da categoria se for mais de um, por vírgula ao escrever)
                        </span> */}
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        required
                        id="tagProduct"
                        name="tagProduct"
                        label="Tags do Produto"
                        fullWidth
                        type="text"
                        style={{ marginBottom: 10 }}
                        inputRef={register()}
                      />
                      <span style={{ color: '#757575' }}>
                        (Separar as tags por vírgula ao escrever)
                      </span>
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
          <Grid container spacing={3}>
            <Grid item sm={12}>
              <Paper className={classes.paper}>
                <h2>Cadastro de Variantes dos Produtos</h2>
                <form
                  onSubmit={handleSubmitProductVariant(onSubmitVariantProduct)}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        required
                        id="productId"
                        name="productId"
                        label="ID do Produto"
                        fullWidth
                        type="number"
                        inputRef={registerProductVariant()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        required
                        id="title"
                        name="title"
                        label="Título"
                        fullWidth
                        inputRef={registerProductVariant()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id="oldPrice"
                        name="oldPrice"
                        label="Preço Anterior"
                        fullWidth
                        inputRef={registerProductVariant()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id="price"
                        name="price"
                        label="Preço"
                        fullWidth
                        inputRef={registerProductVariant()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id="quantity"
                        name="quantity"
                        label="Quantidade"
                        fullWidth
                        type="number"
                        inputRef={registerProductVariant()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Promoção"
                        name="promotion"
                        inputRef={registerProductVariant()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        style={{
                          marginLeft: 1,
                          padding: 0,
                          minWidth: '100%'
                        }}
                      >
                        <InputLabel id="size-select-label">Tamanho</InputLabel>
                        <Select
                          id="size"
                          value={size}
                          onChange={(event) => setSize(event.target.value)}
                        >
                          <MenuItem value={'PP'}>PP</MenuItem>
                          <MenuItem value={'P'}>P</MenuItem>
                          <MenuItem value={'M'}>M</MenuItem>
                          <MenuItem value={'G'}>G</MenuItem>
                          <MenuItem value={'GG'}>GG</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {/* <TextField
                        required
                        id="color"
                        name="color"
                        label="Cor"
                        fullWidth
                        inputRef={registerProductVariant()}
                      /> */}
                      <FormControl
                        style={{
                          padding: 0,
                          marginTop: 16,
                          minHeight: '100%',
                          minWidth: '100%',
                          width: '100%'
                        }}
                      >
                        <ColorPicker
                          style={{ minWidth: '100%' }}
                          name="color"
                          placeholder={color == '' ? 'Cor' : color}
                          defaultValue={color}
                          autoComplete="off"
                          value={color}
                          onChange={(color) => handleColor(color)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        required
                        id="productLength"
                        name="productLength"
                        label="Comprimento em Centímetros"
                        fullWidth
                        type="number"
                        inputRef={registerProductVariant()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        required
                        id="width"
                        name="width"
                        label="Largura em Centímetros"
                        fullWidth
                        type="number"
                        inputRef={registerProductVariant()}
                      />
                    </Grid>
                    <Grid style={{ display: 'flex', flexDirection: 'column' }} item xs={12} sm={12}>
                      <span 
                        style={{ 
                          color: '#757575', 
                          fontSize: 16, 
                          marginBottom: 10 
                        }}>
                        Upload de Imagens
                      </span>
                      {loadingImages ? (
                        <span>Carregando</span>
                      ) : (
                          <input
                            name="productImages"
                            multiple="multiple"
                            onChange={(event) => handleFiles(event)}
                            type="file"
                            // ref={registerProductVariant()}
                          />
                      )}
                    </Grid>
                    {imagesArray.length > 0 && (
                      <Grid item xs={12} sm={12}>
                        <TextField
                          required
                          id="images"
                          name="images"
                          label="Imagens"
                          multiline={true}
                          fullWidth
                          value={imagesArray.join(', ')}
                          onChange={(event) => setImagesArray(event.target.value.replace(/\s/g, '').split(','))}
                          style={{ marginBottom: 10 }}
                          inputRef={registerProductVariant()}
                        />
                        <span style={{ color: '#757575' }}>
                          (Enviar o link das imagens separados por vírgula ao
                          escrever)
                        </span>
                      </Grid>
                    )}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id="height"
                        name="height"
                        label="Altura em Centímetros"
                        fullWidth
                        inputRef={registerProductVariant()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id="weight"
                        name="weight"
                        label="Peso em Gramas"
                        fullWidth
                        inputRef={registerProductVariant()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      {imagesError ? (
                        <span>
                          Erro ao realizar o upload das imagens, tente novamente
                          mais tarde
                        </span>
                      ) : (
                        <Button
                          variant="contained"
                          onClick={handleSubmitProductVariant}
                          color="primary"
                          type="submit"
                        >
                          Salvar
                        </Button>
                      )}
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
