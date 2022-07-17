import React, { Component } from "react";
import { connect } from 'react-redux'
import { Row, Col, InputGroup, Form, Button, Card, ListGroup } from 'react-bootstrap';
import fontawesome from '@fortawesome/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCopy, faTag } from '@fortawesome/free-solid-svg-icons';

import { connectWeb3 } from "../store/web3Store";
import { getProducts, getSessions, connectContract, } from "../store/PricingChain";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

fontawesome.library.add(faCopy, faTag, faCheck);

class BtnCopy extends React.Component {
    state = { icon: <FontAwesomeIcon icon="fas fa-copy" /> }

    copy = (value) => {
        // console.log(this.state.icon)
        navigator.clipboard.writeText(value);
        this.setState({ icon: <FontAwesomeIcon icon="fas fa-check" style={styles.btnChecked} /> })
        setTimeout(() => {
            this.setState({ icon: <FontAwesomeIcon icon="fas fa-copy" /> })
        }, 1500);
    }

    render() {
        return (
            <label style={styles.btnCopy} onClick={(e) => this.copy(this.props.value)}>
                {this.state.icon}
            </label >
        )
    }
}

const styles = {
    btnCopy: {
        cursor: "pointer"
    },
    btnChecked: {
        cursor: "pointer", color: "green"
    },
}
export default BtnCopy;