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

type Bounty = {
  title: string;
  descriptionMeta: string;
  descriptionIPFSHash: string;
  reward: number;
  deadline: number;
  hunter: `0x${string}` | null;
  issuer: `0x${string}`;
  status: "open" | "in-progress" | "completed" | "cancelled";
  communication: {
    method: "email" | "discord";
    value: string;
  };
  createdAt: number;
  updatedAt?: number;
  applications?: BountyApplication[];
  txId: string;
};

type NullableValue<T> = T | undefined;

interface IBountyContextProps {
  address: `0x${string}` | undefined;
  bounties: { data: Bounty; id: string }[];
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
}

export type { BountyApplication, Bounty, NullableValue, IBountyContextProps };
