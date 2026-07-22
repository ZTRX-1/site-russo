import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Camera, X, Keyboard } from "lucide-react";

type Props = {
  onDetected: (code: string) => void;
  onClose?: () => void;
};

/**
 * Leitor de código de barras via câmera.
 * Usa a API nativa BarcodeDetector quando disponível (Android/Chrome)
 * e cai para ZXing em iOS / navegadores sem suporte.
 */
export function BarcodeScanner({ onDetected, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manual, setManual] = useState("");
  const stopRef = useRef<null | (() => void)>(null);

  useEffect(() => {
    let cancelled = false;
    let stream: MediaStream | null = null;

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (cancelled || !videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        // Preferência 1: BarcodeDetector nativo
        const anyWindow = window as unknown as {
          BarcodeDetector?: new (opts?: { formats?: string[] }) => {
            detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>>;
          };
        };
        if (anyWindow.BarcodeDetector) {
          const detector = new anyWindow.BarcodeDetector({
            formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39", "qr_code"],
          });
          let raf = 0;
          const loop = async () => {
            if (cancelled || !videoRef.current) return;
            try {
              const codes = await detector.detect(videoRef.current);
              if (codes.length > 0) {
                cancelled = true;
                onDetected(codes[0].rawValue);
                return;
              }
            } catch {
              /* ignore individual frame errors */
            }
            raf = requestAnimationFrame(loop);
          };
          loop();
          stopRef.current = () => cancelAnimationFrame(raf);
          return;
        }

        // Fallback ZXing
        const reader = new BrowserMultiFormatReader();
        const controls = await reader.decodeFromVideoElement(videoRef.current, (result) => {
          if (result && !cancelled) {
            cancelled = true;
            controls.stop();
            onDetected(result.getText());
          }
        });
        stopRef.current = () => controls.stop();
      } catch (e) {
        setError(
          e instanceof Error
            ? "Não foi possível abrir a câmera. Verifique as permissões e use HTTPS."
            : "Erro ao iniciar o leitor."
        );
      }
    }
    start();
    return () => {
      cancelled = true;
      stopRef.current?.();
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [onDetected]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-white">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Camera className="h-4 w-4" /> Leitor de código de barras
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-2 hover:bg-white/10"
          aria-label="Fechar leitor"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          muted
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-40 w-80 max-w-[80%] rounded-xl border-2 border-primary/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
        </div>
        {error && (
          <div className="absolute inset-x-4 top-4 rounded-md bg-red-600/95 px-3 py-2 text-sm text-white">
            {error}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (manual.trim()) onDetected(manual.trim());
        }}
        className="flex items-center gap-2 border-t border-white/10 bg-black/90 p-3"
      >
        <Keyboard className="h-4 w-4 text-white/60" />
        <input
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          placeholder="Digitar código manualmente..."
          className="flex-1 rounded-md bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
          inputMode="numeric"
          autoFocus={false}
        />
        <button
          type="submit"
          className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
        >
          Usar
        </button>
      </form>
    </div>
  );
}