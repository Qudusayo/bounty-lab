import React, { useState } from "react";
import { ethers } from "ethers";
import { erc20ABI, useContractWrite, useContractRead, useAccount } from "wagmi";
import { waitForTransaction } from "@wagmi/core";
import BountyAbi from "../bounty-abi.json";

export function useBountyHandler(address: `0x${string}`) {
  const { writeAsync: submitApplication } = useContractWrite({
    abi: BountyAbi,
    functionName: "submitApplication",
    address,
  });

  const { writeAsync: rejectApplicant } = useContractWrite({
    abi: BountyAbi,
    functionName: "rejectApplicant",
    address,
  });

  const { writeAsync: acceptApplicant } = useContractWrite({
    abi: BountyAbi,
    functionName: "acceptApplicant",
    address,
  });

  const { writeAsync: submitBounty } = useContractWrite({
    abi: BountyAbi,
    functionName: "submitBounty",
    address,
  });

  const { writeAsync: cancelBounty } = useContractWrite({
    abi: BountyAbi,
    functionName: "cancelBounty",
    address,
  });

  const { writeAsync: reviewSubmission } = useContractWrite({
    abi: BountyAbi,
    functionName: "reviewSubmission",
    address,
  });

  const applyToBounty = async (
    _applicationText: string,
    _communicationValue: string
  ) => {
    try {
      let submitApplicationReqTx = await submitApplication({
        args: [_applicationText, _communicationValue],
      });

      let txStatus = await waitForTransaction({
        hash: submitApplicationReqTx.hash,
      });
      console.log("CREATED BOUNTY", txStatus);
      return txStatus.status === "success";
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const acceptApplication = async (
    _applicantionIndex: number,
    callback: () => void
  ) => {
    try {
      let acceptApplicantReqTx = await acceptApplicant({
        args: [_applicantionIndex],
      });

      let txStatus = await waitForTransaction({
        hash: acceptApplicantReqTx.hash,
      });
      console.log("APPLICANT ACCEPTED", txStatus);
      if (txStatus.status === "success") callback();
    } catch (error) {
      console.log(error);
    }
  };

  const rejectApplication = async (
    _applicantionIndex: number,
    callback: () => void
  ) => {
    try {
      let rejectApplicantReqTx = await rejectApplicant({
        args: [_applicantionIndex],
      });

      let txStatus = await waitForTransaction({
        hash: rejectApplicantReqTx.hash,
      });
      console.log("REJECTED APPLICANT", txStatus);
      if (txStatus.status === "success") callback();
    } catch (error) {
      console.log(error);
    }
  };

  // const approveAndSubmitTx = async (
  //   _bountyMetadata: string,
  //   _reward: number,
  //   _communicationMethod: string,
  //   _communicationValue: string,
  //   _deadline: number
  // ) => {
  //   try {
  //     const approval = await checkApproval(_reward);
  //     if (approval) {
  //       let createBountyReqTx = await createBounty({
  //         args: [
  //           _bountyMetadata,
  //           ethers.utils.parseUnits(_reward.toString(), "ether").toBigInt(),
  //           _communicationMethod,
  //           _communicationValue,
  //           _deadline,
  //         ],
  //       });

  //       let txStatus = await waitForTransaction({
  //         hash: createBountyReqTx.hash,
  //       });
  //       console.log("CREATED BOUNTY", txStatus);
  //       return txStatus.status === "success";
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     return false;
  //   }
  // };

  const submitWork = async (
    _submission: string,
    _isRequestChange: boolean,
    _isSubmission: boolean
  ) => {
    try {
      let submitBountyReqTx = await submitBounty({
        args: [_submission, _isRequestChange, _isSubmission],
      });

      let txStatus = await waitForTransaction({ hash: submitBountyReqTx.hash });
      if (txStatus.status === "success") return true;
      else return false;
    } catch (error) {
      return false;
    }
  };

  const acceptSubmission = async () => {
    try {
      let submitBountyReqTx = await reviewSubmission({
        args: [true],
      });

      let txStatus = await waitForTransaction({ hash: submitBountyReqTx.hash });
      if (txStatus.status === "success") return true;
      else return false;
    } catch (error) {
      return false;
    }
  };

  // const cancelBountyTx = async (_id: string) => {
  //   try {
  //     let cancelBountyReqTx = await cancelBounty({
  //       args: [_id],
  //     });

  //     let txStatus = await waitForTransaction({ hash: cancelBountyReqTx.hash });
  //     if (txStatus.status === "success") return true;
  //     else return false;
  //   } catch (error) {
  //     return false;
  //   }
  // };

  return {
    applyToBounty,
    acceptApplication,
    rejectApplication,
    submitWork,
    acceptSubmission,
    // approveAndSubmitTx,
    // acceptBountyTx,
    // cancelBountyTx,
  };
}
