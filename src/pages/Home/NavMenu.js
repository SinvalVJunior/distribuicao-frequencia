import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import LogoImg from './cruzeiro.png';

import "./styles.css";

export default function NavMenu(){

    return (
        <Navbar className="navbar justify-content-between" variant="light" fixed="top" >
            <Navbar.Brand className="image-brand">
                    <img src={LogoImg} height="70px" alt="Logo Cruzeiro" />
                </Navbar.Brand>
                <Container>
                <h4>Distribuição de Frequência</h4>

                </Container>
            <Container className="name-prof">
                <h4 >Prof. Sinval de Deus Vieira</h4>
            </Container>
        </Navbar>
    )
}