import React, {
  ChangeEvent,
  Dispatch,
  InputHTMLAttributes,
  ReactNode,
  SetStateAction,
} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  //naming this onchange results in an error
  setValue: Function | Dispatch<React.SetStateAction<string>>;
  customFunction?: boolean;
  icon?: ReactNode;
}

function Input(props: InputProps) {
  return (
    <div
      className={
        props.className +
        " flex w-full items-center  gap-2 rounded-sm bg-zinc-700 p-2 focus-within:bg-zinc-600 focus-within:shadow-[0_0_0_2px] focus-within:shadow-neutral-500  hover:bg-zinc-600  "
      }
    >
      {props.icon ? props.icon : null}
      <input
        value={props.value || ""}
        type={props.type}
        // @ts-ignore
        onChange={(e) => props.setValue(e.target.value)}
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

export function InputField({
  setValue,
  value,
  type,
  className,
  name,
  placeholder,
}: InputFieldProps) {
  return (
    <fieldset className={` ${className} mb-6 flex items-center gap-5`}>
      <label className=" w-[90px]  text-right text-[15px]" htmlFor={name}>
        {name}
      </label>

      <Input
        setValue={setValue}
        type={type}
        name={name}
        id={name}
        value={value}
        placeholder={placeholder}
      />
    </fieldset>
  );
}

export default Input;

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  setValue: any;
  placeholder: string;
  className?: string;
  name?: string;
  value: string;
}
