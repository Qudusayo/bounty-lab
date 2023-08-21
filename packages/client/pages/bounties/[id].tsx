import { Container } from "@/components/Utils";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Link as MuiLink,
  Typography,
} from "@mui/joy";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { GoPeople, GoLock } from "react-icons/go";
import { HiOutlineBookOpen } from "react-icons/hi";
import { BsDot, BsThreeDotsVertical } from "react-icons/bs";
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
import { useAppContext } from "@/context/AppContext";
import { FiEye } from "react-icons/fi";
import ApplicationCard from "@/components/ApplicationCard";
import {
  BsChatLeft,
  BsDiscord,
  BsFillEnvelopeFill,
  BsArrowRepeat,
  BsCheck2,
  BsEye,
} from "react-icons/bs";
// @ts-ignore
import WeaveDB from "weavedb-sdk-node";
import SubmitWork from "@/components/SubmitWork";
import AcceptSubmission from "@/components/AcceptBounty";
import AbandonBounty from "@/components/AbandonBounty";
import CancelBounty from "@/components/CancelBounty";
import RequestChages from "@/components/RequestChanges";
import ShareModal from "@/components/ShareModal";

export default function Bounty({
  bounty: _bounty,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  let { id: bountyId } = _bounty;
  const { mode } = useJoyColorScheme();
  const [bounty, setBounty] = useState(_bounty.data);
  const [value, setValue] = useState("1");
  const { address, fetchBounty } = useAppContext();
  const [isHunter, setIsHunter] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isOpenBounty, setIsOpenBounty] = useState(false);
  const [isCompletedBounty, setIsCompletedBounty] = useState(false);
  const [common, setCommon] = useState("#ffffff");
  const [bountyDescription, setBountyDescription] = useState<string | null>(
    null
  );

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
    setIsHunter(address === bounty.hunter);
    setIsCreator(address === bounty.issuer);
    setIsOpenBounty(bounty.status === "open");
    setIsCompletedBounty(bounty.status === "completed");
  }, [address, bounty]);

  useEffect(() => {
    const fetchBountyDescription = async () => {
      const { data } = await axios.get(
        `https://ipfs.io/ipfs/${bounty.descriptionIPFSHash}`
      );
      setBountyDescription(data);
    };
    fetchBountyDescription();
  });

  const refetchBounty = async (backToDetails?: boolean) => {
    let bountyData = await fetchBounty(bountyId);
    if (backToDetails) setValue("1");
    setBounty(bountyData);
  };

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
            }}
          >
            <LuClock4 />
            <Typography level="body-sm" sx={{ ml: 1 }}>
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
          <Box display={"flex"} alignItems={"center"} gap={".5rem"}>
            <ShareModal title={bounty.title} reward={bounty.reward} />
            {isHunter && (
              <AbandonBounty
                refetchBounty={refetchBounty}
                bountyId={bountyId}
              />
            )}
            {isCreator && isOpenBounty && (
              <CancelBounty refetchBounty={refetchBounty} bountyId={bountyId} />
            )}
            {isCreator ? (
              isOpenBounty && (
                <>
                  <Button
                    variant="solid"
                    color="primary"
                    startDecorator={<FiEye />}
                    onClick={() => setValue("2")}
                  >
                    View Applications
                  </Button>
                </>
              )
            ) : isOpenBounty ? (
              <ApplyBounty
                refetchBounty={refetchBounty}
                bountyId={bountyId}
                {...bounty}
              />
            ) : (
              isHunter &&
              !isCompletedBounty && (
                <SubmitWork refetchBounty={refetchBounty} bountyId={bountyId} />
              )
            )}
          </Box>
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
                      {bounty?.applications?.length ?? 0}
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
                icon={
                  isHunter || isCreator ? (
                    <BsChatLeft size={15} />
                  ) : (
                    <GoLock size={15} />
                  )
                }
                iconPosition="start"
                disableRipple={true}
                label={"Discussion"}
                value="3"
                disabled={isHunter || isCreator ? false : true}
              />
            </TabList>
          </Box>
          <TabPanel
            value="1"
            sx={{
              p: 0,
            }}
          >
            {bounty.status === "completed" && (
              <Box
                sx={{
                  backgroundColor: common,
                  p: 3,
                  borderRadius: 6,
                  mt: 3,
                  fontWeight: 600,
                  border: "1px solid #00A11B",
                  boxShadow: "rgba(0, 161, 27, 0.4) 0px 0px 8px",
                }}
              >
                This Bounty has been completed!
              </Box>
            )}
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
            {!bounty.applications?.length && (
              <Box
                sx={{
                  backgroundColor: common,
                  p: 3,
                  borderRadius: 6,
                }}
              >
                No applications.
              </Box>
            )}
            {bounty.applications?.map((application, i) => (
              <ApplicationCard
                key={i}
                {...application}
                bountyId={bountyId}
                refetch={refetchBounty}
                issuer={bounty.issuer}
                acceptedHunter={bounty.hunter}
              />
            ))}
          </TabPanel>
          <TabPanel
            sx={{
              px: 0,
            }}
            value="3"
          >
            {bounty.submissionStatus === "submitted" && (
              <Box
                sx={{
                  backgroundColor: common,
                  p: 3,
                  borderRadius: 6,
                  mb: 2,
                  border:
                    bounty.status === "completed" ? "1px solid #00A11B" : "",
                  boxShadow:
                    bounty.status === "completed"
                      ? "rgba(0, 161, 27, 0.4) 0px 0px 8px"
                      : "",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography fontWeight={"600"}>
                    {shortenAddress(bounty.hunter ?? "")} submitted work!
                  </Typography>
                  <MuiLink
                    rel="noopener"
                    href={bounty.submissionLink}
                    target="_blank"
                    variant="solid"
                    startDecorator={<BsEye />}
                    sx={{
                      borderRadius: 5,
                      p: 0.5,
                      px: 1.25,
                      mr: 0.125,
                      fontSize: "1rem",
                      textDecoration: "none",

                      "&:hover": {
                        textDecoration: "none",
                      },
                    }}
                  >
                    View Work
                  </MuiLink>
                </Box>

                {isCreator &&
                  bounty.hunter &&
                  bounty.status !== "completed" && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 1.5,
                        mt: 4,
                      }}
                    >
                      <RequestChages
                        bountyId={bountyId}
                        refetchBounty={refetchBounty}
                      />
                      <AcceptSubmission
                        bountyId={bountyId}
                        hunter={bounty.hunter}
                        refetchBounty={refetchBounty}
                      />
                    </Box>
                  )}
              </Box>
            )}
            {bounty.submissionStatus === "reviewed" ||
              (!bounty.submissionStatus &&
                isHunter &&
                bounty.status !== "completed" && (
                  <Box
                    sx={{
                      backgroundColor: common,
                      p: 3,
                      borderRadius: 6,
                      mb: 2,
                      border:
                        bounty.submissionStatus === "reviewed"
                          ? "1px solid #a19600"
                          : "",
                      boxShadow:
                        bounty.submissionStatus === "reviewed"
                          ? "rgba(161, 118, 0, 0.4) 0px 0px 8px"
                          : "",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography fontWeight={"600"}>
                        {isCreator
                          ? "You"
                          : shortenAddress(bounty.hunter ?? "")}{" "}
                        request some changes!
                      </Typography>
                      {!isCreator && (
                        <SubmitWork
                          refetchBounty={refetchBounty}
                          bountyId={bountyId}
                        />
                      )}
                    </Box>
                    <Typography>{bounty.submissionFeedback}</Typography>
                  </Box>
                ))}
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
              <Grid xs={6}>
                <Box
                  sx={{
                    backgroundColor: common,
                    p: 3,
                    borderRadius: 6,
                    mb: 2,
                  }}
                >
                  <Typography fontWeight={"600"}>Get in touch</Typography>
                  <Typography level="body-sm" sx={{ mt: 2 }}>
                    You
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      my: 1,
                    }}
                  >
                    {bounty.communication.method === "discord" ? (
                      <BsDiscord size={20} />
                    ) : (
                      <BsFillEnvelopeFill size={20} />
                    )}
                    <Typography>{bounty.communication.value}</Typography>
                  </Box>
                  <Typography level="body-sm" sx={{ mt: 2 }}>
                    Bounty Hunter
                  </Typography>
                  {bounty.hunter ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        my: 1,
                      }}
                    >
                      {bounty.communication.method === "discord" ? (
                        <BsDiscord size={20} />
                      ) : (
                        <BsFillEnvelopeFill size={20} />
                      )}
                      <Typography>
                        {
                          bounty.applications?.find(
                            (application) =>
                              application.hunter === bounty.hunter
                          )?.communication.value
                        }
                      </Typography>
                    </Box>
                  ) : (
                    <Typography sx={{ my: 1 }}>
                      No contact information provided.
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid xs={6}>
                <Box
                  sx={{
                    backgroundColor: common,
                    p: 3,
                    borderRadius: 6,
                    mb: 2,
                  }}
                >
                  <Typography fontWeight={"600"}>Having trouble?</Typography>
                </Box>
              </Grid>
            </Grid>
            <Box
              sx={{
                backgroundColor: common,
                p: 3,
                borderRadius: 6,
              }}
            >
              <Typography fontWeight={"600"}>Activity Log</Typography>
              {bounty.submissions && bounty.submissions.length
                ? bounty.submissions.map((log, i) => (
                    <Box key={i}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          my: 2,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Avatar address={log.user} />
                          <Typography>{shortenAddress(log.user)}</Typography>
                        </Box>
                        <Typography>
                          {formatTimestamp(log.createdAt)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          backgroundColor: "neutral.800",
                          p: 1,
                          borderRadius: 6,
                          my: 1.5,
                        }}
                      >
                        <Typography fontWeight={600}>
                          {log.type === "submission" ? "Submitted work" : null}
                          {log.type === "review" ? "Requested Changes" : null}
                          {log.type === "accepted"
                            ? "Accepted submission"
                            : null}
                        </Typography>
                        {log.message && (
                          <Typography sx={{ mt: 2 }}>{log.message}</Typography>
                        )}
                      </Box>
                    </Box>
                  ))
                : null}
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
}

// export const getServerSideProps: GetServerSideProps<{
//   bounty: { data: IBounty; id: string };
// }> = async (context) => {
//   try {
//     const { id } = context.query;

//     const req = await axios.get(`${process.env.SERVER_URL}/bounties/${id}`);
//     let bounty = req.data;

//     if (req.status !== 200) {
//       return {
//         redirect: {
//           destination: "/404",
//           permanent: false,
//         },
//       };
//     }

//     return { props: { bounty } };
//   } catch (error) {
//     return {
//       redirect: {
//         destination: "/404",
//         permanent: false,
//       },
//     };
//   }
// };

export const getServerSideProps: GetServerSideProps<{
  bounty: { data: IBounty; id: string };
}> = async (context) => {
  const { id } = context.query;

  const db = new WeaveDB({
    contractTxId: process.env.NEXT_PUBLIC_WEAVEDB_ContractTxId,
  });
  await db.init();
  let bounties: Promise<{ data: IBounty; id: string }[]> = await db.cget(
    "bounties",
    ["txId", "==", id]
  );
  if (!(await bounties).length) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  let bounty = (await bounties)[0];

  return {
    props: {
      bounty: {
        data: bounty.data,
        id: bounty.id,
      },
    },
  };
};
