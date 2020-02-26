import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import * as Yup from 'yup';

import { Form, Input } from '@rocketseat/unform';

import logo from '~/assets/logo.svg';
import { singInRequest } from '~/store/modules/auth/actions';

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Insira um e-mail válido')
    .required('O e-mail é obrigatório'),
  password: Yup.string().required('A senha é obrigatória'),
});

export default function SingIn() {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);
  function handleSubmit({ email, password }) {
    dispatch(singInRequest(email, password));
  }
  return (
    <>
      <img src={logo} alt="GoBarber" />
      <Form onSubmit={handleSubmit} schema={schema}>
        <Input name="email" type="email" placeholder="Seu e-mail" />
        <Input
          name="password"
          type="password"
          placeholder="Sua senha secreta"
        />

        <button type="submit">{loading ? 'Carregando...' : 'Acessar'}</button>

        <Link to="/register">Criar conta gratuita</Link>
      </Form>
    </>
  );
}
