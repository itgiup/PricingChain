// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./lib/myMath.sol";

contract PricingChain is Ownable {
    enum State {
        CLOSE,
        OPEN
    }

    struct Product {
        uint256 id;
        string ipfsID;
        string name;
        uint256 price; // P
    }

    struct Session {
        uint256 id;
        uint256 productID;
        State state;
        address[] participants;
        mapping(address => uint256) participant_pricing;
        mapping(address => uint256) deviationOfParticipants;
        uint256 timeStarted;
        uint256 timeout;
        int proposedPrice;
        uint256 finalPrice;
    }

    struct User {
        string name;
        string email;
        address walletAddress;
        uint accumulatedDeviation;
        uint numbersOfSessionJoined;
    }

    event onRegisted(string name, string email, address addr);
    event onProductAdded(
        uint256 productID,
        string ipfsID,
        string name,
        uint256 price
    );
    event onCreatedSession(Product p, uint256 sessionID);
    event onStartedSession(uint256 id, State, Product p);
    event onClosedSession(uint256 id, State, Product p);
    event onGuessPrice(address participant, uint256 price, uint256 sessionID);
    event onSetPrice(
        uint256 productID,
        uint256 price,
        uint256 sessionID,
        int proposedPrice,
        uint[] deviationOfParticipants
    );

    // Số người tham gia tối đa
    uint8 private participantsLimit = 10;

    // đếm xem có bao nhiêu sản phẩm
    // danh sách sản phẩm, uint là id của sản phẩm
    Product[] private _products;

    // danh sách session
    Session[] private _sessions;
    User[] public _users;

    constructor() public {
        /* test */
        /*addProduct(
            "QmSy425yK2bjAzWp2ba68HzFdAfwtfD64auk52xs5LoxQr",
            "galaxy s22"
        );
        addProduct(
            "QmNndBy2XHuM4f2vVwmykfkEXytAcrAX88HCfFC2V6VYNL",
            "giay golf"
        );
        // _products[0].price = 10;

        createSession(0);
        startSession(0, 0);

        guessPrice(0, 5 ether, 0x746e9Fbb7E066435eF4208E3661e4B42aD09A0dD);
        guessPrice(0, 2 ether, 0xe8584AA83Df68EA98e840dAc05782B81559D1Da1);
        guessPrice(0, 24 ether, 0x53C6E288B9eF2E2627b09E4DEAec3806A0571Cf1);
        guessPrice(0, 7 ether, 0x9428207253BC364209212d07B88E21c2fCF916d6);
        guessPrice(0, 4 ether, 0x2769C260f31240901271C53D72E263D16b4F1946);
        closeSession(0);*/
    }

    // register and update user infomation
    function register(string memory name, string memory email)
        public
        returns (bool _exist)
    {
        address addr = msg.sender;
        bool exist = false;
        for (uint i = 0; i < _users.length; i++) {
            if (addr == _users[i].walletAddress) {
                exist = true;
                User storage u;
                u = _users[i];
                u.name = name;
                u.email = email;
                emit onRegisted(name, email, addr);
                return (exist);
            }
        }
        if (!exist) {
            User storage u;
            u = _users.push();
            u.name = name;
            u.email = email;
            u.walletAddress = addr;
            emit onRegisted(name, email, addr);
            return (exist);
        }
    }

    function getUser(address addr)
        public
        view
        returns (
            string memory _name,
            string memory _email,
            address _walletAddress,
            uint _accumulatedDeviation,
            uint _numbersOfSessionJoined
        )
    {
        User memory u;
        for (uint256 i = 0; i < _users.length; i++) {
            if (_users[i].walletAddress == addr) {
                u = _users[i];
            }
        }
        return (
            u.name,
            u.email,
            u.walletAddress,
            u.accumulatedDeviation,
            u.numbersOfSessionJoined
        );
    }

    function getUsers()
        public
        view
        returns (
            string[] memory _names,
            string[] memory _emails,
            address[] memory _walletAddresses
        )
    {
        string[] memory names = new string[](_users.length);
        string[] memory emails = new string[](_users.length);
        address[] memory walletAddresses = new address[](_users.length);
        for (uint i = 0; i < _users.length; i++) {
            names[i] = _users[i].name;
            emails[i] = _users[i].email;
            walletAddresses[i] = _users[i].walletAddress;
        }
        return (names, emails, walletAddresses);
    }

    function setUserAccumulatedDeviation(
        address user,
        uint accumulatedDeviation
    ) public onlyOwner returns (bool status) {
        for (uint i = 0; i < _users.length; i++) {
            if (_users[i].walletAddress == user) {
                _users[i].accumulatedDeviation = accumulatedDeviation;
                _users[i].numbersOfSessionJoined++;
                return true;
            }
        }
        return false;
    }

    modifier isProductAdded(string memory ipfsID) {
        for (uint256 i = 0; i < _products.length; i++) {
            if (
                keccak256(abi.encodePacked((_products[i].ipfsID))) ==
                keccak256(abi.encodePacked((ipfsID)))
            ) {
                revert("This product has been added");
            }
        }
        _;
    }

    function addProduct(string memory ipfsID, string memory name)
        public
        onlyOwner
        isProductAdded(ipfsID)
        returns (uint256 id)
    {
        Product storage p = _products.push();
        p.id = _products.length - 1;
        p.ipfsID = ipfsID;
        p.name = name;
        emit onProductAdded(p.id, p.ipfsID, p.name, p.price);
        return p.id;
    }

    function getProductByID(uint256 ID)
        public
        view
        returns (
            uint256 id,
            string memory ipfsID,
            uint256 price
        )
    {
        if (ID < 0 || ID >= _products.length) ID = _products.length - 1;
        Product storage p = _products[ID];
        /*Session storage s;
        uint[] memory _prices;
        address[] memory participants;
        // lấy phiên định giá cuối cùng với sản phẩm đó
        for (uint i = _sessions.length - 1; i >= 0; i--) {
            if (_sessions[i].productID == ID) {
                s = _sessions[i];
                _prices = new uint[](s.participants.length);

                for (uint j = 0; j < s.participants.length; j++) {
                    _prices[j] = s.participant_pricing[s.participants[j]];
                }
                participants = s.participants;
                break;
            }
        }*/
        return (p.id, p.ipfsID, p.price);
    }

    function getProduct(string memory _ipfsID)
        public
        view
        returns (
            uint256 id,
            string memory ipfsID,
            string memory name,
            uint256 price
        )
    {
        for (uint256 i = 0; i < _products.length; i++) {
            if (
                keccak256(abi.encodePacked((_products[i].ipfsID))) ==
                keccak256(abi.encodePacked((_ipfsID)))
            ) {
                Product storage p = _products[i];
                return (p.id, p.ipfsID, p.name, p.price);
            }
        }
        revert("Product is not exist");
    }

    function getProducts()
        public
        view
        returns (
            string[] memory ipfsIDs,
            string[] memory names,
            uint256[] memory prices
        )
    {
        string[] memory _ipfsIDs = new string[](_products.length);
        string[] memory _names = new string[](_products.length);
        uint256[] memory _prices = new uint256[](_products.length);
        for (uint256 i = 0; i < _products.length; i++) {
            _ipfsIDs[i] = _products[i].ipfsID;
            _names[i] = _products[i].name;
            _prices[i] = _products[i].price;
        }
        return (_ipfsIDs, _names, _prices);
    }

    modifier productExist(uint256 ID) {
        require(ID >= 0 && ID < _products.length, "ID session is not exist");
        _;
    }

    modifier sessionExist(uint256 ID) {
        require(ID >= 0 && ID < _sessions.length, "ID session is not exist");
        _;
    }

    // tạo phiên đấu giá
    function createSession(uint256 productID)
        public
        productExist(productID)
        onlyOwner
        returns (uint256 id)
    {
        Session storage s = _sessions.push();
        s.productID = productID;
        s.state = State.CLOSE;
        s.proposedPrice = 0;
        Product memory p;
        for (uint256 i = 0; i < _products.length; i++) {
            if (_products[i].id == productID) p = _products[i];
        }
        emit onCreatedSession(p, _sessions.length - 1);
        return _sessions.length - 1;
    }

    function startSession(uint256 ID, uint256 timeout)
        public
        sessionExist(ID)
        onlyOwner
    {
        _sessions[ID].state = State.OPEN;
        _sessions[ID].timeStarted = block.timestamp;
        _sessions[ID].timeout = timeout;
        emit onStartedSession(
            ID,
            _sessions[ID].state,
            _products[_sessions[ID].productID]
        );
    }

    function closeSession(uint256 ID) public sessionExist(ID) onlyOwner {
        _sessions[ID].state = State.CLOSE;
        emit onClosedSession(
            ID,
            _sessions[ID].state,
            _products[_sessions[ID].productID]
        );
    }

    function getSessions()
        public
        view
        returns (
            uint256[] memory sessionIDs,
            uint256[] memory productIDs,
            string[] memory ipfsIDs,
            string[] memory names,
            uint256[] memory prices,
            // uint256[] memory proposedPrices,
            State[] memory states,
            uint256[] memory timeStarteds,
            uint256[] memory timeouts
        )
    {
        uint256[] memory _sessionIDs = new uint256[](_sessions.length);
        uint256[] memory _productIDs = new uint256[](_sessions.length);
        string[] memory _ipfsIDs = new string[](_sessions.length);
        string[] memory _names = new string[](_sessions.length);
        uint256[] memory _prices = new uint256[](_sessions.length);
        // uint256[] memory _proposedPrices = new uint256[](_sessions.length);
        State[] memory _states = new State[](_sessions.length);
        uint256[] memory _timeStarteds = new uint256[](_sessions.length);
        uint256[] memory _timeouts = new uint256[](_sessions.length);
        for (uint256 i = 0; i < _sessions.length; i++) {
            _sessionIDs[i] = _sessions[i].id;
            _productIDs[i] = _sessions[i].productID;
            _ipfsIDs[i] = _products[_sessions[i].productID].ipfsID;
            _names[i] = _products[_sessions[i].productID].name;
            _prices[i] = _products[_sessions[i].productID].price;
            // _proposedPrices[i] = _sessions[i].proposedPrice;
            _states[i] = _sessions[i].state;
            _timeStarteds[i] = _sessions[i].timeStarted;
            _timeouts[i] = _sessions[i].timeout;
        }
        return (
            _sessionIDs,
            _productIDs,
            _ipfsIDs,
            _names,
            _prices,
            // _proposedPrices,
            _states,
            _timeStarteds,
            _timeouts
        );
    }

    function getSession(uint256 id)
        public
        view
        sessionExist(id)
        returns (
            uint256 sessionID,
            uint256 productID,
            string memory ipfsID,
            string memory name,
            uint256 price,
            int proposedPrice,
            State state,
            address[] memory participants,
            uint256[] memory participant_pricings,
            uint256 timeStarted,
            uint256 timeout
        )
    {
        Session storage session = _sessions[id];
        uint256[] memory _participant_pricings = new uint256[](
            session.participants.length
        );
        for (uint256 i = 0; i < session.participants.length; i++) {
            _participant_pricings[i] = session.participant_pricing[
                session.participants[i]
            ];
        }
        return (
            session.id,
            session.productID,
            _products[session.productID].ipfsID,
            _products[session.productID].name,
            _products[session.productID].price,
            session.proposedPrice,
            session.state,
            session.participants,
            _participant_pricings,
            session.timeStarted,
            session.timeout
        );
    }

    modifier sessionClosed(uint256 sessionID) {
        require(
            _sessions[sessionID].state == State.CLOSE,
            "Session was not closed"
        );
        _;
    }

    function setPrice(uint256 sessionID, uint256 price)
        public
        onlyOwner
        sessionClosed(sessionID)
        productExist(_sessions[sessionID].productID)
    {
        uint256 productID = _sessions[sessionID].productID;
        _products[productID].price = price;

        Session storage s = _sessions[sessionID];
        s.finalPrice = price;

        (
            int proposedPrice,
            uint[] memory deviationOfParticipants
        ) = calc_proposedPrice(sessionID);

        s.proposedPrice = proposedPrice;

        // save deviationOfParticipants
        for (uint i = 0; i < deviationOfParticipants.length; i++) {
            s.deviationOfParticipants[
                s.participants[i]
            ] = deviationOfParticipants[i];
        }

        // accumulated deviation
        // tính toán từng độ lệch tích lũy của từng người chơi
        for (uint256 i = 0; i < s.participants.length; i++) {
            uint d_new = calc_d_new(
                price,
                s.participant_pricing[s.participants[i]]
            );

            (, , , uint d_current, uint numbersOfSessionJoined) = getUser(
                s.participants[i]
            );
            uint accumulatedDeviation = calc_accumulatedDeviation(
                d_current,
                d_new,
                numbersOfSessionJoined
            );
            // save accumulatedDeviation, numbersOfSessionJoined + 1
            setUserAccumulatedDeviation(
                s.participants[i],
                accumulatedDeviation
            );
        }

        emit onSetPrice(
            productID,
            price,
            sessionID,
            proposedPrice,
            deviationOfParticipants
        );
    }

    // kiểm tra vượt quá số người tham gia định giá 10
    modifier checkParticipantsLimit(uint256 sessionID) {
        require(
            _sessions[sessionID].participants.length < participantsLimit,
            string.concat(
                "reached participants limit: ",
                Strings.toString(participantsLimit)
            )
        );
        _;
    }
    // kiểm tra còn thời hạn hay không
    modifier checkTimeout(uint256 sessionID) {
        if (_sessions[sessionID].timeout > 0)
            require(
                block.timestamp - _sessions[sessionID].timeStarted <
                    _sessions[sessionID].timeout ||
                    _sessions[sessionID].timeout == 0,
                string.concat(
                    "You've run out of time",
                    "-",
                    Strings.toString(block.timestamp),
                    "-",
                    Strings.toString(_sessions[sessionID].timeStarted),
                    "-",
                    Strings.toString(_sessions[sessionID].timeout)
                )
            );
        _;
    }

    function guessPrice(
        uint256 sessionID,
        uint256 price,
        address addr
    )
        public
        sessionExist(sessionID)
        checkParticipantsLimit(sessionID)
        checkTimeout(sessionID)
    {
        // address addr = msg.sender;
        Session storage s = _sessions[sessionID];
        require(s.state == State.OPEN, "Session closed");
        s.participant_pricing[addr] = price;

        // nếu trong người này đã pricing rồi thì ko đưa vào danh sách participants
        bool exist = false;
        for (uint256 i = 0; i < s.participants.length; i++) {
            if (s.participants[i] == addr) {
                exist = true;
                break;
            }
        }
        if (!exist) s.participants.push(addr);
        emit onGuessPrice(addr, price, sessionID);
    }

    /*
        P: The final price
        p: The given price of the participant
        d_new: deviation in the current session
    */
    function calc_d_new(uint256 finalPice, uint256 pricing)
        public
        pure
        returns (uint256)
    {
        if (finalPice == 0) return 0;
        uint256 d_new = ((
            finalPice > pricing ? finalPice - pricing : pricing - finalPice
        ) / finalPice) * 100;
        return d_new;
    }

    /* n: number of all participants */
    function calc_accumulatedDeviation(
        uint256 d_current,
        uint256 d_new,
        uint256 n
    ) public pure returns (uint256) {
        uint256 d = ((d_current * n) + d_new) / (n + 1);
        return d;
    }


    function calc_proposedPrice(uint256 sessionID)
        public view
        sessionExist(sessionID)
        returns (int _proposedPrice, uint[] memory _deviationOfParticipants)
    {
        // Session storage s = _sessions[sessionID];
        uint256 n = _sessions[sessionID].participants.length;
        uint256 sum_d_i = 0;

        // numerator, denominator in formular
        int sum_numerator = 0;

        uint[] memory deviationOfParticipants = new uint[](n);
        uint finalPrice = _sessions[sessionID].finalPrice;

        for (uint256 i = 0; i < n; i++) {
            // the given price of the participant
            uint256 p_i = _sessions[sessionID].participant_pricing[
                _sessions[sessionID].participants[i]
            ];
            // deviation of participant
            uint256 d_i = calc_d_new(finalPrice, p_i);

            deviationOfParticipants[i] = d_i;
            sum_d_i += d_i;

            sum_numerator += (int(p_i) * (100 - int(d_i)));
        }

        int denominator = (100 * int(n) - int(sum_d_i));
        int proposedPrice = sum_numerator / denominator;
        return (proposedPrice, deviationOfParticipants);
    }
}
