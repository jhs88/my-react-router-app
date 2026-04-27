import React from "react";

/** Renders the front card component. */
export default function FrontCard(props: { children?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <img className="max-w-full h-auto" src="" alt="" />
      </div>
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold" aria-label="front heading">
          Front Card
        </h1>
        <h4
          className="text-2xl font-semibold card-sub-heading"
          aria-label="front subheading"
        >
          Subheading
        </h4>
        <p className="text-sm font-medium text-muted-foreground">
          <span
            aria-label="Expiry date label"
            className="card display-date-label mr-2"
          >
            Offer Expires :
          </span>
          <span aria-label="expiry date" className="display-date-label">
            Date
          </span>
        </p>
        <p className="text-sm card-description-1"></p>
        <p className="text-sm card-description-2"></p>
        <p className="text-sm card-description-3"></p>
      </div>
      {React.Children.map(props?.children, (child) => (
        <div>{child}</div>
      ))}
    </div>
  );
}
