import { Box } from "@mui/material";
import type { LinksFunction } from "react-router";
import appStylesHref from "~/styles/app.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

export default function Home() {
  return (
    <Box bgcolor={"white"} p={5}>
      <p id="index-page">
        This is a demo for React Router.
        <br />
        Check out{" "}
        <a href="https://reactrouter.com">the docs at reactrouter.com</a>.
      </p>
    </Box>
  );
}
