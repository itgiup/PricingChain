import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import "moment-timer";

import PricingChain from "./contracts/PricingChain.json";

momentDurationFormatSetup(moment);

let mywalletsP = [
    '58cda6528e72266566dba1c09cd2687a1ea202ec536f5e66bef7b219e63f0688',
    '6bbc25ad0d901b44a3d7e3cd16b931145dd92f011e89ba79f65d23e013da0e1c',
    '038fad47b484cdfbe34d7fb19b6ec7d25edd78c33e711987763218766a874a9c',
    'a81db92a93023a6f88aa0814e0b0f8545c7359e3802fde2f69e5359e3c6f39d9',
    'f8c513e274eccf8f35099ef922858318cf4160ebd32ad299c565becf990196f4',
    '92030c6cfb1db8c280c87313f7518436c1b7c67760ed479a87ba5d9c85d793c7',
    '9a91aff1de275dc7348a4f0fcd3eceb784fbeb297fd33b93568cba64bf0a9f94',
    '2ed3f7fa145bbabda5ba8d0000c2f1c84d74e4a858e3f300609b7cef2b280f3a',
    'cdf1ad786621d7b3a978c6544a2ade0b8c927258ca2268b2635c777497cc238d',
    '8c8e898a3e45ed44c4c9a77b1ee834c22cbd395f54358c6af8fa2199f0beb87d',
    'f25963a7823c0ce05f24d23a224bf448f74829211d895df105ccc7fe83b99f54',
];
let mywalletsL = [
    'ad888e1d74cf790c3f855d5f01bc3d53b61d3c831a050661e24a21aeb988bcc9',
    '4aa846366ddee8dc5df9ef91f0174a9ae70a3fc9a1950895da6d9070b6874ad4',
    '9e9f942cb787aa4b6da2ce9ed64d6d98277c4ad0b53b23abdc2a8af7fa3ab189',
    '95cc3e33e9a69338c9b1a3b5f3b87a1765374faca4c07c824bba1d7389aa2311',
    '03373a2b11375ce10e33e96e66a7b5718afeaef8801dcbadabf3bcc75808419f',
    '7cbd274bd6532cc01a943d8279702ff90de63b5b8e19bb9b284c761f5262711e',
    'e4fe708b05c6fe70db53486a6cba60f0dc11c163ef887793b24250bbf76b9fe7',
    'd7124453f3980b334acbb46cc8cb050e08586d5f56238ec09e4ad6e5a36e9821',
    '010872bce0ec5143e06ac90298411e130a604482f58b072ebda7d2e74a3b593c',
    '2ba5132cea19ab1bb375da46042bf3d483fcbc6e469ef0cc11b40c0c116970dc',
    '90068cd91943ab8f32a2b2a536634ce3cb340372897ec393c81662ebbb5935fd',
];

let mywallets = mywalletsL;

const test1 = async () => {
    window.myProvider = new HDWalletProvider(mywallets, "http://localhost:8545", 0, 10);
    window.myWeb3 = new Web3(window.myProvider)
    let contract =
        window.mycontract =
        new window.myWeb3.eth.Contract(PricingChain.abi, PricingChain.networks[5777].address);
    contract.methods.test().call({ from: window.myProvider.addresses[0] })
        .then(rse => {
            const now = new Date(parseInt(rse) * 1000);
            let v = moment.unix(rse, 'YYYY/MM/DD HH:mm:ss');
            console.log(v)
        })
        .catch(console.error)
}

const test2 = async () => {
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
    let pricings = [
        {
            address: "0x795667b1E4d057Aae442cdee09896D7d81e8da13", sessionID: "0", pricing: 6,
            address: "0x89C3aC8D824035DA67d5F253F3dc87e40cB59F7B", sessionID: "0", pricing: 5,
            address: "0xC6a3Fe62fEAdA8DE965c152344A5764435916935", sessionID: "0", pricing: 4,
            address: "0x987ed3543Bae6306cd589653117b6ce40BadAfe8", sessionID: "0", pricing: 2,
            address: "0x939A0e9a5FB30c8C7c3410eA40965A9B0F77BCB6", sessionID: "0", pricing: 8,
            address: "0xE2EcdE4E3c91ffd2a45A087937Ca970802D93f84", sessionID: "0", pricing: 9,
            address: "0x194416cbF451892e0A2EA80058Efe73A37739865", sessionID: "0", pricing: 10,
            address: "0x4201f1142757f3BeabD5427a96a1Cf1DeC4Bc283", sessionID: "0", pricing: 12,
            address: "0xB1163FD94FE6B0Cb9eA6e1b64Eab714df96CeED8", sessionID: "0", pricing: 11,
            address: "0x7C0584373EE7251AA5Ad7eaDFc2aD23aA7c5158b", sessionID: "0", pricing: 5,
        }
    ];
    window.myProvider = new HDWalletProvider(mywallets, "http://localhost:8545", 0, 10);
    window.myWeb3 = new Web3(window.myProvider)
    let contract =
        window.mycontract =
        new window.myWeb3.eth.Contract(PricingChain.abi, PricingChain.networks[5777].address);
    // thêm sản phẩm
    (async () => myproducts.map(p => {
        contract.methods.addProduct(p.ipfsID, p.name).send({ from: window.myProvider.addresses[0] })
            .then(() => {
                console.log("success add ", p.name);
            }).catch(error => {
                console.error(error.message);
            })
    }))()

        // thêm session
        .then(() => mysesions.map(p => {
            contract.methods.createSession(p.productID).send({ from: window.myProvider.addresses[0] })
                .then((res) => {
                    console.log("success createSession ", res.events.onCreatedSession.returnValues);
                }).catch(error => {
                    console.error(error.message);
                })
        }))

        // kích hoạt session 0
        .then(() => contract.methods.startSession(0, 0).send({ from: window.myProvider.addresses[0] })
            .then(res => console.log("stated session 0", res.status)))

        // các ví người chơi tham gia đoán giá
        .then(() => {
            let doanGia = (i = 1, to = 10) => {
                if (i <= to) {
                    contract.methods.guessPrice(0, Math.floor(Math.random() * 11) + 1).send({ from: window.myProvider.addresses[i] })
                        .then(res => console.log(res.events.onGuessPrice.returnValues));
                    return doanGia(i + 1, to);
                } else return true;
            }
            return doanGia(1, 4);
        })
        .then(window.location.reload);
}

const test = test2;

export default test;