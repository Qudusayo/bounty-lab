import React from "react";
import { Box, Typography, Avatar, Link as MuiLink, Card } from "@mui/joy";
import { LuClock4 } from "react-icons/lu";
import Chip from "@mui/joy/Chip";
import { BsDot } from "react-icons/bs";
import { BsPerson } from "react-icons/bs";
import Link from "next/link";

export const ChipData = {
  open: { color: "primary", status: "Open" },
  "in-progress": { color: "warning", status: "In Progress" },
  completed: { color: "success", status: "Completed" },
  cancelled: { color: "neutral", status: "Cancelled" },
};

export default function BountyCard({
  id,
  status,
  title,
  price,
  applicants,
  description,
}: {
  id: string;
  price: number;
  title: string;
  applicants: number;
  description: string;
  status: "open" | "in-progress" | "completed" | "cancelled";
}) {
  const { format } = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

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
          US{format(price)}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.275rem",
          }}
        >
          <LuClock4 />
          <Typography level="body-sm">due in 15 days</Typography>
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
          href={"/bounties/" + id}
          textColor="inherit"
          underline="none"
          fontWeight="md"
        >
          {title}
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
        {description}
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
          <Avatar color="primary" variant="solid" size="sm" />
          <Typography level="body-sm">Qudusayo</Typography>
          <BsDot size={20} />
          <Typography level="body-sm">26 minutes ago</Typography>
        </Box>
        {status === "in-progress" || status === "completed" ? (
          <Box display={"flex"} alignItems={"center"} gap={".5rem"}>
            <Typography level="body-sm">Claimed by</Typography>
            <Avatar
              color={ChipData[status].color as any}
              variant="solid"
              size="sm"
            />
            <Typography level="body-sm">Qudusayo</Typography>
          </Box>
        ) : (
          <Box display={"flex"} alignItems={"center"} gap={".5rem"}>
            <BsPerson size={20} />
            <Typography level="body-sm">
              {applicants === 0
                ? "No applicants yet"
                : `${applicants} applicant${applicants > 1 ? "s" : ""}`}
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
}
