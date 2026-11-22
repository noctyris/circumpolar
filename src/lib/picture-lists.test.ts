import { describe, expect, it } from "vitest";
import { normalizeList, normalizePictureLists } from "./picture-lists";

describe("normalizeList", () => {
  it("splits legacy comma-separated values", () => {
    expect(normalizeList("Siril, GIMP, Siril")).toEqual(["Siril", "GIMP"]);
  });

  it("trims, removes empty values and deduplicates arrays", () => {
    expect(normalizeList(["  Barlow  ", "", "Barlow", "Filtre"])).toEqual([
      "Barlow",
      "Filtre",
    ]);
  });

  it("returns undefined for empty input", () => {
    expect(normalizeList(undefined)).toBeUndefined();
    expect(normalizeList("  , ")).toBeUndefined();
  });
});

describe("normalizePictureLists", () => {
  it("normalizes numeric database columns and lists", () => {
    const result = normalizePictureLists({
      id: 1,
      accessories: "A, B",
      processing_software: ["Siril"],
      focal_length: "750",
      f_number: "5",
      ra: "10.5",
      dec: "-2.25",
      bortle_class: "4",
    });

    expect(result).toMatchObject({
      accessories: ["A", "B"],
      processing_software: ["Siril"],
      focal_length: 750,
      f_number: 5,
      ra: 10.5,
      dec: -2.25,
      bortle_class: 4,
    });
  });
});
