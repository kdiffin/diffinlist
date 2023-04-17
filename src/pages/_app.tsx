import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Sidebar from "~/components/Sidebar";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar /> <Component {...pageProps} />
    </div>
  );
};

export default api.withTRPC(MyApp);
