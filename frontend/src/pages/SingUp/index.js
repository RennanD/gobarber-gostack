import React from 'react';
import { Link } from 'react-router-dom';

import * as Yup from 'yup';

import { Form, Input } from '@rocketseat/unform';

import logo from '~/assets/logo.svg';

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Insira um e-mail válido')
    .required('O e-mail é obrigatório'),
  name: Yup.string().required('O nome é obrigatório'),
  password: Yup.string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .required('A senha é obrigatória'),
});

export default function SingUp() {
  function handleSubmit(data) {
    console.tron.log(data);
  }

  return (
    <>
      <img src={logo} alt="GoBarber" />
      <Form onSubmit={handleSubmit} schema={schema}>
        <Input name="email" type="email" placeholder="Seu e-mail" />
        <Input name="name" type="text" placeholder="Nome completo" />
        <Input
          name="password"
          type="password"
          placeholder="Sua senha secreta"
        />

        <button type="submit">Cadastrar-se</button>

        <Link to="/">Já tenho login</Link>
      </Form>
    </>
  );
}
