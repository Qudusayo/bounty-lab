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
  applications?: {
    hunter: `0x${string}`;
    status: "open" | "accepted" | "rejected";
    timestamp: number;
    applicatinMessage: string;
  }[];
  txId: string;
};

type NullableValue<T> = T | undefined;

interface IBountyContextProps {
  address: `0x${string}` | undefined;
  bounties: Bounty[];
  fetchBounties: () => void;
  createBounty: (bountyData: Bounty) => Promise<unknown>;
  cancelBounty: (id: string) => Promise<unknown>;
  updateBounty: (id: string, bounty: Bounty) => Promise<unknown>;
}

export type { Bounty, NullableValue, IBountyContextProps };
