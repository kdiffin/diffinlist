export function isImage(url: string) {
  if (url === "") {
    return true;
  } else {
    return url.match(/\.(jpeg|jpg|gif|png|gif|)=?images$/) != null;
  }
}
