import type { AnimationPlayback, PlayState } from "./types.js";

export interface PlaybackController extends AnimationPlayback {
  /** @internal */
  _resolveFinished(): void;
}

export function createPlayback(handlers: {
  onCancel: () => void;
  onComplete: () => void;
}): PlaybackController {
  let playState: PlayState = "running";
  let resolveFinished!: () => void;
  let rejectFinished!: (reason?: unknown) => void;
  let settled = false;

  const finished = new Promise<void>((resolve, reject) => {
    resolveFinished = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    rejectFinished = (reason?: unknown) => {
      if (settled) return;
      settled = true;
      reject(reason ?? abortError());
    };
  });

  // Prevent unhandled rejection when nobody awaits cancel.
  finished.catch(() => {});

  const playback: PlaybackController = {
    get playState() {
      return playState;
    },
    finished,
    cancel() {
      if (playState !== "running") return;
      playState = "cancelled";
      handlers.onCancel();
      rejectFinished();
    },
    complete() {
      if (playState !== "running") return;
      playState = "finished";
      handlers.onComplete();
      resolveFinished();
    },
    _resolveFinished() {
      if (playState === "cancelled") return;
      playState = "finished";
      resolveFinished();
    },
  };

  return playback;
}

function abortError(): Error {
  if (typeof DOMException !== "undefined") {
    return new DOMException("Animation cancelled", "AbortError");
  }
  const err = new Error("Animation cancelled");
  err.name = "AbortError";
  return err;
}
