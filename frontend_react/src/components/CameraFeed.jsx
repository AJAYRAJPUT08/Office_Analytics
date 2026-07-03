import { useEffect, useState } from "react";

const DEMO_VIDEO_URL = "https://cdn.coverr.co/videos/coverr-walking-into-an-office-9013/1080p.mp4";

/**
 * Live CCTV feed panel. Tries the real backend MJPEG stream (/video)
 * first; if the backend reports no physical camera, or the stream
 * drops mid-play, falls back to a looping demo video so the
 * dashboard never shows a blank panel.
 */
export default function CameraFeed({ cameraAvailable, tall = false }) {
  const [streamFailed, setStreamFailed] = useState(false);
  const [timestamp, setTimestamp] = useState("");
  const [videoSrc, setVideoSrc] = useState(() => `/video?t=${Date.now()}`);

  useEffect(() => {
    // Re-mount the MJPEG stream fresh whenever camera availability changes.
    setStreamFailed(false);
    setVideoSrc(`/video?t=${Date.now()}`);
  }, [cameraAvailable]);

  useEffect(() => {
    function tick() {
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-GB").split("/").join("-");
      const timeStr = now.toLocaleTimeString("en-US", { hour12: true });
      setTimestamp(`${dateStr} ${timeStr}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const showDemo = !cameraAvailable || streamFailed;

  return (
    <div className={`video-panel-body${tall ? " tall" : ""}`}>
      {showDemo ? (
        <video src={DEMO_VIDEO_URL} autoPlay loop muted playsInline />
      ) : (
        <img src={videoSrc} alt="Live CCTV Feed" onError={() => setStreamFailed(true)} />
      )}
      <span className="video-tag">CAM 01</span>
      <span className="video-timestamp">{timestamp}</span>
      <span className="video-location">MAIN ENTRANCE</span>
    </div>
  );
}
