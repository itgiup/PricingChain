import React, { Component } from "react";
import { connect } from 'react-redux';
import { Row, InputGroup, Form, Button, Alert } from 'react-bootstrap';
import fontawesome from '@fortawesome/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCopy, faTag } from '@fortawesome/free-solid-svg-icons';

import { connectWeb3 } from "../store/web3Store";
import { getProducts, connectContract, } from "../store/PricingChain";
import { setToast, notify } from "../store/toast";

import BtnCopy from "./BtnCopy";
import Product from "./Product";

window.Buffer = require('buffer/').Buffer
window.Tx = require('@ethereumjs/tx').Transaction;

fontawesome.library.add(faCopy, faTag, faCheck);

class Products extends Component {
    state = {
        imageCID: "", imageCIDinvalid: "",
        productName: "",
        validated: false, btnCopy: (<label>copy</label>)
    }

    componentDidMount = async () => {
        const { accounts } = this.props;
        if (this.props.contract == null) {
            this.props.connectContract();
        }
        // khởi động contract
        let wait = setInterval(() => {
            if (this.props.contract != null) {
                this.props.contract.methods.getUser(accounts[0]).call({ from: accounts[0] })
                    .then(res => {
                        if ((this.props.owner !== accounts[0]) && (res._email == "" || res._name == "")) window.location.href = "users";
                        console.log("user:", res);
                    });

                this.props.getProducts();
                this.listenEvents(this.props.contract);
                clearInterval(wait);
            }
        }, 1000);
    }

    onImageCIDChange = (e) => {
        let image = e.target.value.trim();
        this.setState({ imageCID: image });
    }

    onproductNameChange = (e) => {
        let name = e.target.value;
        this.setState({ productName: name });
    }

    listenEvents = (contract) => {
        contract.events.onGuessPrice((error, event) => {
            if (error) throw error;
            else {
                // console.log('onGuessPrice: ', event, error);
                this.props.getProducts();
            }
        });
        contract.events.onProductAdded((error, event) => {
            if (error) throw error;
            else {
                this.props.getProducts();
            }
        });
        contract.events.onSetPrice((error, event) => {
            if (error) throw error;
            else {
                this.props.getProducts();
            }
        })
    }

    addProduct = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const { imageCID } = this.state;
        const { contract, accounts, products, notify } = this.props;
        if (imageCID === "") {
            console.error("ipfs error")
            notify("ipfs error")
            this.setState({ imageCIDinvalid: "ipfs error" })
        } else if (products.filter(product => product.ipfsID === imageCID).length > 0) {
            notify('Product exists image')
            this.setState({ imageCIDinvalid: "Product exists image" })
        } else if (!contract) {
            console.error("contract error")
            notify("contract error")
            this.setState({ imageCIDinvalid: "contract error" })
        } else {
            contract.methods.addProduct(this.state.imageCID, this.state.productName.trim()).send({ from: accounts[0] })
                .then((response) => {
                    console.log("addProduct success: ", response)
                    notify(['addProduct success', "success"])
                    this.setState({
                        imageCID: "", imageCIDinvalid: "",
                        productName: "",
                    })
                })
                .catch(error => {
                    if (error.code === 4001) {
                        notify("User rejected")
                    } else {
                        let message = 'Add product fail: ' + error.message.substring(error.message.indexOf('"reason":"'), error.message.indexOf('},"stack":')).split(':')[1]
                        console.error(error)
                        notify(message)
                    }
                });
        }
    }
    render() {
        const { accounts, products, owner, contract } = this.props;
        if (!contract) {
            return (
                <Alert variant={'danger'}>
                    Connect contract error!
                </Alert>)
        }
        return (
            <>
                <Row>
                    {products.map((p, i) => (
                        <Product key={i} product={p} />
                    ))}
                </Row>
                {/* thêm sảm phẩm */}
                {accounts[0] === owner ? (
                    <Row>
                        <Form noValidate validated={this.state.validated} onSubmit={this.addProduct}>
                            <InputGroup className="mb-3">
                                <InputGroup.Text id="addon_ipfs">ipfs:</InputGroup.Text>
                                <Form.Control
                                    placeholder="Q..."
                                    aria-label="ipfs"
                                    aria-describedby="addon_ipfs"
                                    value={this.state.imageCID}
                                    onChange={this.onImageCIDChange}
                                    style={styles.imageCID}
                                    required
                                />
                                <InputGroup.Text id="addon_name">name:</InputGroup.Text>
                                <Form.Control
                                    placeholder="product's name..."
                                    aria-label="name"
                                    aria-describedby="addon_name"
                                    value={this.state.productName}
                                    onChange={this.onproductNameChange}
                                    style={styles.productName}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {this.state.imageCIDinvalid}
                                </Form.Control.Feedback>
                                <Button type="submit">Add products</Button>
                            </InputGroup>
                        </Form>
                    </Row>) : " "}

            </>
        )
    }
}

const styles = {
    imageCID: {
    },
    ipfsID: {
        color: "#555"
    }
}

const mapStateToProps = (state, ownProps) => ({
    web3: state.web3Store.web3,
    accounts: state.web3Store.accounts,
    contract: state.PricingChain.contract,
    owner: state.PricingChain.owner,
    products: state.PricingChain.products,
})

export default connect(mapStateToProps, {
    connectWeb3: connectWeb3,
    connectContract: connectContract,
    getProducts: getProducts,
    setToast, notify,
})(Products);
