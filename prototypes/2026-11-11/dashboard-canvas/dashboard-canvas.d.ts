/* Types for dashboard-canvas.js (That Layover Life, 02 · Your travel dashboard, prototype 12 Nov 2026). */

export type ExportType = 'lottie' | 'svg' | 'canvas' | 'standin';
export type SegmentKey = 'A' | 'B' | 'C' | 'UNFOLD';
export type DashState =
  | 'idle' | 'loading' | 'ready'
  | 'playing:A' | 'playing:B' | 'playing:C' | 'playing:unfold'
  | 'paused:offscreen' | 'reduced-motion' | 'error';
export type TriggerName =
  | 'view' | 'stamp:add' | 'stamp:remove' | 'cta:enter' | 'cta:leave'
  | 'signup:success' | 'pet:enter' | 'pet:leave';

export interface Marker { name: string; from: number; to: number; }
export interface UnfoldMarker { name: string; sequence?: Array<'A' | 'B' | 'C'>; from?: number; to?: number; }

export interface SvgTimelineEntry { target: string; from: number; to: number; keyframes: Keyframe[]; easing?: string; }

export interface CanvasScene {
  seek(frame: number): void;
  resize?(cssWidth: number, cssHeight: number, dpr: number): void;
  setData?(data: unknown): void;
  totalFrames?: number;
  fps?: number;
  destroy?(): void;
}

export interface Hub { code: string; name: string; lat: number; lon: number; x?: number; y?: number; note?: string; }

export interface PawAsset {
  type: ExportType; assetUrl?: string; animationData?: object | string | null; renderer?: 'svg' | 'canvas';
  fps?: number; totalFrames?: number; enter: [number, number]; leave: [number, number];
}

export interface FableConfig {
  type: ExportType;
  assetUrl: string;
  animationData: object | string | null;
  svg: string;
  timeline: SvgTimelineEntry[];
  create: ((mount: HTMLElement) => CanvasScene | Promise<CanvasScene>) | null;
  moduleUrl: string;
  renderer: 'svg' | 'canvas';
  lottieBuild: 'light' | 'full';
  fps: number;
  totalFrames: number;
  aspectRatio: [number, number];
  speed: number;
  loadTimeoutMs: number;
  markers: { A: Marker; B: Marker; C: Marker; UNFOLD: UnfoldMarker };
  paw: { mode: 'css' | 'layer' | 'asset'; layer: string; asset: PawAsset };
  hubs: Hub[];
  sampleRoute: string[];
  standin: { simulatedLoadMs: number; failMode: 'none' | 'error' | 'timeout' };
}

export type PlayerEvent = 'frame' | 'loaded' | 'complete' | 'error';

/** The interface every adapter implements (lottie, svg, canvas, standin). */
export interface Player {
  readonly kind: ExportType;
  fps: number;
  totalFrames: number;
  load(): Promise<void>;
  playSegment(from: number, to: number, opts?: { speed?: number }): Promise<'complete' | 'interrupted'>;
  goToFrame(n: number): void;
  pause(): void;
  resume(): void;
  setSpeed(s: number): void;
  currentFrame(): number;
  destroy(): void;
  on(event: PlayerEvent, fn: (detail: any) => void): () => void;
  setData?(data: unknown): void;
  layer?(selector: string): Element | null;
  markers?(): Marker[];
}

export interface StampInput { code?: string; id?: string; label?: string; x?: number; y?: number; lat?: number; lon?: number; }
export interface Stamp { id: string; label: string; x: number; y: number; }

export interface ControllerEvents {
  statechange: { from: DashState; to: DashState; reason: string };
  trigger: { name: TriggerName; detail?: unknown };
  queue: { key: SegmentKey; action: string; queue?: SegmentKey | null; why?: string; replaced?: string };
  segmentstart: { key: SegmentKey; label: string; from: number; to: number };
  segmentend: { key: SegmentKey; label: string; frame: number; jumped?: boolean };
  frame: number;
  loaded: { kind: ExportType; segments: Record<SegmentKey, { steps: Array<{ label: string; from: number; to: number }> }> };
  error: { message: string };
  announce: { text: string };
  stamps: { count: number };
  visibility: { inView?: boolean; pageVisible?: boolean };
  reduced: { reduced: boolean };
  hub: { code: string; source: string };
  paw: { on: boolean; mode: 'css' | 'layer' | 'asset' };
  '*': { type: string; detail: unknown };
}

export interface Snapshot {
  state: DashState; frame: number; restFrame: number; queue: SegmentKey | null; running: SegmentKey | null;
  inView: boolean; pageVisible: boolean; reduced: boolean; aPlayed: boolean; player: ExportType; stamps: number;
  raf: { callbacks: number; whilePaused: number };
}

export declare const FABLE_CONFIG: FableConfig;

export declare class DashboardCanvas {
  constructor(root: HTMLElement, config?: FableConfig);
  readonly root: HTMLElement;
  config: FableConfig;
  state: DashState;
  player: Player | null;
  stamps: Stamp[];
  hubs: Array<Required<Pick<Hub, 'x' | 'y'>> & Hub>;
  start(): this;
  trigger(name: TriggerName, detail?: StampInput | string): void;
  setStamps(list: Array<StampInput | string>): void;
  on<K extends keyof ControllerEvents>(event: K, fn: (detail: ControllerEvents[K]) => void): () => void;
  setSpeed(s: number): void;
  reload(): void;
  snapshot(): Snapshot;
  destroy(): void;
}

export declare function mountDashboardCanvas(root?: HTMLElement | string, config?: FableConfig): DashboardCanvas | null;
export declare function projectToCanvas(lat: number, lon: number): { x: number; y: number };
export declare function formatCoords(lat: number, lon: number): string;
export declare function placesSentence(n: number): string;
