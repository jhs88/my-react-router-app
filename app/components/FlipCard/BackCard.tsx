import React from "react";

interface BackCardComponentProps {
  children?: React.ReactNode;
}

/** Renders the back card component. */
export default function BackCard(props: BackCardComponentProps) {
  return (
    <div className="ml-4 mt-4 space-y-2">
      <h5 className="text-xl font-medium text-foreground">
        {/* {t("backHeader", { content: { ...props } })} */}
        Test
      </h5>
      <p className="text-sm text-muted-foreground">
        {/* {t("subHeader", { ...props })} */}
        Test
      </p>
      {/* {parse(description ?? "", options)} */}Test2
      {props.children && (
        <div className="grid grid-cols-1 gap-4">
          {React.Children.map(props.children, (child) => (
            <div>{child}</div>
          ))}
        </div>
      )}
    </div>
  );
}
