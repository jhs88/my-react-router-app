import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import "./styles.scss";

interface FlipCardComponentProps {
  width?: string;
  className?: string;
  FrontCard?: React.ReactNode;
  BackCard?: React.ReactNode;
  isFlipped?: boolean;
  onFlip?: () => void;
}

interface CardSideComponentProps {
  disabled?: boolean;
  hidden?: boolean;
  buttonText?: string;
  children?: React.ReactNode;
  switched?: boolean;
  setSwitched?: React.Dispatch<React.SetStateAction<boolean>>;
}

/** Renders a flip card component with a front and back side. */
export default function FlipCard({
  width,
  className,
  FrontCard,
  BackCard,
  isFlipped,
  ...props
}: FlipCardComponentProps) {
  const Front = FrontCard;
  const Back = BackCard;

  const [switched, setSwitched] = useState(isFlipped ?? false);

  return (
    <div
      className={`flip-card${switched ? " is-switched" : ""}`}
      style={{
        width: width ?? "100%",
      }}
    >
      <div className={`flip-card__wrapper${className ? ` ${className}` : ""}`}>
        <Card
          className={`flip-card__side${!switched ? " is-card-active" : ""}`}
        >
          <CardSide {...{ switched, setSwitched, hidden: switched, ...props }}>
            {Front ?? <></>}
          </CardSide>
        </Card>
        <Card
          className={`flip-card__side flip-card__side--back${switched ? " is-card-active" : ""}`}
        >
          <CardSide {...{ switched, setSwitched, hidden: !switched, ...props }}>
            {Back ?? <></>}
          </CardSide>
        </Card>
      </div>
    </div>
  );
}

/** Renders a card side component with a flip button and content. */
function CardSide({
  disabled,
  hidden,
  buttonText,
  children,
  switched,
  setSwitched,
}: CardSideComponentProps) {
  return (
    <CardContent className="p-0">
      <div className="grid grid-cols-1 gap-4">
        {!hidden && React.Children.map(children, (child) => <>{child}</>)}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setSwitched?.(!switched)}
            disabled={disabled}
          >
            {buttonText ?? "View Offer"}
          </Button>
        </div>
      </div>
    </CardContent>
  );
}
