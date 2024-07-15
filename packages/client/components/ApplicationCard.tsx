import { Box, Button, Chip, Typography } from "@mui/joy";
import React from "react";
import { useColorScheme } from "@mui/joy/styles";
import { useEffect, useState } from "react";
import { BountyApplication } from "@/types";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatTimestamp, shortenAddress } from "@/functions";
import Avatar from "@/utils/Avatar";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import { useAppContext } from "@/context/AppContext";
import { useBountyDetail } from "@/hooks/useBountyDetail";
import { useBountyHandler } from "@/hooks/useBountyHandler";

interface ApplicationCardProps extends BountyApplication {
  bountyId: `0x${string}`;
  issuer: `0x${string}`;
  refetch: () => void;
  isOpenBounty: boolean;
  acceptedHunter: `0x${string}` | null;
  index: number;
}

export default function ApplicationCard(application: ApplicationCardProps) {
  const { mode } = useColorScheme();
  const { address } = useAppContext();
  const [common, setCommon] = useState("#ffffff");
  const [applicationMessage, setApplicationMessage] = useState("");
  const [isCreator, setIsCreator] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);
  const { refreshBountyData } = useBountyDetail(application.bountyId);
  const { acceptApplication, rejectApplication } = useBountyHandler(
    application.bountyId
  );

  useEffect(() => {
    setIsCreator(application.issuer === address);
  }, [application.issuer, address]);

  useEffect(() => {
    const fetchApplicationMessage = async () => {
      try {
        const { data } = await axios.get(
          `https://ipfs.io/ipfs/${application.applicationText}`
        );
        setApplicationMessage(data);
      } catch (error) {
        console.log("Error fetching application message", error);
      }
    };
    fetchApplicationMessage();
  }, [application.applicationText]);

  useEffect(() => {
    if (mode === "light") {
      setCommon("#ffffff");
    } else {
      setCommon("neutral.900");
    }
  }, [mode]);

  const acceptApplicant = async () => {
    setAccepting(true);
    await acceptApplication(application.index, refreshBountyData);
    setAccepting(false);
  };

  const declineApplicant = async () => {
    setDeclining(true);
    await rejectApplication(application.index, refreshBountyData);
    application.refetch();
    setDeclining(false);
  };

  return (
    <Box px={3} py={1} my={2} borderRadius={"md"} bgcolor={common}>
      <Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Box display={"flex"} alignItems={"center"} gap={".5rem"} my={3}>
            <Box display={"flex"} alignItems={"center"} gap={".5rem"}>
              <Avatar address={application.applicant} />
              <Typography level="body-sm">
                {shortenAddress(application.applicant)}
              </Typography>
            </Box>
            {application.isAccepted && (
              <Chip
                startDecorator={<IoMdCheckmark />}
                size="sm"
                color="primary"
              >
                Accepted
              </Chip>
            )}
            {application.isRejected && (
              <Chip startDecorator={<IoMdCheckmark />} size="sm" color="danger">
                Rejected
              </Chip>
            )}
          </Box>
          {isCreator && application.isOpenBounty && !application.isRejected && (
            <Box display={"flex"} alignItems={"center"} gap={".5rem"}>
              <Button
                variant="soft"
                color="danger"
                onClick={declineApplicant}
                loading={declining}
                disabled={declining}
              >
                <IoMdClose size={20} color="#000z" />
              </Button>
              <Button
                variant="solid"
                color="primary"
                startDecorator={<IoMdCheckmark />}
                onClick={acceptApplicant}
                loading={accepting}
                disabled={accepting}
              >
                Accept Application
              </Button>
            </Box>
          )}
        </Box>
        <Typography>
          Applied {formatTimestamp(Number(application.applicationDate) * 1000)}
        </Typography>
      </Box>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {applicationMessage.replace(/^(.*)$/gm, "$1  ")}
      </ReactMarkdown>
    </Box>
  );
}
