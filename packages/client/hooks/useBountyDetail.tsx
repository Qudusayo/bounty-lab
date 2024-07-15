import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useContractRead, useAccount } from "wagmi";
import BountyAbi from "../bounty-abi.json";
import axios from "axios";
import { marked } from "marked";
import he from "he";

type iBountyMeta = {
  title: string;
  description: string;
};

export function useBountyDetail(address: `0x${string}`) {
  const [applicants, setApplicants] = useState(0);
  const [bountyMeta, setBountyMeta] = useState<iBountyMeta>({} as iBountyMeta);
  const [status, setStatus] = useState(
    "open" as "open" | "in progress" | "completed" | "cancelled"
  );

  const [reward, setReward] = useState(0);
  const [createdAt, setCreatedAt] = useState(0);
  const [deadline, setDeadline] = useState(0);
  const [creator, setCreator] = useState("");

  const { data: pay } = useContractRead({
    functionName: "reward",
    abi: BountyAbi,
    address,
  });

  const { data: endDate } = useContractRead({
    abi: BountyAbi,
    functionName: "deadline",
    address,
  });

  const { data: description } = useContractRead({
    abi: BountyAbi,
    functionName: "description",
    address,
  });

  const { data: startDate } = useContractRead({
    abi: BountyAbi,
    functionName: "createdAt",
    address,
  });

  const { data: owner } = useContractRead({
    abi: BountyAbi,
    functionName: "creator",
    address,
  });

  const { data: isCancelled, refetch: updateIsCancelled } = useContractRead({
    abi: BountyAbi,
    functionName: "isCancelled",
    address,
  });

  const { data: isCompleted, refetch: updateIsCompleted } = useContractRead({
    abi: BountyAbi,
    functionName: "isCompleted",
    address,
  });

  const { data: isOpen, refetch: updateIsOpen } = useContractRead({
    abi: BountyAbi,
    functionName: "isOpen",
    address,
  });

  const { data: isSubmitted, refetch: updateIsSubmitted } = useContractRead({
    abi: BountyAbi,
    functionName: "isSubmitted",
    address,
  });

  const { data: isRequestChange, refetch: updateIsRequestChange } =
    useContractRead({
      abi: BountyAbi,
      functionName: "isRequestChange",
      address,
    });

  const { data: acceptedApplicant, refetch: updateAcceptedApplicant } =
    useContractRead({
      abi: BountyAbi,
      functionName: "acceptedApplicant",
      address,
    });

  const { data: applications, refetch: updateApplications } = useContractRead({
    abi: BountyAbi,
    functionName: "getApplications",
    address,
  });

  const { data: communicationMethod } = useContractRead({
    abi: BountyAbi,
    functionName: "communicationMethod",
    address,
  });

  const { data: communicationValue } = useContractRead({
    abi: BountyAbi,
    functionName: "getCommunicationValue",
    address,
  });

  const { data: submissions } = useContractRead({
    abi: BountyAbi,
    functionName: "getSubmissions",
    address,
  });

  useEffect(() => {
    if (pay) {
      setReward(Number(pay));
    }
  }, [pay]);

  useEffect(() => {
    if (startDate) {
      setCreatedAt(startDate ? Number(startDate) : 0);
    }
  }, [startDate]);

  useEffect(() => {
    if (endDate) {
      setDeadline(endDate ? Number(endDate) : 0);
    }
  }, [endDate]);

  useEffect(() => {
    if (owner) {
      setCreator(owner as string);
    }
  }, [owner]);

  const getShortDescription = (description: string) => {
    const parsedHtml = marked(description);
    const decodedText = he.decode(parsedHtml);
    const plainText = decodedText.replace(/<[^>]*>/g, "").replace(/\n/g, " ");
    return plainText.slice(0, 200);
  };

  useEffect(() => {
    const fetchBountyDescription = async () => {
      const { data } = await axios.get(`https://ipfs.io/ipfs/${description}`);
      setBountyMeta(data);
    };
    description && fetchBountyDescription();
  }, [description]);

  useEffect(() => {
    if (isCancelled) {
      setStatus("cancelled");
    } else if (isCompleted) {
      setStatus("completed");
    } else if (isOpen) {
      setStatus("open");
    }
    else {
      setStatus("in progress");
    }
  }, [isCancelled, isCompleted, isOpen, isSubmitted, isRequestChange]);

  useEffect(() => {
    console.log("APPLICATIONS", applications);
    setApplicants(applications ? (applications as `0x${string}`).length : 0);
  }, [applications]);

  const refreshBountyData = () => {
    updateIsCancelled();
    updateIsCompleted();
    updateIsOpen();
    updateAcceptedApplicant();
    updateApplications();
    updateIsSubmitted();
    updateIsRequestChange();
  };

  return {
    reward,
    deadline,
    createdAt,
    creator,
    isCancelled,
    isCompleted,
    isOpen,
    isSubmitted,
    isRequestChange,
    acceptedApplicant,
    applicants,
    applications,
    bountyMeta,
    status,
    communicationMethod,
    shortDescription: getShortDescription(bountyMeta.description ?? ""),
    refreshBountyData,
    communicationValue: communicationValue,
    submissions,
  };
}
