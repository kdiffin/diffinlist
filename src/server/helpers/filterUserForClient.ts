import { User } from "@clerk/nextjs/dist/api";

export function filterProfileForClient(user: User) {
  return {
    username: user.username ? user.username : "",
    profileImageUrl: user.profileImageUrl,
  };
}
