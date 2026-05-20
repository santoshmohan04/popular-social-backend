import { z } from "zod";

export const createPostSchema = z.object({
  user: z.string().min(1, "user is required"),
  text: z.string().min(1, "text is required"),
  imgName: z.string().optional(),
  avatar: z.string().optional(),
  timestamp: z
    .string()
    .optional()
    .refine((val) => !val || !Number.isNaN(Date.parse(val)), {
      message: "timestamp must be a valid ISO date string"
    })
});
