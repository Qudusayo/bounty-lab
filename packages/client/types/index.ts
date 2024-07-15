type BountyApplication = {
  applicant: `0x${string}`;
  applicationDate: number;
  applicationText: string;
  communicationValue: string;
  isAccepted: boolean;
  isRejected: boolean;
};

type SubmissionLog = {
  createdAt: number;
  message?: string;
  user: `0x${string}`;
  type: "submission" | "review" | "rejected" | "accepted" | "other";
};

type Bounty = {
  bountyMeta: string;
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
  submissionLink?: string;
  submissions?: SubmissionLog[];
  submissionFeedback?: string;
  submissionStatus?: "submitted" | "reviewed";
};

type NullableValue<T> = T | undefined;

interface IBountyContextProps {
  address: `0x${string}` | undefined;
  bounties: `0x${string}`[];
  statusSort: "" | "open" | "in progress" | "completed" | "cancelled";
  setStatusSort: React.Dispatch<
    React.SetStateAction<
      "" | "open" | "in progress" | "completed" | "cancelled"
    >
  >;
  orderSort: "createdAt" | "reward";
  setOrderSort: React.Dispatch<React.SetStateAction<"createdAt" | "reward">>;
  // fetchBounty: (id: string) => Promise<Bounty>;
  fetchBounties: () => void;
  createBounty: (
    bountyData: Omit<Bounty, "issuer" | "hunter" | "status">
  ) => Promise<unknown>;
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
  abandonBounty: (id: string) => Promise<unknown>;
  requestChanges: (id: string, message: string) => Promise<unknown>;
}

export type { BountyApplication, Bounty, NullableValue, IBountyContextProps };
