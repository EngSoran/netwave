"use client";
import { useEffect, useRef } from "react";
import styles from "./AnimatedNetworkBackground.module.css";

// Animated SVG/canvas background: fiber optic lines, wifi arcs, network nodes
interface AnimatedNetworkBackgroundProps {
  theme?: "default" | "glass";
}

export default function AnimatedNetworkBackground({ theme = "default" }: AnimatedNetworkBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Responsive resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    // Theme-based color palettes
    const lineColor = theme === "glass"
      ? () => `hsla(${200 + Math.random() * 60}, 100%, 85%, 0.7)`
      : () => `hsla(${180 + Math.random() * 120}, 80%, 60%, 0.5)`;
    const nodeColor = theme === "glass"
      ? () => `hsla(${200 + Math.random() * 60}, 100%, 95%, 0.9)`
      : () => `hsla(${180 + Math.random() * 120}, 100%, 70%, 0.8)`;
    const wifiArcColor = theme === "glass"
      ? () => `hsla(210, 100%, 95%, 0.6)`
      : () => `hsla(210, 100%, 70%, 0.5)`;

    // Fiber optic lines
    const lines = Array.from({ length: 8 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 0.5 + Math.random() * 1.2,
      length: 200 + Math.random() * 200,
      angle: Math.random() * Math.PI * 2,
      color: lineColor()
    }));

    // Network nodes
    const nodes = Array.from({ length: 12 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      pulse: Math.random() * Math.PI * 2,
      color: nodeColor()
    }));

    // WiFi arcs
    const wifiArcs = Array.from({ length: 4 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      baseRadius: 18 + Math.random() * 30,
      color: wifiArcColor()
    }));


    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Draw fiber optic lines
      lines.forEach((line, i) => {
        if (!ctx) return;
        ctx.save();
        ctx.strokeStyle = line.color;
        ctx.shadowColor = line.color;
        ctx.shadowBlur = 12;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        const dx = Math.cos(line.angle) * line.length;
        const dy = Math.sin(line.angle) * line.length;
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x + dx, line.y + dy);
        ctx.stroke();
        ctx.restore();
        // Animate
        line.x += Math.cos(line.angle) * line.speed;
        line.y += Math.sin(line.angle) * line.speed;
        // Wrap
        if (line.x > width || line.x < 0 || line.y > height || line.y < 0) {
          line.x = Math.random() * width;
          line.y = Math.random() * height;
          line.angle = Math.random() * Math.PI * 2;
        }
      });

      // Draw network nodes (pulsing)
      nodes.forEach((node) => {
        if (!ctx) return;
        ctx.save();
        ctx.beginPath();
        const pulse = 6 + Math.sin(Date.now() / 500 + node.pulse) * 3;
        ctx.arc(node.x, node.y, pulse, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.restore();
      });

      // Draw WiFi arcs
      wifiArcs.forEach((arc, i) => {
        if (!ctx) return;
        ctx.save();
        ctx.strokeStyle = arc.color;
        ctx.shadowColor = arc.color;
        ctx.shadowBlur = 8;
        ctx.lineWidth = 2.5;
        for (let j = 1; j <= 3; j++) {
          ctx.beginPath();
          ctx.arc(arc.x, arc.y, arc.baseRadius + j * 10 + Math.sin(Date.now() / 800 + i) * 2, Math.PI * 1.1, Math.PI * 1.9);
          ctx.stroke();
        }
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Use CSS module classes for styling
  const className = theme === "glass"
    ? `${styles["network-bg-canvas"]} ${styles.glass}`
    : styles["network-bg-canvas"];

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  );
}
