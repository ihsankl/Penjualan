import React, { Component } from 'react';
import { Container, Jumbotron, Button, Nav, Navbar, Form, FormControl, Col, Row, Table, Card, Modal } from 'react-bootstrap';

class Stok extends Component {

    state = {
        showModalTambah: false
    }

    showModalTambah = () => {
        this.setState({ showModalTambah: true })
    }

    hideModal = () => {
        this.setState({ showModalTambah: false })
    }

    render() {
        return (
            <Container style={{ marginTop: '20px' }}>
                <Row>
                    <Col sm>
                        <Row>
                            <Col sm>
                                <h1>Daftar Stok</h1>
                                <hr></hr>
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                            <Col></Col>
                            <Col sm>
                                <Button block={true} onClick={this.showModalTambah} variant="primary">+ Tambah data stok</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col sm>
                        <Card>
                            <Card.Body>
                                <Table responsive striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Nama Distributor</th>
                                            <th>Tanggal Masuk</th>
                                            <th>QTY</th>
                                            <th>Jumlah Beli</th>
                                            <th>Harga Pokok</th>
                                            <th>Harga Jual</th>
                                            <th>Sisa Stok</th>
                                            <th>Opsi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th>Nama Distributor</th>
                                            <th>Tanggal Masuk</th>
                                            <th>QTY</th>
                                            <th>Jumlah Beli</th>
                                            <th>Harga Pokok</th>
                                            <th>Harga Jual</th>
                                            <th>Sisa Stok</th>
                                            <th>Opsi</th>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Modal show={this.state.showModalTambah} onHide={this.hideModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Tambah Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Nama Distributor</Form.Label>
                                <Form.Control type="text" placeholder="Nama Distributor" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Tanggal Masuk</Form.Label>
                                <Form.Control type="text" placeholder="Tanggal Masuk" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>QTY</Form.Label>
                                <Form.Control type="number" placeholder="QTY" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Total Bayar</Form.Label>
                                <Form.Control type="number" placeholder="Total Bayar" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Harga Pokok</Form.Label>
                                <Form.Control type="number" placeholder="Harga Pokok" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Harga Jual</Form.Label>
                                <Form.Control type="number" placeholder="Harga Jual" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Sisa Stok</Form.Label>
                                <Form.Control readOnly={true} type="text" placeholder="Sisa Stok" />
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

                {/* <Modal show={this.state.showModal2} onHide={this.hideModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Tambah Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Kode Barang</Form.Label>
                                <Form.Control value={this.state._kodeBarang} onChange={(event) => this.setState({ _kodeBarang: event.target.value })}
                                    type="text" placeholder="Kode Barang" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Nama Barang</Form.Label>
                                <Form.Control value={this.state._namaBarang} onChange={(event) => this.setState({ _namaBarang: event.target.value })}
                                    type="text" placeholder="Nama Barang" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Stok</Form.Label>
                                <Form.Control value={this.state._stok} onChange={(event) => this.setState({ _stok: event.target.value })}
                                    type="number" placeholder="Stok" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Harga Pokok</Form.Label>
                                <Form.Control value={this.state._hargaPokok} onChange={(event) => this.setState({ _hargaPokok: event.target.value })}
                                    type="number" placeholder="Harga Pokok" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Harga Jual</Form.Label>
                                <Form.Control value={this.state._hargaJual} onChange={(event) => this.setState({ _hargaJual: event.target.value })}
                                    type="number" placeholder="Harga Jual" />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => this.deleteDataBarangApi()}>
                            Hapus data
              </Button>
                        <Button variant="primary" onClick={() => this.editDataBarangApi()}>
                            Edit data
              </Button>
                    </Modal.Footer>
                </Modal> */}
            </Container >
        );
    }
}
export default Stok;