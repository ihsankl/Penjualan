import React, { Component } from 'react';
import { Container, ButtonGroup, Jumbotron, Button, Nav, Navbar, Form, FormControl, Col, Row, Table, Card, Modal } from 'react-bootstrap';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import moment from 'moment'

const url = 'http://127.0.0.1:3001'

class Stok extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModalTambah: false,
            showModalEdit: false,
            loading: true,
            // STATE UNTUK INPUT BARANG

            id_pembelian: '',
            id_supplier: '',
            id_barang: '',
            tgl_pembelian: '',
            tgl_exp: '',
            qty: 0,
            total_pembelian: 0,

            // END STATE BARANG
            dataStok: [],
            dataSupplier: [],
            dataBarang: [],
            columns: [
                {
                    name: 'Supplier',
                    selector: 'nama_supplier',
                    sortable: true,
                },
                {
                    name: 'Nama Barang',
                    selector: 'nama_barang',
                    sortable: true,
                },
                {
                    name: 'Tanggal Pembelian',
                    selector: 'tgl_pembelian',
                    sortable: true,
                    format: d => moment(d.tgl_pembelian).format('ll')
                },
                {
                    name: 'Tanggal Expired',
                    selector: 'tgl_exp',
                    sortable: true,
                    format: d => moment(d.tgl_exp).format('ll')
                },
                {
                    name: 'QTY',
                    selector: 'qty',
                    sortable: true,
                },
                {
                    name: 'Total Beli',
                    selector: `total_pembelian`,
                    sortable: true,
                },
                {
                    name: 'Opsi',
                    button: true,
                    cell: row => <div><button onClick={() => this.deleteDataApi(row.id_pembelian, row.id_barang)} style={{ border: '2px solid red', color: 'red', padding: '5px 15px', textAlign: 'center', textDecoration: 'none', display: 'inline-block' }} >Hapus</button> <br></br> <button onClick={() => this.showModalEdit(row.id_pembelian, row.id_supplier, row.id_barang, (moment(row.tgl_pembelian).format('YYYY-MM-DD')), (moment(row.tgl_exp).format('YYYY-MM-DD')), row.qty, row.total_pembelian)} style={{ width: '100%', marginTop: '5px', border: '2px solid blue', color: 'blue', padding: '5px 15px', textAlign: 'center', textDecoration: 'none', display: 'inline-block' }} >Edit</button></div>
                },
            ]
        }
    }

    componentDidMount() {
        this.getDataFromApi()
        this.getSupplierBarang()
    }

    // getDataFromApi = async () => {
    //     await axios.all([reqBarangGet, reqSupplyGet])
    //         .then(axios.spread((...response) => {
    //             const resOne = response[0].data
    //             const resTwo = response[1].data
    //             this.setState({
    //                 dataBarang: resOne,
    //                 dataSupply: resTwo
    //             })
    //         }))
    //         .catch(error => {
    //             // handle error
    //             alert(error);
    //         })
    // }

    getDataFromApi = async () => {
        try {
            const result = await axios.get(`${url}/pembelian`)
            const newData = result.data
            this.setState({
                dataStok: newData,
                loading: false
            })

        } catch (error) {
            alert(error)
        }
    }

    getSupplierBarang = async () => {
        try {
            const result = await axios.all([(axios.get(`${url}/supplier`)), (axios.get(`${url}/barang`))])
            const res1 = result[0].data
            const res2 = result[1].data
            this.setState({
                dataSupplier: res1,
                dataBarang: res2,
                loading: false
            })
        } catch (error) {
            alert(error)
        }
    }

    getSupplyBarangById = async () => {
        const id_barang = this.state.id_barang
        if (this.state.id_supplier === '' || this.state.id_barang === '' || this.state.tgl_pembelian === '' || this.state.tgl_exp === '' || this.state.qty === '' || this.state.total_pembelian === 0) {
            alert('harap di isi')
        } else {
            try {
                const data = await axios.get(`${url}/pembelian/barang/${id_barang}`)

                if (data.data.length === 0) {
                    this.postDataToApi()
                } else {
                    alert('data sudah ada')
                }
            } catch (error) {
                return false
            }
        }
    }

    postDataToApi = async () => {
        try {
            await axios.post(`${url}/pembelian`, {
                id_supplier: this.state.id_supplier,
                id_barang: this.state.id_barang,
                tgl_pembelian: this.state.tgl_pembelian,
                tgl_exp: this.state.tgl_exp,
                qty: this.state.qty,
                total_pembelian: this.state.total_pembelian,
            })
            this.insertQtyBarang()
            alert('berhasil')
            this.setState({ showModalTambah: false })
            this.getDataFromApi()
        } catch (error) {
            alert(error)
        }
    }

    insertQtyBarang = async () => {
        const id_barang = this.state.id_barang
        try {
            await axios.put(`${url}/ubahbarang/${id_barang}`, {
                stok_barang: this.state.qty
            })
        } catch (error) {
            alert(`kesalahan pada saat input qty: ${error}`)
        }
    }

    hapusQtyBarang = async(id_barang) => {
        try {
            await axios.put(`${url}/hapusbarang/${id_barang}`, {
                stok_barang: 0
            })
        } catch (error) {
            alert(`kesalahan pada saat hapus qty: ${error}`)
        }
    }

    editDataApi = async () => {
        const { id_pembelian, id_supplier, id_barang, tgl_pembelian, tgl_exp, qty, total_pembelian } = this.state
        if (this.state.id_supplier === '' || this.state.id_barang === '' || this.state.tgl_pembelian === '' || this.state.tgl_exp === '' || this.state.qty === '' || this.state.total_pembelian === 0) {
            alert('harap di isi')
        } else {
            try {
                await axios.put(`${url}/pembelian/${id_pembelian}`, {
                    id_supplier: id_supplier,
                    id_barang: id_barang,
                    tgl_pembelian: tgl_pembelian,
                    tgl_exp: tgl_exp,
                    qty: qty,
                    total_pembelian: total_pembelian,
                })
                this.insertQtyBarang()
                alert('berhasil')
                this.setState({ showModalEdit: false })
                this.getDataFromApi()
            } catch (error) {
                alert(error)
            }
        }
    }

    deleteDataApi = async (id_pembelian, id_barang) => {
        try {
            await axios.delete(`${url}/pembelian/${id_pembelian}`)
            this.hapusQtyBarang(id_barang)
            alert('Data Berhasil dihapus')
            this.setState({ showModal: false })
            this.getDataFromApi()
        } catch (error) {
            console.log({ error })
            alert(error)
        }

    }

    showModalTambah = () => {
        this.setState({ showModalTambah: true })
    }

    hideModal = () => {
        this.setState({ showModalTambah: false })
    }

    showModalEdit = (id_pembelian, id_supplier, id_barang, tgl_pembelian, tgl_exp, qty, total_pembelian) => {
        this.setState({ showModalEdit: true })
        this.setState({
            id_pembelian: id_pembelian,
            id_supplier: id_supplier,
            id_barang: id_barang,
            tgl_pembelian: tgl_pembelian,
            tgl_exp: tgl_exp,
            qty: qty,
            total_pembelian: total_pembelian,
        })
    }

    hideModalEdit = () => {
        this.setState({ showModalEdit: false })
    }

    render() {
        return (
            <Container style={{ marginTop: '20px' }}>
                <Row>
                    <Col sm>
                        <Row style={{ marginBottom: 10 }}>
                            <Col><h1>Daftar Stok</h1></Col>
                            <Col sm>
                                <Row>
                                    <Col style={{ float: 'right' }} sm>
                                        <Button style={{ marginBottom: 5 }} block onClick={this.showModalTambahSupplier} variant="primary">+ Tambah Supplier</Button>
                                    </Col>
                                    <Col style={{ float: 'right' }} sm>
                                        <Button block onClick={() => this.showModalTambah()} variant="primary">+ Tambah data Stok</Button>
                                        {/* <Button block onClick={this.showModalTambah} variant="primary">+ Tambah data barang</Button> */}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <hr></hr>
                    </Col>
                </Row>
                <Row>
                    <Col sm>
                        <Card>
                            <Card.Body>
                                {!this.state.loading && <DataTable
                                    columns={this.state.columns}
                                    data={this.state.dataStok}
                                    pagination
                                />}
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
                                <Form.Label>Supplier</Form.Label>
                                <Form.Control onChange={(event) => this.setState({ id_supplier: event.target.value })} value={this.state.id_supplier} as="select">
                                    <option value={''}>--Pilih Supplier --</option>
                                    {this.state.dataSupplier.map((item, index) => (
                                        <option key={index} value={item.id_supplier}>{item.nama_supplier}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Barang</Form.Label>
                                <Form.Control onChange={(event) => this.setState({ id_barang: event.target.value })} value={this.state.id_barang} as="select">
                                    <option value={''}>--Pilih Barang --</option>
                                    {this.state.dataBarang.map((item, index) => (
                                        <option key={index} value={item.id_barang}>{item.nama_barang}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Row>
                                <Col>
                                    <Form.Group >
                                        <Form.Label>Tanggal Pembelian</Form.Label>
                                        <Form.Control value={this.state.tgl_pembelian} onChange={(event) => this.setState({ tgl_pembelian: event.target.value })} type="date" placeholder="Tanggal Pembelian" />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group >
                                        <Form.Label>Tanggal Expired</Form.Label>
                                        <Form.Control type="date" value={this.state.tgl_exp} onChange={(event) => this.setState({ tgl_exp: event.target.value })} placeholder="Tanggal Expired" />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group >
                                <Form.Label>QTY</Form.Label>
                                <Form.Control value={this.state.qty} onChange={(event) => this.setState({ qty: event.target.value })} type="number" placeholder="QTY" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Total Pembelian</Form.Label>
                                <Form.Control value={this.state.total_pembelian} onChange={(event) => this.setState({ total_pembelian: event.target.value })} type="number" placeholder="Total Pembelian" />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.hideModal}>
                            Keluar
              </Button>
                        <Button onClick={() => { this.getSupplyBarangById(); }} variant="primary">Tambah data
              </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showModalEdit} onHide={this.hideModalEdit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Supplier</Form.Label>
                                <Form.Control onChange={(event) => this.setState({ id_supplier: event.target.value })} value={this.state.id_supplier} as="select">
                                    <option value={''}>--Pilih Supplier --</option>
                                    {this.state.dataSupplier.map((item, index) => (
                                        <option key={index} value={item.id_supplier}>{item.nama_supplier}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Barang</Form.Label>
                                <Form.Control onChange={(event) => this.setState({ id_barang: event.target.value })} value={this.state.id_barang} as="select">
                                    <option value={''}>--Pilih Barang --</option>
                                    {this.state.dataBarang.map((item, index) => (
                                        <option key={index} value={item.id_barang}>{item.nama_barang}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Row>
                                <Col>
                                    <Form.Group >
                                        <Form.Label>Tanggal Pembelian</Form.Label>
                                        <Form.Control value={this.state.tgl_pembelian} onChange={(event) => this.setState({ tgl_pembelian: event.target.value })} type="date" placeholder="Tanggal Pembelian" />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group >
                                        <Form.Label>Tanggal Expired</Form.Label>
                                        <Form.Control type="date" value={this.state.tgl_exp} onChange={(event) => this.setState({ tgl_exp: event.target.value })} placeholder="Tanggal Expired" />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group >
                                <Form.Label>QTY</Form.Label>
                                <Form.Control value={this.state.qty} onChange={(event) => this.setState({ qty: event.target.value })} type="number" placeholder="QTY" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Total Pembelian</Form.Label>
                                <Form.Control value={this.state.total_pembelian} onChange={(event) => this.setState({ total_pembelian: event.target.value })} type="number" placeholder="Total Pembelian" />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.hideModalEdit}>
                            Keluar
              </Button>
                        <Button onClick={() => this.editDataApi()} variant="primary">Edit Data
              </Button>
                    </Modal.Footer>
                </Modal>
            </Container >
        );
    }
}
export default Stok;