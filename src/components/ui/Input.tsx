import React, {
  ChangeEvent,
  Dispatch,
  InputHTMLAttributes,
  ReactNode,
  SetStateAction,
} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  //naming this onchange results in an error
  onType: Function | Dispatch<React.SetStateAction<string>>;
  customFunction?: boolean;
  icon?: ReactNode;
}

function Input(props: InputProps) {
  return (
    <div
      className={
        props.className +
        " flex w-full items-center  gap-2 rounded-sm bg-zinc-700 p-1 focus-within:bg-zinc-600 focus-within:shadow-[0_0_0_2px] focus-within:shadow-neutral-500  hover:bg-zinc-600  md:p-2 "
      }
    >
      {props.icon ? props.icon : null}
      <input
        value={props.value || ""}
        type={props.type}
        // @ts-ignore
        onChange={(e) => props.onChange(e.target.value)}
        autoComplete="off"
        id={props.id}
        defaultValue={props.defaultValue}
        spellCheck="false"
        name={props.name}
        placeholder={props.placeholder}
        className={`flex w-full items-center justify-center  border-none bg-transparent outline-none placeholder:text-sm placeholder:italic`}
      />
    </div>
  );
}
export default Input;
