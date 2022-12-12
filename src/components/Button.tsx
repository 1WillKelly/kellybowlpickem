import React from "react";

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  primary?: boolean;
  secondary?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  disabled,
  primary = true,
  className = "",
  secondary,
  children,
  ...props
}) => {
  const buttonClasses = ["rounded py-2 px-3 text-white", className];
  if (primary) {
    buttonClasses.push("bg-blue-400");
  } else if (secondary) {
    buttonClasses.push("bg-gray-400");
  }

  return (
    <button disabled={disabled} {...props} className={buttonClasses.join(" ")}>
      {children}
    </button>
  );
};

export default Button;
