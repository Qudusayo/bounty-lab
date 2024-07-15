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
import { BountyApplication, Bounty as IBounty } from "@/types";
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
import { useBountyDetail } from "@/hooks/useBountyDetail";
import { useAccount } from "wagmi";

export default function Bounty({
  bounty: _bounty,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { mode } = useJoyColorScheme();
  const { address } = useAccount();
  // const [bounty, setBounty] = useState(_bounty.data);
  const [value, setValue] = useState("1");
  // const { address, fetchBounty } = useAppContext();
  // const [isHunter, setIsHunter] = useState(false);
  // const [isCreator, setIsCreator] = useState(false);
  // const [isOpenBounty, setIsOpenBounty] = useState(false);
  // const [isCompletedBounty, setIsCompletedBounty] = useState(false);
  const [common, setCommon] = useState("#ffffff");
  // const [bountyDescription, setBountyDescription] = useState<string | null>(
  //   null
  // );

  const {
    bountyMeta,
    reward,
    deadline,
    creator,
    status,
    createdAt,
    acceptedApplicant,
    applicants,
    communicationValue,
    communicationMethod,
    applications,
    isSubmitted,
    isRequestChange,
    refreshBountyData,
  } = useBountyDetail(_bounty.address);

  const isCreator = address === creator;
  const isOpenBounty = status === "open";
  const isCompletedBounty = status === "completed";
  const isHunter = address === acceptedApplicant;

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

  // useEffect(() => {
  //   setIsHunter(address === bounty.hunter);
  //   setIsCreator(address === bounty.issuer);
  //   setIsOpenBounty(bounty.status === "open");
  //   setIsCompletedBounty(bounty.status === "completed");
  // }, [address, bounty]);

  // useEffect(() => {
  //   const fetchBountyDescription = async () => {
  //     const { data } = await axios.get(
  //       `https://ipfs.io/ipfs/${bounty.descriptionIPFSHash}`
  //     );
  //     setBountyDescription(data);
  //   };
  //   fetchBountyDescription();
  // });

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
            Earn {format(reward ? Number(reward) / 10 ** 18 : 0)}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <LuClock4 />
            <Typography level="body-sm" sx={{ ml: 1 }}>
              due {formatTimestamp(deadline ? Number(deadline) : 0)}
            </Typography>
            <BsDot size={20} />
            <Chip size="sm" color={ChipData[status].color as any}>
              {ChipData[status].status}
            </Chip>
          </Box>
        </Box>
        <Typography level="h3" my={".75em"}>
          {bountyMeta.title}
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
            <Avatar address={creator as string} />
            <Typography level="body-sm">
              {shortenAddress(creator as string)}
            </Typography>
            <BsDot size={20} />
            <Typography level="body-sm">
              Posted{" "}
              {formatTimestamp(
                createdAt ? Number(createdAt) * 1000 : Date.now()
              )}
            </Typography>
          </Box>
          <Box display={"flex"} alignItems={"center"} gap={".5rem"}>
            <ShareModal
              title={bountyMeta.title}
              reward={format(Number(reward ? Number(reward) / 10 ** 18 : 0))}
            />
            {isHunter && (
              <AbandonBounty
                refetchBounty={refreshBountyData}
                bountyId={_bounty.address}
              />
            )}
            {isCreator && isOpenBounty && (
              <CancelBounty
                refetchBounty={refreshBountyData}
                bountyId={_bounty.address}
              />
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
                refetchBounty={refreshBountyData}
                bountyId={_bounty.address}
                bountyMeta={_bounty.address}
                communication={{
                  method: communicationMethod as "email" | "discord",
                  value: communicationValue as string,
                }}
                createdAt={createdAt as number}
                deadline={deadline as number}
                hunter={acceptedApplicant as `0x${string}`}
                issuer={creator as `0x${string}`}
                reward={Number(reward) / 10 ** 18}
                status={
                  status as "open" | "in progress" | "completed" | "cancelled"
                }
                applications={applications as []}
              />
            ) : (
              isHunter &&
              !isCompletedBounty && (
                <SubmitWork
                  refetchBounty={refreshBountyData}
                  bountyId={_bounty.address}
                />
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
                      {applicants ?? 0}
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
            {status === "completed" && (
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
            {bountyMeta.description ? (
              <Box px={3} py={1} borderRadius={12} bgcolor={common}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {bountyMeta.description.replace(/^(.*)$/gm, "$1  ")}
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
            {!applicants && (
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
            {(applications as BountyApplication[])?.map((application, i) => (
              <ApplicationCard
                key={i}
                isOpenBounty={isOpenBounty}
                bountyId={_bounty.address}
                refetch={refreshBountyData}
                issuer={creator as `0x${string}`}
                acceptedHunter={acceptedApplicant as `0x${string}`}
                applicant={application.applicant as `0x${string}`}
                applicationDate={application.applicationDate as number}
                applicationText={application.applicationText as string}
                communicationValue={application.communicationValue as string}
                isAccepted={application.isAccepted as boolean}
                isRejected={application.isRejected as boolean}
                index={i}
              />
            ))}
          </TabPanel>
          <TabPanel
            sx={{
              px: 0,
            }}
            value="3"
          >
            {!!isSubmitted && (
              <Box
                sx={{
                  backgroundColor: common,
                  p: 3,
                  borderRadius: 6,
                  mb: 2,
                  border: isCompletedBounty ? "1px solid #00A11B" : "",
                  boxShadow: isCompletedBounty
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
                    {shortenAddress((acceptedApplicant as string) ?? "")}{" "}
                    submitted work!
                  </Typography>
                  {/* <MuiLink
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
                  </MuiLink> */}
                </Box>

                {isCreator && !!acceptedApplicant && !isCompletedBounty && (
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
                      bountyId={_bounty.address}
                      refetchBounty={refreshBountyData}
                    />
                    <AcceptSubmission
                      bountyId={_bounty.address}
                      hunter={acceptedApplicant as `0x${string}`}
                      refetchBounty={refreshBountyData}
                    />
                  </Box>
                )}
              </Box>
            )}
            {!!isRequestChange ||
              (!!isSubmitted && isHunter && !isCompletedBounty && (
                <Box
                  sx={{
                    backgroundColor: common,
                    p: 3,
                    borderRadius: 6,
                    mb: 2,
                    border: !!isRequestChange ? "1px solid #a19600" : "",
                    boxShadow: !!isRequestChange
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
                        : shortenAddress(
                            (acceptedApplicant as string) ?? ""
                          )}{" "}
                      request some changes!
                    </Typography>
                    {!isCreator && (
                      <SubmitWork
                        refetchBounty={refreshBountyData}
                        bountyId={_bounty.address}
                      />
                    )}
                  </Box>
                  {/* <Typography>{bounty.submissionFeedback}</Typography> */}
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
                    {communicationMethod === "discord" ? (
                      <BsDiscord size={20} />
                    ) : (
                      <BsFillEnvelopeFill size={20} />
                    )}
                    <Typography>{communicationValue as string}</Typography>
                  </Box>
                  <Typography level="body-sm" sx={{ mt: 2 }}>
                    Bounty Hunter
                  </Typography>
                  {acceptedApplicant ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        my: 1,
                      }}
                    >
                      {communicationMethod === "discord" ? (
                        <BsDiscord size={20} />
                      ) : (
                        <BsFillEnvelopeFill size={20} />
                      )}
                      <Typography>
                        {
                          (applications as BountyApplication[])?.find(
                            (application) =>
                              application.applicant === acceptedApplicant
                          )?.communicationValue
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
              {/* {bounty.submissions && bounty.submissions.length
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
                : null} */}
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps<{
  bounty: { address: `0x${string}` };
}> = async (context) => {
  const { id } = context.query;

  return {
    props: {
      bounty: {
        address: id as `0x${string}`,
      },
    },
  };
};
