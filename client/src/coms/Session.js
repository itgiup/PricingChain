import React, { Component } from "react";
import { connect } from 'react-redux';
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import "moment-timer";

import { Popover, Col, InputGroup, Form, Button, Card, ListGroup, ButtonGroup, OverlayTrigger, Alert, Badge } from 'react-bootstrap';
import fontawesome from '@fortawesome/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faHandHoldingDollar, faAnglesRight, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';

import { connectWeb3 } from "../store/web3Store";
import { getSessions, connectContract } from "../store/PricingChain";
import BtnCopy from "./BtnCopy";
import { notify } from "../store/toast";

momentDurationFormatSetup(moment);

fontawesome.library.add(faPlay, faPause, faHandHoldingDollar, faAnglesRight, faLock, faLockOpen);

class Session extends Component {
    state = {
        validated: true, timeout: 0, price: 0, proposedPrice: 0, participant_pricings: [], timeLeft: -0,
    }
    componentDidMount = async () => {
        await this.getSession();
        this.timeLeft();
        this.listenEvents();
    }

    listenEvents = () => {
        const { session, contract } = this.props;
        if (contract) {
            contract.events.onGuessPrice((error, event) => {
                if (error) throw error;
                else {
                    if (parseInt(event.returnValues.id) === session.id) {
                        this.getSession(session.id);
                    }
                }
            });
            contract.events.onSetPrice((error, event) => {
                if (error) throw error;
                else {
                    if (parseInt(event.returnValues.sessionID) === session.id) {
                        // console.log("onSetPrice", event.returnValues);
                        this.getSession(session.id);
                    }
                }
            });
            // contract.events.onClosedSession((error, event) => {
            //     if (error) throw error;
            //     else {
            //         if (parseInt(event.returnValues.id) === session.id) {
            //             this.timeLeft();
            //             console.log("onClosedSession", event.returnValues);
            //         }
            //     }
            // });
        } else setTimeout(this.listenEvents, 200);
    }

    onPriceChange = (e) => {
        let value = Math.abs(parseInt(e.target.value));
        this.setState({ price: value })
    }

    onTimeoutChange = (e) => {
        let value = parseInt(e.target.value);
        this.setState({ timeout: value > 0 ? value : 0 })
    }

    timeLeft = () => {
        const { session, contract, accounts, notify } = this.props;
        let started = session.timeStarted;
        let timeout = session.timeout; // seconds
        if (session.state === 1 && started > 0 && timeout > 0) {
            let timeEnd = moment.unix(started + timeout);
            let now = moment();
            let duration = moment.duration(now.diff(timeEnd));
            if (duration < 0) {
                this.setState({ timeLeft: Math.round(duration.asSeconds()) });
            }
        } else this.setState({ timeLeft: -0 });
        setTimeout(this.timeLeft, 1000);
    }

    startSession = async (sessionid, timeout = 0) => {
        const { session, contract, accounts, notify } = this.props;
        contract.methods.startSession(sessionid, timeout * 60).send({ from: accounts[0] })
            .then((res) => {
                // console.log('startSession res', res.events.onStartedSession.returnValues.p);
                notify(["start Session success", "success"])
            })
            .catch(error => {
                let message = 'error: ' + error.message.substring(error.message.indexOf('"reason":"'), error.message.indexOf('},"stack":')).split(':')[1]
                notify(message);
                console.error('startSession error', error);
            })
    }

    closeSession = async (sessionid) => {
        const { session, contract, accounts, notify } = this.props;
        contract.methods.closeSession(sessionid).send({ from: accounts[0] })
            .then((res) => {
                // console.log('closeSession res', res.events.onClosedSession.returnValues.p);
                notify(["close Session success", "success"])
            })
            .catch(error => {
                let message = 'error: ' + error.message.substring(error.message.indexOf('"reason":"'), error.message.indexOf('},"stack":')).split(':')[1]
                notify(message);
                console.error('close Session error', error);
            })
    }

    tongleSession = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const { session, contract, accounts, notify } = this.props;

        if (session.state === 1) {
            this.closeSession(session.id);
        } else this.startSession(session.id, this.state.timeout);
    }

    setPrice = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const { web3, session, contract, accounts, notify } = this.props;
        console.log("setPrice", session.id);
        contract.methods.setPrice(session.id, web3.utils.toWei(this.state.price.toString(), 'ether')).send({ from: accounts[0] })
            .then((res) => {
                console.log('setPrice res', res.events/*.calc.map(v => (
                    [v.returnValues[0], v.returnValues[1], v.returnValues[2], v.returnValues[0] * (100 - v.returnValues[1])]
                ))*/); //.onSetPrice.returnValues);
                notify(["set price success", "success"]);
            })
            .catch(error => {
                let message = 'error: ' + error.message.substring(error.message.indexOf('"reason":"'), error.message.indexOf('},"stack":')).split(':')[1]
                notify(message);
                console.error('setPrice error', error);
            });
    }

    getSession = async (id = this.props.session.id) => {
        try {
            let data = await this.props.contract.methods.getSession(id).call();
            // console.log('getSession', data);
            const { web3 } = this.props;
            let session = {
                id: parseInt(data.sessionID),
                productID: parseInt(data.productID),
                ipfsID: data.ipfsID,
                name: data.name,
                price: parseInt(web3.utils.fromWei(data.price, 'ether')),
                proposedPrice: parseInt(web3.utils.fromWei(data.proposedPrice, 'ether')),
                state: parseInt(data.state),
                participant_pricings: data.participants.map((address, index) => ({
                    address: address,
                    pricing: parseInt(data.participant_pricings[index])
                })),
                timeStarted: parseInt(data.timeStarted),
                timeout: parseInt(data.timeout),
            }
            this.setState({
                price: session.price,
                timeout: moment.duration(session.timeout, 'seconds').asMinutes(),
                participant_pricings: session.participant_pricings,
                proposedPrice: session.proposedPrice,
            });
            return session;
        } catch (error) {
            console.error('error ', error);
            return null;
        }
    }

    guessPrice = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const { web3, session, contract, accounts, notify } = this.props;
        contract.methods.guessPrice(session.id, web3.utils.toWei(this.state.price.toString(), 'ether')).send({ from: accounts[0] })
            .then((res) => {
                notify(["pricing susscess", "success"]);
                this.getSession();
            })
            .catch(error => {
                let message = 'Error: ' + error.message.substring(error.message.indexOf('"reason":"'), error.message.indexOf('},"stack":')).split(':')[1]
                notify(message);
                console.error('guessPrice error', error, session);
            })
    }

    render() {
        const { web3, session, accounts, owner } = this.props;
        let disabled = 0 === session.state || this.state.participant_pricings.length >= 10
        /* Danh sách đã dự đoán giá */
        const popover = (
            <Popover id="popover-basic">
                <Popover.Header as="h3">Người đã chơi ({this.state.participant_pricings.length})</Popover.Header>
                <Popover.Body>
                    <ListGroup className="list-group-flush">
                        {this.state.participant_pricings.map((participant, index) => (
                            <ListGroup.Item className="text-center" key={index}>
                                ..{participant.address.slice(-3)} <Badge bg="warning" text="dark"> {web3.utils.fromWei(participant.pricing.toString())} $</Badge>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Popover.Body>
            </Popover>
        );
        let timeStarted = moment.unix(session.timeStarted).format('YYYY-MM-DD  HH:mm:ss');
        return (
            <Col>
                <Card style={{ width: '18rem' }} >
                    <Card.Img variant="top" src={"https://gateway.pinata.cloud/ipfs/" + session.ipfsID} style={{ height: '18rem' }} />
                    <Card.Body>
                        <OverlayTrigger trigger={["hover", "hover"]} placement="right" overlay={popover}>
                            <Card.Title>
                                {disabled ? <FontAwesomeIcon icon="fa-solid fa-lock" color="#0d6efdd9" /> : <FontAwesomeIcon icon="fas fa-lock-open" color="#099956d9" />}&nbsp;
                                {session.name} <Badge bg="warning" text="dark">{web3.utils.fromWei(session.price.toString(), 'ether')} $</Badge > <FontAwesomeIcon icon="fas fa-angles-right" color="#0d6efdab" /></Card.Title>
                        </OverlayTrigger>
                        <Card.Text style={styles.ipfsID}>
                            <i>proposed Price</i> <Badge>{this.state.proposedPrice} $</Badge>
                            {session.ipfsID}&nbsp;
                            <BtnCopy value={session.ipfsID} />
                            <div style={styles.timeStarted}>
                                {session.timeStarted > 0 ?
                                    (<>{timeStarted} <Badge bg="warning" text="dark" style={styles.timeLeft}>{this.state.timeLeft}s</Badge></>) :
                                    "Not started"}
                            </div>
                        </Card.Text>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroup.Item className="text-center">
                            {accounts[0] === owner ?
                                <> {/* Phần dành cho admin */}
                                    <Form noValidate onSubmit={this.tongleSession}>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text id="timeout">⏳"</InputGroup.Text>
                                            <Form.Control
                                                placeholder="product's price..."
                                                aria-label="name"
                                                aria-describedby="timeout"
                                                value={this.state.timeout} type="number"
                                                onChange={this.onTimeoutChange}
                                                required
                                            />
                                            <ButtonGroup>
                                                {session.state === 1 ?
                                                    <Button variant="danger" type="submit" ><FontAwesomeIcon icon="fas fa-pause" /> Close session</Button> :
                                                    <Button variant="success" type="submit" ><FontAwesomeIcon icon="fas fa-play" /> Start session</Button>
                                                } </ButtonGroup></InputGroup>
                                    </Form>

                                    {/* Đặt giá cho sản phẩm */}
                                    <Form noValidate validated={this.state.validated} onSubmit={this.setPrice}>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text id="addonPrice">$</InputGroup.Text>
                                            <Form.Control
                                                placeholder="product's price..."
                                                aria-label="name"
                                                aria-describedby="addonPrice"
                                                value={this.state.price} type="number"
                                                onChange={this.onPriceChange}
                                                required
                                            />
                                            <Button type="submit">Set Price</Button>
                                        </InputGroup>  </Form>
                                </> : /* Phần dành cho user tham gia chơi */ (
                                    <Form noValidate validated={this.state.validated} onSubmit={this.guessPrice}>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text id="addonPrice">$</InputGroup.Text>
                                            <Form.Control
                                                placeholder="product's price..."
                                                aria-label="name"
                                                aria-describedby="addonPrice"
                                                value={this.state.price} type="number"
                                                onChange={this.onPriceChange}
                                                required
                                                disabled={disabled}
                                            />
                                            <Button type="submit" disabled={disabled}>Guess Price</Button>
                                        </InputGroup>  </Form>
                                )
                            }
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col >
        )
    }
}

const styles = {
    ipfsID: {
        color: "#555"
    },
    timeStarted: {
        fontSize: "12px",
        fontStyle: "italic",
    },
    timeLeft: {
        fontSize: "1em",
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        web3: state.web3Store.web3,
        accounts: state.web3Store.accounts,
        contract: state.PricingChain.contract,
        sessions: state.PricingChain.sessions,
        owner: state.PricingChain.owner,
    }
}

export default connect(mapStateToProps, {
    connectWeb3: connectWeb3,
    getSessions: getSessions,
    connectContract: connectContract, notify,
})(Session);

