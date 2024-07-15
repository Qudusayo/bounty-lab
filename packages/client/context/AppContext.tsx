import { createContext, useContext, useEffect, useState } from "react";
import WeaveDB from "weavedb-sdk";
import { useAccount, useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

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
  // fetchBounty: () => Promise.resolve({} as Bounty),
  fetchBounties: () => Promise.resolve(),
  createBounty: async (bountyData: Omit<Bounty, "issuer" | "hunter" | "status">): Promise<boolean> => {
      // Your implementation here
      return true;
  },
  cancelBounty: () => Promise.resolve(),
  updateBounty: () => Promise.resolve(),
  applyToBounty: () => Promise.resolve(),
  submitBounty: () => Promise.resolve(),
  abandonBounty: () => Promise.resolve(),
  requestChanges: () => Promise.resolve(),
};

export const AppContext = createContext<IBountyContextProps>(defaultState);
const contractTxId = process.env.NEXT_PUBLIC_WEAVEDB_ContractTxId as string;

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  // const [dbInstance, setDbInstance] = useState<WeaveDB | null>(null);
  const [user, setUser] = useState<{
    wallet: NullableValue<`0x${string}`>;
    privateKey: NullableValue<string>;
  }>({
    wallet: undefined,
    privateKey: undefined,
  });
  const [bounties, setBounties] = useState<`0x${string}`[]>([]);
  const { address, isConnected } = useAccount();
  const [statusSort, setStatusSort] =
    useState<StatusSortKey[keyof StatusSortKey]>("");
  const [orderSort, setOrderSort] =
    useState<OrderSortKey[keyof OrderSortKey]>("createdAt");
  const { approveAndSubmitTx, acceptBountyTx, cancelBountyTx, getBounties } =
    useContract();

  // useEffect(() => {
  //   const init = async () => {
  //     const _db = new WeaveDB({
  //       contractTxId,
  //       nocache: true,
  //     });
  //     await _db.init();
  //     setDbInstance(_db);
  //   };
  //   init();
  // }, []);
  
  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    if (isConnected) {
      fetchBounties();
    }
  }, [isConnected, address]);

  // useEffect(() => {
  //   async function createVirtualUser() {}

  //   if (dbInstance && address && isConnected) {
  //     createVirtualUser();
  //   }
  // }, [address, isConnected, dbInstance]);

  const fetchBounties = async () => {
    let bounties: (`0x${string}`)[] = (await getBounties()).data as (`0x${string}`)[];
    console.log("BOUNTIES", bounties);

    setBounties(bounties);
  };

  const fetchBounty = async (id: string) => {
    // let bounty = await dbInstance!.get<Bounty>("bounties", id);
    // return bounty;
  };

  const createBounty = async (bountyData: Omit<Bounty, "issuer" | "hunter" | "status">) => {
    console.log("Creating bounty...");
    console.log("BOUNTY DATA", bountyData);
    try {
      let createdBounty = await approveAndSubmitTx(
        bountyData.bountyMeta,
        bountyData.reward,
        bountyData.communication.method,
        bountyData.communication.value,
        bountyData.deadline
      );

      if (createdBounty) {
        console.log("Bounty created!");
        fetchBounties();
      }
      return createdBounty;
    } catch (error) {
      return error;
    }
  };

  const updateBounty = async (id: string, bounty: Bounty) => {
    // try {
    //   await dbInstance!.update(bounty, "bounties", id, user);
    //   await fetchBounties();
    // } catch (error) {
    //   return error;
    // }
  };

  const requestChanges = async (id: string, message: string) => {
    // try {
    //   let bounty = await dbInstance!.get<Bounty>("bounties", id);

    //   if (bounty.issuer !== address) return;

    //   let submissionRequest = await dbInstance!.update(
    //     {
    //       ...bounty,
    //       submissionFeedback: message,
    //       submissionStatus: "reviewed",
    //       submissions: bounty?.submissions
    //         ? [
    //             ...bounty.submissions,
    //             {
    //               createdAt: Date.now(),
    //               type: "review",
    //               user: address,
    //               message,
    //             },
    //           ]
    //         : [
    //             {
    //               createdAt: Date.now(),
    //               type: "request",
    //               user: address,
    //               message,
    //             },
    //           ],
    //     },
    //     "bounties",
    //     id
    //     // user
    //   );
    //   await fetchBounties();
    //   return submissionRequest;
    // } catch (error) {
    //   return error;
    // }
  };

  const applyToBounty = async (
    id: string,
    bountyApplicationData: BountyApplication
  ) => {
    try {
      // let bounty = await dbInstance!.get<Bounty>("bounties", id);
      // let status = await dbInstance!.update(
      //   {
      //     ...bounty,
      //     applications: bounty?.applications
      //       ? [...bounty.applications, bountyApplicationData]
      //       : [bountyApplicationData],
      //   },
      //   "bounties",
      //   id
      //   // user
      // );
      // console.log(status);

      // await fetchBounties();
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
      // let bounty = await dbInstance!.get<Bounty>("bounties", id);
      // let submissionRequest = await dbInstance!.update(
      //   {
      //     ...bounty,
      //     submissionLink,
      //     submissionStatus: "submitted",
      //     submissions: bounty?.submissions
      //       ? [
      //           ...bounty.submissions,
      //           {
      //             createdAt: Date.now(),
      //             type: "submission",
      //             user: address,
      //             message,
      //           },
      //         ]
      //       : [
      //           {
      //             createdAt: Date.now(),
      //             type: "submission",
      //             user: address,
      //             message,
      //           },
      //         ],
      //   },
      //   "bounties",
      //   id
      //   // user
      // );
      // return submissionRequest;

      // await fetchBounties();
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
    // fetchBounty,
    fetchBounties,
    createBounty,
    updateBounty,
    applyToBounty,
    submitBounty,
    requestChanges,
    cancelBounty: function (id: string): Promise<unknown> {
      throw new Error("Function not implemented.");
    },
    abandonBounty: function (id: string): Promise<unknown> {
      throw new Error("Function not implemented.");
    }
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
