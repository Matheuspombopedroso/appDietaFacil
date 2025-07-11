import { getISOWeek } from "../src/utils/getISOWeek";

describe("getISOWeek", () => {
  it("returns ISO week 1 for 2021‑01‑04", () => {
    expect(getISOWeek(new Date("2021‑01‑04"))).toBe(1);
  });
  it("returns ISO week 52 for 2021‑12‑31", () => {
    expect(getISOWeek(new Date("2021‑12‑31"))).toBe(52);
  });
});
