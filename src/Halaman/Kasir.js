import React, { Component } from 'react';
import { Container, InputGroup, Button, Form, Col, Row, Modal, Card, Table, } from 'react-bootstrap';
import moment from 'moment';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import NumberFormat from 'react-number-format';

const url = 'http://127.0.0.1:3001'

class Kasir extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        show: false,
        cekHarga: 0,
        statStok: 0,
        statHargaJual: 0,
        statKodeBarang: '',
        statIdBarang: '',
        statNamaBarang: '',
        statBayar: 0,
        statTanggal: moment().format('YYYY-MM-DD'),
        // MISAHIN DOANG
        qtyJual: 0,
        subTotal: 0,
        diskon: 0,
        // MISAHIN DOANG (BAGIAN RIBET DI SINI)
        orders: [],
        // DATA DARI HARUSNYA DARI DATABASE. YG INI PURA2 AJA
        data: [],
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
                cell: () => <Button variant={'warning'} onClick={() => this.onRemoveItem()}>Hapus</Button>
            },
        ],
    }

    onAddOrder = () => {
        const harga_jual = this.state.statHargaJual
        const jumlah_jual = this.state.qtyJual
        let hasil = harga_jual * jumlah_jual

        const obj = { 'id_barang': this.state.statIdBarang, 'kode_barang': this.state.statKodeBarang, 'nama_barang': this.state.statNamaBarang, 'harga_jual': this.state.statHargaJual, 'sisa_stok': this.state.statStok, 'qty_jual': Number(this.state.qtyJual), 'harga_akhir': hasil, 'tgl_jual': this.state.statTanggal }

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
        this.getDataApiByNama()
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

    removeOrders = () => {
        this.setState({
            orders: []
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

    getDataApiByKode = async () => {
        const kode = this.state.statKodeBarang
        // const find = this.state.data.find(item => item.kode_barang === kode)
        // if (!kode || !find) {
        //     alert('Data tidak ditemukan')
        //     this.removeStates()
        // } else {
        //     Object.keys(find).forEach(key => {
        //         this.setState({
        //             statStok: find.stok,
        //             statHargaJual: find.harga_jual,
        //             statNamaBarang: find.nama_barang,
        //             statKodeBarang: find.kode_barang,
        //         })
        //     });
        //     return find
        // }

        try {
            const result = await (axios.get(`${url}/kodebarang/${kode}`))
            const newData = result.data
            this.setState({
                data: newData
            })
            this.alihkan()
        } catch (error) {
            console.log(error)
            alert('data tidak ditemukan/ server error')
            this.removeStates()
        }
    }

    getDataApiByNama = async () => {
        const kode = this.state.statNamaBarang
        // const find = this.state.data.find(item => item.nama_barang === kode)

        // if (!kode || !find) {
        //     alert('Data tidak ditemukan')
        //     this.removeStates()
        // } else {
        //     Object.keys(find).forEach(key => {
        //         this.setState({
        //             statStok: find.stok,
        //             statHargaJual: find.harga_jual,
        //             statNamaBarang: find.nama_barang,
        //             statKodeBarang: find.kode_barang,
        //         })
        //     });

        //     return find
        // }

        try {
            const result = await (axios.get(`${url}/namabarang/${kode}`))
            const newData = result.data
            this.setState({
                data: newData
            })

        } catch (error) {
            console.log(error)
            alert('data tidak ditemukan/ server error')
        }
    }

    alihkan = (index) => {
        if (index > 0) {
            const stok = (this.state.data[index].sisa_stok === undefined) ? 0 : this.state.data[index].sisa_stok
            this.setState({
                show: false,
                statStok: stok,
                statIdBarang: this.state.data[index].id_barang,
                statNamaBarang: this.state.data[index].nama_barang,
                statHargaJual: this.state.data[index].harga_jual,
                statKodeBarang: this.state.data[index].kode_barang,
            })
        } else {
            let stok = (this.state.data[0].sisa_stok === undefined) ? 0 : this.state.data[0].sisa_stok
            this.setState({
                show: false,
                statStok: stok,
                statIdBarang: this.state.data[0].id_barang,
                statNamaBarang: this.state.data[0].nama_barang,
                statHargaJual: this.state.data[0].harga_jual,
                statKodeBarang: this.state.data[0].kode_barang,
            })
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

    isBarangExist = () => {
        if (this.state.statHargaJual === 0) {
            return <Form.Check
                disabled
                onChange={() => this.changeHarga()}
                style={{ paddingTop: 7, marginLeft: 35 }}
                type="switch"
                id="custom-switch"
                label="Distributor?"
            />
        } else {
            return <Form.Check
                onChange={() => this.changeHarga()}
                style={{ paddingTop: 7, marginLeft: 35 }}
                type="switch"
                id="custom-switch"
                label="Distributor?"
            />
        }
    }

    buttonTambah = () => {
        if (this.state.statStok != 0) {
            return <Button onClick={this.onAddOrder} block="true" variant="primary">Tambahkan</Button>
        } else {
            return <Button disabled block="true" variant="primary">Tambahkan</Button>
        }
    }

    inputPenjualan = async (index) => {

        try {
            await axios.post(`${url}/penjualan`, {
                id_barang: this.state.orders[index].id_barang,
                tgl_penjualan: this.state.orders[index].tgl_jual,
                qty_beli: this.state.orders[index].qty_jual,
                total_pembelian: this.state.orders[index].harga_akhir,
                // sisa_stok: (this.state.statStok) - (this.state.orders[index].qty_jual)
            })
            this.kurangiStok(index, this.state.orders[index].id_barang)
        } catch (error) {
            console.log(error)
            alert(`kesalahan ketika input data ke: ${index + 1}`)
        }
    }

    kurangiStok = async (index, id_barang) => {
        try {
            await axios.put(`${url}/ubahstok/${id_barang}`, {
                qty_beli: this.state.orders[index].qty_jual
            })
        } catch (error) {
            console.log(error)
            alert(`kesalahan ketika input data ke: ${index + 1}`)
        }
        this.removeOrders()
        this.removeStates()
        window.location.reload()
    }

    pisahData = () => {
        this.state.orders.map((item, index) => (
            this.inputPenjualan(index)
        ))
        alert('Proses input selesai! Jika terjadi error, Cek Console untuk melihat error!')
    }

    // UNTUK REFERENSI SIAPA TAU BUTUH
    // keyPressed2 = (event) => {
    //     if (event.key === "Enter") {
    // this.getDataApiByNama()
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
                                            {/* <h2>Rp. {this.getTotalHarga()} </h2> */}
                                            <h2><NumberFormat value={this.getTotalHarga()} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></h2>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: 5 }}>
                        <Col xs={6} md={2}>
                            <Form.Label>Kode Barang</Form.Label>
                            <Form.Control autoFocus="true" onKeyPress={(event) => (event.key === "Enter") ? this.getDataApiByKode() : ''} style={{ marginBottom: 5 }} value={this.state.statKodeBarang} onChange={(event) => this.setState({ statKodeBarang: event.target.value })} type="text" placeholder="Kode Barang" />
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
                            {/* <Form.Control value={this.state.statHargaJual} style={{ marginBottom: 5 }} disabled thousandSeparator={true} prefix={'Rp. '} type="text" placeholder="Harga Satuan" /> */}

                            <NumberFormat value={this.state.statHargaJual} style={{ marginBottom: 5 }} disabled thousandSeparator={true} prefix={'Rp. '} customInput={Form.Control} />
                        </Col>
                        <Col xs={6} md={2}>
                            <Form.Label>QTY Jual</Form.Label>
                            <Form.Control max={this.state.statStok} min={0} onKeyPress={(event) => (event.key === "Enter") ? this.onAddOrder() : ''} value={this.state.qtyJual} onChange={(event) => this.setState({ qtyJual: event.target.value })} style={{ marginBottom: 5 }} type="number" placeholder="Jumlah Jual" />
                        </Col>
                        <Col xs={6} md={2}>
                            <Form.Label>Harga Akhir</Form.Label>
                            {/* <Form.Control disabled value={(this.state.qtyJual) * (this.state.statHargaJual)} style={{ marginBottom: 5 }} type="text" placeholder="Harga Akhir" /> */}

                            <NumberFormat disabled value={(this.state.qtyJual) * (this.state.statHargaJual)} thousandSeparator={true} prefix={'Rp. '} customInput={Form.Control} />
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: 5 }}>
                        <Col>
                            <Row>
                                <Col style={{ marginBottom: 5 }} xs={6} md={3}>
                                    <Button onClick={this.onShow} block="true" variant="primary">Cari</Button>
                                </Col>
                                <Col style={{ marginBottom: 5 }} xs={6} md={3}>
                                    {this.isBarangExist()}
                                </Col>
                                <Col style={{ marginBottom: 5 }} xs={6} md={3}>
                                    {this.buttonTambah()}
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
                                            {/* <Form.Control disabled value={this.getSubTotal()} type="number" placeholder="Sub Total" /> */}

                                            <NumberFormat disabled value={this.getSubTotal()} thousandSeparator={true} prefix={'Rp. '} customInput={Form.Control} />
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
                                            {/* <Form.Control disabled value={this.getTotalHarga()} type="text" placeholder="Total Harga" /> */}

                                            <NumberFormat disabled value={this.getTotalHarga()} thousandSeparator={true} prefix={'Rp. '} customInput={Form.Control} />
                                        </Col>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group as={Row}>
                                        <Form.Label column="true" xs={12} md={5}>Bayar</Form.Label>
                                        <Col column="true" xs={12} md={7}>
                                            <InputGroup>
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text id="inputGroupPrepend">Rp.</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <Form.Control value={this.state.statBayar} onChange={(event) => this.setState({ statBayar: event.target.value })} type="number" placeholder="Bayar" />
                                            </InputGroup>

                                            {/* <NumberFormat value={this.state.statBayar} onChange={(event) => this.setState({ statBayar: event.target.value })} thousandSeparator={true} prefix={'Rp. '} customInput={Form.Control} /> */}
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column="true" xs={12} md={5}>Kembalian</Form.Label>
                                        <Col column="true" xs={12} md={7}>
                                            {/* <Form.Control disabled value={(this.state.statBayar) - (this.getTotalHarga())} type="text" placeholder="Kembalian" /> */}

                                            <NumberFormat disabled value={(this.state.statBayar) - (this.getTotalHarga())} thousandSeparator={true} prefix={'Rp. '} customInput={Form.Control} />
                                        </Col>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={3}>
                            <Button onClick={() => this.pisahData()} block="true" variant="primary">Simpan</Button>
                            <Button onClick={() => this.removeOrders()} block="true" variant="warning">Batal</Button>
                        </Col>
                    </Row>
                </Form>
                <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" show={this.state.show} onHide={this.onHide}>
                    <Modal.Header closeButton>
                        <Modal.Title>Pencarian barang: {this.state.statNamaBarang}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table responsive striped bordered hover>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Nama Barang</th>
                                    <th>Kode Barang</th>
                                    <th>Kategori</th>
                                    <th>Harga Jual</th>
                                    <th>Stok Barang</th>
                                    <th>Opsi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.data.map((item, index) => (
                                    <tr key={index}>
                                        <td>{`${index + 1}.`}</td>
                                        <td>{item.nama_barang}</td>
                                        <td>{item.kode_barang}</td>
                                        <td>{item.kategori}</td>
                                        <td>{item.harga_jual}</td>
                                        <td>{item.sisa_stok}</td>
                                        <td style={{ width: 50 }}>
                                            <Button onClick={() => this.alihkan(index)} variant='warning' >Pilih</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.onHide}>
                            Keluar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container >
        );
    }
}
export default Kasir;