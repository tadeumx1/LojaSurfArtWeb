import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';

import { makeStyles } from '@material-ui/core/styles';

import ExitToApp from '@material-ui/icons/ExitToApp';

import { logout } from '../services/auth'

export const MainListItems = () => {
  const classes = useStyles();

  return (
    <div>
      { /* <ListItem button component="a" href="/">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
        </ListItem> */ }
      { /* <ListItem button component="a" href="/usuarios">
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Usuários" />
        </ListItem> */ }
      <ListItem button component="a" href="/produtos">
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Produtos" />
      </ListItem>
      <ListItem
        button
        component="a"
        className={classes.nested}
        href="/produtos/cadastrar"
      >
        <ListItemText primary="Criar Produto" />
      </ListItem>
      <ListItem
        button
        component="a"
        className={classes.nested}
        href="/produtos/editar"
      >
        <ListItemText primary="Atualizar Produto" />
      </ListItem>
      <ListItem button component="a" href="/categorias">
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Categorias" />
      </ListItem>
      <ListItem
        button
        component="a"
        className={classes.nested}
        href="/categorias/cadastrar"
      >
        <ListItemText primary="Criar Categoria" />
      </ListItem>
      <ListItem
        button
        component="a"
        className={classes.nested}
        href="/categorias/editar"
      >
        <ListItemText primary="Atualizar Categoria" />
      </ListItem>
      <ListItem button component="a" href="/pedidos">
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Pedidos" />
      </ListItem>
    </div>
  );
};

const handleLogout = () => {
  // Delete Token
  logout()
  window.location.replace('/login');
}

export const SecondaryListItems = (
  <div>
    { /* <ListSubheader inset>Opções</ListSubheader> */ }
    <ListItem button={true} onClick={handleLogout}>
      <ListItemIcon>
        <ExitToApp />
      </ListItemIcon>
      <ListItemText primary="Sair" />
    </ListItem>
  </div>
);

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(9),
  },
}));

