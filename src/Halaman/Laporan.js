import React, { Component } from 'react';
import { Container, Jumbotron, Button, Nav, Navbar, Form, FormControl, Col, Row, Table, Card, Modal } from 'react-bootstrap';

class Laporan extends Component {

    state = {
        showModalTambah: false,
        stateCard: ''
    }

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.nav('harian')
    }

    showModalTambah = () => {
        this.setState({ showModalTambah: true })
    }

    hideModal = () => {
        this.setState({ showModalTambah: false })
    }

    nav = (key) => {
        if (key == 'harian') {
            this.setState({
                stateCard:
                    <Card.Body>
                        <Card.Title>LAPORAN KEUANGAN HARIAN</Card.Title>
                        {/* <DataTable
                            title="Barang yang di jual"
                            columns={this.state.columns}
                            data={this.state.orders}
                            pagination
                        /> */}
                    </Card.Body>
            })
        } else {
            this.setState({
                stateCard:
                    <Card.Body>
                        <Card.Title>UNTUK BULANAN</Card.Title>
                        <Card.Text>
                            With supporting text below as a natural lead-in to additional content.
                    </Card.Text>
                        <Button variant="primary">Go somewhere</Button>
                    </Card.Body>
            })
        }
    }

    render() {
        return (
            <Container style={{ marginTop: '20px' }}>
                <Row>
                    <Col sm>
                        <Row>
                            <Col sm>
                                <h1>Laporan Keuangan</h1>
                                <hr></hr>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Card>
                    <Card.Header>
                        <Nav variant="tabs" defaultActiveKey="harian" onSelect={(key) => this.nav(key)}>
                            <Nav.Item>
                                <Nav.Link eventKey="harian">Harian</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="bulanan">Bulanan</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Card.Header>
                    {this.state.stateCard}
                </Card>
                <Modal show={this.state.showModalTambah} onHide={this.hideModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Tambah Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Kode Barang</Form.Label>
                                <Form.Control type="text" placeholder="Kode Barang" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Nama Barang</Form.Label>
                                <Form.Control type="text" placeholder="Nama Barang" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Stok</Form.Label>
                                <Form.Control type="number" placeholder="Stok" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Harga Pokok</Form.Label>
                                <Form.Control type="number" placeholder="Harga Pokok" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Harga Jual</Form.Label>
                                <Form.Control type="number" placeholder="Harga Jual" />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.hideModal}>
                            Keluar
              </Button>
                        <Button variant="primary">Tambah data
              </Button>
                    </Modal.Footer>
                </Modal>
            </Container >
        );
    }
}

export default Laporan