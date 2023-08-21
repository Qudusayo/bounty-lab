import React, { useEffect, useState } from "react";
import { BsChevronDown, BsPlusLg } from "react-icons/bs";
import { Box, Typography } from "@mui/material";
import { Container } from "@/components/Utils";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { BsUpload } from "react-icons/bs";
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlineChecklistRtl } from "react-icons/md";
import BountyCard from "@/components/BountyCard";
import Select, { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { Input } from "@mui/joy";
import CreateBounty from "@/components/CreateBounty";
import { useAppContext } from "@/context/AppContext";
import { Bounty } from "@/types";

export default function Bounties() {
  const [value, setValue] = React.useState("1");
  const [allBounties, setAllBounties] = useState<
    { data: Bounty; id: string }[]
  >([]);
  const [postedBounties, setPostedBounties] = useState<
    { data: Bounty; id: string }[]
  >([]);
  const [assignedBounties, setAssignedBounties] = useState<
    { data: Bounty; id: string }[]
  >([]);
  const {
    address,
    bounties,
    statusSort,
    orderSort,
    setStatusSort,
    setOrderSort,
  } = useAppContext();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (bounties) {
      setAllBounties(bounties);
      setPostedBounties(
        bounties.filter((bounty) => bounty.data.issuer === address)
      );
      // Assginned bounties is such where applications is an array of object which one of it includes object of hunter address
      setAssignedBounties(
        bounties.filter((bounty) =>
          bounty.data.applications?.some(
            (application) => application.hunter === address
          )
        )
      );
    }
  }, [bounties]);

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
        flexDirection={["column", "column", "row"]}
      >
        <div>
          <Typography
            variant="h4"
            sx={{
              fontSize: "1.9rem",
              fontWeight: 500,
            }}
          >
            {value === "1" && "Bounties"}
            {value === "2" && "Your posted Bounties"}
            {value === "3" && "Your Assigned Bounties"}
          </Typography>
          <Typography variant="h6">
            {value === "1" &&
              "Work with top problem solvers to bring your ideas to life."}
            {value === "2" && "View Bounties that you have posted."}
            {value === "3" && "View Bounties that you have applied for."}
          </Typography>
        </div>
        <CreateBounty />
      </Box>
      <Box sx={{ width: "100%", typography: "body1" }}>
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
                icon={<MdOutlineChecklistRtl size={20} />}
                iconPosition="start"
                disableRipple={true}
                label="All bounties"
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
                icon={<BsUpload size={15} />}
                iconPosition="start"
                disableRipple={true}
                label={"Posted bounties"}
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
                icon={<IoPersonOutline size={15} />}
                iconPosition="start"
                disableRipple={true}
                label={"Assigned bounties"}
                value="3"
              />
            </TabList>
          </Box>
          <Box
            display={"flex"}
            flexDirection={["column", "column", "row"]}
            gap={1}
            alignItems={"center"}
            justifyContent={"space-between"}
            my={2}
          >
            <Input
              disabled={false}
              size="sm"
              placeholder="Search for bounty"
              sx={{
                minWidth: ["100%", "100%", 400],
              }}
            />
            <Box
              display={"flex"}
              gap={1}
              flexDirection={["column", "column", "row"]}
              width={[1, 1, "auto"]}
            >
              <Select
                placeholder="Select a pet…"
                size="sm"
                indicator={<BsChevronDown />}
                sx={{
                  minWidth: ["100%", "100%", 150],
                  minHeight: "2.25em",
                  [`& .${selectClasses.indicator}`]: {
                    transition: "0.2s",
                    [`&.${selectClasses.expanded}`]: {
                      transform: "rotate(-180deg)",
                    },
                  },
                }}
                value={orderSort}
                onChange={(_, value) => {
                  value !== null && setOrderSort(value);
                }}
              >
                {/* <Option value="application">Sort By Application</Option> */}
                <Option value="createdAt">Sort By Posting Date</Option>
                <Option value="reward">Sort By Reward</Option>
              </Select>
              <Select
                placeholder="Select a pet…"
                size="sm"
                indicator={<BsChevronDown />}
                sx={{
                  minWidth: ["100%", "100%", 160],
                  minHeight: "2.25em",
                  [`& .${selectClasses.indicator}`]: {
                    transition: "0.2s",
                    [`&.${selectClasses.expanded}`]: {
                      transform: "rotate(-180deg)",
                    },
                  },
                }}
                value={statusSort}
                onChange={(_, value) => {
                  value !== null && setStatusSort(value);
                }}
              >
                <Option value="">All Bounties</Option>
                <Option value="open">Open Bounties</Option>
                <Option value="in progress">In Progress Bounties</Option>
                <Option value="completed">Completed Bounties</Option>
                <Option value="cancelled">Cancelled Bounties</Option>
              </Select>
            </Box>
          </Box>
          <TabPanel
            value="1"
            sx={{
              p: 0,
            }}
          >
            {allBounties.length
              ? bounties.map(({ data: bounty }, id) => (
                  <BountyCard key={id} {...bounty} />
                ))
              : null}
          </TabPanel>
          <TabPanel
            sx={{
              p: 0,
            }}
            value="2"
          >
            {postedBounties.length ? (
              postedBounties.map(({ data: bounty }, id) => (
                <BountyCard key={id} {...bounty} />
              ))
            ) : (
              <Box
                sx={{
                  border: "1px dashed #70788c50",
                  width: ["100%", "100%", "fit-content"],
                  mx: "auto",
                  my: "2em",
                  px: [3, 3, 6],
                  py: 4,
                  borderRadius: "5px",
                  textAlign: "center",
                }}
              >
                <Typography variant="body1">
                  You haven&apos;t posted any Bounties yet.
                </Typography>
              </Box>
            )}
          </TabPanel>
          <TabPanel
            sx={{
              p: 0,
            }}
            value="3"
          >
            {assignedBounties.length ? (
              assignedBounties.map(({ data: bounty }, id) => (
                <BountyCard key={id} {...bounty} />
              ))
            ) : (
              <Box
                sx={{
                  border: "1px dashed #70788c50",
                  width: ["100%", "100%", "fit-content"],
                  mx: "auto",
                  my: "2em",
                  px: [3, 3, 6],
                  py: 4,
                  borderRadius: "5px",
                  textAlign: "center",
                }}
              >
                <Typography variant="body1">
                  You aren&apos;t working on any Bounties yet.
                </Typography>
              </Box>
            )}
          </TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
}
