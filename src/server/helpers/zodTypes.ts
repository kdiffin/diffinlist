import { z } from "zod";

export const playlistValidate = z.object({
  name: z
    .string()
    .min(1, { message: "Please enter in playlist name" })
    .max(70, { message: "Playlist name too long" }),

  //it can either be an empty string or a url
  picture: z.union([
    z.string().url("Please enter in valid picture URL!").trim(),
    z.string().max(0),
  ]),
  genre: z.string().max(30),
});

export const songValidate = z.object({
  name: z.string().min(1, { message: "Please enter in a name for the song" }),
  pictureUrl: z.union([
    z.string().url("Please enter in valid picture URL!").trim(),
    z.string().max(0),
  ]),
  songUrl: z
    .string()
    .min(1, {
      message:
        "Please enter in a link for the song, (youtube, spotify, soundcloud etc.)",
    })
    .url(),
  genre: z.string().min(1, { message: "Please enter in a genre for the song" }),
  playlistName: z.string().min(1),

  albumName: z.string().nullable().optional(),
  artistName: z.string().nullable().optional(),
  description: z.string().max(400).nullable().optional(),
  rating: z
    .number()
    .min(0, { message: "Please enter a number above 0" })
    .max(10, { message: "Please enter a number below 10" })
    .nullable()
    .optional(),
});
