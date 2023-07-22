// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

interface IERC20 {
    event Approval(address indexed owner, address indexed spender, uint value);
    event Transfer(address indexed from, address indexed to, uint value);

    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint);
    function balanceOf(address owner) external view returns (uint);
    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);
}

contract TxSafe {

    IERC20 public TXS;
    IERC20 public stNATIVE;
    IERC20 public DAI;

    address public owner;

    AggregatorV3Interface internal priceFeed;

    // State Variables
    uint txs_price_pool0 = 1000000000000000000;
    uint txs_price_pool1 = 1000000000000000000;
    uint txs_price_pool2 = 1000000000000000000;

    uint pool0_min_value = 0;
    uint pool1_min_value = 0;
    uint pool2_min_value = 0;

    uint public coverages_count = 0;
    uint public deposits_count = 0;

    uint public pool0_native_value = 0;
    uint public pool1_native_value = 0;
    uint public pool2_native_value = 0;
    
    uint public pool0_stnative_value = 0;
    uint public pool1_stnative_value = 0;
    uint public pool2_stnative_value = 0;

    uint public pool0_stable_value = 0;
    uint public pool1_stable_value = 0;
    uint public pool2_stable_value = 0;

    mapping(address => mapping(string => mapping(string => mapping(uint => mapping(uint => uint))))) public users_coverage;
    mapping(address => mapping(string => mapping(uint => mapping(uint8 => uint)))) public users_deposits;
    mapping(address => mapping(string => mapping(uint => mapping(uint8 => uint)))) public users_withdrawals;
    
    mapping(address => uint) public users_deposit_native_value;
    mapping(address => uint) public users_deposit_stnative_value;
    mapping(address => uint) public users_deposit_dai_value;

    mapping(address => uint) public users_native_txs_holding_pool0;
    mapping(address => uint) public users_native_txs_holding_pool1;
    mapping(address => uint) public users_native_txs_holding_pool2;
    mapping(address => uint) public users_stnative_txs_holding_pool0;
    mapping(address => uint) public users_stnative_txs_holding_pool1;
    mapping(address => uint) public users_stnative_txs_holding_pool2;
    mapping(address => uint) public users_dai_txs_holding_pool0;
    mapping(address => uint) public users_dai_txs_holding_pool1;
    mapping(address => uint) public users_dai_txs_holding_pool2;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(address _txs, address _stNative, address _dai, address _feed) {
        owner = msg.sender;

        TXS = IERC20(_txs);
        stNATIVE = IERC20(_stNative);
        DAI = IERC20(_dai);
        priceFeed = AggregatorV3Interface(_feed);
    }

    // CHANGE POOL MIN VALUES

    function change_pool0_min_value(uint _value) onlyOwner public {
        pool0_min_value = _value;
    }

    function change_pool1_min_value(uint _value) onlyOwner public {
        pool1_min_value = _value;
    }

    function change_pool2_min_value(uint _value) onlyOwner public {
        pool2_min_value = _value;
    }

    function update_txs_price_pool0(uint _new_txs_price) onlyOwner public {
        txs_price_pool0 = _new_txs_price;
    }

    function update_txs_price_pool1(uint _new_txs_price) onlyOwner public {
        txs_price_pool1 = _new_txs_price;
    }

    function update_txs_price_pool2(uint _new_txs_price) onlyOwner public {
        txs_price_pool2 = _new_txs_price;
    }

    // ORACLE ETH price
    function getLatestPrice() public view returns (int) {
        (
          , // uint80 roundId
          int answer,
          , // uint256 startedAt
          , // uint256 updatedAt
            // uint80 answeredInRound
         ) = priceFeed.latestRoundData();
        return answer;
    }
    
    // Deposit Functions
    function deposit_native(uint _amount, uint8 _risk_pool, uint _time_in) public payable {
        require(msg.value > 0);
        require(msg.value == _amount);
        require(_risk_pool == 0 || _risk_pool == 1 || _risk_pool == 2);
        
        users_deposits[msg.sender]["NATIVE"][_time_in][_risk_pool] = _amount;
        users_deposit_native_value[msg.sender] += _amount;

        deposits_count += 1;

        if (_risk_pool == 0) {
            pool0_native_value += _amount;
            users_native_txs_holding_pool0[msg.sender] += _amount * (10 ** 18) * uint(getLatestPrice()) / txs_price_pool0;
            (bool sent) = TXS.transfer(msg.sender, _amount * (10 ** 18) * uint(getLatestPrice()) / txs_price_pool0);
            require(sent, "Failed to unstake unlocked tokens");
        } else if (_risk_pool == 1) {
            pool1_native_value += _amount;
            users_native_txs_holding_pool1[msg.sender] += _amount * (10 ** 18) * uint(getLatestPrice()) / txs_price_pool1;
            (bool sent) = TXS.transfer(msg.sender, _amount * (10 ** 18) * uint(getLatestPrice()) / txs_price_pool1);
            require(sent, "Failed to unstake unlocked tokens");
        } else if (_risk_pool == 2) {
            pool2_native_value += _amount;
            users_native_txs_holding_pool2[msg.sender] += _amount * (10 ** 18) * uint(getLatestPrice()) / txs_price_pool2;
            (bool sent) = TXS.transfer(msg.sender, _amount * (10 ** 18) * uint(getLatestPrice()) / txs_price_pool2);
            require(sent, "Failed to unstake unlocked tokens");
        }
    }

    function deposit(string memory _token, uint _amount, uint8 _risk_pool, uint _time_in) public {
        require(keccak256(bytes(_token)) == keccak256(bytes("stNATIVE")) || keccak256(bytes(_token)) == keccak256(bytes("DAI")));
        require(_risk_pool == 0 || _risk_pool == 1 || _risk_pool == 2);
        require(_time_in >= block.timestamp);

        if (keccak256(bytes(_token)) == keccak256(bytes("stNATIVE"))) {
            bool _success = stNATIVE.transferFrom(msg.sender, address(this), _amount);
            require(_success);
            users_deposit_stnative_value[msg.sender] += _amount;
            if (_risk_pool == 0) {
                pool0_stnative_value += _amount;
                users_stnative_txs_holding_pool0[msg.sender] += _amount * (10 ** 18) * uint(getLatestPrice()) / txs_price_pool0;
                (bool sent) = TXS.transfer(msg.sender, _amount * (10 ** 18) * uint(getLatestPrice()) / txs_price_pool0);
                require(sent, "Failed to unstake unlocked tokens");
            } else if (_risk_pool == 1) {
                pool1_stnative_value += _amount;
                users_stnative_txs_holding_pool1[msg.sender] += _amount * (10 ** 18) * uint(getLatestPrice()) / txs_price_pool1;
                (bool sent) = TXS.transfer(msg.sender, _amount * (10 ** 18) * uint(getLatestPrice()) / txs_price_pool1);
                require(sent, "Failed to unstake unlocked tokens");
            } else if (_risk_pool == 2) {
                pool2_stnative_value += _amount;
                users_stnative_txs_holding_pool2[msg.sender] += _amount * (10 ** 18) * uint(getLatestPrice()) / txs_price_pool2;
                (bool sent) = TXS.transfer(msg.sender, _amount * (10 ** 18) * uint(getLatestPrice()) / txs_price_pool2);
                require(sent, "Failed to unstake unlocked tokens");
            }
        } else if (keccak256(bytes(_token)) == keccak256(bytes("DAI"))) {
            bool _success = DAI.transferFrom(msg.sender, address(this), _amount);
            require(_success);
            users_deposit_dai_value[msg.sender] += _amount;
            if (_risk_pool == 0) {
                pool0_stable_value += _amount;
                users_dai_txs_holding_pool0[msg.sender] += _amount * (10 ** 18) / txs_price_pool0;
                (bool sent) = TXS.transfer(msg.sender, _amount * (10 ** 18) / txs_price_pool0);
                require(sent, "Failed to unstake unlocked tokens");
            } else if (_risk_pool == 1) {
                pool1_stable_value += _amount;
                users_dai_txs_holding_pool1[msg.sender] += _amount * (10 ** 18) / txs_price_pool1;
                (bool sent) = TXS.transfer(msg.sender, _amount * (10 ** 18) / txs_price_pool1);
                require(sent, "Failed to unstake unlocked tokens");
            } else if (_risk_pool == 2) {
                pool2_stable_value += _amount;
                users_dai_txs_holding_pool2[msg.sender] += _amount * (10 ** 18) / txs_price_pool2;
                (bool sent) = TXS.transfer(msg.sender, _amount * (10 ** 18) / txs_price_pool2);
                require(sent, "Failed to unstake unlocked tokens");
            }
        }
        
        users_deposits[msg.sender][_token][_time_in][_risk_pool] = _amount;

        deposits_count += 1;
    }

    function get_pool_value(uint8 _risk_pool) public view returns (uint) {
        require(_risk_pool == 0 || _risk_pool == 1 || _risk_pool == 2);
        uint pool_value;
        if (_risk_pool == 0) {
            pool_value = pool0_native_value * uint(getLatestPrice()) + pool0_stnative_value * uint(getLatestPrice()) + pool0_stable_value;
        } else if (_risk_pool == 1) {
            pool_value = pool1_native_value * uint(getLatestPrice()) + pool1_stnative_value * uint(getLatestPrice()) + pool1_stable_value;
        } else if (_risk_pool == 2) {
            pool_value = pool2_native_value * uint(getLatestPrice()) + pool2_stnative_value * uint(getLatestPrice()) + pool2_stable_value;
        }
        return pool_value;
    }

    function get_pool_min_value(uint8 _risk_pool) public view returns (uint) {
        require(_risk_pool == 0 || _risk_pool == 1 || _risk_pool == 2);
        uint pool_min_value;
        if (_risk_pool == 0) {
            pool_min_value = pool0_min_value;
        } else if (_risk_pool == 1) {
            pool_min_value = pool1_min_value;
        } else if (_risk_pool == 2) {
            pool_min_value = pool2_min_value;
        }
        return pool_min_value;
    }

    function get_native_withdrawal_value(uint _amount, uint8 _risk_pool) public view returns(uint) {
        uint premium;
        if (_risk_pool == 0) {
            premium = _amount * txs_price_pool0 / ((10 ** 18) * uint(getLatestPrice()));
        } else if (_risk_pool == 1) {
            premium = _amount * txs_price_pool1 / ((10 ** 18) * uint(getLatestPrice()));
        } else if (_risk_pool == 2) {
            premium = _amount * txs_price_pool2 / ((10 ** 18) * uint(getLatestPrice()));
        }
        return premium;
    }

    function get_stable_withdrawal_value(uint _amount, uint8 _risk_pool) public view returns(uint) {
        uint premium;
        if (_risk_pool == 0) {
            premium = _amount * txs_price_pool0 / (10 ** 18);
        } else if (_risk_pool == 1) {
            premium = _amount * txs_price_pool1 / (10 ** 18);
        } else if (_risk_pool == 2) {
            premium = _amount * txs_price_pool2 / (10 ** 18);
        }
        return premium;
    }

    // frontend send converted value in TXS
    function withdraw_deposit_native(uint _amount, uint8 _risk_pool, uint _time_in) public {
        require(get_pool_value(_risk_pool) - _amount >= get_pool_min_value(_risk_pool));

        users_withdrawals[msg.sender]["NATIVE"][_time_in][_risk_pool] = _amount;
        users_deposit_native_value[msg.sender] -= _amount;

        if (_risk_pool == 0) {
            require(users_native_txs_holding_pool0[msg.sender] >= _amount);
            pool0_native_value -= _amount;
            users_native_txs_holding_pool0[msg.sender] -= _amount;
        } else if (_risk_pool == 1) {
            require(users_native_txs_holding_pool1[msg.sender] >= _amount);
            pool1_native_value -= _amount;
            users_native_txs_holding_pool1[msg.sender] -= _amount;
        } else if (_risk_pool == 2) {
            require(users_native_txs_holding_pool2[msg.sender] >= _amount);
            pool2_native_value -= _amount;
            users_native_txs_holding_pool2[msg.sender] -= _amount;
        }

        bool _success = TXS.transferFrom(msg.sender, address(this), _amount);
        require(_success, "Failed to unstake unlocked tokens");
        (bool sent, ) = msg.sender.call{value: get_native_withdrawal_value(_amount, _risk_pool)}("");
        require(sent, "Failed to unstake unlocked tokens");
    }

    function withdraw_deposit(string memory _token, uint _amount, uint8 _risk_pool, uint _time_in) public {

        if (keccak256(bytes(_token)) == keccak256(bytes("stNATIVE"))) {
            require(get_pool_value(_risk_pool) - _amount >= get_pool_min_value(_risk_pool));
            users_withdrawals[msg.sender]["_token"][_time_in][_risk_pool] = _amount;
            users_deposit_stnative_value[msg.sender] -= _amount;
            if (_risk_pool == 0) {
                require(users_stnative_txs_holding_pool0[msg.sender] >= _amount);
                pool0_native_value -= _amount;
                users_stnative_txs_holding_pool0[msg.sender] -= _amount;
            } else if (_risk_pool == 1) {
                require(users_stnative_txs_holding_pool1[msg.sender] >= _amount);
                pool1_native_value -= _amount;
                users_stnative_txs_holding_pool1[msg.sender] -= _amount;
            } else if (_risk_pool == 2) {
                require(users_stnative_txs_holding_pool2[msg.sender] >= _amount);
                pool2_native_value -= _amount;
                users_stnative_txs_holding_pool2[msg.sender] -= _amount;
            }

            bool _success = TXS.transferFrom(msg.sender, address(this), _amount);
            require(_success, "Failed to unstake unlocked tokens");
            (bool sent) = stNATIVE.transfer(msg.sender, get_native_withdrawal_value(_amount, _risk_pool));
            require(sent, "Failed to unstake unlocked tokens");
        } else if (keccak256(bytes(_token)) == keccak256(bytes("DAI"))) {
            require(get_pool_value(_risk_pool) - _amount >= get_pool_min_value(_risk_pool));
            users_withdrawals[msg.sender]["_token"][_time_in][_risk_pool] = _amount;
            users_deposit_dai_value[msg.sender] -= _amount;
            if (_risk_pool == 0) {
                require(users_dai_txs_holding_pool0[msg.sender] >= _amount);
                pool0_stable_value -= _amount;
                users_stnative_txs_holding_pool0[msg.sender] -= _amount;
            } else if (_risk_pool == 1) {
                require(users_dai_txs_holding_pool1[msg.sender] >= _amount);
                pool1_stable_value -= _amount;
                users_stnative_txs_holding_pool1[msg.sender] -= _amount;
            } else if (_risk_pool == 2) {
                require(users_dai_txs_holding_pool2[msg.sender] >= _amount);
                pool2_stable_value -= _amount;
                users_stnative_txs_holding_pool2[msg.sender] -= _amount;
            }

            bool _success = TXS.transferFrom(msg.sender, address(this), _amount);
            require(_success, "Failed to unstake unlocked tokens");
            (bool sent) = DAI.transfer(msg.sender, get_stable_withdrawal_value(_amount, _risk_pool));
            require(sent, "Failed to unstake unlocked tokens");
        }
    }

    // Coverage Functions
    
    function get_native_coverage_price() private pure returns (uint) {
        return 0;
    }

    function get_coverage_price(uint _amount, uint _time_in, uint _time_out) private pure returns (uint) {
        return _amount * max(0.02 / 100 ; 0.015 * (_time_out - _time_in) / 2880);
    }

    // 1inch, makerdao, uniswap, aave
    function get_coverage_native(uint _amount, uint _time_in, uint _time_out, string memory _protocols) public payable {
        require(_amount > 0);
        require(msg.value > 0);
        require(_time_in >= block.timestamp);
        require(_time_in < _time_out);
        require(msg.value >= get_native_coverage_price());

        users_coverage[msg.sender]["NATIVE"][_protocols][_time_in][_time_out] = _amount;
        coverages_count += 1;
    }

    function get_coverage(string memory _token, uint _amount, uint _time_in, uint _time_out, string memory _protocols) public payable {
        require(keccak256(bytes(_token)) == keccak256(bytes("stNATIVE")) || keccak256(bytes(_token)) == keccak256(bytes("DAI")));
        require(_amount > 0);

        if (keccak256(bytes(_token)) == keccak256(bytes("stNATIVE"))) {
            bool _success = stNATIVE.transferFrom(msg.sender, address(this), get_native_coverage_price());
            require(_success);
        } else if (keccak256(bytes(_token)) == keccak256(bytes("DAI"))) {
            bool _success = DAI.transferFrom(msg.sender, address(this), get_coverage_price());
            require(_success);
            users_deposit_dai_value[msg.sender] += _amount;
        }

        users_coverage[msg.sender][_token][_protocols][_time_in][_time_out] = _amount;
        coverages_count += 1;
    }

    //    Viewer functions

}