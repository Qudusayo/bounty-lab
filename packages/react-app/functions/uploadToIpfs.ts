import { create } from "ipfs-http-client";

export const handleUpload = async (markdownText: string) => {
  const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
  const projectSecret = process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET;

  const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

  const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });

  const { cid } = await client.add(markdownText);
  return cid;
};
