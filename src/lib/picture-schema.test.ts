import { describe, expect, it } from "vitest";
import { normalizePictureInput, pictureInputSchema } from "./picture-schema";

const validPayload = {
  target: "M42",
  target_category: "Ciel profond",
  publicID: "circumpolar/m42",
  capture_date: "2025-01-01",
  optics: "Newton 150/750",
  camera: "ASI 533",
  capture_data: [{ filter: "Ha", count: 30, exposure: 300 }],
  processing_software: ["Siril"],
};

describe("pictureInputSchema", () => {
  it("accepts a complete payload and applies defaults", () => {
    const parsed = pictureInputSchema.safeParse(validPayload);

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.mount).toBeUndefined();
      expect(parsed.data.processing_software).toEqual(["Siril"]);
    }
  });

  it("rejects invalid dates, categories and coordinates", () => {
    expect(
      pictureInputSchema.safeParse({ ...validPayload, capture_date: "2025-02-31" }).success
    ).toBe(false);
    expect(
      pictureInputSchema.safeParse({ ...validPayload, target_category: "Autre" }).success
    ).toBe(false);
    expect(
      pictureInputSchema.safeParse({ ...validPayload, ra: 361 }).success
    ).toBe(false);
    expect(
      pictureInputSchema.safeParse({ ...validPayload, dec: -91 }).success
    ).toBe(false);
  });

  it("rejects malformed capture rows", () => {
    expect(
      pictureInputSchema.safeParse({
        ...validPayload,
        capture_data: [{ filter: "", count: 0, exposure: -1 }],
      }).success
    ).toBe(false);
  });

  it("supports the legacy processing_softwares alias", () => {
    const parsed = pictureInputSchema.parse({
      ...validPayload,
      processing_software: null,
      processing_softwares: ["GIMP"],
    });
    const normalized = normalizePictureInput(parsed);

    expect(normalized.processing_software).toEqual(["GIMP"]);
  });
});
