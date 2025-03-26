import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import React, { useMemo, useState } from "react";

import "./styles.scss";

/**
 * Renders a flip card component with a front and back side.
 *
 * @example
 *   <FlipCard FrontCard={<FrontComponent />} BackCard={<BackComponent />} />;
 */
export default function FlipCard({
  width,
  className,
  FrontCard,
  BackCard,
  isFlipped,
  onFlip,
  ...props
}: FlipCardComponentProps) {
  const { FrontCard: Front, BackCard: Back } = useMemo(
    () => ({ FrontCard, BackCard }),
    [FrontCard, BackCard],
  );

  const [switched, setSwitched] = useState(isFlipped ?? false);

  return (
    <Box
      className={`flip-card${switched ? " is-switched" : ""}`}
      sx={{
        width: width ?? "100%",
      }}
    >
      <Box className={`flip-card__wrapper${className ? ` ${className}` : ""}`}>
        <Card className={`flip-card__side${!switched ? " is-active" : ""}`}>
          <CardSide {...{ switched, setSwitched, hidden: switched, ...props }}>
            {Front ?? <></>}
          </CardSide>
        </Card>
        <Card
          className={`flip-card__side flip-card__side--back${switched ? " is-active" : ""}`}
        >
          <CardSide {...{ switched, setSwitched, hidden: !switched, ...props }}>
            {Back ?? <></>}
          </CardSide>
        </Card>
      </Box>
    </Box>
  );
}

/** Renders a card side component with a flip button and content. */
function CardSide({
  spacing,
  columns,
  disabled,
  hidden,
  buttonText,
  children,
  switched,
  setSwitched,
  ...props
}: CardSideComponentProps) {
  return (
    <CardContent>
      <Grid
        container
        spacing={spacing ?? { sm: 2, md: 4 }}
        columns={columns ?? { xs: 4, sm: 8, md: 12 }}
        {...props}
      >
        {!hidden && React.Children.map(children, (child) => <>{child}</>)}
        <Grid item>
          <Button
            variant="outlined"
            onClick={() => setSwitched(!switched)}
            disabled={disabled}
          >
            {buttonText ?? "View Offer"}
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  );
}
