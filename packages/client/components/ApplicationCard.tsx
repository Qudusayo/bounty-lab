import { Box, Button, Typography } from "@mui/joy";
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
  issuer: `0x${string}`;
}

export default function ApplicationCard(application: ApplicationCardProps) {
  const { mode } = useColorScheme();
  const { address } = useAppContext();
  const [common, setCommon] = useState("#ffffff");
  const [applicationMessage, setApplicationMessage] = useState("");
  const [isCreator, setIsCreator] = useState(false);

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

  return (
    <Box px={3} py={1} my={2} borderRadius={"md"} bgcolor={common}>
      <Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Box display={"flex"} alignItems={"center"} gap={".5rem"} my={3}>
            <Avatar address={application.hunter} />
            <Typography level="body-sm">
              {shortenAddress(application.hunter)}
            </Typography>
          </Box>
          {isCreator && (
            <Box display={"flex"} alignItems={"center"} gap={".5rem"}>
              <Button variant="soft" color="danger">
                <IoMdClose size={20} color="#000z" />
              </Button>
              <Button
                variant="solid"
                color="primary"
                startDecorator={<IoMdCheckmark />}
                onClick={() => {}}
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
