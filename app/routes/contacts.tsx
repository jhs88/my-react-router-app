import {
  Box,
  Button,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect } from "react";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  redirect,
  useMatches,
  useNavigation,
  useSubmit,
} from "react-router";
import type { Route } from "./+types/contacts";

import { createEmptyContact, getContacts } from "~/api/data";

const SearchInput = styled(TextField)(({ theme }) => ({
  color: "inherit",
  boxSizing: "border-box",
  width: "100%",
  "& .MuiInputBase-input": {
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='%23999' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' /%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "0.75rem 1rem",
    backgroundSize: "1.5rem",
    position: "relative",
  },
}));

export const useRootLoaderData = () => {
  const [root] = useMatches();
  return root?.data as unknown;
};

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
}

export async function action() {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
  const { contacts, q } = loaderData;
  const navigation = useNavigation();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");
  const submit = useSubmit();

  // If you click back after a search,
  // the form field still has the value
  // you entered even though the list is no longer filtered.
  // useEffect is used to manipulate the input's value in the DOM directly.
  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q ?? "";
    }
  }, [q]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Box
          component="nav"
          sx={{
            justifyContent: "center",
          }}
        >
          <MuiLink component={Link} to="/contacts">
            <Typography variant="h3" gutterBottom>
              React Router Contacts
            </Typography>
          </MuiLink>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "baseline",
            }}
          >
            <Form
              id="search-form"
              onChange={(event) => {
                const isFirstSearch = q === null;
                submit(event.currentTarget, { replace: !isFirstSearch });
              }}
              role="search"
            >
              <Stack
                spacing={2}
                sx={{
                  alignItems: "center",
                }}
              >
                <SearchInput
                  id="q"
                  name="q"
                  aria-label="Search contacts"
                  className={searching ? "loading" : ""}
                  defaultValue={q ?? ""}
                  placeholder="Search"
                  type="search"
                />
                {searching && (
                  <CircularProgress aria-hidden id="search-spinner" />
                )}
              </Stack>
            </Form>
            <Form method="post">
              <Button variant="outlined" type="submit">
                New
              </Button>
            </Form>
          </Stack>
          <List hidden={searching}>
            {contacts.length ? (
              contacts.map((contact) => (
                <ListItemButton
                  key={contact.id}
                  component={NavLink}
                  to={`${contact.id}`}
                >
                  <ListItemText>
                    {contact.first ?? ""} {contact.last ?? ""}
                  </ListItemText>
                  {contact.favorite && <Typography variant="h5">★</Typography>}
                </ListItemButton>
              ))
            ) : (
              <ListItem>
                <ListItemText>No contacts</ListItemText>
              </ListItem>
            )}
          </List>
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        md={8}
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className={
            navigation.state === "loading" && !searching ? "loading" : ""
          }
          id="detail"
        >
          <Outlet />
        </div>
      </Grid>
    </Grid>
  );
}
