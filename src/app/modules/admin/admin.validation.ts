import { z } from "zod";
import { USER_ROLE } from "../user/user.constants";


export const userRoleSchema = z.object({
    body: z.object({
      role: z.enum(
        Object.values(USER_ROLE) as [
          (typeof USER_ROLE)[keyof typeof USER_ROLE],
          ...(typeof USER_ROLE)[keyof typeof USER_ROLE][],
        ],
      ),
    }),
  });