import React, { Component } from 'react';
import { Container, Jumbotron, Button, Nav, Navbar, Form, FormControl, Col, Row, Table, Card, Modal } from 'react-bootstrap';
import axios from 'axios';

const url = 'http://127.0.0.1:3001'

class Supplier extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.getDataFromApi()
    }

    state = {
        showModalTambah: false,
        namaSupplier: '',
        id_supplier: '',
        edit: false,
        data: [],
    }

    showModalTambah = () => {
        this.setState({ showModalTambah: true })
    }

    hideModal = () => {
        this.setState({ showModalTambah: false })
    }

    getDataFromApi = async () => {
        try {
            const result = await axios.get(`${url}/supplier`)
            this.setState({
                data: result.data
            })
        } catch (error) {
            alert(error)
        }
    }

    deleteDataSupplier = async (index) => {
        if (index) {
            try {
                await axios.delete(`${url}/supplier/${index}`)
                alert('berhasil di hapus')
                this.getDataFromApi()
            } catch (error) {
                alert(error)
            }
        } else {
            alert('tidak di temukan')
        }
    }

    postDataSupplier = async () => {
        if (this.state.namaSupplier) {
            try {
                await axios.post(`${url}/supplier`, {
                    nama_supplier: this.state.namaSupplier
                })
                alert('berhasil di input')
                this.getDataFromApi()
            } catch (error) {
                alert(error)
            }
        } else {
            alert('isi data dahulu')
        }
    }

    editDataSupplier = async () => {
        const { namaSupplier, id_supplier } = this.state
        if (namaSupplier === undefined) {
            alert('harap di isi')
        } else {
            try {
                await axios.put(`${url}/supplier/${id_supplier}`, {
                    nama_supplier: namaSupplier
                })
                alert('data berhasil di edit')
                this.getDataFromApi()
            } catch (error) {
                alert(error)
            }
        }
    }

    buttonTes = (edit) => {
        if (!edit) {
            return <Button block onClick={() => this.postDataSupplier()}>Simpan</Button>
        } else {
            return <Button block onClick={() => this.editDataSupplier()}>Edit</Button>
        }
    }

    render() {
        return (
            <div>
                <Col style={{ float: 'right' }} sm>
                    <Button style={{ marginBottom: 5 }} block onClick={this.showModalTambah} variant="primary">+ Tambah Supplier</Button>
                </Col>
                <Modal show={this.state.showModalTambah} onHide={this.hideModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Data Supplier</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col style={{ marginBottom: 5 }} sm={9}>
                                <Form.Control value={this.state.namaSupplier} onChange={(event) => this.setState({ namaSupplier: event.target.value })} type="text" placeholder="Nama Supplier" />
                            </Col>
                            <Col sm={3}>
                                {this.buttonTes(this.state.edit)}
                            </Col>
                        </Row>
                        <Row>
                            <Col sm>
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr >
                                            <th>No.</th>
                                            <th>Nama Supplier</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.data.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}.</td>
                                                <td>{(item.nama_supplier)}</td>
                                                <td><Button onClick={() => this.deleteDataSupplier(item.id_supplier)}>Hapus </Button> <Button onClick={() => this.setState({ edit: true, namaSupplier: item.nama_supplier, id_supplier: item.id_supplier })}>Edit </Button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ edit: false, namaSupplier: '', id_supplier: '' })}>
                            Batal
                        </Button>
                        <Button variant="secondary" onClick={this.hideModal}>
                            Keluar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
export default Supplier;