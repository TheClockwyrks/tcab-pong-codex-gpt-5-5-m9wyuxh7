import { createCanvas } from "@napi-rs/canvas";
import { ConstantClock, createEngine } from "@clockwyrks/simple-2d";
import { describe, expect, it } from "vitest";
import {
  BALL_R,
  FIELD_CY,
  FIELD_W,
  P1_X1,
  PADDLE_MIN_CY,
  SERVE_SPEED,
} from "./constants";
import { game, type CaromDebugApi, type CaromState } from "./game";

function makeEngine(stepMs = 1000 / 60) {
  const canvas = createCanvas(1280, 720);
  const events = new EventTarget();
  return createEngine<CaromState, CaromDebugApi>({
    canvas: canvas as unknown as HTMLCanvasElement,
    width: 1280,
    height: 720,
    game,
    clock: new ConstantClock(stepMs),
    background: "#071017",
    surface: {
      cssWidth: () => 1280,
      cssHeight: () => 720,
      dpr: () => 1,
      events: () => events,
    },
  });
}

describe("Carom", () => {
  it("initializes the title state and debug snapshot", async () => {
    const engine = makeEngine();
    await engine.initialize();

    const snap = engine.debug.snapshot(engine.state);
    expect(snap.version).toBe(1);
    expect(snap.screen).toBe("title");
    expect(snap.mode).toBe("solo");
    expect(snap.score).toEqual({ p1: 0, p2: 0 });
    expect(snap.ball?.held).toBe(true);
    expect(snap.obstacles.map((item) => item.index)).toEqual([0, 1]);
    expect(engine.debug.menuItemRect(engine.state, 0)).not.toBeNull();
    expect(engine.debug.menuItemRect(engine.state, 99)).toBeNull();

    engine.destroy();
  });

  it("serves after countdown without advancing the ball on the serve frame", async () => {
    const engine = makeEngine(1000);
    await engine.initialize();
    engine.apply((state) => engine.debug.setScreen(state, "countdown"));
    engine.apply((state) => engine.debug.setBallServeSign(state, 1));

    await engine.advance(1);

    const ball = engine.debug.snapshot(engine.state).ball;
    expect(engine.state.screen).toBe("playing");
    expect(ball?.held).toBe(false);
    expect(ball?.x).toBe(640);
    expect(ball?.y).toBe(360);
    expect(ball?.speed).toBeCloseTo(SERVE_SPEED, 5);
    expect(ball?.vx).toBeLessThan(0);
    expect(ball?.vy).toBeGreaterThan(0);

    engine.destroy();
  });

  it("adds spin from a driven paddle and clamps paddle velocity at bounds", async () => {
    const engine = makeEngine();
    await engine.initialize();
    engine.apply((state) => engine.debug.setScreen(state, "playing"));
    engine.apply((state) =>
      engine.debug.setPaddleCy(state, "left", PADDLE_MIN_CY),
    );
    engine.apply((state) => engine.debug.setPaddleVy(state, "left", -720));
    engine.apply((state) => engine.debug.setPaddleDriven(state, "left", true));
    await engine.advance(1);
    expect(engine.debug.snapshot(engine.state).paddles.left.vy).toBe(0);

    engine.apply((state) => engine.debug.setPaddleCy(state, "left", FIELD_CY));
    engine.apply((state) => engine.debug.setPaddleVy(state, "left", 720));
    engine.apply((state) => engine.debug.setBallHeld(state, false));
    engine.apply((state) =>
      engine.debug.setBallPosition(state, P1_X1 + BALL_R - 2, FIELD_CY),
    );
    engine.apply((state) => engine.debug.setBallVelocity(state, -520, 0));

    await engine.advance(1);

    const snap = engine.debug.snapshot(engine.state);
    expect(snap.ball?.vx).toBeGreaterThan(0);
    expect(snap.ball?.spin).toBeGreaterThan(500);
    expect(snap.ball?.speed).toBeGreaterThan(520);

    engine.destroy();
  });

  it("scores points, parks the next serve, and ends by the win rule", async () => {
    const engine = makeEngine();
    await engine.initialize();
    engine.apply((state) => engine.debug.setScreen(state, "playing"));
    engine.apply((state) => engine.debug.setScore(state, 10, 8));
    engine.apply((state) => engine.debug.setBallHeld(state, false));
    engine.apply((state) =>
      engine.debug.setBallPosition(state, FIELD_W + BALL_R + 1, FIELD_CY),
    );
    engine.apply((state) => engine.debug.setBallVelocity(state, 100, 0));

    await engine.advance(1);

    const snap = engine.debug.snapshot(engine.state);
    expect(snap.screen).toBe("matchover");
    expect(snap.score).toEqual({ p1: 11, p2: 8 });
    expect(snap.winner).toBe("left");

    engine.destroy();
  });

  it("lets the debug surface clear and restore the world loudly", async () => {
    const engine = makeEngine();
    await engine.initialize();
    engine.apply((state) => engine.debug.clearWorld(state));
    expect(engine.debug.snapshot(engine.state).ball).toBeNull();
    expect(engine.debug.snapshot(engine.state).obstacles).toEqual([]);
    expect(() =>
      engine.apply((state) => engine.debug.setBallVelocity(state, 1, 2)),
    ).toThrow(/no ball/);
    engine.apply((state) => engine.debug.spawnBall(state));
    engine.apply((state) => engine.debug.spawnObstacle(state, 1));
    expect(engine.debug.snapshot(engine.state).ball?.held).toBe(true);
    expect(engine.debug.snapshot(engine.state).obstacles).toHaveLength(1);

    engine.destroy();
  });
});
