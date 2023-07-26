import z from "zod";

const errorMessage =
  "You must provide a password when setting status to `PROTECTED`";

export const baseCreateGroupSchema = z.object({
  name: z.string().min(3),
  status: z.enum(["PUBLIC", "PROTECTED", "PRIVATE"]),
  password: z.string().min(8).optional(),
});

export const createGroupSchema = baseCreateGroupSchema.refine(
  (data) => data.status !== "PROTECTED" || data.password !== undefined,
  errorMessage
);
export type CreateGroupType = z.infer<typeof createGroupSchema>;

export const updateGroupSchema = baseCreateGroupSchema
  .partial()
  .refine(
    (data) => data.status !== "PROTECTED" || data.password !== undefined,
    errorMessage
  );
export type UpdateGroupType = z.infer<typeof updateGroupSchema>;

export const addGroupAdminSchema = z.object({
  userId: z.number().positive(),
});
export type AddGroupAdminType = z.infer<typeof addGroupAdminSchema>;

export const removeGroupAdminSchema = addGroupAdminSchema;
export type RemoveGroupAdminType = z.infer<typeof removeGroupAdminSchema>;

export const banUserSchema = addGroupAdminSchema;
export type BanUserType = z.infer<typeof banUserSchema>;

export const unBanUserSchema = banUserSchema;
export type UnBanUserType = z.infer<typeof unBanUserSchema>;

export const kickUserSchema = banUserSchema;
export type KickUserType = z.infer<typeof kickUserSchema>;