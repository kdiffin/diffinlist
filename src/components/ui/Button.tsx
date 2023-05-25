import React, { forwardRef } from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function ButtonNoRef(
  { children, type, className, disabled, onClick }: Props,
  ref: React.Ref<HTMLButtonElement>
) {
  return (
    <button
      ref={ref}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${
        className ? className : ""
      } inline-flex items-center justify-center gap-1 rounded-sm bg-zinc-700 px-5 py-3 
      font-medium leading-none focus-within:bg-zinc-600 hover:bg-zinc-600
       focus:bg-zinc-600 focus:shadow-[0_0_0_2px] focus:shadow-neutral-400  `}
    >
      {children}
    </button>
  );
}

const Button = forwardRef(ButtonNoRef);

export default Button;
