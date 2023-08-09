import { Container } from "@/components/Utils";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Link as MuiLink,
  Typography,
} from "@mui/joy";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { GoPeople, GoLock } from "react-icons/go";
import { HiOutlineBookOpen } from "react-icons/hi";
import { BsDot } from "react-icons/bs";
import { FiUserPlus } from "react-icons/fi";
import { LuClock4 } from "react-icons/lu";
import { ChipData } from "@/components/BountyCard";
import { TbBrandStackshare } from "react-icons/tb";
import ApplyBounty from "@/components/ApplyBounty";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

const markdown = `# 1.1 Objective
The primary goal is to develop a Minimum Viable Product (MVP) in the form of a web service for a highly personalized financial management assistant aimed at young professionals entering the workforce.

# 1.2 Target Audience
Young professionals
Individuals interested in personalized financial management

# 2. Functional Requirements
2.1 User Interface (UI)
Interactive Chat Interface: A conversational UI that allows users to interact with the AI bot.
Dashboard: A visual representation of the user's financial status, goals, and progress.
Navigation Menu: Easy navigation to different sections like budgeting, investments, savings, etc.
2.2 AI Chatbot Features
Financial Analysis:
Income and Expense Tracking
Debt Management
Investment Analysis
Personalized Financial Goals Setting:
Short-term and Long-term Goals
Customizable Budget Plans
Notifications and Reminders
Financial Tips and Advice:
Personalized Recommendations
Integration with Financial News and Trends
Educational Content and Tutorials
FAQ and Automated Responses:
Predefined Answers to Common Questions
Natural Language Processing for User Queries

# 3. Technical Stack
3.1 Frontend
Language: JavaScript
Framework: React.js
Libraries: Redux, Axios
3.2 Backend
Language: Python
Framework: Django
Database: PostgreSQL
AI Engine: TensorFlow, PyTorch
3.3 Infrastructure
Cloud Service: AWS
Version Control: Git
CI/CD: Jenkins`;

export default function Bounty() {
  const [value, setValue] = React.useState("1");
  const [status, setStatus] = React.useState<
    "open" | "in-progress" | "completed" | "cancelled"
  >("open");

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const { format } = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
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
        bgcolor={"white"}
        mb={4}
        startDecorator={<IoArrowBack />}
        sx={{
          transition: "all .2s ease-in-out",
          "&:hover": {
            bgcolor: "neutral.100",
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
            Earn {format(1000)}
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
        <Typography level="h3" my={".75em"}>
          Create an Expo config plugin for react-native-line
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
            <Typography level="body-sm">Posted 26 minutes ago</Typography>
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
                        backgroundColor: "#ffffff",
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
            <Box px={3} py={1} borderRadius={12} bgcolor={"#ffffff"}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown.replace(/^(.*)$/gm, "$1  ")}
              </ReactMarkdown>
            </Box>
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
                backgroundColor: "#ffffff",
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
