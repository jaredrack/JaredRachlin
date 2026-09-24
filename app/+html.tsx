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
          content="Jared Rachlin is an independent product builder. Dad, night-shift worker, and self-taught maker of DistrictForge and Dadmark."
        />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="application-name" content="Jared Rachlin" />
        <meta property="og:title" content="Jared Rachlin | Independent Product Builder" />
        <meta
          property="og:description"
          content="Practical software built around problems worth solving — DistrictForge and Dadmark."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jaredrachlin.dev" />
        <meta property="og:image" content="https://jaredrachlin.dev/jared-rachlin-portrait.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Jared Rachlin | Independent Product Builder" />
        <meta
          name="twitter:description"
          content="Practical software built around problems worth solving."
        />
        <meta name="twitter:image" content="https://jaredrachlin.dev/jared-rachlin-portrait.jpg" />
        <link rel="canonical" href="https://jaredrachlin.dev" />
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
        <title>Jared Rachlin | Independent Product Builder</title>
      </head>
      <body>{children}</body>
    </html>
  );
}