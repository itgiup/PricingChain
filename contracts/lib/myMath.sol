// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library myMath {
    function abs(uint a, uint b) internal pure returns (uint) {
        
        return a > b ? (a - b) : (b - a);
    }
}
