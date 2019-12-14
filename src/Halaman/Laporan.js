import React, { Component } from 'react';
import { Container, InputGroup, Jumbotron, Button, Nav, Navbar, Form, FormControl, Col, Row, Table, Card, Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import axios from 'axios'
import NumberFormat from 'react-number-format';

const url = 'http://127.0.0.1:3001'

class Laporan extends Component {

    state = {
        showModalEdit: false,
        stateLaporan: '',
        columns: [
            {
                name: 'Tanggal Terjual',
                selector: 'tgl_penjualan',
                sortable: true,
                format: d => moment(d.tgl_penjualan).format('ll')
            },
            {
                name: 'Nama Barang',
                selector: 'nama_barang',
                sortable: true,
            },
            {
                name: 'QTY Jual',
                selector: 'qty_beli',
                sortable: true,
                cell: (row) => `${row.qty_beli}`
            },
            {
                name: 'Total Jual',
                selector: 'total_pembelian',
                sortable: true,
                cell: (row) => `Rp. ${row.total_pembelian}`
            },
            {
                name: 'Opsi',
                selector: 'opsi',
                sortable: true,
                cell: (row) => <Button onClick={() => this.showModalEdit(row.id_penjualan, row.id_barang)}>Hapus | Edit</Button>
            }],
        dataHarian: [],
        dataEdit: [],
        dataBarang: [],
        totalHarian: 0,
        id_penjualan: '',
        id_barang: '',
        tgl_penjualan: moment().format('YYYY-MM-DD')
    }

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.getDataFromApi(this.state.tgl_penjualan)
        this.getBarang()
    }

    getDataFromApi = async (tanggal) => {
        try {
            const result = await (axios.get(`${url}/penjualan/${tanggal}`))
            const newData = result.data
            this.setState({
                dataHarian: newData
            })
            this.nav('harian')
            this.getTotalHarian(this.state.tgl_penjualan)
        } catch (error) {
            alert(error)
        }
    }

    getTotalHarian = async (tanggal) => {
        try {
            const result = await (axios.get(`${url}/total_harian/${tanggal}`))
            const newData = result.data[0]
            this.setState({
                totalHarian: newData
            })
            console.log(this.state.totalHarian.hasil)
        } catch (error) {
            console.log(error)
        }
    }

    getDataById = async (id_penjualan) => {
        try {
            const result = await (axios.get(`${url}/editpenjualan/${id_penjualan}`))
            const newData = result.data
            this.setState({
                dataEdit: newData
            })
            console.log(this.state.dataEdit)
        } catch (error) {
            console.log(error)
        }
    }

    getBarang = async () => {
        try {
            const result = await (axios.get(`${url}/barang/`))
            const newData = result.data
            this.setState({
                dataBarang: newData
            })
            console.log()
        } catch (error) {
            console.log(error)
        }
    }

    hapusDataApi = async (id_penjualan) => {
        // alert(id_penjualan)
        try {
            const result = await (axios.delete(`${url}/penjualan/${id_penjualan}`))
            alert('Data Berhasil dihapus')
            this.getDataFromApi(this.state.tgl_penjualan)
        } catch (error) {
            console.log(error)
        }
    }

    showModalEdit = (id_penjualan, id_barang) => {
        this.setState({
            showModalEdit: true,
            id_penjualan: id_penjualan,
            id_barang: id_barang,
        })
    }

    hideModal = () => {
        this.setState({ showModalEdit: false })
    }

    buildTittle = (key) => {
        if (key === 'harian') {
            return <span>
                Laporan Harian <span>Tanggal: {this.state.tgl_penjualan}</span><span style={{ float: 'right' }}>
                    <Form.Group>
                        <InputGroup>
                            <Form.Control value={this.state.tgl_penjualan} onChange={(event) => this.setState({ tgl_penjualan: event.target.value })} type="date" placeholder="Tanggal Penjualan" />
                            <Button onClick={() => this.getDataFromApi(this.state.tgl_penjualan)}>Cari</Button>
                        </InputGroup>
                    </Form.Group></span>
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
                <h2 style={{ marginTop: 5 }}>Total Penjualan Tanggal {this.state.tgl_penjualan} :
        <span style={{ float: 'right' }}><NumberFormat value={this.state.totalHarian.hasil} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></span>
                </h2>
                <Modal show={this.state.showModalEdit} onHide={this.hideModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group >
                                <Form.Label>Tanggal Jual</Form.Label>
                                <Form.Control type="number" placeholder="Harga Jual" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Nama Barang</Form.Label>
                                <Form.Control onChange={(event) => this.setState({ id_barang: event.target.value })} value={this.state.id_barang} as="select">
                                    <option value={''}>--Pilih Barang --</option>
                                    {this.state.dataBarang.map((item, index) => (
                                        <option key={index} value={item.id_barang}>{item.nama_barang}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>QTY Jual</Form.Label>
                                <Form.Control type="number" placeholder="Stok" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Total Jual</Form.Label>
                                <Form.Control type="number" placeholder="Harga Pokok" />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.hapusDataApi(this.state.id_penjualan)}>
                            Hapus
              </Button>
                        <Button variant="primary">Edit Data
              </Button>
                    </Modal.Footer>
                </Modal>
            </Container >
        );
    }
}

export default Laporan