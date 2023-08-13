import lf from "localforage";
import { createContext, useContext, useEffect, useState } from "react";
import { isNil } from "ramda";
//@ts-ignore
import WeaveDB from "weavedb-sdk";
import { useAccount } from "wagmi";
import { Bounty, NullableValue, IBountyContextProps } from "@/types";

const defaultState: IBountyContextProps = {
  address: undefined,
  bounties: [],
  fetchBounties: () => {},
  createBounty: () => Promise.resolve(),
  cancelBounty: () => Promise.resolve(),
  updateBounty: () => Promise.resolve(),
};

export const AppContext = createContext<IBountyContextProps>(defaultState);
const contractTxId = process.env.NEXT_PUBLIC_WEAVEDB_ContractTxId;

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [dbInstance, setDbInstance] = useState<typeof WeaveDB>(null);
  const [user, setUser] = useState<{
    wallet: NullableValue<`0x${string}`>;
    privateKey: NullableValue<string>;
  }>({
    wallet: undefined,
    privateKey: undefined,
  });
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const init = async () => {
      const _db = new WeaveDB({
        contractTxId,
      });
      await _db.init();
      setDbInstance(_db);
    };
    init();
  }, []);

  useEffect(() => {
    if (dbInstance && address) {
      fetchBounties();
    }
  }, [dbInstance, address]);

  useEffect(() => {
    async function createVirtualUser() {
      const wallet_address = address;
      let identity = await lf.getItem(
        `temp_address:${contractTxId}:${wallet_address}`
      );
      let tx;
      let err;
      if (isNil(identity)) {
        ({ tx, identity, err } = await dbInstance.createTempAddress(
          wallet_address
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

  const fetchBounties = async () => {
    let bounties = await dbInstance.get("bounties");
    console.log({ bounties });
    setBounties(bounties);
  };

  const createBounty = async (bountyData: Bounty) => {
    console.log("Creating bounty...");
    try {
      const bounty = await dbInstance.add(bountyData, "bounties", user);
      if (bounty.success) {
        console.log("Bounty created!");
        fetchBounties();
      }
    } catch (error) {
      return error;
    }
  };

  const cancelBounty = async (id: string) => {
    console.log("Deleting bounty...");
    try {
      await dbInstance.delete("bounties", id, user);
      await fetchBounties();
    } catch (error) {
      return error;
    }
  };

  const updateBounty = async (id: string, bounty: Bounty) => {
    try {
      await dbInstance.update(bounty, "bounties", id, user);
      await fetchBounties();
    } catch (error) {
      return error;
    }
  };

  const getBountyApplicants = async (id: string) => {};

  const appContextValue: IBountyContextProps = {
    address,
    bounties,
    fetchBounties,
    createBounty,
    cancelBounty,
    updateBounty,
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
