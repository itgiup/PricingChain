import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import "moment-timer";

import PricingChain from "./contracts/PricingChain.json";

momentDurationFormatSetup(moment);

let mywalletsP = [
    {
        'address': '0x78FadaD09ffbfB2a0E7D9F7c4EB98265838DECB2',
        'pk': '58cda6528e72266566dba1c09cd2687a1ea202ec536f5e66bef7b219e63f0688',
    },
    {
        'address': '0x746e9Fbb7E066435eF4208E3661e4B42aD09A0dD',
        'pk': '6bbc25ad0d901b44a3d7e3cd16b931145dd92f011e89ba79f65d23e013da0e1c',
    },
    {
        'address': '0xe8584AA83Df68EA98e840dAc05782B81559D1Da1',
        'pk': '038fad47b484cdfbe34d7fb19b6ec7d25edd78c33e711987763218766a874a9c',
    },
    {
        'address': '0x53C6E288B9eF2E2627b09E4DEAec3806A0571Cf1',
        'pk': 'a81db92a93023a6f88aa0814e0b0f8545c7359e3802fde2f69e5359e3c6f39d9',
    },
    {
        'address': '0x9428207253BC364209212d07B88E21c2fCF916d6',
        'pk': 'f8c513e274eccf8f35099ef922858318cf4160ebd32ad299c565becf990196f4',
    },
    {
        'address': '0x2769C260f31240901271C53D72E263D16b4F1946',
        'pk': '92030c6cfb1db8c280c87313f7518436c1b7c67760ed479a87ba5d9c85d793c7',
    },
    {
        'address': '0x8224D37EDCc433F5d75a75D9d80aE40FE0Fa221A',
        'pk': '9a91aff1de275dc7348a4f0fcd3eceb784fbeb297fd33b93568cba64bf0a9f94',
    },
    {
        'address': '0xA12FFe75d5d0ce348a9d6d5488418E258FA14b82',
        'pk': '2ed3f7fa145bbabda5ba8d0000c2f1c84d74e4a858e3f300609b7cef2b280f3a',
    },
    {
        'address': '0xE66e2e188B3fed6b6C7fE215662866712E0cf43a',
        'pk': 'cdf1ad786621d7b3a978c6544a2ade0b8c927258ca2268b2635c777497cc238d',
    },
    {
        'address': '0x0849A8AE53b1eE2F9141D41f61551c40eba06491',
        'pk': '8c8e898a3e45ed44c4c9a77b1ee834c22cbd395f54358c6af8fa2199f0beb87d',
    },
    {
        'address': '',
        'pk': 'f25963a7823c0ce05f24d23a224bf448f74829211d895df105ccc7fe83b99f54',
    },
];

let mywalletsL = [
    {
        'address': '0x78298fa25ebf614a994041df199c28bc637804d5',
        'pk': 'ad888e1d74cf790c3f855d5f01bc3d53b61d3c831a050661e24a21aeb988bcc9'
    },
    {
        'address': '0x85c033d0055b1f5c36b08db9603a2d6021b56246',
        'pk': '4aa846366ddee8dc5df9ef91f0174a9ae70a3fc9a1950895da6d9070b6874ad4'
    },
    {
        'address': '0xd25693339814e3d3553a0ace3351639bb1ae6b5d',
        'pk': '9e9f942cb787aa4b6da2ce9ed64d6d98277c4ad0b53b23abdc2a8af7fa3ab189'
    },
    {
        'address': '0x787a6c82d901e9519d5e5c727eaae3a8406c3e76',
        'pk': '95cc3e33e9a69338c9b1a3b5f3b87a1765374faca4c07c824bba1d7389aa2311'
    },
    {
        'address': '0x2d75f3fd51bd2c967e8a78dcf138851c92a07991',
        'pk': '03373a2b11375ce10e33e96e66a7b5718afeaef8801dcbadabf3bcc75808419f'
    },
    {
        'address': '0xe90cc5285ad5c769df910be820945341d8d4ada2',
        'pk': '7cbd274bd6532cc01a943d8279702ff90de63b5b8e19bb9b284c761f5262711e'
    },
    {
        'address': '0x4201f1142757f3beabd5427a96a1cf1dec4bc283',
        'pk': 'e4fe708b05c6fe70db53486a6cba60f0dc11c163ef887793b24250bbf76b9fe7'
    },
    {
        'address': '0xb1163fd94fe6b0cb9ea6e1b64eab714df96ceed8',
        'pk': 'd7124453f3980b334acbb46cc8cb050e08586d5f56238ec09e4ad6e5a36e9821'
    },
    {
        'address': '0x7c0584373ee7251aa5ad7eadfc2ad23aa7c5158b',
        'pk': '010872bce0ec5143e06ac90298411e130a604482f58b072ebda7d2e74a3b593c'
    },
    {
        'address': '0x536a768935acb8a8eda69f96957034a654f77260',
        'pk': '2ba5132cea19ab1bb375da46042bf3d483fcbc6e469ef0cc11b40c0c116970dc'
    },
    {
        'address': '0xF0920fA6D4e20243125ED7F63D1ddFD048a95a3d',
        'pk': 'aaf2da5a85000c571e83e0b14d9206704187149e808ce9ef475dbea714435367'
    },
    {
        'address': '0xD5E77dE6240282f91E0A4886aDa9d4EC16C00df0',
        'pk': 'd4f971026fc00a442549938df97b22ed0dc2f1e166138b9a1c0ccd5b8ac2e879'
    },
];


export default mywalletsL;
