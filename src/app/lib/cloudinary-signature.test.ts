import { describe, expect, it } from "vitest";
import { buildParamsToSign } from "./cloudinary-signature";

describe("buildParamsToSign", () => {
  it("accepts only the allowlisted parameters", () => {
    const result = buildParamsToSign({
      timestamp: 1_700_000_000,
      folder: "circumpolar/2025",
      source: "local",
      upload_preset: "circumpolar",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.params).toMatchObject({
        timestamp: 1_700_000_000,
        folder: "circumpolar/2025",
        upload_preset: "circumpolar",
      });
    }
  });

  it("rejects unexpected and dangerous parameters", () => {
    for (const paramsToSign of [
      { timestamp: 1_700_000_000, transformation: "w_5000" },
      { timestamp: 1_700_000_000, public_id: "existing/asset" },
      { timestamp: 1_700_000_000, folder: "../outside" },
      { timestamp: 1_700_000_000, folder: "/absolute" },
      { timestamp: "not-a-number" },
    ]) {
      expect(buildParamsToSign(paramsToSign).ok).toBe(false);
    }
  });

  it("rejects non-object bodies", () => {
    expect(buildParamsToSign(null).ok).toBe(false);
    expect(buildParamsToSign([]).ok).toBe(false);
    expect(buildParamsToSign("timestamp=1").ok).toBe(false);
  });
});
