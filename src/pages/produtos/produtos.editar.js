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

import { useLocation } from 'react-router-dom';

import { useForm } from 'react-hook-form';

import api from '../../services/api';

export default function ProdutoEditar() {
  const classes = useStyles();

  const history = useHistory();
  const location = useLocation();

  let product = {};
  let productScreen = false;
  let variantId = null;

  if (location.state != null) {
    product = location.state.params;
    productScreen = location.state.productScreen;
    variantId = location.state.variantId;
  }

  const [checkPromotionValue, setCheckPromotionValue] = useState(false);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [loadingImages, setLoadingImages] = useState(false);
  const [imagesError, setImagesError] = useState(false);
  const [imagesArray, setImagesArray] = useState([]);
  const [productQuantity, setProductQuantity] = useState(0);
  const [productIdInputDisabled, setProductIdInputDisabled] = useState(false);
  const [categoryIdInputDisabled, setCategoryIdInputDisabled] = useState(false);
  const [
    productVariantIdInputDisabled,
    setProductVariantIdInputDisabled
  ] = useState(false);
  const [productIdVariantInputDisabled, setProductIdVariantInputDisabled] = useState(false);

  const { register, handleSubmit, watch, errors, setValue, reset } = useForm();

  const {
    register: registerProductVariant,
    errors: errorProductVariant,
    handleSubmit: handleSubmitProductVariant,
    setValue: setValueProductVariant,
    reset: resetProductVariant
  } = useForm();

  useEffect(() => {
    function loadProductInputValues() {
      if (productScreen != null && productScreen) {
        setValue('productId', product.id);
        setValue('title', product.title);
        setValue('categoryProduct', product.category.id);
        if (product.tags.length > 0) {
          setValue('tags', product.tags.join(','));
        }
        setValue('rate_stars', product.rate_stars);
        setProductIdInputDisabled(true)
        setCategoryIdInputDisabled(true)
      } else {
        if (variantId != null) {
          console.log('product');
          console.log(product);
          console.log(variantId);

          setValue('productId', product.id);
          setValue('title', product.title);
          setValue('categoryProduct', product.category.id);
          if (product.tags.length > 0) {
            setValue('tags', product.tags.join(','));
          }
          setValue('rate_stars', product.rate_stars);

          const variant = product.variants.find(
            (variant) => variant.id == variantId
          );

          console.log('variant.promotion');
          console.log(variant.promotion);

          setValueProductVariant('productVariantId', variant.id);
          setValueProductVariant('productId', variant.product_id);
          setValueProductVariant('title', variant.title);
          setValueProductVariant('oldPrice', variant.old_price);
          setValueProductVariant('price', variant.price);
          setValueProductVariant('quantity', variant.quantity);
          setProductQuantity(variant.quantity);

          setValueProductVariant('promotion', variant.promotion);
          setCheckPromotionValue(variant.promotion);

          setValueProductVariant('size', variant.size);
          setSize(variant.size);

          // setValueProductVariant('color', variant.color.code);
          setColor(variant.color.code);
          setValueProductVariant('productLength', variant.length);
          setValueProductVariant('width', variant.width);

          setImagesArray(variant.images);
          // setValueProductVariant('images', variant.images);

          setValueProductVariant('height', variant.height);
          setValueProductVariant('weight', variant.weight);

          setProductVariantIdInputDisabled(true)
          setProductIdVariantInputDisabled(true)

          setProductIdInputDisabled(true)
          setCategoryIdInputDisabled(true)
        }
      }
    }

    loadProductInputValues();
  }, []);

  const onSubmitProduct = async (data) => {
    if (data.tags != null && data.tags != '') {
      data.tags = data.tags.replace(/\s/g, '').split(',');
    }

    if (data.categoryProduct != null && data.categoryProduct != '') {
      data.category = data.categoryProduct;
    }

    if (data.rate_stars < 0 || data.rate_stars > 5) {
      alert('Valor da avaliação incorreto');

      return;
    }

    console.log(data);

    try {
      const response = await api.put(`/products/${data.productId}`, data);

      console.log(response);

      if (response.status == 200) {
        alert(
          'Produto atualizado com sucesso, o ID do produto é ' +
            response.data.id
        );

        reset();

        history.push('/produtos');
      }
    } catch (err) {
      alert('Erro ao atualizar o produto ' + JSON.stringify(err.message));
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
      height: parseFloat(data.height),
      weight: parseFloat(data.weight),
      promotion: data.promotion,
      size: size,
      color: {
        title: colorDetail[1],
        code: color
      },
      length: data.productLength,
      width: parseInt(data.width),
      availableStock: parseInt(data.quantity),
      quantity: parseInt(data.quantity)
    };

    console.log('dataVariantProduct');
    console.log(dataVariantProduct);

    try {
      const response = await api.put(
        `/skus/${data.productVariantId}`,
        dataVariantProduct
      );

      let responseIncreaseAvailableStock = {};
      let responseDecreaseAvailableStock = {};
      let responseIncreaseRealStock = {};
      let responseDecreaseRealStock = {};

      console.log(response);

      if (dataVariantProduct.quantity > productQuantity) {
        // Aumentando
        const valueQuantity = dataVariantProduct.quantity - productQuantity;
        const dataProductQuantity = {
          quantity: valueQuantity
        };

        responseIncreaseRealStock = await api.put(
          `/skus/stock/real/increase/${data.productVariantId}`,
          dataProductQuantity
        );

        console.log('responseIncreaseRealStock');
        console.log(responseIncreaseRealStock);

        responseIncreaseAvailableStock = await api.put(
          `/skus/stock/available/increase/${data.productVariantId}`,
          dataProductQuantity
        );

        console.log('responseIncreaseAvailableStock');
        console.log(responseIncreaseAvailableStock);
      } else if (dataVariantProduct.quantity < productQuantity) {
        // Diminuindo
        const valueQuantity = productQuantity - dataVariantProduct.quantity;
        console.log('valor');
        console.log(valueQuantity);
        const dataProductQuantity = {
          quantity: valueQuantity
        };

        console.log('eae1');

        responseDecreaseAvailableStock = await api.put(
          `/skus/stock/available/decrease/${data.productVariantId}`,
          dataProductQuantity
        );

        console.log('responseDecreaseAvailableStock');
        console.log(responseDecreaseAvailableStock);

        responseDecreaseRealStock = await api.put(
          `/skus/stock/real/decrease/${data.productVariantId}`,
          dataProductQuantity
        );

        console.log('responseDecreaseRealStock');
        console.log(responseDecreaseRealStock);
      }

      if (
        (response.status == 200 &&
          responseIncreaseRealStock.status == 200 &&
          responseIncreaseAvailableStock.status == 200) ||
        (responseDecreaseRealStock.status == 200 &&
          responseDecreaseAvailableStock.status == 200) ||
        response.status == 200
      ) {
        alert(
          'A variante do produto foi atualizada com sucesso, o ID da variante é ' +
            response.data.id
        );

        resetProductVariant();

        history.push('/produtos');
      }
    } catch (err) {
      alert(
        'Erro ao atualizar a variante do produto ' + JSON.stringify(err.message)
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
                <h2>Editar Produtos</h2>
                <form onSubmit={handleSubmit(onSubmitProduct)}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        required
                        id="productId"
                        name="productId"
                        label="ID do Produto"
                        InputProps={{
                          readOnly: productIdInputDisabled,
                        }}
                        type="number"
                        fullWidth
                        inputRef={register()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        id="title"
                        name="title"
                        label="Título do produto"
                        fullWidth
                        inputRef={register()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        id="categoryProduct"
                        name="categoryProduct"
                        label="ID da Categoria do produto"
                        InputProps={{
                          readOnly: categoryIdInputDisabled,
                        }}
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
                        id="tags"
                        name="tags"
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
                      <TextField
                        id="rate"
                        name="rate_stars"
                        label="Avaliação"
                        fullWidth
                        type="number"
                        style={{ marginBottom: 10 }}
                        inputRef={register()}
                      />
                      <span style={{ color: '#757575' }}>
                        (Avaliação do produto vai de 1 até 5)
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
                <h2>Editar Variantes dos Produtos</h2>
                <form
                  onSubmit={handleSubmitProductVariant(onSubmitVariantProduct)}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        required
                        id="productVariantId"
                        name="productVariantId"
                        label="ID da Variante do Produto"
                        InputProps={{
                          readOnly: productVariantIdInputDisabled,
                        }}
                        fullWidth
                        type="number"
                        inputRef={registerProductVariant()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        required
                        id="productId"
                        name="productId"
                        label="ID do Produto"
                        InputProps={{
                          readOnly: productIdVariantInputDisabled,
                        }}
                        fullWidth
                        type="number"
                        inputRef={registerProductVariant()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        id="title"
                        name="title"
                        label="Título"
                        fullWidth
                        inputRef={registerProductVariant()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="oldPrice"
                        name="oldPrice"
                        label="Preço Anterior"
                        fullWidth
                        inputRef={registerProductVariant()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="price"
                        name="price"
                        label="Preço"
                        fullWidth
                        inputRef={registerProductVariant()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
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
                        control={
                          <Checkbox
                            checked={checkPromotionValue}
                            onChange={(e) =>
                              setCheckPromotionValue(e.target.checked)
                            }
                            value={checkPromotionValue}
                          />
                        }
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
                    <Grid
                      style={{ display: 'flex', flexDirection: 'column' }}
                      item
                      xs={12}
                      sm={12}
                    >
                      <span
                        style={{
                          color: '#757575',
                          fontSize: 16,
                          marginBottom: 10
                        }}
                      >
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
                          onChange={(event) =>
                            setImagesArray(
                              event.target.value.replace(/\s/g, '').split(',')
                            )
                          }
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
                        id="height"
                        name="height"
                        label="Altura em Centímetros"
                        fullWidth
                        inputRef={registerProductVariant()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
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
