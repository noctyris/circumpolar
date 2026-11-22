import { z } from "zod";

export const PICTURE_CATEGORIES = [
  "Ciel profond",
  "Lunaire",
  "Solaire",
  "Planétaire",
  "Système solaire",
  "Open Field",
] as const;

export type PictureCategory = (typeof PICTURE_CATEGORIES)[number];

const safePublicId = z
  .string()
  .trim()
  .min(1)
  .max(300)
  .refine((value) => !/[\u0000-\u001f]/.test(value), "Identifiant Cloudinary invalide.");

const dateOnly = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide.")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, "Date invalide.");

const optionalText = (max: number) => z.string().trim().max(max).nullish();

const listValue = z
  .union([
    z.array(z.string().trim().min(1).max(120)).max(50),
    z.string().trim().max(2000),
  ])
  .nullish();

const optionalNumber = (min: number, max: number) =>
  z.number().finite().min(min).max(max).nullish();

export const captureRowSchema = z.object({
  filter: z.string().trim().min(1).max(100),
  count: z.number().int().min(1).max(100_000),
  exposure: z.number().finite().min(0).max(86_400),
});

export const pictureInputSchema = z.object({
  title: optionalText(160),
  target: z.string().trim().min(1).max(160),
  target_category: z.enum(PICTURE_CATEGORIES),
  publicID: safePublicId,
  annotatedPublicID: safePublicId.nullish(),
  capture_date: dateOnly,
  optics: z.string().trim().min(1).max(160),
  camera: z.string().trim().min(1).max(160),
  mount: optionalText(160),
  accessories: listValue,
  focal_length: optionalNumber(0.1, 100_000),
  f_number: optionalNumber(0.1, 100),
  capture_data: z.array(captureRowSchema).max(50).default([]),
  processing_software: listValue,
  processing_softwares: listValue,
  ra: optionalNumber(0, 360),
  dec: optionalNumber(-90, 90),
  bortle_class: optionalNumber(1, 9),
  location: optionalText(160),
});

export type PictureInput = z.infer<typeof pictureInputSchema>;

export type NormalizedPictureInput = Omit<
  PictureInput,
  "title" | "annotatedPublicID" | "mount" | "processing_software" | "processing_softwares" | "location"
> & {
  title: string | null;
  annotatedPublicID: string | null;
  mount: string | null;
  processing_software: PictureInput["processing_software"];
  location: string | null;
};

export function normalizePictureInput(input: PictureInput): NormalizedPictureInput {
  const { processing_softwares, ...rest } = input;

  return {
    ...rest,
    title: rest.title || null,
    annotatedPublicID: rest.annotatedPublicID || null,
    mount: rest.mount || null,
    processing_software: rest.processing_software ?? processing_softwares ?? null,
    location: rest.location || null,
  };
}
