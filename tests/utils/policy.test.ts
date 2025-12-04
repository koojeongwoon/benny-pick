import { describe, it, expect } from "vitest";
import { matchPolicies } from "../../server/utils/policy";

describe("Policy Utils - matchPolicies", () => {
  it("should match housing policy for eligible age and region", async () => {
    const criteria = {
      age: 28,
      region: "서울",
      category: "housing",
    };
    const results = await matchPolicies(criteria);

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBe("청년월세 특별지원");
  });

  it("should NOT match if age is out of range", async () => {
    const criteria = {
      age: 40, // Too old for youth policies
      region: "서울",
      category: "housing",
    };
    const results = await matchPolicies(criteria);

    expect(results.length).toBe(0);
  });

  it("should match regional policy (Gyeonggi)", async () => {
    const criteria = {
      age: 24,
      region: "경기도",
      category: "cash",
    };
    const results = await matchPolicies(criteria);

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBe("경기도 청년기본소득");
  });

  it("should NOT match regional policy if region differs", async () => {
    const criteria = {
      age: 24,
      region: "부산", // Not Gyeonggi
      category: "cash",
    };
    const results = await matchPolicies(criteria);

    // Should not find Gyeonggi policy
    const gyeonggiPolicy = results.find(
      (p) => p.title === "경기도 청년기본소득"
    );
    expect(gyeonggiPolicy).toBeUndefined();
  });
});
