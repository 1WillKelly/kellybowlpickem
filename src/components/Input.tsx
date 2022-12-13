import React from "react";

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        autoFocus
        className={`rounded border border-slate-400 py-1 px-2 focus:border-transparent ${
          className ?? ""
        }`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
