import React, { Component } from "react";
import { connect } from 'react-redux'
import { Table, Tab, Alert, ListGroup, Row, Button, Col, Form, InputGroup, Badge } from 'react-bootstrap';
import { connectWeb3 } from "../store/web3Store";
import { getSessions, connectContract } from "../store/PricingChain";
import Session from "./Session";
import ConnectWeb3 from "./ConnectWeb3";

import { setToast, notify } from "../store/toast";


class Users extends Component {

    state = {
        users: [], name: "", email: "", address: "",
    }
    componentDidMount = async () => {
        if (!this.props.contract) {
            this.props.connectContract();
        }
        // chờ đến khi kết nối được contract
        let waitContract = setInterval(async () => {
            if (this.props.contract) {
                console.log(this.props.owner, this.props.accounts[0], this.props.owner === this.props.accounts[0]);
                let acc = this.props.accounts[0];
                if (this.props.owner !== acc) {
                    this.getUser(acc);
                } else this.getUsers();
                clearInterval(waitContract);
            }
        }, 200);
    }
    onNameChange = async (event) => {
        // console.log(event.target.value);
        this.setState({ name: event.target.value })
    }
    onEmailChange = async (event) => {
        this.setState({ email: event.target.value })
    }

    getUsers = async () => {
        const { web3, contract, accounts, notify } = this.props;
        return contract.methods.getUsers().call().then((data) => {
            console.log('getUsers', data);
            this.setState({
                users: data._walletAddresses.map((v, i) => {
                    return {
                        name: data._names[i],
                        email: data._emails[i],
                        address: data._walletAddresses[i],
                        accumulatedDeviation: parseInt(data._accumulatedDeviations[i]),
                        numbersOfSessionJoined: parseInt(data._numbersOfSessionJoineds[i]),
                    };
                })
            })
        })
    }

    getUser = async (address) => {
        const { web3, contract, accounts, notify } = this.props;
        return contract.methods.getUser(address).call().then((data) => {
            console.log('getUsers', data);
            this.setState({
                name: data._name,
                email: data._email,
                address: data._walletAddress,
                accumulatedDeviation: parseInt(data._accumulatedDeviation),
                numbersOfSessionJoined: parseInt(data._numbersOfSessionJoined),
            })
        })
    }

    register = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log(this.state.name, this.state.email)
        return this.props.contract.methods.register(this.state.name, this.state.email).send({ from: this.props.accounts[0] })
            .then(res => {
                console.log(res.events.onRegisted.returnValues);
                this.props.notify(["registed", "success"])
            }).catch(err => {
                console.error(err);
                this.props.notify(err.message);
            });
    }
    render() {
        const { web3, contract, accounts, owner } = this.props;
        if (!web3 || !accounts || accounts.length === 0) return (
            <>
                <Row>
                    <Col>
                        <Row style={{ textAlign: 'center' }}>Log in</Row>
                        <Row><ConnectWeb3 /></Row>
                    </Col>
                </Row>
            </>
        );

        if (!contract) {
            this.props.connectContract();
            return (
                <>Please connect contract</>
            );
        }

        /* admin */
        if (owner === accounts[0])
            return (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Emails</th>
                            <th>address</th>
                            <th>session joined</th>
                            <th>accumulated deviation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.users.map((v, i) => (
                                <tr key={i}>
                                    <td>{i}</td>
                                    <td>{v.name}</td>
                                    <td>{v.email}</td>
                                    <td>...{v.address.slice(-3)}</td>
                                    <td>{v.numbersOfSessionJoined}</td>
                                    <td>{v.accumulatedDeviation}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            );

        /* user */
        return (
            <Col>
                <Form onSubmit={this.register}>
                    <b>Sign up / Update info</b>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="addon_name">name</InputGroup.Text>
                        <Form.Control
                            placeholder="peter"
                            aria-describedby="addon_name"
                            value={this.state.name}
                            onChange={this.onNameChange}
                            required
                        />
                    </InputGroup>
                    <InputGroup>
                        <InputGroup.Text id="addon_email">email</InputGroup.Text>
                        <Form.Control
                            placeholder="peter@mail.com"
                            aria-describedby="addon_email"
                            value={this.state.email}
                            onChange={this.onEmailChange}
                            type="email"
                            required
                        />
                    </InputGroup>
                    <Button type="submit">Register / Update info</Button>
                </Form>
                <br />
                accumulated Deviation <Badge>{this.state.accumulatedDeviation}</Badge> &nbsp; | &nbsp;
                numbers Of Session Joined <Badge>{this.state.numbersOfSessionJoined}</Badge>
            </Col>
        )
    }
}

const styles = {
}

const mapStateToProps = (state, ownProps) => ({
    web3: state.web3Store.web3,
    accounts: state.web3Store.accounts,
    owner: state.PricingChain.owner,
    contract: state.PricingChain.contract,
    sessions: state.PricingChain.sessions
})

export default connect(mapStateToProps, {
    connectWeb3: connectWeb3,
    getSessions: getSessions,
    connectContract: connectContract,
    notify: notify,
})(Users);

