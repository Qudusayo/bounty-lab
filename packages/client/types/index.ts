type BountyApplication = {
  hunter: `0x${string}`;
  status: "open" | "accepted" | "rejected";
  timestamp: number;
  applicationMessage: string;
  communication: {
    method: "email" | "discord";
    value: string;
  };
};

type SubmissionLog = {
  createdAt: number;
  message?: string;
  user: `0x${string}`;
  type: "submission" | "review" | "rejected" | "accepted" | "other";
};

type Bounty = {
  title: string;
  descriptionMeta: string;
  descriptionIPFSHash: string;
  reward: number;
  deadline: number;
  hunter: `0x${string}` | null;
  issuer: `0x${string}`;
  status: "open" | "in progress" | "completed" | "cancelled";
  communication: {
    method: "email" | "discord";
    value: string;
  };
  createdAt: number;
  updatedAt?: number;
  applications?: BountyApplication[];
  txId: string;
  submissionLink?: string;
  submissions?: SubmissionLog[];
  submissionFeedback?: string;
  submissionStatus?: "submitted" | "reviewed";
};

type NullableValue<T> = T | undefined;

interface IBountyContextProps {
  address: `0x${string}` | undefined;
  bounties: { data: Bounty; id: string }[];
  statusSort: "" | "open" | "in progress" | "completed" | "cancelled";
  setStatusSort: React.Dispatch<
    React.SetStateAction<
      "" | "open" | "in progress" | "completed" | "cancelled"
    >
  >;
  orderSort: "createdAt" | "reward";
  setOrderSort: React.Dispatch<React.SetStateAction<"createdAt" | "reward">>;
  acceptApplication: (id: string, hunter: `0x${string}`) => Promise<unknown>;
  declineApplicantion: (id: string, hunter: `0x${string}`) => Promise<unknown>;
  fetchBounty: (id: string) => Promise<Bounty>;
  fetchBounties: () => void;
  createBounty: (bountyData: Bounty) => Promise<unknown>;
  cancelBounty: (id: string) => Promise<unknown>;
  updateBounty: (id: string, bounty: Bounty) => Promise<unknown>;
  applyToBounty: (
    id: string,
    application: BountyApplication,
    txId: string
  ) => Promise<unknown>;
  submitBounty: (
    id: string,
    submissionLink: string,
    message?: string
  ) => Promise<unknown>;
  accpetSubmission: (id: string) => Promise<unknown>;
  abandonBounty: (id: string) => Promise<unknown>;
  requestChanges: (id: string, message: string) => Promise<unknown>;
}

export type { BountyApplication, Bounty, NullableValue, IBountyContextProps };
