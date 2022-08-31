import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import "moment-timer";
import Wallets from "./testWallets";

import PricingChain from "./contracts/PricingChain.json";

momentDurationFormatSetup(moment);

function random(min, max) { return Math.floor(Math.random() * (max - min) + min); }

let mywalletsPK = Wallets.map(v => v.pk);
let mywallets = Wallets.map(v => v.address);
let myProvider = window.myProvider = new HDWalletProvider(mywalletsPK, "http://localhost:8545", 0, 10);
let myWeb3 = window.myWeb3 = new Web3(myProvider);

const test = async () => {
    // if (!contract) return alert('error.....')
    // else 
    let myproducts = [
        {
            name: "giày golf",
            ipfsID: "QmNndBy2XHuM4f2vVwmykfkEXytAcrAX88HCfFC2V6VYNL"
        },
        {
            name: "sim eject",
            ipfsID: "QmcfykxRQcFjHJEBmng7RSHUf1FzzfpmPYVEu6Lmaf14rZ"
        },
        {
            name: "samsung",
            ipfsID: "QmXNzeqXwqtjJoUS3nS5CgJad9sspsaf5BKNadU8rLuGiF"
        },
        {
            name: "iphone 11",
            ipfsID: "QmbMjGZp3TgHUJuY4QNm9n1qg9Wy5LvG3MA36XiLi7QJx2"
        },
        {
            name: "galaxy s22",
            ipfsID: "QmSy425yK2bjAzWp2ba68HzFdAfwtfD64auk52xs5LoxQr"
        },
    ];
    let mysesions = [
        { productID: 0 },
        { productID: 1 },
        { productID: 2 },
    ];

    let contract = window.mycontract = new myWeb3.eth.Contract(PricingChain.abi, PricingChain.networks[5777].address);
    // Bắt đầu chạy test
    (async () => true)()

        // Đăng kí người chơi : name, email
        .then(() => {
            return mywallets.map((v, i) => {
                // không phải account admin
                if (i > 0) {
                    let name = v.slice(-3),
                        email = v.slice(-3) + "@gmail.com",
                        account = v;
                    console.log(i, name, email, account);
                    return contract.methods.register(name, email).send({ from: account })
                        .then(res => console.log(res.events.onRegisted.returnValues));
                }
            })
        })

        // thêm sản phẩm
        .then(() => myproducts.map(p => {
            contract.methods.addProduct(p.ipfsID, p.name).send({ from: mywallets[0] })
                .then(() => {
                    console.log("success add ", p.name);
                }).catch(error => {
                    console.error("thêm sản phẩm", error.message);
                })
        }))

        // thêm session
        .then(() => Promise.all(mysesions.map(p => {
            return contract.methods.createSession(p.productID).send({ from: mywallets[0] })
                .then((res) => {
                    console.log("success createSession ", res.events.onCreatedSession.returnValues);
                    return res.events.onCreatedSession.returnValues;
                }).catch(error => {
                    console.error("thêm session", error.message);
                })
        })))

        // kích hoạt session ngẫu nhiên
        .then(() => {
            let sessionID = 0;// random(0, mysesions.length - 1);
            console.log(mysesions, sessionID)
            return contract.methods.startSession(sessionID, 0).send({ from: mywallets[0] })
                .then(res => res.events.onStartedSession.returnValues.id)
        })

        // tạo ngẫu nhiên các ví người chơi tham gia đoán giá
        .then((sessionID) => {
            sessionID = 1;
            let numberAddresses = random(1, mywallets.length - 1);
            let doanGia = (sessionID, numberAddresses, i = 1) => {
                if (i <= numberAddresses) {
                    let address = mywallets[random(1, mywallets.length - 1)];
                    console.log("guess price: ", sessionID, address);

                    contract.methods.guessPrice(sessionID, window.myWeb3.utils.toWei(random(1, 100).toString(), 'ether'))
                        .send({ from: address })
                        .then(res => console.log(res.events.onGuessPrice.returnValues));
                    return doanGia(sessionID, numberAddresses, i + 1);
                } else return sessionID;
            }

            return contract.methods.startSession(sessionID, 0).send({ from: mywallets[0] }).then(() => {
                return doanGia(sessionID, numberAddresses);
            })
        })

        // refresh
        .then((sessionID) => {
            console.log("closeSession", sessionID);
            return contract.methods.closeSession(sessionID).send({ from: mywallets[0] })
                .then(res => {
                    console.log(res.events.onClosedSession.returnValues);
                    return res.events.onClosedSession.returnValues;
                })
        }).then((res) => console.log("Done", "window.location.reload()"));
}

export default test;