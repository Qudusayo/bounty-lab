import { Container } from "@/components/Utils";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Link as MuiLink,
  Typography,
} from "@mui/joy";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
//@ts-ignore
import WeaveDB from "weavedb-sdk-node";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { GoPeople, GoLock } from "react-icons/go";
import { HiOutlineBookOpen } from "react-icons/hi";
import { BsDot } from "react-icons/bs";
import { LuClock4 } from "react-icons/lu";
import { ChipData } from "@/components/BountyCard";
import { TbBrandStackshare } from "react-icons/tb";
import ApplyBounty from "@/components/ApplyBounty";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { Bounty as IBounty } from "@/types";
import axios from "axios";
import { formatTimestamp, shortenAddress } from "@/functions";
import Avatar from "@/utils/Avatar";
import { useColorScheme as useJoyColorScheme } from "@mui/joy/styles";

export default function Bounty({
  bounty,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [bountyDescription, setBountyDescription] = useState<string | null>(
    null
  );
  const [value, setValue] = React.useState("1");
  const [status, setStatus] = React.useState<
    "open" | "in-progress" | "completed" | "cancelled"
  >("open");
  const { mode } = useJoyColorScheme();
  const [common, setCommon] = useState("#ffffff");

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const { format } = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  useEffect(() => {
    if (mode === "light") {
      setCommon("#ffffff");
    } else {
      setCommon("neutral.900");
    }
  }, [mode]);

  useEffect(() => {
    const fetchBountyDescription = async () => {
      const { data } = await axios.get(
        `https://ipfs.io/ipfs/${bounty.descriptionIPFSHash}`
      );
      setBountyDescription(data);
    };
    fetchBountyDescription();
  });

  return (
    <Container>
      <MuiLink
        variant={"soft"}
        color="neutral"
        component={Link}
        href="/"
        underline="none"
        py={0.5}
        px={1}
        borderRadius={5}
        bgcolor={common}
        mb={4}
        startDecorator={<IoArrowBack />}
        sx={{
          transition: "all .2s ease-in-out",
          "&:hover": {
            bgcolor: mode === "light" ? "neutral.100" : "neutral.800",
          },
        }}
      >
        Back to Bounties
      </MuiLink>
      <Box
        sx={{
          m: 0,
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: ["flex-start", "flex-start", "center"],
          }}
          flexDirection={["column", "column", "row"]}
        >
          <Typography level="h2" color="success">
            Earn {format(bounty.reward)}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.275rem",
            }}
          >
            <LuClock4 />
            <Typography level="body-sm">
              due {formatTimestamp(bounty.deadline)}
            </Typography>
            <BsDot size={20} />
            <Chip size="sm" color={ChipData[bounty.status].color as any}>
              {ChipData[bounty.status].status}
            </Chip>
          </Box>
        </Box>
        <Typography level="h3" my={".75em"}>
          {bounty.title}
        </Typography>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          mt={".75rem"}
          alignItems={["flex-start", "flex-start", "center"]}
          flexDirection={["column", "column", "row"]}
          gap={2}
        >
          <Box display={"flex"} alignItems={"center"} gap={".5rem"}>
            <Avatar address={bounty.issuer} />
            <Typography level="body-sm">
              {shortenAddress(bounty.issuer)}
            </Typography>
            <BsDot size={20} />
            <Typography level="body-sm">
              Posted {formatTimestamp(bounty.createdAt)}
            </Typography>
          </Box>
          {status === "in-progress" || status === "completed" ? (
            <Box display={"flex"} alignItems={"center"} gap={".5rem"}>
              <Typography level="body-sm">Claimed by</Typography>
              <Avatar address={bounty.hunter ?? "0x000000"} />
              <Typography level="body-sm">Qudusayo</Typography>
            </Box>
          ) : (
            <Box display={"flex"} alignItems={"center"} gap={".5rem"}>
              <Button
                variant="soft"
                sx={{
                  p: 1,
                }}
                color="neutral"
              >
                <TbBrandStackshare size={20} />
              </Button>
              <ApplyBounty />
            </Box>
          )}
        </Box>
      </Box>
      <Box sx={{ width: "100%", typography: "body1", mb: 4 }}>
        <TabContext value={value}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "#70788c50",
              marginTop: "1.5em",
            }}
          >
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              sx={{
                minHeight: "2.25rem",
                "& .MuiTabs-indicator": {
                  backgroundColor: "primary",
                },
                "& .MuiTab-root": {
                  textTransform: "none",
                  textAlign: "left",
                  fontSize: ".9rem",
                  fontWeight: 200,
                  padding: "0.25rem 0.75rem", // Adjust the padding as needed
                  minHeight: "1.5rem",
                  height: "2.5rem",
                  borderRadius: "0.25rem",

                  "&:before": {
                    content: "''",
                    position: "absolute",
                    width: "1px",
                    height: "1rem",
                    left: "0",
                  },
                },
              }}
            >
              <Tab
                sx={{
                  "&:before": {
                    display: "none",
                  },
                }}
                icon={<HiOutlineBookOpen size={20} />}
                iconPosition="start"
                disableRipple={true}
                label="Details"
                value="1"
              />
              <Tab
                sx={{
                  "&:before": {
                    content: "''",
                    position: "absolute",
                    width: "1px",
                    height: "1rem",
                    backgroundColor: "#70788C",
                    left: "0",
                  },
                }}
                icon={<GoPeople size={15} />}
                iconPosition="start"
                disableRipple={true}
                label={
                  <Box display={"flex"} alignItems={"center"} gap={1}>
                    Applications{" "}
                    <Chip
                      size="sm"
                      sx={{
                        backgroundColor: common,
                      }}
                    >
                      0
                    </Chip>
                  </Box>
                }
                value="2"
              />
              <Tab
                sx={{
                  "&:before": {
                    content: "''",
                    position: "absolute",
                    width: "1px",
                    height: "1rem",
                    backgroundColor: "#70788C",
                    left: "0",
                  },
                }}
                icon={<GoLock size={15} />}
                iconPosition="start"
                disableRipple={true}
                label={"Discussion"}
                value="3"
                disabled
              />
            </TabList>
          </Box>
          <TabPanel
            value="1"
            sx={{
              p: 0,
            }}
          >
            <Typography level="h4" my={3}>
              Bounty Description
            </Typography>
            {bountyDescription ? (
              <Box px={3} py={1} borderRadius={12} bgcolor={common}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {bountyDescription.replace(/^(.*)$/gm, "$1  ")}
                </ReactMarkdown>
              </Box>
            ) : (
              <CircularProgress
                color="neutral"
                sx={{
                  display: "block",
                  margin: "auto",
                  "--CircularProgress-size": "40px",
                  "--CircularProgress-trackThickness": "3px",
                  "--CircularProgress-progressThickness": "3px",
                }}
              />
            )}
          </TabPanel>
          <TabPanel
            value="2"
            sx={{
              p: 0,
            }}
          >
            <Typography level="h4" my={3}>
              Applications
            </Typography>
            <Box
              sx={{
                backgroundColor: common,
                p: 3,
                borderRadius: 6,
              }}
            >
              No applications.
            </Box>
          </TabPanel>
          <TabPanel
            sx={{
              px: 0,
            }}
            value="3"
          >
            Part 3
          </TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<{
  bounty: IBounty;
}> = async (context) => {
  const { id } = context.query;

  const db = new WeaveDB({
    contractTxId: process.env.NEXT_PUBLIC_WEAVEDB_ContractTxId,
  });
  await db.init();
  let bounties: Promise<IBounty[]> = await db.get("bounties", [
    "txId",
    "==",
    id,
  ]);
  if (!(await bounties).length) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  let bounty = (await bounties)[0];

  return { props: { bounty } };
};
