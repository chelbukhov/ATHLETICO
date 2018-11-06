pragma solidity ^0.4.24;
 
// SafeMath.sol
/**
 * @title SafeMath
 * @dev Math operations with safety checks that revert() on error
 */
library SafeMath {
 
    /**
    * @dev Multiplies two numbers, revert() on overflow.
    */
    function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
        // Gas optimization: this is cheaper than asserting 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }
 
        c = a * b;
        assert(c / a == b);
        return c;
    }
 
    /**
    * @dev Integer division of two numbers, truncating the quotient.
    */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically revert() when dividing by 0
        // uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return a / b;
    }
 
    /**
    * @dev Subtracts two numbers, revert() on overflow (i.e. if subtrahend is greater than minuend).
    */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }
 
    /**
    * @dev Adds two numbers, revert() on overflow.
    */
    function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
        c = a + b;
        assert(c >= a);
        return c;
    }
}
 
// ERC20Basic.sol
/**
 * @title ERC20Basic
 * @dev Simpler version of ERC20 interface
 * See https://github.com/ethereum/EIPs/issues/179
 */
contract ERC20Basic {
    function totalSupply() public view returns (uint256);
    function balanceOf(address who) public view returns (uint256);
    function transfer(address to, uint256 value) public returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
}
 
// ERC20.sol
/**
 * @title ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
contract ERC20 is ERC20Basic {
    function allowance(address owner, address spender)
        public view returns (uint256);
 
    function transferFrom(address from, address to, uint256 value)
        public returns (bool);
 
    function approve(address spender, uint256 value) public returns (bool);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}
 
// ERC223.sol
contract ERC223 is ERC20 {
    function transfer(address to, uint value, bytes data) public returns (bool ok);
    function transferFrom(address from, address to, uint value, bytes data) public returns (bool ok);
}
 
// BasicToken.sol
/**
 * @title Basic token
 * @dev Basic version of StandardToken, with no allowances.
 */
contract BasicToken is ERC20Basic {
    using SafeMath for uint256;
 
    mapping(address => uint256) internal balances;
    uint public totalSupply = 0;
 
    /**
    * @dev Total number of tokens in existence
    */
    function totalSupply() public view returns (uint256) {
        return totalSupply;
    }
 
    /**
    * @dev Transfer token for a specified address
    * @param _to The address to transfer to.
    * @param _value The amount to be transferred.
    */
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_value <= balances[msg.sender]);
        require(_to != address(0));
 
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
 
    /**
    * @dev Gets the balance of the specified address.
    * @param _owner The address to query the the balance of.
    * @return An uint256 representing the amount owned by the passed address.
    */
    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }
}
 
// StandardToken.sol
/**
 * @title Standard ERC20 token
 *
 * @dev Implementation of the basic standard token.
 * https://github.com/ethereum/EIPs/issues/20
 * Based on code by FirstBlood: https://github.com/Firstbloodio/token/blob/master/smart_contract/FirstBloodToken.sol
 */
contract StandardToken is ERC20, BasicToken {
 
    mapping (address => mapping (address => uint256)) internal allowed;
 
    /**
     * @dev Transfer tokens from one address to another
     * @param _from address The address which you want to send tokens from
     * @param _to address The address which you want to transfer to
     * @param _value uint256 the amount of tokens to be transferred
     */
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    )
    public
    returns (bool)
    {
        require(_value <= balances[_from]);
        require(_value <= allowed[_from][msg.sender]);
        require(_to != address(0));
 
        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(_value);
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
        emit Transfer(_from, _to, _value);
        return true;
    }
 
    /**
     * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
     * Beware that changing an allowance with this method brings the risk that someone may use both the old
     * and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
     * race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     * @param _spender The address which will spend the funds.
     * @param _value The amount of tokens to be spent.
     */
    function approve(address _spender, uint256 _value) public returns (bool) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
 
    /**
     * @dev Function to check the amount of tokens that an owner allowed to a spender.
     * @param _owner address The address which owns the funds.
     * @param _spender address The address which will spend the funds.
     * @return A uint256 specifying the amount of tokens still available for the spender.
     */
    function allowance(
        address _owner,
        address _spender
    )
    public
    view
    returns (uint256)
    {
        return allowed[_owner][_spender];
    }
 
    /**
     * @dev Increase the amount of tokens that an owner allowed to a spender.
     * approve should be called when allowed[_spender] == 0. To increment
     * allowed value is better to use this function to avoid 2 calls (and wait until
     * the first transaction is mined)
     * From MonolithDAO Token.sol
     * @param _spender The address which will spend the funds.
     * @param _addedValue The amount of tokens to increase the allowance by.
     */
    function increaseApproval(
        address _spender,
        uint256 _addedValue
    )
    public
    returns (bool)
    {
        allowed[msg.sender][_spender] = allowed[msg.sender][_spender].add(_addedValue);
        emit Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
        return true;
    }
 
    /**
     * @dev Decrease the amount of tokens that an owner allowed to a spender.
     * approve should be called when allowed[_spender] == 0. To decrement
     * allowed value is better to use this function to avoid 2 calls (and wait until
     * the first transaction is mined)
     * From MonolithDAO Token.sol
     * @param _spender The address which will spend the funds.
     * @param _subtractedValue The amount of tokens to decrease the allowance by.
     */
    function decreaseApproval(
        address _spender,
        uint256 _subtractedValue
    )
    public
    returns (bool)
    {
        uint256 oldValue = allowed[msg.sender][_spender];
        if (_subtractedValue >= oldValue) {
            allowed[msg.sender][_spender] = 0;
        } else {
            allowed[msg.sender][_spender] = oldValue.sub(_subtractedValue);
        }
        emit Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
        return true;
    }
 
}
 
/**
Base class contracts willing to accept ERC223 token transfers must conform to.
 
Sender: msg.sender to the token contract, the address originating the token transfer.
          - For user originated transfers sender will be equal to tx.origin
          - For contract originated transfers, tx.origin will be the user that made the tx that produced the transfer.
Origin: the origin address from whose balance the tokens are sent
          - For transfer(), origin = msg.sender
          - For transferFrom() origin = _from to token contract
Value is the amount of tokens sent
Data is arbitrary data sent with the token transfer. Simulates ether tx.data
 
From, origin and value shouldn't be trusted unless the token contract is trusted.
If sender == tx.origin, it is safe to trust it regardless of the token.
*/
 
contract ERC223Receiver {
    function tokenFallback(address _sender, address _origin, uint _value, bytes _data) public returns (bool ok);
}
 
// Standard223Token.sol
contract Standard223Token is ERC223, StandardToken {
    //function that is called when a user or another contract wants to transfer funds
    function transfer(address _to, uint _value, bytes _data) public returns (bool success) {
        //filtering if the target is a contract with bytecode inside it
        if (!super.transfer(_to, _value)) revert(); // do a normal token transfer
        if (isContract(_to)) return contractFallback(msg.sender, _to, _value, _data);
        return true;
    }
 
    function transferFrom(address _from, address _to, uint _value, bytes _data) public returns (bool success) {
        if (!super.transferFrom(_from, _to, _value)) revert(); // do a normal token transfer
        if (isContract(_to)) return contractFallback(_from, _to, _value, _data);
        return true;
    }
 
    function transfer(address _to, uint _value) public returns (bool success) {
        return transfer(_to, _value, new bytes(0));
    }
 
    function transferFrom(address _from, address _to, uint _value) public returns (bool success) {
        return transferFrom(_from, _to, _value, new bytes(0));
    }
 
    //function that is called when transaction target is a contract
    function contractFallback(address _origin, address _to, uint _value, bytes _data) private returns (bool success) {
        ERC223Receiver reciever = ERC223Receiver(_to);
        return reciever.tokenFallback(msg.sender, _origin, _value, _data);
    }
 
    //assemble the given address bytecode. If bytecode exists then the _addr is a contract.
    function isContract(address _addr) private view returns (bool is_contract) {
        // retrieve the size of the code on target address, this needs assembly
        uint length;
        assembly { length := extcodesize(_addr) }
        return length > 0;
    }
}
 
contract Ownable {
    address public owner;
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    constructor() public {
        owner = msg.sender;
    }
 
    /**
     * @dev revert() if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
 
    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
 
contract MintableToken is Standard223Token, Ownable {
 
    event MintingAgentChanged(address addr, bool state);
    event Mint(address indexed to, uint256 amount);
    event MintFinished();
    event MintContinued();
 
    bool public mintingFinished = false;
 
    /** List of agents that are allowed to create new tokens */
    mapping (address => bool) public mintAgents;
 
    modifier onlyMintAgent() {
        require(mintAgents[msg.sender] == true);
        _;
    }
 
    function setMintAgent(address addr, bool state) public onlyOwner {
        mintAgents[addr] = state;
        emit MintingAgentChanged(addr, state);
    }
 
    function mint(address _to, uint256 _amount) public onlyMintAgent returns (bool) {
        require(!mintingFinished);
        totalSupply = totalSupply.add(_amount);
        balances[_to] = balances[_to].add(_amount);
        emit Mint(_to, _amount);
        return true;
    }
 
    function finishMinting() public onlyOwner returns (bool) {
        require(mintingFinished == false);
        mintingFinished = true;
        emit MintFinished();
        return true;
    }
 
    function continueMinting() public onlyOwner returns (bool) {
        require(mintingFinished == true);
        mintingFinished = false;
        emit MintContinued();
        return true;
    }
}
 
contract AthleticTokenContract is MintableToken {
 
    string public name = "ATHLETICO ERC223 TOKEN";
    uint8 public decimals = 18;
    string public symbol = "ATH";
    string public version = "v0.1";
 
    event BalanceIncreased(uint256 _amount);
 
    constructor() public {
        balances[msg.sender] = 0;
    }
 
    function increaseBalance(uint256 _amount) public onlyOwner returns (bool) {
        balances[msg.sender] = balances[msg.sender].add(_amount);
        emit BalanceIncreased(_amount);
        return true;
    }
}
 
contract Crowdsale is Ownable {
    uint start = 1532872734;
    uint period = 90;
    uint multiplier = 40000;
    address owner;
    address token;

    using SafeMath for uint256;

 
    event PeriodChange(uint _period);
    event StartChange(uint _start);
    event SetMultiplier(uint _multiplier);
 
    constructor(address _token) public {
        owner = msg.sender;
        token = _token;
    }
 
    function() external payable {
        require(now > start && now < start + period * 24 * 60 * 60);
        owner.transfer(msg.value);
        token.mint(msg.sender, msg.value.mul(multiplier));
    }
 
    function setPeriod(uint _period) public onlyOwner returns (bool) {
        period = _period;
        emit PeriodChange(_period);
        return true;
    }
 
    function setStart(uint _start) public onlyOwner returns (bool) {
        start = _start;
        emit StartChange(_start);
        return true;
    }
 
    function setMultiplier(uint _multiplier) public onlyOwner returns (bool) {
        multiplier = _multiplier;
        emit SetMultiplier(_multiplier);
        return true;
    }
}