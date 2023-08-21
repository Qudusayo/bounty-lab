import React, { useState } from "react";
import { ethers } from "ethers";
import { erc20ABI, useContractWrite } from "wagmi";
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

  const approveAndSubmitTx = async (_id: string, amount: number) => {
    try {
      await approveToken({
        args: [
          process.env.NEXT_PUBLIC_MAIN_CONTRACT_ADDRESS as `0x${string}`,
          ethers.utils.parseUnits(amount.toString(), "ether").toBigInt(),
        ],
      });

      await createBounty({
        args: [
          _id,
          ethers.utils.parseUnits(amount.toString(), "ether").toBigInt(),
        ],
      });
    } catch (error) {
      return error;
    }
  };

  const acceptBountyTx = async (_id: string, submitter: `0x${string}`) => {
    try {
      await acceptBounty({
        args: [_id, submitter],
      });
    } catch (error) {
      return error;
    }
  };

  return {
    approveAndSubmitTx,
    acceptBountyTx,
  };
}
