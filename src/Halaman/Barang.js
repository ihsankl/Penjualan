import React, { Component } from 'react';
import { Container, Jumbotron, Button, Nav, Navbar, Form, FormControl, Col, Row, Table, Card, Modal } from 'react-bootstrap';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const url = 'http://127.0.0.1:3001'

class Barang extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModalTambah: false,
            showModalEdit: false,
            loading: true,
            // STATE UNTUK INPUT BARANG

            id_barang: '',
            kategori: '',
            kode_barang: '',
            nama_barang: '',
            harga_pokok: 0,
            harga_jual: 0,

            // END STATE BARANG
            dataBarang: [],
            columns: [
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
                    name: 'Kategori',
                    selector: 'kategori',
                    sortable: true,
                },
                {
                    name: 'Harga Pokok',
                    selector: 'harga_pokok',
                    sortable: true,
                },
                {
                    name: 'Harga Jual',
                    selector: 'harga_jual',
                    sortable: true,
                },
                {
                    name: 'Sisa Stok',
                    selector: `sisa_stok`,
                    sortable: true,
                },
                {
                    name: 'Opsi',
                    button: true,
                    cell: row => <div><button onClick={() => this.deleteDataApi(row.id_barang, row.sisa_stok)} style={{ border: '2px solid red', color: 'red', padding: '5px 15px', textAlign: 'center', textDecoration: 'none', display: 'inline-block' }} >Hapus</button> <br></br> <button onClick={() => this.showModalEdit(row.id_barang, row.kode_barang, row.nama_barang, row.kategori, row.harga_pokok, row.harga_jual)} style={{ width: '100%', marginTop: '5px', border: '2px solid blue', color: 'blue', padding: '5px 15px', textAlign: 'center', textDecoration: 'none', display: 'inline-block' }} >Edit</button></div>
                },
            ]
        }
    }

    componentDidMount() {
        this.getDataFromApi()
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
            const result = await (axios.get(`${url}/barang`))
            const newData = result.data
            this.setState({
                dataBarang: newData,
                loading: false
            })

        } catch (error) {
            alert(error)
        }
    }

    postDataToApi = async () => {
        if (this.state.kategori === '' || this.state.kode_barang === '' || this.state.nama_barang === '' || this.state.harga_jual === 0 || this.state.harga_pokok === 0) {
            alert('harap di isi')
        } else {
            try {
                await axios.post(`${url}/barang`, {
                    kategori: this.state.kategori,
                    kode_barang: this.state.kode_barang,
                    nama_barang: this.state.nama_barang,
                    harga_jual: this.state.harga_jual,
                    harga_pokok: this.state.harga_pokok
                })
                alert('berhasil')
                this.setState({ showModalTambah: false })
                this.getDataFromApi()
            } catch (error) {
                alert(error)
            }
        }
    }

    editDataApi = async () => {
        const { id_barang, kategori, kode_barang, nama_barang, harga_pokok, harga_jual } = this.state
        
        if (this.state.kategori === '' || this.state.kode_barang === '' || this.state.nama_barang === '' || this.state.harga_jual === 0 || this.state.harga_pokok === 0) {
            alert('harap di isi')
        } else {
            try {
                await axios.put(`${url}/barang/${id_barang}`, {
                    kategori: kategori,
                    kode_barang: kode_barang,
                    nama_barang: nama_barang,
                    harga_jual: harga_jual,
                    harga_pokok: harga_pokok
                })
                alert('berhasil')
                this.setState({ showModalEdit: false })
                this.getDataFromApi()
            } catch (error) {
                alert(error)
            }
        }
    }

    deleteDataApi = async (id_barang, stok_barang) => {
        if (stok_barang != 0) {
            alert('hapus data stok terlebih dahulu!')
        } else {
            try {
                await axios.delete(`${url}/barang/${id_barang}`)
                alert('Data Berhasil dihapus')
                this.setState({ showModal: false })
                this.getDataFromApi()
            } catch (error) {
                console.log({ error })
                alert('terjadi kesalahan')
            }
        }
    }

    showModalTambah = () => {
        this.setState({ showModalTambah: true })
    }

    hideModal = () => {
        this.setState({ showModalTambah: false })
    }

    showModalEdit = (id_barang, kode_barang, nama_barang, kategori, harga_pokok, harga_jual) => {
        this.setState({ showModalEdit: true })
        this.setState({
            id_barang: id_barang,
            kategori: kategori,
            kode_barang: kode_barang,
            nama_barang: nama_barang,
            harga_pokok: harga_pokok,
            harga_jual: harga_jual
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
                            <Col><h1>Daftar Barang</h1></Col>
                            <Col sm>
                                <Button block={true} onClick={this.showModalTambah} variant="primary">+ Tambah data barang</Button>
                            </Col>
                        </Row>
                        <hr></hr>
                    </Col>
                </Row>
                <Row>
                    <Col sm>
                        <Card>
                            <Card.Body>
                                {/* <DataTable
                                    columns={this.state.columns}
                                    data={this.state.dataBarang}
                                    pagination
                                /> */}
                                {!this.state.loading && <DataTable
                                    columns={this.state.columns}
                                    data={this.state.dataBarang}
                                    pagination
                                />}
                                {/* <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Username</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.dataBarang.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.nama_barang}</td>
                                                <td>{item.kode_barang}</td>
                                                <td>{item.kode_barang}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table> */}
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
                                <Form.Label>Kode Barang</Form.Label>
                                <Form.Control value={this.state.kode_barang} onChange={(event) => this.setState({ kode_barang: event.target.value })} type="text" placeholder="Kode Barang" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Nama Barang</Form.Label>
                                <Form.Control value={this.state.nama_barang} onChange={(event) => this.setState({ nama_barang: event.target.value })} type="text" placeholder="Nama Barang" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Kategori</Form.Label>
                                <Form.Control value={this.state.kategori} onChange={(event) => this.setState({ kategori: event.target.value })} type="text" placeholder="Kategori" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Harga Pokok</Form.Label>
                                <Form.Control type="number" value={this.state.harga_pokok} onChange={(event) => this.setState({ harga_pokok: event.target.value })} placeholder="Harga Pokok" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Harga Jual</Form.Label>
                                <Form.Control value={this.state.harga_jual} onChange={(event) => this.setState({ harga_jual: event.target.value })} type="number" placeholder="Harga Jual" />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.hideModal}>
                            Keluar
              </Button>
                        <Button onClick={() => this.postDataToApi()} variant="primary">Tambah data
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
                                <Form.Label>Kode Barang</Form.Label>
                                <Form.Control value={this.state.kode_barang} onChange={(event) => this.setState({ kode_barang: event.target.value })} type="text" placeholder="Kode Barang" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Nama Barang</Form.Label>
                                <Form.Control value={this.state.nama_barang} onChange={(event) => this.setState({ nama_barang: event.target.value })} type="text" placeholder="Nama Barang" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Kategori</Form.Label>
                                <Form.Control value={this.state.kategori} onChange={(event) => this.setState({ kategori: event.target.value })} type="text" placeholder="Kategori" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Harga Pokok</Form.Label>
                                <Form.Control type="number" value={this.state.harga_pokok} onChange={(event) => this.setState({ harga_pokok: event.target.value })} placeholder="Harga Pokok" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Harga Jual</Form.Label>
                                <Form.Control value={this.state.harga_jual} onChange={(event) => this.setState({ harga_jual: event.target.value })} type="number" placeholder="Harga Jual" />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.hideModal}>
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
export default Barang;