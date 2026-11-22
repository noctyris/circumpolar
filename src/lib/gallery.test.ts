import { describe, expect, it } from "vitest";
import {
  groupPictures,
  parseGroup,
  parseOrder,
  parseSort,
  type PictureGroup,
} from "./gallery";
import type { Picture } from "@/types";

function picture(overrides: Partial<Picture>): Picture {
  return {
    id: 1,
    target: "M42",
    publicid: "target",
    capture_date: "2025-01-01",
    optics: "Newton",
    camera: "ASI",
    capture_data: [],
    target_category: "Ciel profond",
    upload_date: "2025-01-02",
    ...overrides,
  };
}

describe("gallery parsing", () => {
  it("accepts known values and falls back on unknown ones", () => {
    expect(parseSort("title")).toBe("title");
    expect(parseSort("unknown")).toBe("capture_date");
    expect(parseOrder("asc")).toBe("asc");
    expect(parseOrder("nope")).toBe("desc");
    expect(parseGroup("camera")).toBe("camera");
    expect(parseGroup("nope")).toBe("none");
  });
});

describe("groupPictures", () => {
  it("keeps the original order when grouping is disabled", () => {
    const images = [picture({ id: 2 }), picture({ id: 1 })];
    const groups = groupPictures(images, "none");

    expect(groups).toEqual([{ key: "all", label: null, images }]);
  });

  it("groups by category and puts missing values in their own bucket", () => {
    const images = [
      picture({ id: 1, target_category: "Lunaire" }),
      picture({ id: 2, target_category: "Ciel profond" }),
      picture({ id: 3, target_category: "" }),
    ];
    const groups = groupPictures(images, "target_category");

    expect(groups.map((group) => group.label)).toEqual([
      "Ciel profond",
      "Lunaire",
      "Non renseigné",
    ]);
    expect(groups[0].images).toHaveLength(1);
  });

  it("formats Bortle values consistently", () => {
    const groups = groupPictures(
      [picture({ bortle_class: 4 }), picture({ bortle_class: undefined })],
      "bortle_class" as PictureGroup
    );

    expect(groups.map((group) => group.label)).toEqual(["Bortle 4", "Non renseigné"]);
  });
});
