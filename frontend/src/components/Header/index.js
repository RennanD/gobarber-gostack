import React from 'react';
import { Link } from 'react-router-dom';

import { Container, Content, Profile } from './styles';

import Notifications from '~/components/Notifications';

import logo from '~/assets/header-logo.svg';

export default function Header() {
  return (
    <Container>
      <Content>
        <nav>
          <img src={logo} alt="GoBarber" />
          <Link to="/dashboard">GOBARBER</Link>
        </nav>
        <aside>
          <Notifications />
          <Profile>
            <div>
              <strong>Rennan Provider</strong>
              <Link to="/profile">Meu Perfil</Link>
            </div>
            <img
              src="https://ovicio.com.br/wp-content/uploads/2019/11/20191127-baby-yoda-mandalorian-277x277.jpg"
              alt="Rennan Provider"
            />
          </Profile>
        </aside>
      </Content>
    </Container>
  );
}
