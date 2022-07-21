import React, { Component } from "react";
import { connect } from 'react-redux'
import { Table, Tab, Alert, ListGroup, Row } from 'react-bootstrap';
import { connectWeb3 } from "../store/web3Store";
import { getSessions, connectContract } from "../store/PricingChain";
import Session from "./Session";
import ConnectWeb3 from "./ConnectWeb3";


class Users extends Component {

    componentDidMount = async () => {
        const { web3, contract, accounts, notify } = this.props;
        if (!contract) {
            console.log(web3);
            this.props.connectContract();
        }
    }

    render() {
        const { web3, contract, accounts, notify } = this.props;
        if (!web3 || !accounts || accounts.length === 0) return (
            <Alert variant={"danger"}  >
                <ConnectWeb3 />
            </Alert>
        );else
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Emails</th>
                        <th>sessions</th>
                        <th>accumulated deviation</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                        <td>@mdo</td>
                    </tr>
                </tbody>
            </Table>
        )
    }
}
const styles = {
}

const mapStateToProps = (state, ownProps) => ({
    web3: state.web3Store.web3,
    accounts: state.web3Store.accounts,
    contract: state.PricingChain.contract,
    sessions: state.PricingChain.sessions
})

export default connect(mapStateToProps, {
    connectWeb3: connectWeb3,
    getSessions: getSessions,
    connectContract: connectContract,
})(Users);

