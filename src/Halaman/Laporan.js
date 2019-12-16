import React, { Component } from 'react';
import { Container, InputGroup, Jumbotron, Button, Nav, Navbar, Form, FormControl, Col, Row, Table, Card, Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import moment from 'moment';
import axios from 'axios'
import NumberFormat from 'react-number-format';

const url = 'http://127.0.0.1:3001'
const columnsBulanan = [
    {
        name: 'Nama Barang',
        selector: 'nama_barang',
        sortable: true,
    },
    {
        name: 'Total QTY Terjual',
        selector: 'total_qty_penjualan',
        sortable: true,
    },
    {
        name: 'Total Pembelian',
        selector: 'jumlah_pembelian',
        sortable: true,
        cell: (row) => `Rp. ${row.jumlah_pembelian}`
    },
]

class Laporan extends Component {

    state = {
        showModalEdit: false,
        showModalTambah: false,
        stateLaporan: '',
        stateJumlahHarian: true,
        stateJumlahBulanan: false,
        dataHarian: [],
        dataBulanan: [],
        dataEdit: [],
        dataBarang: [],
        totalHarian: 0,
        totalBulanan: 0,
        id_penjualan: '',
        id_barang: '',
        tgl_penjualan: '',
        qty_beli: '',
        qty_beliCek: '',
        stokTersedia: '',
        total_pembelian: '',
        tgl_penjualan: moment().format('YYYY-MM-DD'),
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
                cell: (row) => <Button onClick={() => this.showModalEdit(row.id_penjualan, row.id_barang, moment(row.tgl_penjualan).format('YYYY-MM-DD'), row.qty_beli, row.total_pembelian)}>Hapus | Edit</Button>
            }]
    }

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.getDataFromApi(this.state.tgl_penjualan)
        this.getBarang()
        this.getBulanan()
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

        } catch (error) {
            console.log(error)
        }
    }

    getTotalBulanan = async () => {
        const bulan = moment().format('MM')
        const tahun = moment().format('YYYY')

        try {
            const result = await (axios.get(`${url}/total_bulanan/${bulan}/${tahun}`))
            const newData = result.data[0]
            this.setState({
                totalBulanan: newData
            })
            console.log(this.state.totalBulanan.jml_bulanan)
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

        } catch (error) {
            console.log(error)
        }
    }

    hapusDataApi = async (id_penjualan = this.state.id_penjualan) => {
        // alert(id_penjualan)
        try {
            const result = await (axios.delete(`${url}/penjualan/${id_penjualan}`))
            alert('Data Berhasil dihapus')
            this.getDataFromApi(this.state.tgl_penjualan)
        } catch (error) {
            console.log(error)
        }
    }

    postDataToApi = async () => {
        // CEK STOK DULU
        if (this.state.stokTersedia < this.state.qty_beli) {
            alert('qty melebihi sisa stok yang tersedia')
        } else {
            try {
                await axios.post(`${url}/penjualan`, {
                    id_barang: this.state.id_barang,
                    tgl_penjualan: this.state.tgl_penjualan,
                    qty_beli: Number(this.state.qty_beli),
                    total_pembelian: Number(this.state.total_pembelian)
                })
                this.ubahStokBarang(this.state.id_barang, this.state.qty_beli)
            } catch (error) {
                console.log(error)
            }
        }
    }

    removeStates = () => {
        this.setState({
            id_barang: '',
            tgl_penjualan: '',
            qty_beli: '',
            total_pembelian: ''
        })
    }

    cekStok = async () => {
        const { id_barang, tgl_penjualan, qty_beli, total_pembelian } = this.state
        if (id_barang === '' || tgl_penjualan === '' || qty_beli === '' || total_pembelian === '') {
            alert('harap di isi dahulu')
        } else {
            try {
                const result = await (axios.get(`${url}/barang/${id_barang}`))
                const newData = result.data[0].sisa_stok
                this.setState({
                    stokTersedia: newData
                })
                if (this.state.stokTersedia <= 0) {
                    alert('stok sudah tidak tersedia')
                } else {
                    this.postDataToApi()
                }
                console.log(this.state.stokTersedia)
            } catch (error) {
                console.log(error)
            }
        }
    }

    cekStokEdit = async () => {

        const { id_barang, tgl_penjualan, qty_beli, total_pembelian } = this.state
        if (id_barang === '' || tgl_penjualan === '' || qty_beli === '' || total_pembelian === '') {
            alert('harap di isi dahulu')
        } else {
            try {
                const result = await (axios.get(`${url}/barang/${id_barang}`))
                const newData = result.data[0].sisa_stok
                this.setState({
                    stokTersedia: newData
                })
                this.editDataApi()
                console.log(this.state.stokTersedia)
            } catch (error) {
                console.log(error)
            }
        }
    }

    editDataApi = async (id_penjualan = this.state.id_penjualan) => {
        // CEK STOK DULU
        if (this.state.qty_beli < 0) {
            alert('harap masukkan data yang valid')
        } else {
            if (this.state.stokTersedia < this.state.qty_beli) {
                alert(`${this.state.stokTersedia}, ${this.state.qty_beli}`)
                alert('qty melebihi sisa stok yang tersedia')
            } else if (this.state.qty_beli > this.state.qty_beliCek) {
                // alert('besar')
                let qty_beli = Number(this.state.qty_beli) - Number(this.state.qty_beliCek)
                try {
                    await axios.put(`${url}/penjualan/${id_penjualan}`, {
                        id_barang: this.state.id_barang,
                        tgl_penjualan: this.state.tgl_penjualan,
                        qty_beli: Number(this.state.qty_beli),
                        total_pembelian: Number(this.state.total_pembelian)
                    })
                    this.ubahStokBarang(this.state.id_barang, qty_beli)
                } catch (error) {
                    console.log(error)
                }
            } else if (this.state.qty_beli < this.state.qty_beliCek) {
                // alert('kecil')
                let qty_beli = Number(this.state.qty_beliCek) - Number(this.state.qty_beli)
                try {
                    await axios.put(`${url}/penjualan/${id_penjualan}`, {
                        id_barang: this.state.id_barang,
                        tgl_penjualan: this.state.tgl_penjualan,
                        qty_beli: Number(this.state.qty_beli),
                        total_pembelian: Number(this.state.total_pembelian)
                    })
                    this.ubahStokBarangTambah(this.state.id_barang, qty_beli)
                } catch (error) {
                    console.log(error)
                }
            } else {
                try {
                    await axios.put(`${url}/penjualan/${id_penjualan}`, {
                        id_barang: this.state.id_barang,
                        tgl_penjualan: this.state.tgl_penjualan,
                        qty_beli: Number(this.state.qty_beli),
                        total_pembelian: Number(this.state.total_pembelian)
                    })
                    // this.ubahStokBarang(this.state.id_barang, this.state.qty_beli)
                    this.setState({ showModalTambah: false, showModalEdit: false })
                    this.getDataFromApi(this.state.tgl_penjualan)
                } catch (error) {
                    console.log(error)
                }
            }
        }
        // else{
        //     try {
        //         await axios.post(`${url}/penjualan`, {
        //             id_barang: this.state.id_barang,
        //             tgl_penjualan: this.state.tgl_penjualan,
        //             qty_beli: Number(this.state.qty_beli),
        //             total_pembelian: Number(this.state.total_pembelian)
        //         })
        //         this.ubahStokBarang(this.state.id_barang, this.state.qty_beli)
        //     } catch (error) {
        //         console.log(error)
        //     }
        // }
    }

    ubahStokBarang = async (id_barang, qty_beli) => {
        try {
            await axios.put(`${url}/ubahstok/${id_barang}`, {
                qty_beli: qty_beli
            })
            alert('proses input selesai')
            this.setState({ showModalTambah: false, showModalEdit: false })
            this.getDataFromApi(this.state.tgl_penjualan)
        } catch (error) {
            console.log(error)
        }
    }

    ubahStokBarangTambah = async (id_barang, qty_beli) => {

        try {
            await axios.put(`${url}/ubahstoktambah/${id_barang}`, {
                qty_beli: qty_beli
            })
            alert('proses input selesai')
            this.setState({ showModalEdit: false })
            this.getDataFromApi(this.state.tgl_penjualan)
        } catch (error) {
            console.log(error)
        }
    }

    showModalEdit = (id_penjualan, id_barang, tgl_penjualan, qty_beli, total_pembelian) => {
        this.setState({
            showModalEdit: true,
            id_penjualan: id_penjualan,
            id_barang: id_barang,
            tgl_penjualan: tgl_penjualan,
            qty_beli: qty_beli,
            qty_beliCek: qty_beli,
            total_pembelian: total_pembelian,
        })
        console.log(id_penjualan, id_barang, tgl_penjualan, qty_beli)
    }

    showModalTambah = () => {
        this.removeStates()
        this.setState({
            showModalTambah: true
        })
    }

    hideModal = () => {
        this.setState({ showModalEdit: false })
    }

    hideModalTambah = () => {
        this.setState({ showModalTambah: false })
    }

    getBulanan = async () => {
        try {
            const result = await (axios.get(`${url}/penjualan_bulanan`))
            const newData = result.data
            this.setState({
                dataBulanan: newData
            })
            console.log(this.state.dataBulanan)
        } catch (error) {
            console.log(error)
        }
    }

    buildTittle = (key) => {
        if (key === 'harian') {
            return <span>
                Laporan Harian <span>Tanggal: {this.state.tgl_penjualan}</span><span style={{ float: 'right' }}>
                    <Form.Group>
                        <InputGroup>
                            <Form.Control value={this.state.tgl_penjualan} onChange={(event) => this.setState({ tgl_penjualan: event.target.value })} type="date" placeholder="Tanggal Penjualan" />
                            <Button onClick={() => this.getDataFromApi(this.state.tgl_penjualan)}>Cari</Button>
                            <Button style={{ marginLeft: 5 }} onClick={() => this.showModalTambah()}>Tambah Data</Button>
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
                    </Card.Body>,
                stateJumlahHarian: true,
                stateJumlahBulanan: false,
            })
        } else {
            this.getTotalBulanan()
            this.setState({
                stateLaporan:
                    <Card.Body>
                        <DataTable
                            title={this.buildTittle(key)}
                            columns={columnsBulanan}
                            data={this.state.dataBulanan}
                            pagination
                        />
                    </Card.Body>,
                stateJumlahHarian: false,
                stateJumlahBulanan: true,
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
                {this.state.stateJumlahHarian && <h2 style={{ marginTop: 5 }}>Total Penjualan Tanggal {this.state.tgl_penjualan} :
        <span style={{ float: 'right' }}><NumberFormat value={this.state.totalHarian.hasil} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></span>
                </h2>}
                {this.state.stateJumlahBulanan && <h2 style={{ marginTop: 5 }}>Total Penjualan Bulan {moment().format('MMMM')} :
        <span style={{ float: 'right' }}><NumberFormat value={this.state.totalBulanan.jml_bulanan} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></span>
                </h2>}
                <Modal show={this.state.showModalEdit} onHide={this.hideModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
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
                                <Form.Label>Tanggal Jual</Form.Label>
                                <Form.Control type="date" value={this.state.tgl_penjualan} onChange={(event) => this.setState({ tgl_penjualan: event.target.value })} />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>QTY Jual</Form.Label>
                                <Form.Control min={0} type="number" placeholder="QTY Jual" onChange={(event) => this.setState({ qty_beli: event.target.value })} value={this.state.qty_beli} />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Total Jual</Form.Label>
                                <Form.Control min={0} type="number" onChange={(event) => this.setState({ total_pembelian: event.target.value })} value={this.state.total_pembelian} placeholder="Total Penjualan" />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.hapusDataApi()}>
                            Hapus
              </Button>
                        <Button variant="primary" onClick={() => this.cekStokEdit()}>Edit Data </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showModalTambah} onHide={this.hideModalTambah}>
                    <Modal.Header closeButton>
                        <Modal.Title>Tambah Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
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
                                <Form.Label>Tanggal Jual</Form.Label>
                                <Form.Control type="date" value={this.state.tgl_penjualan} onChange={(event) => this.setState({ tgl_penjualan: event.target.value })} />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>QTY Jual</Form.Label>
                                <Form.Control type="number" placeholder="QTY Jual" onChange={(event) => this.setState({ qty_beli: event.target.value })} value={this.state.qty_beli} />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Total Jual</Form.Label>
                                <Form.Control type="number" onChange={(event) => this.setState({ total_pembelian: event.target.value })} value={this.state.total_pembelian} placeholder="Total Penjualan" />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.hideModalTambah()}>
                            Keluar
              </Button>
                        <Button variant="primary" onClick={() => this.cekStok()}>Tambah Data </Button>
                    </Modal.Footer>
                </Modal>
            </Container >
        );
    }
}

export default Laporan