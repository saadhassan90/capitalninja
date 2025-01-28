import { z } from "zod";

export const profileFormSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  title: z.string().optional(),
  company_name: z.string().optional(),
  company_description: z.string().optional(),
  company_website: z.string().url().optional().or(z.literal("")),
  linkedin_url: z.string().url().optional().or(z.literal("")),
  location: z.string().optional(),
  bio: z.string().optional(),
  raising_amount: z.number().optional().nullable(),
  raising_description: z.string().optional(),
  raising_stage: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;