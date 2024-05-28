export function isImage(url: string) {
  const regex = /\.(jpeg|jpg|gif|png|gif|img)|=images$/;

  if (url === "") {
    return true;
  } else {
    return url.match(regex) != null;
  }
}
