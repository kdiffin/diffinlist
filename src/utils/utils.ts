//chatgpt made this for me
//this is for the update mutate function, where I need to turn all strings that are equal to "" into undefined, as not to update the field which is empty.
export function removeEmptyStrings(
  obj: Record<string, string | undefined>
): Record<string, string | undefined> {
  const newObj: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(obj)) {
    newObj[key] = value === "" ? undefined : value;
  }
  return newObj;
}
