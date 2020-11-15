import React from 'react';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Dashboard from './pages/dashboard';

import Produtos from './pages/produtos';
import ProductsVariantList from './pages/produtos/ProductsVariantList';
import ProdutoEditar from './pages/produtos/produtos.editar';
import ProdutoCadastrar from './pages/produtos/produtos.cadastrar';
import ProductsVariantDelete from './pages/produtos/ProductsVariantDelete';

import Categories from './pages/categorias';
import CreateCategories from './pages/categorias/CreateCategories';
import EditCategories from './pages/categorias/EditCategories';

import OrdersList from './pages/orders/OrdersList';
import OrderProductVariantList from './pages/orders/OrderProductsVariantList';
import OrdersClient from './pages/orders/OrdersClient';

import SignIn from './pages/SignIn';

import Usuarios from './pages/usuarios';
import UsuarioEditar from './pages/usuarios/usuarios.editar';
import UsuarioCadastrar from './pages/usuarios/usuarios.cadastrar';

import { isAuthenticated } from "./services/auth";

import Album from './components/painel';

const PrivateRoute = ({ component, ...options }) => {
  const finalComponent = isAuthenticated() ? component : SignIn;

  return <Route {...options} component={finalComponent} />;
};

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <PrivateRoute path="/" exact component={Dashboard} />

        <PrivateRoute path="/produtos" exact component={Produtos} />
        <PrivateRoute path="/produtos/detail" exact component={ProductsVariantList} />
        <PrivateRoute
          path="/produtos/cadastrar"
          exact
          component={ProdutoCadastrar}
        />
        <PrivateRoute
          path="/produtos/editar"
          exact
          component={ProdutoEditar}
        />
        <PrivateRoute
          path="/produtos/detail/delete"
          exact
          component={ProductsVariantDelete}
        />

        <PrivateRoute path="/categorias" exact component={Categories} />

        <PrivateRoute path="/categorias/cadastrar" exact component={CreateCategories} />

        <PrivateRoute path="/categorias/editar" exact component={EditCategories} />

        <PrivateRoute path="/pedidos" exact component={OrdersList} />

        <PrivateRoute path="/pedidos/produtos" exact component={OrderProductVariantList} />

        <PrivateRoute path="/pedidos/cliente" exact component={OrdersClient} />

        <PrivateRoute path="/usuarios" exact component={Usuarios} />
        <PrivateRoute
          path="/usuarios/cadastrar"
          exact
          component={UsuarioCadastrar}
        />
        <PrivateRoute
          path="/usuarios/editar/:idProduto"
          exact
          component={UsuarioEditar}
        />

        <Route path="/login" exact component={SignIn} />

        <Route path="*" component={() => <h1>Page not found</h1>} />

        <PrivateRoute path="/client/panel" exact component={Album} />
      </Switch>
    </BrowserRouter>
  );
}

// surfarttech@gmail.com
// surfart@2020
