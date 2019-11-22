import React, { Component } from 'react';
import { Container, Button, Form, Col, Row, Modal, Card, } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import moment from 'moment';


class Kasir extends Component {
    constructor() {
        super()
    }

    state = {
        show: false,
        statStok: 0,
        statHargaJual: 0,
        statKodeBarang: '',
        statNamaBarang: '',
        statBayar: 0,
        // MISAHIN DOANG
        qtyJual: 0,
        subTotal: 0,
        diskon: 0,
        // MISAHIN DOANG (BAGIAN RIBET DI SINI)
        orders: [],
        // DATA DARI DATABASE. YG INI PURA2 AJA
        data: [{
            kode_barang: '718051794',
            nama_barang: 'Pepsodin',
            harga_jual: 2000,
            harga_pokok: 1000,
            stok: 5,
            harga_akhir: 0,
            opsi: 'Hapus',
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
                name: 'Harga Satuan',
                selector: 'harga_jual',
                sortable: true,
            },
            {
                name: 'QTY Jual',
                selector: 'qty_jual',
                sortable: true,
            },
            {
                name: 'Harga Akhir',
                selector: 'harga_akhir',
                sortable: true,
            },
            {
                name: 'Opsi',
                selector: 'opsi',
                sortable: true,
            },
        ]
    }

    onAddOrder = () => {
        const harga_jual = this.state.statHargaJual
        const jumlah_jual = this.state.qtyJual
        let hasil = harga_jual * jumlah_jual

        const obj = { 'kode_barang': this.state.statKodeBarang, 'nama_barang': this.state.statNamaBarang, 'harga_jual': this.state.statHargaJual, 'qty_jual': this.state.qtyJual, 'harga_akhir': hasil, 'opsi': <Button variant={'warning'} onClick={this.onRemoveItem}>Hapus</Button>, }

        this.setState({
            orders: [...this.state.orders, obj]
        });
    }

    onRemoveItem = () => {
        this.setState({ orders: [...this.state.orders.slice(0, -1)] });
    }

    onHide = () => {
        this.setState({ show: false })
    }

    onShow = () => {
        this.setState({ show: true })
    }

    removeStates = () => {
        this.setState({
            statStok: 0,
            statHargaJual: 0,
            statKodeBarang: '',
            statNamaBarang: '',
            statBayar: 0,
            qtyJual: 0
        })
    }

    getSubTotal = () => {
        const { orders } = this.state;
        return orders.reduce((sum, order) => sum + order.harga_akhir, 0);
    }

    getTotalHarga = () => {
        const { orders } = this.state;
        let total = (orders.reduce((sum, order) => sum + order.harga_akhir, 0))
        let jmlDiskon = ((this.state.diskon) / 100) * total
        if ((this.state.diskon) == 0) {
            return orders.reduce((sum, order) => sum + order.harga_akhir, 0);
        } else {
            return total - jmlDiskon
        }
    }

    getDataApiByKode = () => {
        const kode = this.state.statKodeBarang
        const find = this.state.data.find(item => item.kode_barang === kode)
        if (!kode || !find) {
            alert('Data tidak ditemukan')
            this.removeStates()
        } else {
            Object.keys(find).forEach(key => {
                this.setState({
                    statStok: find.stok,
                    statHargaJual: find.harga_jual,
                    statNamaBarang: find.nama_barang,
                    statKodeBarang: find.kode_barang,
                })
            });
            console.log('im alive')
            return find
        }
    }

    getDataApiByNama = () => {
        const kode = this.state.statNamaBarang
        const find = this.state.data.find(item => item.nama_barang === kode)

        if (!kode || !find) {
            alert('Data tidak ditemukan')
            this.removeStates()
        } else {
            Object.keys(find).forEach(key => {
                this.setState({
                    statStok: find.stok,
                    statHargaJual: find.harga_jual,
                    statNamaBarang: find.nama_barang,
                    statKodeBarang: find.kode_barang,
                })
            });

            return find
        }
    }

    changeHarga = () => {
        const kode = this.state.statNamaBarang
        const find = this.state.data.find(item => item.nama_barang === kode)

        if (!kode || !find) {
            return
        } else {
            Object.keys(find).forEach(key => {
                if (this.state.statHargaJual === find.harga_jual) {
                    this.setState({
                        statHargaJual: find.harga_pokok
                    })
                } else {
                    this.setState({
                        statHargaJual: find.harga_jual
                    })
                }
            });

            return find
        }
    }

    // UNTUK REFERENSI SIAPA TAU BUTUH
    // keyPressed2 = (event) => {
    //     if (event.key === "Enter") {
    //         // this.getDataApiByNama()
    //         this.onShow()
    //     }
    // }

    render() {
        return (
            <Container>
                <h2>Transaksi Kasir</h2>
                <hr></hr>
                <Form>
                    <Row style={{ marginBottom: 10 }}>
                        <Col sm>
                            <Card >
                                <Card.Body>
                                    <Form.Group as={Row}>
                                        <Form.Label column="true" sm="3">No. Faktur</Form.Label>
                                        <Col column="true" sm="9">
                                            <Form.Control type="text" placeholder="Masukkan Faktur" />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column="true" sm="3">Tanggal</Form.Label>
                                        <Col column="true" sm="9">
                                            <Form.Control disabled value={moment().format('YYYY-MM-DD')} type="date" />
                                        </Col>
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm>
                            <Card style={{ height: '23.5vh' }}>
                                <Card.Body>
                                    <Row>
                                        <Col sm>
                                            <h2>Tagihan:</h2>
                                        </Col>
                                        <Col sm>
                                            <h2>Rp. {this.getTotalHarga()}</h2>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: 5 }}>
                        <Col xs={6} md={2}>
                            <Form.Label>Kode Barang</Form.Label>
                            <Form.Control onKeyPress={(event) => (event.key === "Enter") ? this.getDataApiByKode() : ''} style={{ marginBottom: 5 }} value={this.state.statKodeBarang} onChange={(event) => this.setState({ statKodeBarang: event.target.value })} type="text" placeholder="Kode Barang" />
                        </Col>
                        <Col xs={6} md={2}>
                            <Form.Label>Nama Barang</Form.Label>
                            <Form.Control onKeyPress={(event) => (event.key === "Enter") ? this.onShow() : ''} value={this.state.statNamaBarang} onChange={(event) => this.setState({ statNamaBarang: event.target.value })} style={{ marginBottom: 5 }} type="text" placeholder="Nama Barang" />
                        </Col>
                        <Col xs={6} md={2}>
                            <Form.Label>Stok Tersedia</Form.Label>
                            <Form.Control value={this.state.statStok} disabled type="text" placeholder="Stok" />
                        </Col>
                        <Col xs={6} md={2}>
                            <Form.Label>Harga Satuan</Form.Label>
                            <Form.Control value={this.state.statHargaJual} style={{ marginBottom: 5 }} disabled type="text" placeholder="Harga Satuan" />
                        </Col>
                        <Col xs={6} md={2}>
                            <Form.Label>QTY Jual</Form.Label>
                            <Form.Control onKeyPress={(event) => (event.key === "Enter") ? this.onAddOrder() : ''} value={this.state.qtyJual} onChange={(event) => this.setState({ qtyJual: event.target.value })} style={{ marginBottom: 5 }} type="number" placeholder="Jumlah Jual" />
                        </Col>
                        <Col xs={6} md={2}>
                            <Form.Label>Harga Akhir</Form.Label>
                            <Form.Control disabled value={(this.state.qtyJual) * (this.state.statHargaJual)} style={{ marginBottom: 5 }} type="text" placeholder="Harga Akhir" />
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: 5 }}>
                        <Col>
                            <Row>
                                <Col style={{ marginBottom: 5 }} xs={6} md={3}>
                                    <Button onClick={this.onShow} block="true" variant="primary">Cari</Button>
                                </Col>
                                <Col style={{ marginBottom: 5 }} xs={6} md={3}>
                                    <Form.Check
                                        onChange={() => this.changeHarga()}
                                        style={{ paddingTop: 7, marginLeft: 35 }}
                                        type="switch"
                                        id="custom-switch"
                                        label="Distributor?"
                                    />
                                </Col>
                                <Col style={{ marginBottom: 5 }} xs={6} md={3}>
                                    <Button onClick={this.onAddOrder} block="true" variant="primary">Tambahkan</Button>
                                </Col>
                                <Col style={{ marginBottom: 5 }} xs={6} md={3}>
                                    <Button onClick={this.removeStates} block="true" variant="warning">Batal</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                        <Col sm>
                            <Card>
                                <Card.Body>
                                    {/* <h4>Barang yang di jual</h4>
                                    <Table responsive striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Kode Barang</th>
                                                <th>Nama Barang</th>
                                                <th>Harga Satuan</th>
                                                <th>Jumlah Jual</th>
                                                <th>Harga Akhir</th>
                                                <th>Opsi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.orders.map((item, i) =>
                                                <tr key={i}>
                                                    <td>Kode Barang</td>
                                                    <td>Nama Barang</td>
                                                    <td>Harga Satuan</td>
                                                    <td>Jumlah Jual</td>
                                                    <td>{item}</td>
                                                    <td>Opsi</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table> */}

                                    <DataTable
                                        title="Barang yang di jual"
                                        columns={this.state.columns}
                                        data={this.state.orders}
                                        pagination
                                    />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={9}>
                            <Row>
                                <Col>
                                    <Form.Group as={Row}>
                                        <Form.Label column="true" xs={12} md={5}>Sub Total</Form.Label>
                                        <Col column="true" xs={12} md={7}>
                                            <Form.Control disabled value={this.getSubTotal()} type="number" placeholder="Sub Total" />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column="true" xs={12} md={5}>Diskon</Form.Label>
                                        <Col column="true" xs={12} md={7}>
                                            <Form.Control value={this.state.diskon} onChange={(event) => this.setState({ diskon: event.target.value })} type="number" placeholder="Diskon" />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column="true" xs={12} md={5}>Total Harga</Form.Label>
                                        <Col column="true" xs={12} md={7}>
                                            <Form.Control disabled value={this.getTotalHarga()} type="text" placeholder="Total Harga" />
                                        </Col>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group as={Row}>
                                        <Form.Label column="true" xs={12} md={5}>Bayar</Form.Label>
                                        <Col column="true" xs={12} md={7}>
                                            <Form.Control value={this.state.statBayar} onChange={(event) => this.setState({ statBayar: event.target.value })} type="text" placeholder="Bayar" />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column="true" xs={12} md={5}>Kembalian</Form.Label>
                                        <Col column="true" xs={12} md={7}>
                                            <Form.Control disabled value={(this.state.statBayar) - (this.getTotalHarga())} type="text" placeholder="Kembalian" />
                                        </Col>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={3}>
                            <Button block="true" variant="primary">Simpan</Button>
                            <Button block="true" variant="warning">Batal</Button>
                        </Col>
                    </Row>
                </Form>
                <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" show={this.state.show} onHide={this.onHide}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.onHide}>
                            Close
          </Button>
                        <Button variant="primary" onClick={this.onHide}>
                            Save Changes
          </Button>
                    </Modal.Footer>
                </Modal>
            </Container >
        );
    }
}
export default Kasir;