import { Box } from "@mui/material";

export default function Home() {
  return (
    <Box bgcolor={"white"} pt={12} pb={12} borderRadius={1.5}>
      <p id="index-page">
        This is a demo for React Router.
        <br />
        Check out{" "}
        <a href="https://reactrouter.com">the docs at reactrouter.com</a>.
      </p>
    </Box>
  );
}
