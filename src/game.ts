import type {
  Game,
  InitApi,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import {
  ACTIONS,
  AI_DEADZONE,
  AI_HOME_DEADZONE,
  AI_HOME_Y,
  AI_REACT,
  AI_SPEED,
  BALL_R,
  BINDINGS,
  CAROM_DEBUG_VERSION,
  CUES,
  FIELD_CX,
  FIELD_CY,
  FIELD_H,
  FIELD_W,
  HOLD_TIME,
  MATCHOVER_ITEMS,
  MAX_BOUNCE_ANGLE,
  MAX_SUBSTEP,
  NET_X,
  OBSTACLE_CENTERS,
  OBSTACLE_H,
  OBSTACLE_HH,
  OBSTACLE_W,
  OBSTACLE_HW,
  OBSTACLES,
  P1_X0,
  P1_X1,
  P2_X0,
  P2_X1,
  PADDLE_H,
  PADDLE_HALF,
  PADDLE_MAX_CY,
  PADDLE_MIN_CY,
  PADDLE_SPEED,
  PADDLE_W,
  PAUSE_ITEMS,
  SERVE_ANGLE,
  SERVE_SPEED,
  SPEED_CAP,
  SPEED_MULT,
  SPIN_CLAMP,
  SPIN_FROM_PADDLE,
  SPIN_HALFLIFE,
  TITLE_ITEMS,
  TITLE_TEXT,
  TRAIL_TIME,
  WIN_LEAD,
  WIN_SCORE,
  type CueName,
  type Rect,
} from "./constants";

export type Screen =
  "title" | "howto" | "countdown" | "playing" | "paused" | "matchover";

export type Mode = "solo" | "versus";

export type Side = "left" | "right";

export interface PaddleState {
  readonly cy: number;
  readonly vy: number;
  readonly driven: boolean;
  readonly drivenVy: number;
}

export interface AiState {
  readonly tracking: boolean;
  readonly movement: boolean;
}

export interface TrailSample {
  readonly x: number;
  readonly y: number;
  readonly t: number;
}

export interface BallState {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly spin: number;
  readonly held: boolean;
  readonly holdTimer: number;
  readonly serveSign: 1 | -1;
  readonly trail: readonly TrailSample[];
}

export interface ObstacleState {
  readonly index: number;
  readonly cx: number;
  readonly cy: number;
}

export interface CaromState {
  readonly screen: Screen;
  readonly mode: Mode;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly resumeScreen: "countdown" | "playing";

  readonly score: { readonly p1: number; readonly p2: number };
  readonly winner: Side | null;

  readonly paddles: { readonly left: PaddleState; readonly right: PaddleState };
  readonly ai: AiState;

  readonly receiver: Side;
  readonly ball: BallState | null;
  readonly obstacles: readonly ObstacleState[];

  readonly simTime: number;
  readonly muted: boolean;
}

interface SnapshotBall extends BallState {
  readonly speed: number;
}

interface Snapshot {
  readonly version: typeof CAROM_DEBUG_VERSION;
  readonly screen: Screen;
  readonly mode: Mode;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly resumeScreen: "countdown" | "playing";
  readonly score: { readonly p1: number; readonly p2: number };
  readonly winner: Side | null;
  readonly muted: boolean;
  readonly paddles: CaromState["paddles"];
  readonly ai: AiState;
  readonly receiver: Side;
  readonly ball: SnapshotBall | null;
  readonly obstacles: readonly ObstacleState[];
  readonly simTime: number;
}

interface MenuRect {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export interface CaromDebugApi {
  readonly version: typeof CAROM_DEBUG_VERSION;
  clearWorld(state: DeepReadonly<CaromState>): CaromState;
  spawnBall(state: DeepReadonly<CaromState>): CaromState;
  spawnObstacle(state: DeepReadonly<CaromState>, index: number): CaromState;
  reset(state: DeepReadonly<CaromState>): CaromState;
  reconcile(state: DeepReadonly<CaromState>): CaromState;
  setScreen(state: DeepReadonly<CaromState>, screen: Screen): CaromState;
  setMode(state: DeepReadonly<CaromState>, mode: Mode): CaromState;
  setMenuIndex(state: DeepReadonly<CaromState>, index: number): CaromState;
  setTitleIndex(state: DeepReadonly<CaromState>, index: number): CaromState;
  setResumeScreen(
    state: DeepReadonly<CaromState>,
    screen: "countdown" | "playing",
  ): CaromState;
  setScore(state: DeepReadonly<CaromState>, p1: number, p2: number): CaromState;
  setWinner(state: DeepReadonly<CaromState>, side: Side | null): CaromState;
  setReceiver(state: DeepReadonly<CaromState>, side: Side): CaromState;
  setPaddleCy(
    state: DeepReadonly<CaromState>,
    side: Side,
    cy: number,
  ): CaromState;
  setPaddleVy(
    state: DeepReadonly<CaromState>,
    side: Side,
    vy: number,
  ): CaromState;
  setPaddleDriven(
    state: DeepReadonly<CaromState>,
    side: Side,
    driven: boolean,
  ): CaromState;
  setBallPosition(
    state: DeepReadonly<CaromState>,
    x: number,
    y: number,
  ): CaromState;
  setBallVelocity(
    state: DeepReadonly<CaromState>,
    vx: number,
    vy: number,
  ): CaromState;
  setBallSpin(state: DeepReadonly<CaromState>, spin: number): CaromState;
  setBallHeld(state: DeepReadonly<CaromState>, held: boolean): CaromState;
  setBallHoldTimer(
    state: DeepReadonly<CaromState>,
    seconds: number,
  ): CaromState;
  setBallServeSign(state: DeepReadonly<CaromState>, sign: 1 | -1): CaromState;
  drawBallServeSign(state: DeepReadonly<CaromState>): CaromState;
  setAiTracking(state: DeepReadonly<CaromState>, enabled: boolean): CaromState;
  setAiMovement(state: DeepReadonly<CaromState>, enabled: boolean): CaromState;
  setMuted(state: DeepReadonly<CaromState>, muted: boolean): CaromState;
  snapshot(state: DeepReadonly<CaromState>): Snapshot;
  menuItemRect(state: DeepReadonly<CaromState>, index: number): MenuRect | null;
}

export const BACKGROUND = "#071017";

const LEFT_COLOR = "#2ff3c9";
const RIGHT_COLOR = "#ff5f87";
const BALL_COLOR = "#fff6a6";
const OBSTACLE_COLOR = "#8eb7ff";
const TEXT_COLOR = "#edf7ff";
const DIM_TEXT = "#7f92a0";
const PANEL = "rgba(7, 16, 23, 0.72)";
const HOWTO_ITEM = ["BACK"] as const;

interface CollisionResult {
  readonly hit: boolean;
  readonly face: "left" | "right" | "top" | "bottom" | null;
  readonly ball: BallState;
}

interface AdvanceResult {
  readonly ball: BallState | null;
  readonly cues: ReadonlySet<CueName>;
}

interface MenuAction {
  readonly menuIndex: number;
  readonly confirm: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function serveSign(): 1 | -1 {
  return Math.random() < 0.5 ? -1 : 1;
}

function obstacle(index: number): ObstacleState {
  const center = OBSTACLE_CENTERS[index];
  if (!center) throw new RangeError(`Carom: no obstacle ${index}`);
  return { index, cx: center.x, cy: center.y };
}

function allObstacles(): readonly ObstacleState[] {
  return OBSTACLE_CENTERS.map((_center, index) => obstacle(index));
}

function parkedBall(): BallState {
  return {
    x: FIELD_CX,
    y: FIELD_CY,
    vx: 0,
    vy: 0,
    spin: 0,
    held: true,
    holdTimer: HOLD_TIME,
    serveSign: serveSign(),
    trail: [],
  };
}

function paddle(): PaddleState {
  return { cy: FIELD_CY, vy: 0, driven: false, drivenVy: 0 };
}

function titleState(muted: boolean, titleIndex = 0, simTime = 0): CaromState {
  return {
    screen: "title",
    mode: "solo",
    menuIndex: titleIndex,
    titleIndex,
    resumeScreen: "playing",
    score: { p1: 0, p2: 0 },
    winner: null,
    paddles: { left: paddle(), right: paddle() },
    ai: { tracking: true, movement: true },
    receiver: "left",
    ball: parkedBall(),
    obstacles: allObstacles(),
    simTime,
    muted,
  };
}

function startMatch(state: DeepReadonly<CaromState>, mode: Mode): CaromState {
  return {
    ...state,
    screen: "countdown",
    mode,
    menuIndex: 0,
    resumeScreen: "playing",
    score: { p1: 0, p2: 0 },
    winner: null,
    receiver: "left",
    ball: parkedBall(),
    paddles: {
      left: { ...state.paddles.left, cy: FIELD_CY, vy: 0 },
      right: { ...state.paddles.right, cy: FIELD_CY, vy: 0 },
    },
  };
}

function returnToTitle(state: DeepReadonly<CaromState>): CaromState {
  return titleState(state.muted, state.titleIndex, state.simTime);
}

function withPaddle(
  state: DeepReadonly<CaromState>,
  side: Side,
  paddleState: PaddleState,
): CaromState {
  return {
    ...state,
    paddles: { ...state.paddles, [side]: paddleState },
  };
}

function requireBall(state: DeepReadonly<CaromState>): BallState {
  if (!state.ball) throw new Error("Carom: no ball is present");
  return { ...state.ball, trail: [...state.ball.trail] };
}

function integratePaddle(
  paddleState: DeepReadonly<PaddleState>,
  desiredVy: number,
  dt: number,
): PaddleState {
  const next = clamp(
    paddleState.cy + desiredVy * dt,
    PADDLE_MIN_CY,
    PADDLE_MAX_CY,
  );
  const vy = dt > 0 ? (next - paddleState.cy) / dt : 0;
  return { ...paddleState, cy: next, vy };
}

function playerAxis(
  api: UpdateApi,
  upAction: string,
  downAction: string,
): number {
  return api.input.value(downAction) - api.input.value(upAction);
}

function paddleVelocity(
  side: Side,
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
  dt: number,
): number {
  const paddleState = state.paddles[side];
  if (paddleState.driven) return paddleState.drivenVy;
  if (side === "left") {
    const solo = state.mode === "solo";
    const up =
      api.input.value("p1-up") || (solo ? api.input.value("p2-up") : 0);
    const down =
      api.input.value("p1-down") || (solo ? api.input.value("p2-down") : 0);
    return (down - up) * PADDLE_SPEED;
  }
  if (state.mode === "versus") {
    return playerAxis(api, "p2-up", "p2-down") * PADDLE_SPEED;
  }
  if (!state.ai.movement) return 0;
  let target = AI_HOME_Y;
  let deadzone = AI_HOME_DEADZONE;
  const ball = state.ball;
  if (state.ai.tracking && state.screen === "playing" && ball && ball.vx > 0) {
    target = ball.y - ball.vy * AI_REACT;
    deadzone = AI_DEADZONE;
  }
  const diff = target - paddleState.cy;
  if (Math.abs(diff) <= deadzone || dt <= 0) return 0;
  return Math.sign(diff) * Math.min(AI_SPEED, Math.abs(diff) / dt);
}

function advancePaddles(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
  dt: number,
): CaromState {
  return {
    ...state,
    paddles: {
      left: integratePaddle(
        state.paddles.left,
        paddleVelocity("left", state, api, dt),
        dt,
      ),
      right: integratePaddle(
        state.paddles.right,
        paddleVelocity("right", state, api, dt),
        dt,
      ),
    },
  };
}

function paddleRect(side: Side, cy: number): Rect {
  return {
    x0: side === "left" ? P1_X0 : P2_X0,
    x1: side === "left" ? P1_X1 : P2_X1,
    y0: cy - PADDLE_HALF,
    y1: cy + PADDLE_HALF,
  };
}

function resolveRect(ball: BallState, rect: Rect): CollisionResult {
  if (!(
    ball.x > rect.x0 - BALL_R &&
    ball.x < rect.x1 + BALL_R &&
    ball.y > rect.y0 - BALL_R &&
    ball.y < rect.y1 + BALL_R
  )) {
    return { hit: false, face: null, ball };
  }
  const depths = [
    ["left", ball.x - (rect.x0 - BALL_R)],
    ["right", rect.x1 + BALL_R - ball.x],
    ["top", ball.y - (rect.y0 - BALL_R)],
    ["bottom", rect.y1 + BALL_R - ball.y],
  ] as const;
  let face: "left" | "right" | "top" | "bottom" = depths[0][0];
  let depth = depths[0][1];
  for (const [candidate, candidateDepth] of depths.slice(1)) {
    if (candidateDepth < depth) {
      face = candidate;
      depth = candidateDepth;
    }
  }

  if (face === "left") {
    return {
      hit: true,
      face,
      ball: {
        ...ball,
        x: rect.x0 - BALL_R,
        vx: ball.vx > 0 ? -ball.vx : ball.vx,
      },
    };
  }
  if (face === "right") {
    return {
      hit: true,
      face,
      ball: {
        ...ball,
        x: rect.x1 + BALL_R,
        vx: ball.vx < 0 ? -ball.vx : ball.vx,
      },
    };
  }
  if (face === "top") {
    return {
      hit: true,
      face,
      ball: {
        ...ball,
        y: rect.y0 - BALL_R,
        vy: ball.vy > 0 ? -ball.vy : ball.vy,
      },
    };
  }
  return {
    hit: true,
    face,
    ball: {
      ...ball,
      y: rect.y1 + BALL_R,
      vy: ball.vy < 0 ? -ball.vy : ball.vy,
    },
  };
}

function bouncePaddle(
  ball: BallState,
  side: Side,
  paddleState: DeepReadonly<PaddleState>,
): BallState {
  const offset = clamp((ball.y - paddleState.cy) / PADDLE_HALF, -1, 1);
  const theta = offset * MAX_BOUNCE_ANGLE;
  const speed = Math.min(Math.hypot(ball.vx, ball.vy) * SPEED_MULT, SPEED_CAP);
  const dir = side === "left" ? 1 : -1;
  return {
    ...ball,
    x: side === "left" ? P1_X1 + BALL_R : P2_X0 - BALL_R,
    vx: dir * speed * Math.cos(theta),
    vy: speed * Math.sin(theta),
    spin: clamp(
      ball.spin + paddleState.vy * SPIN_FROM_PADDLE,
      -SPIN_CLAMP,
      SPIN_CLAMP,
    ),
  };
}

function appendTrail(ball: BallState, simTime: number): BallState {
  const trail = [...ball.trail, { x: ball.x, y: ball.y, t: simTime }].filter(
    (sample) => simTime - sample.t <= TRAIL_TIME,
  );
  return { ...ball, trail };
}

function serveBall(ball: BallState, receiver: Side): BallState {
  const dir = receiver === "left" ? -1 : 1;
  return {
    ...ball,
    held: false,
    holdTimer: 0,
    trail: [],
    vx: dir * SERVE_SPEED * Math.cos(SERVE_ANGLE),
    vy: ball.serveSign * SERVE_SPEED * Math.sin(SERVE_ANGLE),
  };
}

function advanceBall(
  state: DeepReadonly<CaromState>,
  simTime: number,
  dt: number,
): AdvanceResult {
  const cues = new Set<CueName>();
  const sourceBall = state.ball;
  if (!sourceBall) return { ball: null, cues };
  let ball: BallState = { ...sourceBall, trail: [...sourceBall.trail] };

  if (state.screen === "countdown") {
    const holdTimer = Math.max(0, ball.holdTimer - dt);
    ball = { ...ball, x: FIELD_CX, y: FIELD_CY, holdTimer };
    if (holdTimer <= 0) return { ball: serveBall(ball, state.receiver), cues };
    return { ball: appendTrail(ball, simTime), cues };
  }

  if (ball.held) return { ball: appendTrail(ball, simTime), cues };
  const speed = Math.hypot(ball.vx, ball.vy);
  const steps = Math.max(1, Math.ceil((speed * dt) / MAX_SUBSTEP));
  const h = dt / steps;

  for (let i = 0; i < steps; i += 1) {
    const currentSpeed = Math.hypot(ball.vx, ball.vy);
    if (currentSpeed > 0) {
      const angle = (ball.spin / currentSpeed) * h;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      ball = {
        ...ball,
        vx: ball.vx * cos - ball.vy * sin,
        vy: ball.vx * sin + ball.vy * cos,
      };
    }
    ball = {
      ...ball,
      spin: ball.spin * Math.pow(0.5, h / SPIN_HALFLIFE),
      x: ball.x + ball.vx * h,
      y: ball.y + ball.vy * h,
    };

    if (ball.y - BALL_R < 0 && ball.vy < 0) {
      ball = { ...ball, y: BALL_R, vy: -ball.vy };
      cues.add(CUES.wallBounce);
    } else if (ball.y + BALL_R > FIELD_H && ball.vy > 0) {
      ball = { ...ball, y: FIELD_H - BALL_R, vy: -ball.vy };
      cues.add(CUES.wallBounce);
    }

    for (const side of ["left", "right"] as const) {
      const hit = resolveRect(ball, paddleRect(side, state.paddles[side].cy));
      if (!hit.hit) continue;
      if (hit.face === "left" || hit.face === "right") {
        ball = bouncePaddle(hit.ball, side, state.paddles[side]);
        cues.add(CUES.paddleHit);
      } else {
        ball = hit.ball;
        cues.add(CUES.wallBounce);
      }
    }

    for (const present of state.obstacles) {
      const rect = OBSTACLES[present.index];
      if (!rect) continue;
      const hit = resolveRect(ball, rect);
      if (hit.hit) {
        ball = hit.ball;
        cues.add(CUES.obstacleBounce);
      }
    }
  }
  return { ball: appendTrail(ball, simTime), cues };
}

function scoreAfterPoint(state: CaromState, ball: BallState): CaromState {
  let scorer: Side | null = null;
  if (ball.x - BALL_R > FIELD_W) scorer = "left";
  if (ball.x + BALL_R < 0) scorer = "right";
  if (!scorer) return { ...state, ball };

  const score = {
    p1: state.score.p1 + (scorer === "left" ? 1 : 0),
    p2: state.score.p2 + (scorer === "right" ? 1 : 0),
  };
  const leftWins = score.p1 >= WIN_SCORE && score.p1 - score.p2 >= WIN_LEAD;
  const rightWins = score.p2 >= WIN_SCORE && score.p2 - score.p1 >= WIN_LEAD;
  if (leftWins || rightWins) {
    return {
      ...state,
      score,
      winner: scorer,
      screen: "matchover",
      menuIndex: 0,
      ball,
    };
  }
  return {
    ...state,
    score,
    receiver: scorer === "left" ? "right" : "left",
    screen: "countdown",
    ball: parkedBall(),
  };
}

function menuItems(screen: Screen): readonly string[] {
  if (screen === "title") return TITLE_ITEMS;
  if (screen === "howto") return HOWTO_ITEM;
  if (screen === "paused") return PAUSE_ITEMS;
  if (screen === "matchover") return MATCHOVER_ITEMS;
  return [];
}

function itemRect(screen: Screen, index: number): MenuRect | null {
  const items = menuItems(screen);
  if (index < 0 || index >= items.length) return null;
  const w = screen === "howto" ? 240 : 360;
  const h = 54;
  const gap = 16;
  const startY =
    screen === "title"
      ? 360
      : screen === "howto"
        ? 590
        : screen === "paused"
          ? 314
          : 398;
  return { x: FIELD_CX - w / 2, y: startY + index * (h + gap), w, h };
}

function hitMenu(screen: Screen, x: number, y: number): number | null {
  const items = menuItems(screen);
  for (let index = 0; index < items.length; index += 1) {
    const rect = itemRect(screen, index);
    if (
      rect &&
      x >= rect.x &&
      x <= rect.x + rect.w &&
      y >= rect.y &&
      y <= rect.y + rect.h
    ) {
      return index;
    }
  }
  return null;
}

function pointerMenuAction(
  screen: Screen,
  api: UpdateApi,
  menuIndex: number,
): MenuAction {
  let index = menuIndex;
  let confirm = false;
  const pointer = api.input.pointer();
  const hovered = hitMenu(screen, pointer.x, pointer.y);
  if (hovered !== null) index = hovered;

  const samples = api.input.pointerSamples();
  const downById = new Map<number, number>();
  for (const sample of samples) {
    const sampleIndex = hitMenu(screen, sample.x, sample.y);
    if (sampleIndex !== null) index = sampleIndex;
    if (sample.type === "down" && sampleIndex !== null) {
      downById.set(sample.id, sampleIndex);
    }
    if (sample.type === "up" && sampleIndex !== null) {
      confirm = downById.get(sample.id) === sampleIndex;
      index = sampleIndex;
    }
  }
  return { menuIndex: index, confirm };
}

function moveMenu(
  state: DeepReadonly<CaromState>,
  direction: -1 | 1,
): CaromState {
  const items = menuItems(state.screen);
  if (items.length === 0) return state as CaromState;
  return {
    ...state,
    menuIndex: (state.menuIndex + direction + items.length) % items.length,
  };
}

function confirmMenu(state: DeepReadonly<CaromState>): CaromState {
  if (state.screen === "title") {
    const titleIndex = state.menuIndex;
    if (state.menuIndex === 0) {
      return { ...startMatch(state, "solo"), titleIndex };
    }
    if (state.menuIndex === 1) {
      return { ...startMatch(state, "versus"), titleIndex };
    }
    return { ...state, screen: "howto", menuIndex: 0, titleIndex };
  }
  if (state.screen === "howto") return returnToTitle(state);
  if (state.screen === "paused") {
    if (state.menuIndex === 0) return { ...state, screen: state.resumeScreen };
    if (state.menuIndex === 1) return startMatch(state, state.mode);
    return returnToTitle(state);
  }
  if (state.screen === "matchover") {
    if (state.menuIndex === 0) return startMatch(state, state.mode);
    return returnToTitle(state);
  }
  return state as CaromState;
}

function readInput(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
): CaromState {
  let next: CaromState = state as CaromState;

  if (api.input.pressed("mute")) {
    const muted = !api.audio.muted();
    api.audio.setMuted(muted);
    next = { ...next, muted };
  }

  const up = api.input.pressed("p1-up") || api.input.pressed("p2-up");
  const down = api.input.pressed("p1-down") || api.input.pressed("p2-down");
  const confirm = api.input.pressed("confirm");
  const back = api.input.pressed("back");
  const pause = api.input.pressed("pause");

  if (state.screen === "countdown" || state.screen === "playing") {
    if (pause) {
      return {
        ...next,
        screen: "paused",
        resumeScreen: state.screen,
        menuIndex: 0,
      };
    }
    return next;
  }

  if (state.screen === "paused" && (pause || back)) {
    return { ...next, screen: state.resumeScreen };
  }
  if (state.screen === "howto" && (confirm || back)) return returnToTitle(next);
  if (state.screen === "matchover" && back) return returnToTitle(next);

  const isMenu =
    state.screen === "title" ||
    state.screen === "paused" ||
    state.screen === "matchover" ||
    state.screen === "howto";
  if (!isMenu) return next;

  const moved = up || down;
  if (up) next = moveMenu(next, -1);
  else if (down) next = moveMenu(next, 1);
  else if (confirm) next = confirmMenu(next);

  if (!moved && !confirm) {
    const pointer = pointerMenuAction(state.screen, api, next.menuIndex);
    if (pointer.menuIndex !== next.menuIndex) {
      next = { ...next, menuIndex: pointer.menuIndex };
    }
    if (pointer.confirm) next = confirmMenu(next);
  }
  return next;
}

function advanceScreen(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
  dt: number,
): CaromState {
  const simTime = state.simTime + dt;
  let next: CaromState = { ...(state as CaromState), simTime };
  if (state.screen === "countdown" || state.screen === "playing") {
    next = advancePaddles(next, api, dt);
  }
  if (
    (state.screen === "countdown" || state.screen === "playing") &&
    next.ball
  ) {
    const advanced = advanceBall(next, simTime, dt);
    for (const cue of advanced.cues) api.audio.play(cue);
    if (!advanced.ball)
      return { ...next, ball: null, muted: api.audio.muted() };
    const served =
      state.screen === "countdown" && !advanced.ball.held
        ? "playing"
        : next.screen;
    next = { ...next, ball: advanced.ball, screen: served };
    if (next.screen === "playing") {
      const scored = scoreAfterPoint(next, advanced.ball);
      if (scored.score !== next.score) api.audio.play(CUES.score);
      next = scored;
    }
  }
  return { ...next, muted: api.audio.muted() };
}

function register(api: InitApi<CaromState>): void {
  for (const action of ACTIONS) {
    api.input.register(action, { keys: [...BINDINGS[action]] });
  }
  api.audio.define(CUES.paddleHit, {
    wave: "square",
    freq: 520,
    freqTo: 720,
    gain: 0.16,
    durationMs: 42,
  });
  api.audio.define(CUES.wallBounce, {
    wave: "triangle",
    freq: 260,
    freqTo: 160,
    gain: 0.12,
    durationMs: 56,
  });
  api.audio.define(CUES.obstacleBounce, {
    wave: "sawtooth",
    freq: 360,
    freqTo: 240,
    gain: 0.13,
    durationMs: 64,
  });
  api.audio.define(CUES.score, {
    wave: "sine",
    freq: 300,
    freqTo: 900,
    gain: 0.18,
    durationMs: 180,
  });
  api.diagnostics.register("screen", (s) => s.screen);
  api.diagnostics.register("mode", (s) => s.mode);
  api.diagnostics.register("score", (s) => `${s.score.p1}-${s.score.p2}`);
  api.diagnostics.register("ball", (s) =>
    s.ball ? `${s.ball.x.toFixed(1)}, ${s.ball.y.toFixed(1)}` : "none",
  );
  api.diagnostics.register("speed", (s) =>
    s.ball ? Math.hypot(s.ball.vx, s.ball.vy) : 0,
  );
  api.diagnostics.register("spin", (s) => s.ball?.spin ?? 0);
}

function snapshot(state: DeepReadonly<CaromState>): Snapshot {
  return {
    version: CAROM_DEBUG_VERSION,
    screen: state.screen,
    mode: state.mode,
    menuIndex: state.menuIndex,
    titleIndex: state.titleIndex,
    resumeScreen: state.resumeScreen,
    score: { ...state.score },
    winner: state.winner,
    muted: state.muted,
    paddles: {
      left: { ...state.paddles.left },
      right: { ...state.paddles.right },
    },
    ai: { ...state.ai },
    receiver: state.receiver,
    ball: state.ball
      ? {
          ...state.ball,
          trail: [...state.ball.trail],
          speed: Math.hypot(state.ball.vx, state.ball.vy),
        }
      : null,
    obstacles: state.obstacles.map((item) => ({ ...item })),
    simTime: state.simTime,
  };
}

function debugApi(): CaromDebugApi {
  return {
    version: CAROM_DEBUG_VERSION,
    clearWorld: (state) => ({ ...state, ball: null, obstacles: [] }),
    spawnBall: (state) => ({ ...state, ball: parkedBall() }),
    spawnObstacle: (state, index) => {
      const placed = obstacle(index);
      return {
        ...state,
        obstacles: [
          ...state.obstacles.filter((item) => item.index !== index),
          placed,
        ].sort((a, b) => a.index - b.index),
      };
    },
    reset: (state) => titleState(state.muted),
    reconcile: (state) => state as CaromState,
    setScreen: (state, screen) => ({ ...state, screen }),
    setMode: (state, mode) => ({ ...state, mode }),
    setMenuIndex: (state, menuIndex) => ({ ...state, menuIndex }),
    setTitleIndex: (state, titleIndex) => ({ ...state, titleIndex }),
    setResumeScreen: (state, resumeScreen) => ({ ...state, resumeScreen }),
    setScore: (state, p1, p2) => ({ ...state, score: { p1, p2 } }),
    setWinner: (state, winner) => ({ ...state, winner }),
    setReceiver: (state, receiver) => ({ ...state, receiver }),
    setPaddleCy: (state, side, cy) =>
      withPaddle(state, side, { ...state.paddles[side], cy }),
    setPaddleVy: (state, side, drivenVy) =>
      withPaddle(state, side, { ...state.paddles[side], drivenVy }),
    setPaddleDriven: (state, side, driven) =>
      withPaddle(state, side, { ...state.paddles[side], driven }),
    setBallPosition: (state, x, y) => ({
      ...state,
      ball: { ...requireBall(state), x, y },
    }),
    setBallVelocity: (state, vx, vy) => ({
      ...state,
      ball: { ...requireBall(state), vx, vy },
    }),
    setBallSpin: (state, spin) => ({
      ...state,
      ball: { ...requireBall(state), spin },
    }),
    setBallHeld: (state, held) => ({
      ...state,
      ball: { ...requireBall(state), held },
    }),
    setBallHoldTimer: (state, holdTimer) => ({
      ...state,
      ball: { ...requireBall(state), holdTimer },
    }),
    setBallServeSign: (state, serveSign) => ({
      ...state,
      ball: { ...requireBall(state), serveSign },
    }),
    drawBallServeSign: (state) => ({
      ...state,
      ball: { ...requireBall(state), serveSign: serveSign() },
    }),
    setAiTracking: (state, tracking) => ({
      ...state,
      ai: { ...state.ai, tracking },
    }),
    setAiMovement: (state, movement) => ({
      ...state,
      ai: { ...state.ai, movement },
    }),
    setMuted: (state, muted) => ({ ...state, muted }),
    snapshot,
    menuItemRect: (state, index) => itemRect(state.screen, index),
  };
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function drawField(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  const glow = ctx.createRadialGradient(
    FIELD_CX,
    FIELD_CY,
    60,
    FIELD_CX,
    FIELD_CY,
    680,
  );
  glow.addColorStop(0, "#102530");
  glow.addColorStop(1, BACKGROUND);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);

  ctx.strokeStyle = "rgba(237,247,255,0.18)";
  ctx.lineWidth = 3;
  ctx.setLineDash([18, 20]);
  ctx.beginPath();
  ctx.moveTo(NET_X, 42);
  ctx.lineTo(NET_X, FIELD_H - 42);
  ctx.stroke();
  ctx.setLineDash([]);

  for (const item of state.obstacles) {
    ctx.fillStyle = OBSTACLE_COLOR;
    drawRoundRect(
      ctx,
      item.cx - OBSTACLE_HW,
      item.cy - OBSTACLE_HH,
      OBSTACLE_W,
      OBSTACLE_H,
      10,
    );
  }

  ctx.fillStyle = LEFT_COLOR;
  drawRoundRect(
    ctx,
    P1_X0,
    state.paddles.left.cy - PADDLE_HALF,
    PADDLE_W,
    PADDLE_H,
    8,
  );
  ctx.fillStyle = RIGHT_COLOR;
  drawRoundRect(
    ctx,
    P2_X0,
    state.paddles.right.cy - PADDLE_HALF,
    PADDLE_W,
    PADDLE_H,
    8,
  );

  if (state.ball) {
    const trail = state.ball.trail;
    for (let i = 1; i < trail.length; i += 1) {
      const age = state.simTime - trail[i].t;
      const alpha = clamp(1 - age / TRAIL_TIME, 0, 1) * 0.5;
      ctx.strokeStyle = `rgba(255,246,166,${alpha})`;
      ctx.lineWidth = BALL_R * 1.4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
      ctx.lineTo(trail[i].x, trail[i].y);
      ctx.stroke();
    }
    ctx.fillStyle = BALL_COLOR;
    ctx.beginPath();
    ctx.arc(state.ball.x, state.ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHud(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = "700 52px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(String(state.score.p1), FIELD_CX - 116, 24);
  ctx.fillText(String(state.score.p2), FIELD_CX + 116, 24);
  ctx.font = "700 18px Inter, system-ui, sans-serif";
  ctx.fillStyle = DIM_TEXT;
  ctx.fillText(
    state.mode === "solo" ? "SOLO DUEL" : "VERSUS DUEL",
    FIELD_CX,
    34,
  );
}

function drawMenu(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
  title: string,
  subtitle: string,
): void {
  ctx.fillStyle = PANEL;
  drawRoundRect(ctx, 360, 86, 560, 548, 18);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = "800 82px Inter, system-ui, sans-serif";
  ctx.fillText(title, FIELD_CX, 190);
  ctx.font = "500 20px Inter, system-ui, sans-serif";
  ctx.fillStyle = DIM_TEXT;
  ctx.fillText(subtitle, FIELD_CX, 258);

  const items = menuItems(state.screen);
  for (let index = 0; index < items.length; index += 1) {
    const rect = itemRect(state.screen, index);
    if (!rect) continue;
    const selected = index === state.menuIndex;
    ctx.fillStyle = selected
      ? "rgba(47,243,201,0.18)"
      : "rgba(237,247,255,0.06)";
    drawRoundRect(ctx, rect.x, rect.y, rect.w, rect.h, 8);
    ctx.strokeStyle = selected ? LEFT_COLOR : "rgba(237,247,255,0.15)";
    ctx.lineWidth = selected ? 3 : 1;
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    ctx.fillStyle = selected ? TEXT_COLOR : DIM_TEXT;
    ctx.font = "800 22px Inter, system-ui, sans-serif";
    ctx.fillText(items[index] ?? "", FIELD_CX, rect.y + rect.h / 2);
  }
}

function drawHowTo(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  drawMenu(state, ctx, "HOW TO PLAY", "Curve the rally, bank the angles");
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = "600 22px Inter, system-ui, sans-serif";
  const lines = [
    "Solo: W/S or arrow keys move the left paddle.",
    "Versus: W/S move left, arrow keys move right.",
    "Move as you strike to add spin. Downward motion bends the ball clockwise.",
    "Use the center obstacles for bank shots and pressure.",
    "First to 11 wins, with a two point lead.",
    "P or Escape pauses. M toggles sound.",
  ];
  lines.forEach((line, index) => ctx.fillText(line, 414, 304 + index * 38));
}

export const game: Game<CaromState, CaromDebugApi> = {
  initialize(api: InitApi<CaromState>): [CaromState, CaromDebugApi] {
    register(api);
    return [titleState(false), debugApi()];
  },

  update(
    state: DeepReadonly<CaromState>,
    api: UpdateApi,
    dt: number,
  ): CaromState {
    if (state.muted !== api.audio.muted()) api.audio.setMuted(state.muted);
    const inputState = readInput(state, api);
    return advanceScreen(inputState, api, dt);
  },

  render(state: DeepReadonly<CaromState>, api: RenderApi): void {
    const { ctx } = api;
    drawField(state, ctx);
    if (state.screen === "playing" || state.screen === "countdown") {
      drawHud(state, ctx);
      if (state.screen === "countdown" && state.ball) {
        ctx.fillStyle = TEXT_COLOR;
        ctx.font = "900 88px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          Math.ceil(state.ball.holdTimer).toString(),
          FIELD_CX,
          FIELD_CY,
        );
      }
    } else if (state.screen === "title") {
      drawMenu(state, ctx, TITLE_TEXT, "Spin-heavy paddle duels");
    } else if (state.screen === "howto") {
      drawHowTo(state, ctx);
    } else if (state.screen === "paused") {
      drawHud(state, ctx);
      drawMenu(state, ctx, "PAUSED", "The rally is waiting");
    } else if (state.screen === "matchover") {
      drawHud(state, ctx);
      const winner = state.winner === "left" ? "LEFT WINS" : "RIGHT WINS";
      drawMenu(
        state,
        ctx,
        winner,
        `Final score ${state.score.p1}-${state.score.p2}`,
      );
    }
  },
};
