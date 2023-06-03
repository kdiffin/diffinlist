export function validQuery(query: string | string[] | undefined) {
  if (query && typeof query === "string") {
    return query;
  }

  return undefined;
}
