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

interface ApplicationCardProps extends BountyApplication {
  bountyId: string;
  issuer: `0x${string}`;
  refetch: () => void;
  acceptedHunter: `0x${string}` | null;
}

export default function ApplicationCard(application: ApplicationCardProps) {
  const { mode } = useColorScheme();
  const { address, acceptApplication, declineApplicantion } = useAppContext();
  const [common, setCommon] = useState("#ffffff");
  const [applicationMessage, setApplicationMessage] = useState("");
  const [isCreator, setIsCreator] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);

  useEffect(() => {
    setIsCreator(application.issuer === address);
  }, [application.issuer, address]);

  useEffect(() => {
    const fetchApplicationMessage = async () => {
      const { data } = await axios.get(
        `https://ipfs.io/ipfs/${application.applicationMessage}`
      );
      setApplicationMessage(data);
    };
    fetchApplicationMessage();
  }, [application.applicationMessage]);

  useEffect(() => {
    if (mode === "light") {
      setCommon("#ffffff");
    } else {
      setCommon("neutral.900");
    }
  }, [mode]);

  const acceptApplicant = async (address: `0x${string}`) => {
    setAccepting(true);
    await acceptApplication(application.bountyId, address);
    application.refetch();
    setAccepting(false);
  };

  const declineApplicant = async (address: `0x${string}`) => {
    setDeclining(true);
    await declineApplicantion(application.bountyId, address);
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
              <Avatar address={application.hunter} />
              <Typography level="body-sm">
                {shortenAddress(application.hunter)}
              </Typography>
            </Box>
            {application.acceptedHunter === application.hunter && (
              <Chip
                startDecorator={<IoMdCheckmark />}
                size="sm"
                color="primary"
              >
                Accepted
              </Chip>
            )}
            {application.status === "rejected" && (
              <Chip startDecorator={<IoMdCheckmark />} size="sm" color="danger">
                Rejected
              </Chip>
            )}
          </Box>
          {isCreator &&
            !application.acceptedHunter &&
            application.status !== "rejected" && (
              <Box display={"flex"} alignItems={"center"} gap={".5rem"}>
                <Button
                  variant="soft"
                  color="danger"
                  onClick={() => declineApplicant(application.hunter)}
                  loading={declining}
                  disabled={declining}
                >
                  <IoMdClose size={20} color="#000z" />
                </Button>
                <Button
                  variant="solid"
                  color="primary"
                  startDecorator={<IoMdCheckmark />}
                  onClick={() => acceptApplicant(application.hunter)}
                  loading={accepting}
                  disabled={accepting}
                >
                  Accept Application
                </Button>
              </Box>
            )}
        </Box>
        <Typography>
          Applied {formatTimestamp(application.timestamp)}
        </Typography>
      </Box>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {applicationMessage.replace(/^(.*)$/gm, "$1  ")}
      </ReactMarkdown>
    </Box>
  );
}
