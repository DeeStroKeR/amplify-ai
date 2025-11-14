import { cookies } from "next/headers";
import { ColorMode } from "@aws-amplify/ui-react";
import { ThemeStyle } from "@aws-amplify/ui-react/server";
import { ConfigureAmplify } from "./ConfigureAmplify";
import { theme } from "@/theme";
import { Layout } from "@/components/Layout";
import { ConditionalSidebar } from "@/components/ConditionalSidebar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const colorMode = (cookieStore.get("colorMode")?.value ??
    "light") as ColorMode;
  return (
    <html lang="en">
      <body {...theme.containerProps({ colorMode })}>
        <Layout>
          <ConfigureAmplify />

          <ConditionalSidebar colorMode={colorMode} />

          {children}
        </Layout>
        <ThemeStyle theme={theme} />
      </body>
    </html>
  );
}
