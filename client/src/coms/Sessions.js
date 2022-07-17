import React, { Component } from "react";
import { connect } from 'react-redux'
import { Col, Tab, Alert, ListGroup, Row } from 'react-bootstrap';
import { connectWeb3 } from "../store/web3Store";
import { getSessions, connectContract } from "../store/PricingChain";
import Session from "./Session";


class Sessions extends Component {
    componentDidMount = async () => {
        const { contract, accounts, notify } = this.props;
        if (!contract) {
            this.props.connectContract();
        }
        // khởi động contract
        let wait = setInterval(() => {
            if (this.props.contract) {
                this.props.getSessions();
                this.listenEvents(this.props.contract);
                clearInterval(wait);
            }
        }, 500);
    }

    listenEvents = (contract) => {
        const { getSessions } = this.props;

        contract.events.onStartedSession((error, event) => {
            if (error) throw error;
            else {
                // console.log("onStartedSessions", event.returnValues);
                getSessions();
            }
        })
        contract.events.onClosedSession((error, event) => {
            if (error) throw error;
            else {
                // console.log("onClosedSessions", event.returnValues);
                getSessions();
            }
        })

    }

    render() {
        const { contract, sessions } = this.props;

        if (!contract) {
            return (
                <Alert variant={'danger'}>
                    Connect contract error!
                </Alert>)
        }
        return (
            <Row>
                {sessions.map((session, i) => (
                    <Session session={session} key={session.id} />
                ))}
            </Row>
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
})(Sessions);

