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
  Typography,
} from "@mui/material";
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
import { SearchInput } from "~/sections/Search/styled";

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
        <Outlet />
      </Grid>
    </Grid>
  );
}
