import React, { Component } from "react";
import { connect } from 'react-redux'
import { Button, Col, Container, Form, FormControl, InputGroup, Row } from 'react-bootstrap';
import fontawesome from '@fortawesome/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faCopy, faTag } from '@fortawesome/free-solid-svg-icons';

import { connectWeb3 } from "./store/web3Store";
import { getProducts, getSessions, connectContract, } from "./store/PricingChain";
import Products from "./coms/Products";


import 'bootstrap/dist/css/bootstrap.min.css';

fontawesome.library.add(faCopy, faTag);

class Pricing extends Component {
    state = {
    };
    constructor(props) {
        super(props);
        this.fileRef = React.createRef();
    }

    IPFS = null;

    componentDidMount = async () => {
        if (!this.props.contract)
            await this.props.connectContract();
        await this.props.getProducts();
        this.listenEvents()
        // this.connectIPFS();
    };

    listenEvents = () => {
        let { contract } = this.props
        contract.events.onCreatedSession((error, event) => {
            if (error) throw error;
            else {
                console.log('onCreatedSession: ', event, error);
                this.props.getSessions();
            }
        })
        contract.events.onStartedSession((error, event) => {
            if (error) throw error;
            else {
                console.log('onStartedSession: ', event, error);
                this.props.getSessions();
                this.props.getProducts();
            }
        })
        contract.events.onClosedSession((error, event) => {
            if (error) throw error;
            else {
                console.log('onClosedSession: ', event, error);
                this.props.getSessions();
                this.props.getProducts();
            }
        })
        contract.events.onPricing((error, event) => {
            if (error) throw error;
            else {
                console.log('onPricing: ', event, error);
                this.props.getProducts();
            }
        })
        contract.events.onProductAdded((error, event) => {
            if (error) throw error;
            else {
                this.props.getProducts();
            }
        })
    }
    
    connectIPFS = async () => {
        document.addEventListener('DOMContentLoaded', async () => {
            const node = this.IPFS = window.IPFS = await window.Ipfs.create();
            window.IPFS.version().then(r => console.log('IFPS node:', r.version))

            const results = await node.add('=^.^= chào bạn ')
            console.log('node.add:', results)

            const cid = results.path
            console.log('CID created via ipfs.add:', cid)
            const data = await node.cat(cid)
            console.log('Data read back via ipfs.cat:', data)// new TextDecoder().decode(data))
            // node.cat(cid).then(r => {
            //   console.log('Data read back via ipfs.cat: ', r)
            // })
        })
    }

    getInfo = async () => {
        this.getSessions();
    }

    getSessions = () => {
        const { web3, contract, pricings } = this.state;
        contract.methods.getSessions().call()
            .then(res => {
                console.log("getSessions: ", res);
            })
    }

    onFileChange = (event) => {
        console.log("onFileChange: ", this.fileRef.current.files[0])
    }

    ipfsAddFile = async () => {
        const file = this.fileRef.current.files[0]
        console.log(this.state)
        const { files } = this.state;
        try {
            let reader = new FileReader()
            reader.readAsArrayBuffer(file)
            reader.onload = () => {
                console.log(reader.result);
                window.IPFS.add(reader.result).then(res => {
                    console.log("file address: ", res.path)
                    let _files = [...new Set([...files, res.path])];

                    this.setState({ files: _files })
                    localStorage.setItem('files', JSON.stringify(_files))
                })
            };

            reader.onerror = function () {
                console.error(reader.error);
            };

        } catch (error) {
            console.error(`Unable to perform quick upload due to ${error}`)
        }
    }

    copy = (e) => {
        const p = window.ppp = e.target.parentElement.parentElement;
        navigator.clipboard.writeText(p.getElementsByTagName('input')[0].value)
        p.style.color = 'green'
        setTimeout(() => {
            p.style.color = 'initial'
        }, 2000)
    }

    onPriceChange = (e) => {
        if (e.target.value < 0) e.target.value = 0;
        let pricings = [...this.state.pricings];
        let id = e.target.attributes.keyindex.value, value = parseInt(e.target.value);
        pricings[id] = value;

        this.setState({ "pricings": pricings });
    }

    pricing = (e) => {
        const { web3, contract, pricings } = this.state;
        let id = e.target.attributes.keyindex.value, value = pricings[id];
        console.log("pricing: ", id, value);
        contract.methods.pricing(value)
    }
    render() {
        const { web3, files, pricings } = this.state;
        if (!web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <Container className="App">
                <h1>FUNIX PRICING CHAIN!</h1>

                <div>The stored value is: {this.state.storageValue}</div>
                <Row>
                    <Col>
                        {/* <Form>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Upload file to IPFS</Form.Label>
                <Form.Control type="file" ref={this.fileRef} onChange={this.onFileChange} />
                <Button variant="outline-primary" onClick={this.ipfsAddFile}>Upload</Button>
              </Form.Group> </Form> */} </Col> </Row>
                <Row><h2>Số lượng sản phẩm:<b> {Products.length} </b></h2></Row>

                <Row>
                    <Products /> </Row>
            </Container>
        );
    }
}

const style = {
    product: {
        border: "3px solid black",
        borderImage: `linear-gradient(45deg, turquoise, greenyellow) 1`,
        boxShadow: '10px 10px 5px #aaaaaa',
        margin: 3,
    },
    productImg: {
        height: 120,
    },
    copy: {
        cursor: "pointer",
    },
    clipboard: {
        fontSize: 1,
        display: 'none',
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        web3: state.web3Store.web3,
        accounts: state.web3Store.accounts,
        contract: state.PricingChain.contract,
        owner: state.PricingChain.owner,
        products: state.PricingChain.products,
        sessions: state.PricingChain.sessions
    }
}

export default connect(mapStateToProps, {
    connectWeb3: connectWeb3,
    getSessions: getSessions,
    connectContract: connectContract,
    getProducts: getProducts,
})(Pricing);
