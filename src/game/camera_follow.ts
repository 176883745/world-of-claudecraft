export interface CameraFollowInput {
  camYaw: number;
  interpFacing: number;
  frameDt: number;
  lastInterpFacing: number | null;
  mouselook: boolean;
  moving: boolean;
  clickMoving?: boolean;
  orbiting: boolean;
}

export interface CameraFollowResult {
  camYaw: number;
  lastInterpFacing: number;
}

const SETTLE_RATE = 6;
const MAX_SETTLE_STEP = 0.16;
const CLICK_MOVE_SETTLE_RATE = 1.8;
const CLICK_MOVE_MAX_SETTLE_STEP = 0.022;
const CLICK_MOVE_BIG_TURN_FLOOR = 0.18;
const CLICK_MOVE_SMALL_TURN = 0.35;

export function wrapAngle(d: number): number {
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
}

function clickMoveSettleScale(absDelta: number): number {
  const span = Math.PI - CLICK_MOVE_SMALL_TURN;
  const t = span > 0 ? Math.max(0, Math.min(1, (Math.PI - absDelta) / span)) : 1;
  const eased = t * t * (3 - 2 * t);
  return CLICK_MOVE_BIG_TURN_FLOOR + (1 - CLICK_MOVE_BIG_TURN_FLOOR) * eased;
}

export function updateFollowCameraYaw(input: CameraFollowInput): CameraFollowResult {
  let camYaw = input.camYaw;
  if (!input.mouselook) {
    if (input.orbiting) return { camYaw, lastInterpFacing: input.interpFacing };
    if (input.lastInterpFacing !== null && !input.clickMoving) camYaw += wrapAngle(input.interpFacing - input.lastInterpFacing);
    if (input.moving && !input.orbiting) {
      const delta = wrapAngle(input.interpFacing - camYaw);
      const clickMoveScale = input.clickMoving ? clickMoveSettleScale(Math.abs(delta)) : 1;
      const rate = input.clickMoving ? CLICK_MOVE_SETTLE_RATE * clickMoveScale : SETTLE_RATE;
      const maxStep = input.clickMoving ? CLICK_MOVE_MAX_SETTLE_STEP * clickMoveScale : MAX_SETTLE_STEP;
      const step = delta * (1 - Math.exp(-Math.max(0, input.frameDt) * rate));
      camYaw += Math.max(-maxStep, Math.min(maxStep, step));
    }
  }
  return { camYaw, lastInterpFacing: input.interpFacing };
}
