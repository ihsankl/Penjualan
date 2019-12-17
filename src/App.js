import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Container, Jumbotron, Button, Nav, Navbar, Form, FormControl, Col, Row, Table, Card, Modal } from 'react-bootstrap';
// AMBIL DARI FILE LAIN
import Main from './Halaman/Main';
import Kasir from './Halaman/Kasir';
import Laporan from './Halaman/Laporan';
import Barang from './Halaman/Barang';
import Stok from './Halaman/Stok';

class App extends Component {
  render() {
    return (
      <Router>
        <Container>
          <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">Minimarketku</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/kasir">Kasir</Nav.Link>
                <Nav.Link href="/laporan">Histori</Nav.Link>
                <Nav.Link href="/barang">Barang</Nav.Link>
                <Nav.Link href="/stok">Stok</Nav.Link>
              </Nav>
              <Form inline>
                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                <Button variant="outline-success">Search</Button>
              </Form>
            </Navbar.Collapse>
          </Navbar>
          <Jumbotron>
            <Switch>
              <Route exact path="/">
                <Main />
              </Route>
              <Route path="/kasir">
                <Kasir />
              </Route>
              <Route path="/laporan">
                <Laporan />
              </Route>
              <Route path="/barang">
                <Barang />
              </Route>
              <Route path="/stok">
                <Stok />
              </Route>
            </Switch>
          </Jumbotron>
        </Container>
      </Router>
    );
  }
}

export default App;
