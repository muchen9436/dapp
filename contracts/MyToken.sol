// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") {
        _mint(msg.sender, initialSupply * (10 ** uint256(decimals())));
    }

    function decimals() public view virtual override returns (uint8) {
        return 0; // 将小数位数设置为 0
    }
}
