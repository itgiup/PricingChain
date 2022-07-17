import React, { Component } from "react";
import { connect } from 'react-redux'
import { Col, Button, Alert, ListGroup, Row, Accordion } from 'react-bootstrap';
import { connectWeb3 } from "./store/web3Store";
import ConnectWeb3 from "./coms/ConnectWeb3";

import Sessions from "./coms/Sessions";
import Products from "./coms/Products";

import test from "./test"
class Admin extends Component {
    componentDidMount = async () => {
        const { web3, accounts } = this.props;
        await this.props.connectWeb3()

        window.ethereum.on('chainChanged', (chainId) => {
            // console.log(chainId);
            window.location.reload();
        });
    }

    getSession = async () => {
        const { web3, accounts } = this.props;
    }

    render = () => {
        const { web3, accounts, sessions, products } = this.props;
        if (!web3 || !accounts || accounts.length === 0) return (
            <Alert variant={"danger"}  >
                <ConnectWeb3 />
            </Alert>
        );
        return (
            <><Button onClick={test}>Test</Button>
                <Accordion defaultActiveKey="1">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Products({products.length})</Accordion.Header>
                        <Accordion.Body>  <Products /></Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Sessions({sessions.length})</Accordion.Header>
                        <Accordion.Body>  <Sessions /></Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </>
        )
    }
}

const styles = {
}


const mapStateToProps = (state, ownProps) => ({
    web3: state.web3Store.web3,
    accounts: state.web3Store.accounts,
    sessions: state.PricingChain.sessions,
    products: state.PricingChain.products,
})

export default connect(mapStateToProps, {
    connectWeb3: connectWeb3,
})(Admin);

