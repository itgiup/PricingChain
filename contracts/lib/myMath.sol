// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library myMath {
    function abs(int number) internal pure returns (uint) {
        return uint(number > 0 ? number : (-number));
    }
}
