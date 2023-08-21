import lf from "localforage";
import { createContext, useContext, useEffect, useState } from "react";
import { isNil } from "ramda";
import WeaveDB from "weavedb-sdk";
import { useAccount } from "wagmi";
import { v4 } from "uuid";

import {
  Bounty,
  NullableValue,
  IBountyContextProps,
  BountyApplication,
} from "@/types";
import { useContract } from "@/hooks/contract";

type OrderSortKey = Pick<IBountyContextProps, "orderSort">;
type StatusSortKey = Pick<IBountyContextProps, "statusSort">;

const defaultState: IBountyContextProps = {
  address: undefined,
  bounties: [],
  statusSort: "",
  setStatusSort: () => {},
  orderSort: "createdAt",
  setOrderSort: () => {},
  acceptApplication: () => Promise.resolve(),
  declineApplicantion: () => Promise.resolve(),
  fetchBounty: () => Promise.resolve({} as Bounty),
  fetchBounties: () => Promise.resolve(),
  createBounty: () => Promise.resolve(),
  cancelBounty: () => Promise.resolve(),
  updateBounty: () => Promise.resolve(),
  applyToBounty: () => Promise.resolve(),
  accpetSubmission: () => Promise.resolve(),
  submitBounty: () => Promise.resolve(),
  abandonBounty: () => Promise.resolve(),
  requestChanges: () => Promise.resolve(),
};

export const AppContext = createContext<IBountyContextProps>(defaultState);
const contractTxId = process.env.NEXT_PUBLIC_WEAVEDB_ContractTxId as string;

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [dbInstance, setDbInstance] = useState<WeaveDB | null>(null);
  const [user, setUser] = useState<{
    wallet: NullableValue<`0x${string}`>;
    privateKey: NullableValue<string>;
  }>({
    wallet: undefined,
    privateKey: undefined,
  });
  const [bounties, setBounties] = useState<{ data: Bounty; id: string }[]>([]);
  const { address, isConnected } = useAccount();
  const [statusSort, setStatusSort] =
    useState<StatusSortKey[keyof StatusSortKey]>("");
  const [orderSort, setOrderSort] =
    useState<OrderSortKey[keyof OrderSortKey]>("createdAt");
  const { approveAndSubmitTx, acceptBountyTx, cancelBountyTx } = useContract();

  useEffect(() => {
    const init = async () => {
      const _db = new WeaveDB({
        contractTxId,
        nocache: true,
      });
      await _db.init();
      setDbInstance(_db);
    };
    init();
  }, []);

  useEffect(() => {
    if (dbInstance) {
      fetchBounties();
    }
  }, [dbInstance, statusSort, orderSort]);

  useEffect(() => {
    async function createVirtualUser() {
      const wallet_address = address;
      let identity = await lf.getItem(
        `temp_address:${contractTxId}:${wallet_address}`
      );
      let tx;
      let err;
      if (isNil(identity)) {
        ({ tx, identity, err } = await dbInstance!.createTempAddress(
          wallet_address as string
        ));
        //@ts-ignore
        const linked = await dbInstance.getAddressLink(identity.address);
        console.log({ linked });
        if (isNil(linked)) {
          alert("something went wrong");
          return;
        }
      } else {
        await lf.setItem("temp_address:current", wallet_address);
        setUser({
          wallet: wallet_address,
          //@ts-ignore
          privateKey: identity.privateKey,
        });
        return;
      }
      if (!isNil(tx) && isNil(tx.err)) {
        //@ts-ignore
        identity.tx = tx;
        //@ts-ignore
        identity.linked_address = wallet_address;
        await lf.setItem("temp_address:current", wallet_address);
        await lf.setItem(
          `temp_address:${contractTxId}:${wallet_address}`,
          JSON.parse(JSON.stringify(identity))
        );
        setUser({
          wallet: wallet_address,
          //@ts-ignore
          privateKey: identity.privateKey,
        });
      }
    }

    if (dbInstance && address && isConnected) {
      createVirtualUser();
    }
  }, [address, isConnected, dbInstance]);

  const acceptApplication = async (id: string, hunter: `0x${string}`) => {
    try {
      let bounty = await dbInstance!.get<Bounty>("bounties", id);
      let applications = bounty.applications;

      if (applications) {
        // Find the application where the hunter is the applicant and set the status to accepted
        applications = applications.map((application) => {
          if (application.hunter === hunter) {
            return { ...application, status: "accepted" };
          } else {
            return application;
          }
        });
      }

      await dbInstance!.update<Bounty>(
        { ...bounty, hunter, status: "in progress", applications },
        "bounties",
        id
        // user
      );
      await fetchBounties();
    } catch (error) {
      return error;
    }
  };

  const accpetSubmission = async (id: string) => {
    try {
      let bounty = await dbInstance!.get<Bounty>("bounties", id);
      if (bounty.issuer !== address) return;
      if (bounty.status === "completed") return;
      if (!bounty.hunter) return;

      let acceptBountyTxReq = await acceptBountyTx(bounty.txId, bounty.hunter);
      if (!acceptBountyTxReq) return;

      await dbInstance!.update<Bounty>(
        { ...bounty, status: "completed" },
        "bounties",
        id
        // user
      );
      await fetchBounties();
    } catch (error) {
      return error;
    }
  };

  const abandonBounty = async (id: string) => {
    try {
      let bounty = await dbInstance!.get<Bounty>("bounties", id);
      let applications = bounty.applications;

      if (bounty.hunter !== address) return;

      if (applications) {
        applications = applications.map((application) => {
          if (application.hunter === address) {
            return { ...application, status: "rejected" };
          } else {
            return application;
          }
        });
      }

      await dbInstance!.update<Bounty>(
        {
          ...bounty,
          applications,
          status: "open",
          submissionFeedback: "",
          submissionLink: "",
          hunter: "" as `0x${string}`,
        },
        "bounties",
        id
        // user
      );
      await fetchBounties();
    } catch (error) {
      return error;
    }
  };

  const cancelBounty = async (id: string) => {
    try {
      let bounty = await dbInstance!.get<Bounty>("bounties", id);

      if (bounty.issuer !== address) return;
      if (bounty.status === "completed" || bounty.status === "in progress")
        return;

      let cancelBountyReqTx = await cancelBountyTx(bounty.txId);
      if (!cancelBountyReqTx) return;

      let cancelBountyReq = await dbInstance!.update<Bounty>(
        {
          ...bounty,
          status: "cancelled",
        },
        "bounties",
        id
        // user
      );
      await fetchBounties();
      return cancelBountyReq;
    } catch (error) {
      return error;
    }
  };

  const declineApplicantion = async (id: string, hunter: `0x${string}`) => {
    try {
      let bounty = await dbInstance!.get<Bounty>("bounties", id);
      let applications = bounty.applications;

      if (applications) {
        applications = applications.map((application) => {
          if (application.hunter === hunter) {
            return { ...application, status: "rejected" };
          } else {
            return application;
          }
        });
      }

      await dbInstance!.update<Bounty>(
        { ...bounty, applications },
        "bounties",
        id
        // user
      );
      await fetchBounties();
    } catch (error) {
      return error;
    }
  };

  const fetchBounties = async () => {
    let bounties = await dbInstance!.cget<Bounty>(
      "bounties",
      [orderSort, "desc"],
      statusSort && ["status", "==", statusSort]
    );

    let aggregatedBounties: { data: Bounty; id: string }[] = bounties.map(
      (bounty) => {
        return {
          data: bounty.data,
          id: bounty.id,
        };
      }
    );
    setBounties(aggregatedBounties);
  };

  const fetchBounty = async (id: string) => {
    let bounty = await dbInstance!.get<Bounty>("bounties", id);
    return bounty;
  };

  const createBounty = async (bountyData: Bounty) => {
    console.log("Creating bounty...");
    let txId = v4();
    try {
      let bountyDataWithTxId = { ...bountyData, txId };
      let deposit = await approveAndSubmitTx(txId, bountyData.reward);
      if (!deposit) return false;

      const bounty = await dbInstance!.add(bountyDataWithTxId, "bounties");
      if (bounty.success) {
        console.log("Bounty created!");
        fetchBounties();
      }
      return bounty.success;
    } catch (error) {
      return error;
    }
  };

  const updateBounty = async (id: string, bounty: Bounty) => {
    try {
      await dbInstance!.update(bounty, "bounties", id, user);
      await fetchBounties();
    } catch (error) {
      return error;
    }
  };

  const requestChanges = async (id: string, message: string) => {
    try {
      let bounty = await dbInstance!.get<Bounty>("bounties", id);

      if (bounty.issuer !== address) return;

      let submissionRequest = await dbInstance!.update(
        {
          ...bounty,
          submissionFeedback: message,
          submissionStatus: "reviewed",
          submissions: bounty?.submissions
            ? [
                ...bounty.submissions,
                {
                  createdAt: Date.now(),
                  type: "review",
                  user: address,
                  message,
                },
              ]
            : [
                {
                  createdAt: Date.now(),
                  type: "request",
                  user: address,
                  message,
                },
              ],
        },
        "bounties",
        id
        // user
      );
      await fetchBounties();
      return submissionRequest;
    } catch (error) {
      return error;
    }
  };

  const applyToBounty = async (
    id: string,
    bountyApplicationData: BountyApplication
  ) => {
    try {
      let bounty = await dbInstance!.get<Bounty>("bounties", id);
      let status = await dbInstance!.update(
        {
          ...bounty,
          applications: bounty?.applications
            ? [...bounty.applications, bountyApplicationData]
            : [bountyApplicationData],
        },
        "bounties",
        id
        // user
      );
      console.log(status);

      await fetchBounties();
    } catch (error) {
      return error;
    }
  };

  const submitBounty = async (
    id: string,
    submissionLink: string,
    message?: string
  ) => {
    try {
      let bounty = await dbInstance!.get<Bounty>("bounties", id);
      let submissionRequest = await dbInstance!.update(
        {
          ...bounty,
          submissionLink,
          submissionStatus: "submitted",
          submissions: bounty?.submissions
            ? [
                ...bounty.submissions,
                {
                  createdAt: Date.now(),
                  type: "submission",
                  user: address,
                  message,
                },
              ]
            : [
                {
                  createdAt: Date.now(),
                  type: "submission",
                  user: address,
                  message,
                },
              ],
        },
        "bounties",
        id
        // user
      );
      return submissionRequest;

      await fetchBounties();
    } catch (error) {
      return error;
    }
  };

  const appContextValue: IBountyContextProps = {
    address,
    bounties,
    statusSort,
    setStatusSort,
    orderSort,
    setOrderSort,
    acceptApplication,
    declineApplicantion,
    fetchBounty,
    fetchBounties,
    createBounty,
    cancelBounty,
    updateBounty,
    applyToBounty,
    accpetSubmission,
    submitBounty,
    abandonBounty,
    requestChanges,
  };

  return (
    <AppContext.Provider value={appContextValue}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  return useContext(AppContext);
}
