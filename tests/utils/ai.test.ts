import { describe, it, expect } from "vitest";
import { parseIntent } from "../../server/utils/ai";

describe("AI Utils - parseIntent", () => {
  it("should extract age, region, and category correctly", async () => {
    const input = "28살 서울 월세 지원 받고 싶어";
    const result = await parseIntent(input);

    expect(result).toEqual({
      age: 28,
      region: "서울",
      category: "housing",
    });
  });

  it("should extract region and category without age", async () => {
    const input = "경기도 취업 지원금";
    const result = await parseIntent(input);

    expect(result).toEqual({
      age: null,
      region: "경기도",
      category: "job",
    });
  });

  it("should handle unmatched inputs gracefully", async () => {
    const input = "안녕하세요";
    const result = await parseIntent(input);

    expect(result).toEqual({
      age: null,
      region: null,
      category: null,
    });
  });
});
