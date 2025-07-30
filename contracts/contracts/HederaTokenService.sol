// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.5.0 <0.9.0;
pragma experimental ABIEncoderV2;

import "./HederaResponseCodes.sol";
import "./IHederaTokenService.sol";

abstract contract HederaTokenService {
    address constant precompileAddress = address(0x167);
    // 90 days in seconds
    int32 constant defaultAutoRenewPeriod = 7776000;

    modifier nonEmptyExpiry(IHederaTokenService.HederaToken memory token)
    {
        if (token.expiry.second == 0 && token.expiry.autoRenewPeriod == 0) {
            token.expiry.autoRenewPeriod = defaultAutoRenewPeriod;
        }
        _;
    }

    /// Generic event
    event CallResponseEvent(bool, bytes);

    /// Get the approved address for a single NFT
    /// Only Applicable to NFT Tokens
    /// @param token The Hedera NFT token address to check approval
    /// @param serialNumber The NFT to find the approved address for
    /// @return responseCode The response code for the status of the request. SUCCESS is 22.
    /// @return approved The approved address for this NFT, or the zero address if there is none
    function getApproved(address token, uint256 serialNumber) internal returns (int responseCode, address approved)
    {
        (bool success, bytes memory result) = precompileAddress.call(
            abi.encodeWithSelector(IHederaTokenService.getApproved.selector,
            token, serialNumber));
        (responseCode, approved) =
        success
        ? abi.decode(result, (int32, address))
        : (HederaResponseCodes.UNKNOWN, address(0));
    }
}
