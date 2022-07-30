const PricingChain = artifacts.require("./PricingChain.sol");

function random(min, max) { return Math.floor(Math.random() * (max - min) + min); }
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

contract("PricingChain", accounts => {


  it("Thêm sản phẩm", async () => {
    let contract = await PricingChain.deployed();

    myproducts.map((p, i) => {
      contract.addProduct(p.ipfsID, p.name, { from: accounts[0] })
        .then(() => {
          console.log("success add ", p.name);
        }).catch(error => {
          console.error("thêm sản phẩm", error.message);
        })
    });
  });



  it("Thêm sản phẩm bị trùng", async () => {
    let contract = await PricingChain.deployed();
    try {
      await contract.addProduct(
        "QmNndBy2XHuM4f2vVwmykfkEXytAcrAX88HCfFC2V6VYNL",
        "giay golf", { from: accounts[0] }
      );
    } catch (error) {
      let m = error.toString();
      let patern = "-- Reason given: ";
      let mess = m.substring(m.search("-- Reason given: ") + patern.length);
      assert.equal("This product has been added.", mess);
    }
  });



  it("Người chơi đăng kí", async () => {
    let contract = await PricingChain.deployed();
    accounts.map((v, i) => {
      let name = v.slice(-3),
        email = v.slice(-3) + "@gmail.com",
        account = v;
      console.log(i, name, email, account,)
      contract.register(name, email, { from: account })
        .then(res => console.log(res.events.onRegisted.returnValues))
    })
  });




  it("Thêm session", async () => {
    let contract = await PricingChain.deployed();
    mysesions.map(p =>
      contract.createSession(p.productID, { from: window.myProvider.addresses[0] })
        .then((res) => {
          console.log("success createSession ", res.events.onCreatedSession.returnValues);
        }).catch(error => {
          console.error("thêm session", error.message);
        })
    )
  });



  // it("kích hoạt session ngẫu nhiên", async () => {
  //   let contract = await PricingChain.deployed();
  //   let sessionID = random(0, mysesions.length - 1);
  //   contract.startSession(sessionID, 0).send({ from: window.myProvider.addresses[0] })
  //     .then(res => res.events.onStartedSession.returnValues.id)
  // });


  // /* */
  // it("", async () => {
  //   let contract = await PricingChain.deployed();
  // });


});
