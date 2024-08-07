import React, { useEffect, useState } from "react";
import { Box, Typography, Link as MuiLink, Card } from "@mui/joy";
import { LuClock4 } from "react-icons/lu";
import Chip from "@mui/joy/Chip";
import { BsDot } from "react-icons/bs";
import { BsPerson } from "react-icons/bs";
import Link from "next/link";
import { formatTimestamp, shortenAddress } from "@/functions";
import Avatar from "@/utils/Avatar";
import { useBountyDetail } from "@/hooks/useBountyDetail";

export const ChipData = {
  open: { color: "primary", status: "Open" },
  "in progress": { color: "warning", status: "In Progress" },
  completed: { color: "success", status: "Completed" },
  cancelled: { color: "neutral", status: "Cancelled" },
};

export default function BountyCard({ address }: { address: `0x${string}` }) {
  const { format } = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const {
    bountyMeta,
    reward,
    deadline,
    creator,
    status,
    createdAt,
    acceptedApplicant,
    applicants,
    shortDescription,
  } = useBountyDetail(address);

  return (
    <Card
      sx={{
        borderRadius: "5px",
        padding: "1rem",
        m: 0,
        marginBottom: "1rem",
        cursor: "pointer",
        border: "1px solid #4E556950",
        transition: "border 0.2s ease-in-out",
        gap: "0.25rem",
        "&:hover": {
          border: "1px solid #4E556980",
        },
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.05)",
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
        <Typography level="h4" color="success">
          US{format(reward ? Number(reward) / 10 ** 18 : 0)}
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
            due {formatTimestamp(deadline ? Number(deadline) : 0)}
          </Typography>
          <BsDot size={20} />
          <Chip size="sm" color={ChipData[status].color as any}>
            {ChipData[status].status}
          </Chip>
        </Box>
      </Box>
      <Typography level="body-lg" my={".75em"}>
        <MuiLink
          component={Link}
          overlay
          href={"/bounties/" + address}
          textColor="inherit"
          underline="none"
          fontWeight="md"
        >
          {bountyMeta.title}
        </MuiLink>
      </Typography>
      <Typography
        level="body-md"
        sx={{
          fontSize: "0.875rem",
          width: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {shortDescription}
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
          <Avatar address={(acceptedApplicant as string) ?? ""} />
          <Box display={"flex"} alignItems={"center"}>
            <Typography level="body-sm">
              {shortenAddress((creator as string) ?? "")}
            </Typography>
            <BsDot size={20} />
            <Typography level="body-sm">
              {formatTimestamp(createdAt ? Number(createdAt) * 1000 : 0)}
            </Typography>
          </Box>
        </Box>
        {status === "in progress" || status === "completed" ? (
          <Box display={"flex"} alignItems={"center"} gap={".5rem"}>
            <Typography level="body-sm">Claimed by</Typography>
            <Avatar address={(creator as string) ?? ""} />
            <Typography level="body-sm">
              {shortenAddress((acceptedApplicant as string) || "")}
            </Typography>
          </Box>
        ) : (
          <Box display={"flex"} alignItems={"center"} gap={".5rem"}>
            <BsPerson size={20} />
            <Typography level="body-sm">
              {applicants
                ? applicants === 0
                  ? "No applicants yet"
                  : `${applicants} applicant${applicants > 1 ? "s" : ""}`
                : "No applicants yet"}
              {}
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
}
