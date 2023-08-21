import React, { useState } from "react";
import { ethers } from "ethers";
import { erc20ABI, useContractWrite } from "wagmi";
import { waitForTransaction } from "@wagmi/core";
import ContractAbi from "../contract-abi.json";

export function useContract() {
  const { writeAsync: approveToken } = useContractWrite({
    abi: erc20ABI,
    functionName: "approve",
    address: process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS as `0x${string}`,
  });

  const { writeAsync: createBounty } = useContractWrite({
    abi: ContractAbi,
    functionName: "createBounty",
    address: process.env.NEXT_PUBLIC_MAIN_CONTRACT_ADDRESS as `0x${string}`,
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

  const approveAndSubmitTx = async (_id: string, amount: number) => {
    try {
      let tokenApproval = await approveToken({
        args: [
          process.env.NEXT_PUBLIC_MAIN_CONTRACT_ADDRESS as `0x${string}`,
          ethers.utils.parseUnits(amount.toString(), "ether").toBigInt(),
        ],
      });

      let txStatus = await waitForTransaction({ hash: tokenApproval.hash });

      if (txStatus.status === "success") {
        let createBountyTx = await createBounty({
          args: [
            _id,
            ethers.utils.parseUnits(amount.toString(), "ether").toBigInt(),
          ],
        });

        let txStatus = await waitForTransaction({ hash: createBountyTx.hash });

        if (txStatus.status === "success") return true;
      } else {
        return false;
      }
    } catch (error) {
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
    approveAndSubmitTx,
    acceptBountyTx,
    cancelBountyTx,
  };
}
