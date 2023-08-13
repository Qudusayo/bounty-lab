import type { AppProps } from "next/app";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import celoGroups from "@celo/rainbowkit-celo/lists";
import Layout from "../Layout/Layout";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { publicProvider } from "wagmi/providers/public";
import { Alfajores, Celo } from "@celo/rainbowkit-celo/chains";
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import { CssBaseline } from "@mui/joy";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AppProvider } from "@/context/AppContext";
import joyTheme from "@/theme/joytheme";
import Router from "next/router";
import NProgress from "nprogress";

// Router Events
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const materialTheme = materialExtendTheme();

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID as string;

const { chains, publicClient } = configureChains(
  [Celo, Alfajores],
  [publicProvider()]
);

const connectors = celoGroups({
  chains,
  projectId,
  appName: (typeof document === "object" && document.title) || "Your App Name",
});

const appInfo = {
  appName: "Celo Composer",
};

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient: publicClient,
});

function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        appInfo={appInfo}
        coolMode={true}
        modalSize="compact"
      >
        <AppProvider>
          <MaterialCssVarsProvider
            theme={{ [MATERIAL_THEME_ID]: materialTheme }}
          >
            <JoyCssVarsProvider defaultMode="dark" theme={joyTheme}>
              <CssBaseline />
              <Layout>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Component {...pageProps} />
                </LocalizationProvider>
              </Layout>
            </JoyCssVarsProvider>
          </MaterialCssVarsProvider>
        </AppProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
