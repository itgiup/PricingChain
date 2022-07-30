const truffleAssert = require('truffle-assertions');

const color = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",

  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",

  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m"
}

function pLog(message) { console.log(Object.values(arguments).join(' ')) }
function pTitle(message) { console.log(color.BgYellow + (Object.values(arguments).join(' ') + color.Reset)) }
function pError(message) { console.log(color.FgRed + Object.values(arguments).join(' ') + color.Reset) }
function pWarn(message) { console.log(color.FgYellow + Object.values(arguments).join(' ') + color.Reset) }
function pSuccess(message) { console.log(color.FgGreen + Object.values(arguments).join(' ') + color.Reset) }

const BN = web3.utils.BN

const PricingChain = artifacts.require("./PricingChain.sol");


contract("PricingChain", accounts => {

  it("... add product", async () => {
    let instance = await PricingChain.deployed();

    // console.log("instance", instance)
    pTitle("\n\n// 1. thêm sảm phẩm:     ");

    let s = await instance.addProduct('QmSdQ8kf2ELtzrYMes9NC3KUVrbr66BgTBx2LuUAQ8cFm4', { from: accounts[0] });
    pSuccess('addedProduct: ', s.logs[0].args.productID.toNumber())
    s = await instance.addProduct('Qmdr7hfEx8ateqWddTftAwBV2j9uhYYWeEdVwuR27KuZzb', { from: accounts[0] });
    pSuccess('addedProduct: ', s.logs[0].args.productID.toNumber())
    s = await instance.addProduct('QmcNMB26KWY7wvEsTsSkZ4GEAcu31XaJvVNs3s7JjYMur6', { from: accounts[0] });
    pSuccess('addedProduct: ', s.logs[0].args.productID.toNumber())

    pTitle("// thử lấy sản phẩm     ");
    try {
      let product = await instance.getProduct('QmcNMB26KWY7wvEsTsSkZ4GEAcu31XaJvVNs3s7JjYMur6')
      pSuccess('getProduct: ', product.id.toNumber(), product.ipfsID.toString());
    } catch (error) {
      pError('getProduct: ', error)
    }


    pTitle("\n\n// 2. Tạo phiên đấu giá     ");
    try {
      let sessionID = await instance.createSession(1);
      pSuccess('createSession(1): ', sessionID.logs[0].args.sessionID.toNumber())

      sessionID = await instance.createSession(2);
      pSuccess('createSession(2): ', sessionID.logs[0].args.sessionID.toNumber())
    } catch (error) {
      pError('createSession(2): ', error);
    }


    pTitle("\n\n// 3. Bắt đầu phiên đấu giá     ");
    try {
      let sessionID = await instance.startSession(0);
      console.log('startSession(0): ', sessionID.logs[0].args.p)

      sessionID = await instance.startSession(3);
      console.log('startSession(3): ', sessionID.logs[0].args.p)
    } catch (error) {
      pError('startSession(3): ', error);
    }


    pTitle("\n\n// 4. Đấu giá     ");
    try {
      let pricing = await instance.pricing(0, 9);
      pSuccess('pricing(0, 9): ', pricing.logs[0].args.participant);

      pricing = await instance.pricing(5, 6);
      pSuccess('pricing(5, 6): ', pricing.logs[0].args.participant);

    } catch (error) {
      pError('pricing(5, 6): ', error);
    }


    pTitle("\n\n// 5. Đóng phiên đấu giá     ");
    try {
      let closed = await instance.closeSession(0);
      console.log('closeSession(0): ', closed.logs[0].args.p);

      // closed = await instance.closeSession(5);
      // console.log('closeSession(5): ', closed.logs[0]);
    } catch (error) {
      pError('closeSession(5): ', error);
    }

    // 6. Chốt giá


    // 7. Lấy thông tin sản phẩm


    // await instance.createSession(2);
    // await instance.createSession(1);
    // let tx = await instance.createSession(3);
    // truffleAssert.eventEmitted(tx, 'onCreatedSession', (ev) => {
    //   console.log('eventEmitted', ev);
    //   // return ev.player === bettingAccount && ev.betNumber.eq(ev.winningNumber);
    //   return ev.sessionID
    // });

  })

});
