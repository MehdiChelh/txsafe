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

    IERC20 public stNATIVE;
    IERC20 public DAI;

    address public owner;

    AggregatorV3Interface internal priceFeed;

    // State Variables
    uint pool0_min_value = 0;
    uint pool1_min_value = 0;
    uint pool2_min_value = 0;

    uint public coverages_count = 0;
    uint public deposits_count = 0;
    uint public claims_count = 0;
    uint public claims_resolved_count = 0;

    uint public pool0_native_value = 0;
    uint public pool1_native_value = 0;
    uint public pool2_native_value = 0;

    uint public pool0_stable_value = 0;
    uint public pool1_stable_value = 0;
    uint public pool2_stable_value = 0;

    mapping(address => mapping(string => mapping(string => uint))) public users_coverage;
    mapping(address => mapping(string => mapping(uint => mapping(uint8 => uint)))) public users_deposits;
    mapping(address => mapping(string => mapping(uint => mapping(uint8 => uint)))) public users_withdrawals;
    mapping(address => uint) public users_deposit_native_value;
    mapping(address => uint) public users_deposit_stnative_value;
    mapping(address => uint) public users_deposit_dai_value;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(address _stNative, address _dai, address _feed) {
        owner = msg.sender;

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
        require(_time_in >= block.timestamp);
        
        users_deposits[msg.sender]["NATIVE"][_time_in][_risk_pool] = _amount;
        users_deposit_native_value[msg.sender] += _amount;

        deposits_count += 1;

        if (_risk_pool == 0) {
            pool0_native_value += _amount;
        } else if (_risk_pool == 1) {
            pool1_native_value += _amount;
        } else if (_risk_pool == 2) {
            pool2_native_value += _amount;
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
                pool0_native_value += _amount;
            } else if (_risk_pool == 1) {
                pool1_native_value += _amount;
            } else if (_risk_pool == 2) {
                pool2_native_value += _amount;
            }
        } else if (keccak256(bytes(_token)) == keccak256(bytes("DAI"))) {
            bool _success = DAI.transferFrom(msg.sender, address(this), _amount);
            require(_success);
            users_deposit_dai_value[msg.sender] += _amount;
            if (_risk_pool == 0) {
                pool0_stable_value += _amount;
            } else if (_risk_pool == 1) {
                pool1_stable_value += _amount;
            } else if (_risk_pool == 2) {
                pool2_stable_value += _amount;
            }
        }
        
        users_deposits[msg.sender][_token][_time_in][_risk_pool] = _amount;

        deposits_count += 1;
    }

    function get_pool_value(uint8 _risk_pool) public view returns (uint) {
        require(_risk_pool == 0 || _risk_pool == 1 || _risk_pool == 2);
        uint pool_value;
        if (_risk_pool == 0) {
            pool_value = pool0_native_value * uint(getLatestPrice()) + pool0_stable_value;
        } else if (_risk_pool == 1) {
            pool_value = pool1_native_value * uint(getLatestPrice()) + pool1_stable_value;
        } else if (_risk_pool == 2) {
            pool_value = pool2_native_value * uint(getLatestPrice()) + pool2_stable_value;
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

    function get_native_premium() public pure returns(uint) {
        uint premium = 0;
        return premium;
    }

    function get_stable_premium() public pure returns(uint) {
        uint premium = 0;
        return premium;
    }

    function withdraw_deposit_native(uint _amount, uint8 _risk_pool, uint _time_in) public {

        require(users_deposit_native_value[msg.sender] >= _amount);
        require(get_pool_value(_risk_pool) - _amount >= get_pool_min_value(_risk_pool));

        users_withdrawals[msg.sender]["NATIVE"][_time_in][_risk_pool] = _amount;
        users_deposit_native_value[msg.sender] -= _amount;

        if (_risk_pool == 0) {
            pool0_native_value -= _amount;
        } else if (_risk_pool == 1) {
            pool1_native_value -= _amount;
        } else if (_risk_pool == 2) {
            pool2_native_value -= _amount;
        }

        (bool sent, ) = msg.sender.call{value: _amount + get_native_premium()}("");
        require(sent, "Failed to unstake unlocked tokens");
    }

    function withdraw_deposit(string memory _token, uint _amount, uint8 _risk_pool, uint _time_in) public {

        if (keccak256(bytes(_token)) == keccak256(bytes("stNATIVE"))) {
            require(users_deposit_stnative_value[msg.sender] >= _amount);
            require(get_pool_value(_risk_pool) - _amount >= get_pool_min_value(_risk_pool));
            users_withdrawals[msg.sender]["_token"][_time_in][_risk_pool] = _amount;
            users_deposit_stnative_value[msg.sender] -= _amount;
            if (_risk_pool == 0) {
                pool0_native_value -= _amount;
            } else if (_risk_pool == 1) {
                pool1_native_value -= _amount;
            } else if (_risk_pool == 2) {
                pool2_native_value -= _amount;
            }

            (bool sent) = stNATIVE.transfer(msg.sender, _amount + get_native_premium());
            require(sent, "Failed to unstake unlocked tokens");
        } else if (keccak256(bytes(_token)) == keccak256(bytes("DAI"))) {
            require(users_deposit_dai_value[msg.sender] >= _amount);
            require(get_pool_value(_risk_pool) - _amount >= get_pool_min_value(_risk_pool));
            users_withdrawals[msg.sender]["_token"][_time_in][_risk_pool] = _amount;
            users_deposit_dai_value[msg.sender] -= _amount;
            if (_risk_pool == 0) {
                pool0_stable_value -= _amount;
            } else if (_risk_pool == 1) {
                pool1_stable_value -= _amount;
            } else if (_risk_pool == 2) {
                pool2_stable_value -= _amount;
            }

            (bool sent) = DAI.transfer(msg.sender, _amount + get_stable_premium());
            require(sent, "Failed to unstake unlocked tokens");
        }
    }

    // Coverage Functions
    
    function get_coverage_price() private view returns (uint) {

    }

    function get_coverage_native(string memory _token, uint _amount, string memory _period) public payable {
        require(msg.value >0);
        require(msg.value >= get_coverage_price());
        require(keccak256(bytes(_token)) == keccak256(bytes("ETH")) || keccak256(bytes(_token)) == keccak256(bytes("DAI")));
        require(_amount > 0);
        // require(_period) is correct;

        users_coverage[msg.sender][_token][_period] = _amount;
        coverages_count += 1;
    }

    function get_coverage(string memory _token, uint _amount, string memory _period) public payable {
        require(msg.value >0);
        require(msg.value >= get_coverage_price());
        require(keccak256(bytes(_token)) == keccak256(bytes("ETH")) || keccak256(bytes(_token)) == keccak256(bytes("DAI")));
        require(_amount > 0);
        // require(_period) is correct;

        users_coverage[msg.sender][_token][_period] = _amount;
        coverages_count += 1;
    }

    // Claim Functions
    // funciton claim() public {

    // }
    
    // Resolve Claims
    // function resolve() {

    // }
}