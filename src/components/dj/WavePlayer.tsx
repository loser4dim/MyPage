"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

type Props = {
  src: string;
  markers?: {
    time : number;
    label: string;
  }[];
};

function formatTime(t: number) {
  if (!Number.isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function WavePlayer({ src, markers}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const wsRef = useRef<WaveSurfer | null>(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [dur, setDur] = useState(0);
  const [pos, setPos] = useState(0);
  const [err, setErr] = useState<string | null>(null);

  // シーク中のチラつきを抑える
  const posRatio = useMemo(() => (dur > 0 ? pos / dur : 0), [pos, dur]);
  const [waveW, setWaveW] = useState(0);
  const BAR_W = 2;

  useEffect(() => {
    setReady(false);
    setPlaying(false);
    setDur(0);
    setPos(0);
    setErr(null);

    const container = containerRef.current;
    const audio = audioRef.current;
    

    if (!container || !audio) return;

    // 以前のインスタンスを破棄
    wsRef.current?.destroy();
    wsRef.current = null;

    const ws = WaveSurfer.create({
      container,
      height: 80,
      normalize: true,
      // 色はTailwindで寄せたいならここは変えてOK
      waveColor: "#9ca3af",      // gray-400
      progressColor: "#e5e7eb",  // gray-200
      cursorColor: "#e5e7eb",
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      // media に audio を渡すと、HTMLAudioElement を使える（controlsListも効く）
      media: audio,
      // 余計なクリック選択などを避けたいなら
      interact: true,
    });

    wsRef.current = ws;

    ws.on("ready", () => {
      setReady(true);
      const d = ws.getDuration();
      setDur(d);
      setPos(ws.getCurrentTime());
    });

    ws.on("play", () => setPlaying(true));
    ws.on("pause", () => setPlaying(false));

    // 再生中の位置更新
    ws.on("timeupdate", (t) => setPos(t));

    // クリックシーク等
    ws.on("seeking", (t) => setPos(t));
    ws.on("interaction", () => {
      // クリックした瞬間にUI反映されやすくする
      setPos(ws.getCurrentTime());
    });

    ws.on("error", (e) => {
      console.error("WaveSurfer error:", e);
      setErr("音声の読み込みに失敗しました（CORS/DNS/URLを確認）");
    });

    // これが実ロード
    setTimeout(() => {
      ws.load(src);
    }, 0);

    const ro = new ResizeObserver(() => {
      // v7 だと redraw() が安定。無ければ seekTo(…)で再描画誘発でもOK
      setWaveW(container.clientWidth);
      // @ts-expect-error: wavesurfer version differences
      ws?.renderer?.onResize?.();
    });
    setWaveW(container.clientWidth);
    ro.observe(container);

    return () => {
      ro.disconnect();
      ws.destroy();
      wsRef.current = null;
    };
  }, [src]);

  const toggle = async () => {
    const ws = wsRef.current;
    if (!ws || !ready) return;
    ws.playPause();
  };

  const seek = (ratio: number) => {
    const ws = wsRef.current;
    if (!ws || !ready) return;
    ws.seekTo(Math.min(1, Math.max(0, ratio)));
  };

  return (
    <div
      className="relative rounded-xl border border-neutral-600 bg-neutral-800 p-3"
      onContextMenu={(e) => e.preventDefault()}
    >
      <audio
        ref={audioRef}
        preload="metadata"
        crossOrigin="anonymous"
        controls={false}
        controlsList="nodownload noplaybackrate"
      />

      <div className="space-y-3">
        <div className="relative">
          <div
            ref={containerRef}
            className="relative h-[80px] w-full overflow-hidden rounded-lg bg-neutral-700 z-0"
          />

          {ready && dur > 0 && waveW > 0 && markers?.map((m, i) => {
            const r = m.time / dur;
            if (!Number.isFinite(r) || r < 0 || r > 1) return null;

            const leftPx = (BAR_W / 2) + r * (waveW - BAR_W);

            return (
              <div
                key={i}
                className="pointer-events-none absolute top-0 h-full z-20"
                style={{ left: `${leftPx}px` }}
              >
                <div className="h-full w-[2px] bg-highlight shadow-[0_0_10px_rgba(0,0,0,0)]" />
                {m.label && (
                  <div
                    className="
                      absolute -top-2 left-0
                      -translate-x-1/2 -translate-y-full
                      whitespace-nowrap
                      rounded-full
                      border border-highlight/40
                      bg-neutral-950/85
                      px-2 py-[2px]
                      text-[8px] font-medium
                      text-neutral-100
                      shadow-[0_2px_12px_rgba(0,0,0,0.55)]
                      backdrop-blur
                    "
                  >
                    {m.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <input
          className="w-full"
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={posRatio}
          onChange={(e) => seek(Number(e.target.value))}
          disabled={!ready}
        />

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={toggle}
            disabled={!ready}
            className="h-9 w-24 rounded-lg border border-neutral-600 bg-neutral-900 text-sm disabled:opacity-50"
          >
            {ready ? (playing ? "Pause" : "Play") : "Loading..."}
          </button>

          <div className="text-right text-xs text-neutral-300">
            <div>{formatTime(pos)}</div>
            <div className="text-neutral-400">{formatTime(dur)}</div>
          </div>
        </div>
      </div>


      {err && (
        <div className="mt-2 text-xs text-red-300">
          {err}
        </div>
      )}
    </div>
  );
}
