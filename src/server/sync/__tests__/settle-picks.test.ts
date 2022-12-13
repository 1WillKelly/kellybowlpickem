import { getSeason } from "../season";
import { settlePicks } from "../settle-picks";

describe("settling picks", () => {
  beforeAll(async () => {
    await getSeason();
  });

  test("creates scores for participants", async () => {
    await settlePicks();
    // TODO
  });

  test("updates scores for participants", async () => {
    await settlePicks();
    // TODO
  });
});
