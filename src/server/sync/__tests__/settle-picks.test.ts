import { getSeason } from "../season";
import { settlePicks } from "../settle-picks";

describe("settling picks", () => {
  beforeAll(async () => {
    await getSeason();
  });
});
