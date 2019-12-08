import React, { Component } from 'react';
import { Container, Jumbotron, Button, Nav, Navbar, Form, FormControl, Col, Row, Table, Card, Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import moment from 'moment';

class Laporan extends Component {

    state = {
        showModalTambah: false,
        stateLaporan: '',
        columns: [
            {
                name: 'No.',
                selector: 'nomor',
                sortable: true,
            },
            {
                name: 'Kode Barang',
                selector: 'kode_barang',
                sortable: true,
            },
            {
                name: 'Nama Barang',
                selector: 'nama_barang',
                sortable: true,
            },
            {
                name: 'QTY Jual',
                selector: 'qty_jual',
                sortable: true,
            },
            {
                name: 'Sisa Stok',
                selector: 'sisa_stok',
                sortable: true,
            },
            {
                name: 'Harga Jual',
                selector: 'harga_jual',
                sortable: true,
            },
            {
                name: 'Harga Pokok',
                selector: 'harga_pokok',
                sortable: true,
            },
            {
                name: 'Opsi',
                selector: 'opsi',
                sortable: true,
            }],
        dataHarian: [{
            kode_barang: '718051794',
            nama_barang: 'Pepsodin',
            harga_jual: 2000,
            harga_pokok: 1000,
            stok: 5,
            harga_akhir: 0
        },
        {
            kode_barang: 'B0002',
            nama_barang: 'Autisna',
            harga_jual: 3000,
            harga_pokok: 2000,
            stok: 4,
            harga_akhir: 0
        },
        {
            kode_barang: 'B0003',
            nama_barang: 'Obege',
            harga_jual: 5000,
            harga_pokok: 4000,
            stok: 1,
            harga_akhir: 0
        },],
        dataBulanan: [{
            kode_barang: 'asdasd',
            nama_barang: 'Pepsoasdasdin',
            harga_jual: 2000,
            harga_pokok: 1000,
            stok: 5,
            harga_akhir: 0
        },
        {
            kode_barang: 'B00asdasd02',
            nama_barang: 'Autasdasdisna',
            harga_jual: 3000,
            harga_pokok: 2000,
            stok: 4,
            harga_akhir: 0
        },
        {
            kode_barang: 'B0adasdasd003',
            nama_barang: 'Obasdasdasege',
            harga_jual: 5000,
            harga_pokok: 4000,
            stok: 1,
            harga_akhir: 0
        },]
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

    buildTittle = (key) => {
        if (key === 'harian') {
            return <span>
                Laporan Harian <span>Tanggal: {moment().format('DD-MMMM-YYYY')}</span>
            </span>
        } else {
            return <span>
                Laporan Bulanan <span>Bulan: {moment().format('MMMM')}</span>
            </span>
        }
    }

    nav = (key) => {
        if (key === 'harian') {
            this.setState({
                stateLaporan:
                    <Card.Body>
                        <DataTable
                            title={this.buildTittle(key)}
                            columns={this.state.columns}
                            data={this.state.dataHarian}
                            pagination
                        />
                    </Card.Body>
            })
        } else {
            this.setState({
                stateLaporan:
                    <Card.Body>
                        <DataTable
                            title={this.buildTittle(key)}
                            columns={this.state.columns}
                            data={this.state.dataBulanan}
                            pagination
                        />
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
                    {this.state.stateLaporan}
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