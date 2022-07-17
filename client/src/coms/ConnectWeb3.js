import React, { Component } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { connect } from 'react-redux'
import { connectWeb3, updateAccounts, CHAINS, switchChain } from "../store/web3Store";
import metamaskImg from "./metamask.svg";
import PricingChainABI from "../contracts/PricingChain"

class ConnectWeb3 extends Component {
    state = {
    }
    componentDidMount = async () => {
        window.ethereum.on('chainChanged', (chainId) => {
            this.props.updateChain(chainId);
        });
        window.ethereum.on('accountsChanged', (accounts) => {
            console.log('accountsChanged', accounts);
            this.props.updateAccounts(accounts);
        });
    }

    connect = async () => {
        await this.props.connectWeb3()
    }

    switchChain = async (chainId) => {
        console.log(chainId);
        this.props.switchChain(chainId);
    }
    render() {
        const { accounts, chainId, chainName, } = this.props;
        // console.log('ConnectWeb3:', accounts, chainId, chainName, CHAINS[chainId], Object.keys(PricingChainABI.networks))
        return (
            <label style={styles.com} onClick={this.connect}>
                <label style={styles.img}><img src={metamaskImg} /></label>
                <label style={styles.texts}>
                    <div>
                        <DropdownButton onSelect={this.switchChain} title={CHAINS[chainId] ? CHAINS[chainId].nativeCurrency.symbol : "connect web3"} style={styles.dropChains}>
                            {Object.keys(PricingChainABI.networks).map(v => (
                                <Dropdown.Item eventKey={v} key={v}>
                                    {CHAINS[v] ? CHAINS[v].chainName : v}</Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </div>
                    <div>{(accounts.length > 0) ? "0x..." + accounts[0].slice(-3) : "connect web3"}</div>
                </label>
            </label>
        )
    }
}

const styles = {
    com: {
        cursor: 'pointer',
        width: 'fit-content',
        borderWidth: 3,
        borderStyle: "solid",
        borderColor: "black",
        borderImage: "linear-gradient(45deg, turquoise, greenyellow) 1 / 1 / 0 stretch",
        boxShadow: "rgb(170 170 170) 2px 2px 2px",
    },
    img: {
        display: "inline-grid",
        cursor: 'pointer',
        marginRight: 5
    },
    texts: {
        cursor: 'pointer',
    },
    dropChains: {
        padding: 1,
        margin: 1,
    },

}
const mapStateToProps = (state, ownProps) => ({
    web3: state.web3Store.web3,
    accounts: state.web3Store.accounts,
    chainId: state.web3Store.chainId,
    chainName: state.web3Store.chainName,
})

export default connect(mapStateToProps, {
    connectWeb3: connectWeb3,
    updateAccounts,
    switchChain: switchChain,
})(ConnectWeb3);

