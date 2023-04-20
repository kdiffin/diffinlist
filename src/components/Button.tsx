import React from "react";

function Button({
  children,
  className,
  disabled,
  onClick,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick ? onClick : () => null}
      disabled={disabled}
      className={`${
        className ? className : ""
      } inline-flex items-center justify-center rounded-sm bg-zinc-700 px-5 py-3 font-medium leading-none focus-within:bg-zinc-600 hover:bg-zinc-600  focus:bg-zinc-600 focus:shadow-[0_0_0_2px]  focus:outline-none`}
    >
      {children}
    </button>
  );
}

export default Button;
