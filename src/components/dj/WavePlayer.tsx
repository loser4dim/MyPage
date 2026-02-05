"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

type Props = {
  src: string;
};

function formatTime(t: number) {
  if (!Number.isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function WavePlayer({ src }: Props) {
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
    ws.load(src);

    const ro = new ResizeObserver(() => {
      // v7 だと redraw() が安定。無ければ seekTo(…)で再描画誘発でもOK
      // @ts-expect-error: wavesurfer version differences
      ws?.renderer?.onResize?.();
    });
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
      onContextMenu={(e) => e.preventDefault()} // “簡単に”DLさせない（完全防止ではない）
    >
      {/* 見えない audio（controls を出さない） */}
      <audio
        ref={audioRef}
        preload="metadata"
        crossOrigin="anonymous"
        controls={false}
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          disabled={!ready}
          className="h-9 w-24 rounded-lg border border-neutral-600 bg-neutral-900 text-sm disabled:opacity-50"
        >
          {ready ? (playing ? "Pause" : "Play") : "Loading..."}
        </button>

        <div className="flex-1">
          <div
            ref={containerRef}
            className="h-[80px] w-full overflow-hidden rounded-lg bg-neutral-700"
          />
          <input
            className="mt-2 w-full"
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={posRatio}
            onChange={(e) => seek(Number(e.target.value))}
            disabled={!ready}
          />
        </div>

        <div className="w-24 text-right text-xs text-neutral-300">
          <div>{formatTime(pos)}</div>
          <div className="text-neutral-400">{formatTime(dur)}</div>
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
