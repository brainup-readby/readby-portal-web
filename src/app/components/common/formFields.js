import React from "react";
import {
  Button,
} from "@material-ui/core";

const ClrdButton = props => {
  const { variant, disabled, color, className, ...rest } = props;
  if (color === "primary" || color === "secondary")
    // nothing to do
    return (
      <Button
        {...rest}
        variant={variant}
        disabled={disabled}
        color={color}
        className={`${className} ${
          color === "primary" && variant === "contained" ? "text-white" : ""
        }`}
      />
    );

  let styling = "";
  switch (color) {
    case "success":
      styling = "bg-success text-white";
      break;
    case "danger":
      styling = "bg-danger text-white";
      break;
    case "warning":
      styling = "bg-warning text-dark";
      break;
    case "info":
      styling = "bg-info text-white";
      break;
    default:
      return <Button {...props} />;
  }
  const override = `${!!disabled ? "" : styling} ${className || ""}`;
  return (
    <Button
      {...props}
      variant="contained"
      color="inherit"
      className={override}
    />
  );
};

export {
  ClrdButton
};
