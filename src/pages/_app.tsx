import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Sidebar from "~/components/Sidebar";
import { ClerkProvider } from "@clerk/nextjs";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="flex min-h-screen">
      <ClerkProvider {...pageProps}>
        <Sidebar /> <Component {...pageProps} />
      </ClerkProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
