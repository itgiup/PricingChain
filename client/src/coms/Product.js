import React, { Component } from "react";
import { connect } from 'react-redux';
import { Row, Col, InputGroup, Form, Button, Card, ListGroup } from 'react-bootstrap';

import BtnCopy from "./BtnCopy"
import { notify } from "../store/toast";

import { connectWeb3 } from "../store/web3Store";
import { getProducts, getSessions, connectContract, } from "../store/PricingChain";


class Product extends Component {

    createSession = async (productID) => {
        const { web3, contract, owner, accounts, notify } = this.props;
        if (!web3)
            notify("web3 was not connected");
        else if (!contract)
            notify("contract was not connected");
        else if (owner !== accounts[0])
            notify("you are not admin");
        else {
            // alert(productID)
            contract.methods.createSession(productID).send({ from: accounts[0] })
                .then(res => {
                    // console.log('respone:', res.events.onCreatedSession.returnValues)
                    notify(["created Session success", 'success'])
                })
                .catch(error => {
                    if (error.code === 4001) notify("You rejected");
                })
        }
    }
    render() {
        const { accounts, owner, product } = this.props;
        return (
            <Col>
                <Card style={{ width: '18rem' }} >
                    <Card.Img variant="top" src={"https://gateway.pinata.cloud/ipfs/" + product.ipfsID} style={{ height: '18rem' }} />
                    <Card.Body>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text style={styles.ipfsID}>
                            {product.ipfsID}&nbsp;
                            <BtnCopy value={product.ipfsID} />
                        </Card.Text>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroup.Item className="text-center">
                            {/* Phần dành cho admin */}
                            {accounts[0] === owner ?
                                <> <b>{product.price === "0" ? "?" : product.price}</b> $ <Button onClick={e => this.createSession(product.id)}>Create session</Button></>
                                : (<></>)
                            }
                        </ListGroup.Item>
                    </ListGroup>

                </Card>
            </Col>
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

const mapStateToProps = (state, ownProps) => {
    return {
        web3: state.web3Store.web3,
        accounts: state.web3Store.accounts,
        contract: state.PricingChain.contract,
        owner: state.PricingChain.owner,
        products: state.PricingChain.products,
        sessions: state.PricingChain.sessions,
    }
}

export default connect(mapStateToProps, {
    connectWeb3: connectWeb3,
    getSessions: getSessions,
    connectContract: connectContract,
    getProducts: getProducts,
    notify,
})(Product);
