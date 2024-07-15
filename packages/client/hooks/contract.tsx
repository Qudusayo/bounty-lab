import React, { useState } from "react";
import { ethers } from "ethers";
import { erc20ABI, useContractWrite, useContractRead, useAccount } from "wagmi";
import { waitForTransaction } from "@wagmi/core";
import ContractAbi from "../contract-abi.json";
import FactoryAbi from "../factory-abi.json";

export function useContract() {
  const { address } = useAccount();

  const { refetch: getApproval } = useContractRead({
    abi: erc20ABI,
    functionName: "allowance",
    address: process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS as `0x${string}`,
    args: [
      address as `0x${string}`,
      process.env.NEXT_PUBLIC_BOUNTY_FACTORY_CONTRACT_ADDRESS as `0x${string}`,
    ],
  });

  const { refetch: getBounties } = useContractRead({
    abi: FactoryAbi,
    functionName: "getBounties",
    address: process.env.NEXT_PUBLIC_BOUNTY_FACTORY_CONTRACT_ADDRESS as `0x${string}`,
  });

  const { writeAsync: approveToken } = useContractWrite({
    abi: erc20ABI,
    functionName: "approve",
    address: process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS as `0x${string}`,
  });

  const { writeAsync: createBounty } = useContractWrite({
    abi: FactoryAbi,
    functionName: "createBounty",
    address: process.env.NEXT_PUBLIC_BOUNTY_FACTORY_CONTRACT_ADDRESS as `0x${string}`,
  });

  const { writeAsync: acceptBounty } = useContractWrite({
    abi: ContractAbi,
    functionName: "acceptSubmission",
    address: process.env.NEXT_PUBLIC_MAIN_CONTRACT_ADDRESS as `0x${string}`,
  });

  const { writeAsync: cancelBounty } = useContractWrite({
    abi: ContractAbi,
    functionName: "cancelBounty",
    address: process.env.NEXT_PUBLIC_MAIN_CONTRACT_ADDRESS as `0x${string}`,
  });

  const checkApproval = async (amount: number) => {
    try {
      const approval = await getApproval();
      if (Number(approval.data) < amount) {
        let tokenApproval = await approveToken({
          args: [
            process.env
              .NEXT_PUBLIC_BOUNTY_FACTORY_CONTRACT_ADDRESS as `0x${string}`,
            ethers.utils.parseUnits(amount.toString(), "ether").toBigInt(),
          ],
        });

        let txStatus = await waitForTransaction({ hash: tokenApproval.hash });
        console.log(txStatus);
        return txStatus.status === "success";
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const approveAndSubmitTx = async (
    _bountyMetadata: string,
    _reward: number,
    _communicationMethod: string,
    _communicationValue: string,
    _deadline: number
  ) => {
    try {
      const approval = await checkApproval(_reward);
      if (approval) {
        let createBountyReqTx = await createBounty({
          args: [
            _bountyMetadata,
            ethers.utils.parseUnits(_reward.toString(), "ether").toBigInt(),
            _communicationMethod,
            _communicationValue,
            _deadline,
          ],
        });

        let txStatus = await waitForTransaction({
          hash: createBountyReqTx.hash,
        });
        console.log("CREATED BOUNTY", txStatus);
        return txStatus.status === "success";
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const acceptBountyTx = async (_id: string, submitter: `0x${string}`) => {
    try {
      let acceptBountyReqTx = await acceptBounty({
        args: [_id, submitter],
      });

      let txStatus = await waitForTransaction({ hash: acceptBountyReqTx.hash });
      if (txStatus.status === "success") return true;
      else return false;
    } catch (error) {
      return false;
    }
  };

  const cancelBountyTx = async (_id: string) => {
    try {
      let cancelBountyReqTx = await cancelBounty({
        args: [_id],
      });

      let txStatus = await waitForTransaction({ hash: cancelBountyReqTx.hash });
      if (txStatus.status === "success") return true;
      else return false;
    } catch (error) {
      return false;
    }
  };

  return {
    getBounties,
    approveAndSubmitTx,
    acceptBountyTx,
    cancelBountyTx,
  };
}
