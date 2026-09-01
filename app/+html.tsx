import { ScrollViewStyleReset } from "expo-router/html";
import { PropsWithChildren } from "react";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta
          name="description"
          content="DistrictForge brings school facilities, work orders, assets, inspections, purchasing, and budgets into one operational system."
        />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="application-name" content="DistrictForge" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body, #root { background: #FFFFFF !important; color-scheme: light; min-height: 100%; }
              body { margin: 0; overscroll-behavior-y: none; }
              * { box-sizing: border-box; }
              button, input, textarea { font: inherit; }
              ::selection { background: #BFD9FA; color: #10233D; }
            `,
          }}
        />
        <ScrollViewStyleReset />
        <title>DistrictForge | School Facilities Operations</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
