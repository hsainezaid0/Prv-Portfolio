"use client";

// The hero's 3D scene, themed around network security:
// - a globe made of points: the internet,
// - glowing nodes on it: servers,
// - arcs between nodes with "packets" travelling along them: traffic,
// - a shield ring that scans the globe, and a few packets flagged as threats
//   that the shield catches (they flash and disappear).
// The camera follows the mouse, and the scene sinks as you scroll.

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import type { Theme } from "@/lib/ui";

const RADIUS = 2.2;

type Colors = { dots: string; nodes: string; arcs: string; packet: string; threat: string; ring: string };
const colors: Record<Theme, Colors> = {
  dark: { dots: "#a5b4fc", nodes: "#e0e7ff", arcs: "#6366f1", packet: "#e0e7ff", threat: "#a5b4fc", ring: "#6366f1" },
  light: { dots: "#4338ca", nodes: "#1e1b4b", arcs: "#6366f1", packet: "#4338ca", threat: "#1e1b4b", ring: "#4338ca" },
};

/** Evenly spread points on a sphere (Fibonacci lattice). */
function spherePoints(count: number, radius: number) {
  const points: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    points.push(new THREE.Vector3(Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius));
  }
  return points;
}

/** A curved arc between two points on the globe, lifted above the surface. */
function makeArc(a: THREE.Vector3, b: THREE.Vector3) {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const lift = 1 + a.distanceTo(b) * 0.28;
  mid.normalize().multiplyScalar(RADIUS * lift);
  return new THREE.QuadraticBezierCurve3(a, mid, b);
}

function Globe({ theme, compact }: { theme: Theme; compact: boolean }) {
  const c = colors[theme];
  const group = useRef<THREE.Group>(null);

  // Points of the globe surface
  const dotPositions = useMemo(() => {
    const pts = spherePoints(compact ? 900 : 1800, RADIUS);
    const arr = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => p.toArray(arr, i * 3));
    return arr;
  }, [compact]);

  // Servers: a few surface points, and arcs ("connections") between pairs of them
  const { nodes, arcs } = useMemo(() => {
    const all = spherePoints(60, RADIUS * 1.005);
    const nodes = all.filter((_, i) => i % 4 === 0); // 15 nodes
    const arcs: { curve: THREE.QuadraticBezierCurve3; points: THREE.Vector3[]; speed: number; offset: number; threat: boolean }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const j = (i * 7 + 3) % nodes.length;
      if (i === j) continue;
      const curve = makeArc(nodes[i], nodes[j]);
      arcs.push({ curve, points: curve.getPoints(40), speed: 0.12 + (i % 5) * 0.03, offset: i / nodes.length, threat: i % 4 === 1 });
    }
    return { nodes, arcs };
  }, []);

  const packetRefs = useRef<(THREE.Mesh | null)[]>([]);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (group.current) group.current.rotation.y += delta * 0.08;
    // Packets travel along their arc; "threat" packets are caught by the shield mid-way.
    arcs.forEach((arc, i) => {
      const mesh = packetRefs.current[i];
      if (!mesh) return;
      const p = (t * arc.speed + arc.offset) % 1;
      const caught = arc.threat && p > 0.55;
      mesh.visible = !caught;
      if (!caught) arc.curve.getPointAt(p, mesh.position);
      const flash = arc.threat && p > 0.45 && p <= 0.55;
      mesh.scale.setScalar(flash ? 1.8 + Math.sin(t * 30) * 0.5 : 1);
    });
    // The shield ring sweeps up and down the globe like a scanner.
    if (ringRef.current) {
      const y = Math.sin(t * 0.6) * RADIUS * 0.85;
      ringRef.current.position.y = y;
      const r = Math.sqrt(Math.max(RADIUS * RADIUS - y * y, 0.01)) * 1.04;
      ringRef.current.scale.set(r, r, 1);
    }
  });

  return (
    <group ref={group} rotation={[0.35, 0, 0.12]}>
      {/* surface */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dotPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.022} color={c.dots} transparent opacity={0.65} sizeAttenuation depthWrite={false} />
      </points>
      {/* faint inner sphere so the back of the globe is dimmed */}
      <mesh>
        <sphereGeometry args={[RADIUS * 0.985, 48, 48]} />
        <meshBasicMaterial color={theme === "dark" ? "#0b0a1f" : "#f8faff"} transparent opacity={0.55} />
      </mesh>
      {/* servers */}
      {nodes.map((n, i) => (
        <mesh key={i} position={n}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color={c.nodes} />
        </mesh>
      ))}
      {/* connections and packets */}
      {arcs.map((arc, i) => (
        <group key={i}>
          <Line points={arc.points} color={arc.threat ? c.threat : c.arcs} lineWidth={1.2} transparent opacity={arc.threat ? 0.55 : 0.4} dashed={arc.threat} dashSize={0.08} gapSize={0.06} />
          <mesh ref={(m) => { packetRefs.current[i] = m; }}>
            <sphereGeometry args={[arc.threat ? 0.05 : 0.035, 12, 12]} />
            <meshBasicMaterial color={arc.threat ? c.threat : c.packet} />
          </mesh>
        </group>
      ))}
      {/* scanning shield ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.985, 1, 96]} />
        <meshBasicMaterial color={c.ring} transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>
      {/* orbit rings */}
      <mesh rotation={[Math.PI / 2.4, 0.3, 0]}>
        <torusGeometry args={[RADIUS * 1.35, 0.006, 8, 160]} />
        <meshBasicMaterial color={c.arcs} transparent opacity={0.45} />
      </mesh>
      <mesh rotation={[Math.PI / 1.8, -0.5, 0.4]}>
        <torusGeometry args={[RADIUS * 1.6, 0.004, 8, 160]} />
        <meshBasicMaterial color={c.dots} transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

/** Moves the camera gently with the pointer and the page scroll. */
function CameraRig({ offsetX }: { offsetX: number }) {
  useFrame((state, delta) => {
    const { camera, pointer } = state;
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.5);
    const k = 1 - Math.exp(-3 * delta);
    camera.position.x += (pointer.x * 0.7 + offsetX - camera.position.x) * k;
    camera.position.y += (pointer.y * 0.45 - scroll * 1.4 - camera.position.y) * k;
    camera.position.z += (7.5 + scroll * 2 - camera.position.z) * k;
    camera.lookAt(offsetX, -scroll * 0.9, 0);
  });
  return null;
}

/** Background "data dust" drifting slowly. */
function Dust({ count, color }: { count: number; color: string }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 24;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 4;
    }
    return arr;
  }, [count]);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 0.015;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color={color} transparent opacity={0.45} sizeAttenuation depthWrite={false} />
    </points>
  );
}

type HeroSceneProps = { theme: Theme; animate: boolean; compact: boolean };

export default function HeroScene({ theme, animate, compact }: HeroSceneProps) {
  // On wide screens the globe sits to the right of the headline.
  const offsetX = compact ? 0 : -2.4;
  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={animate ? "always" : "demand"}
      eventSource={document.body}
      eventPrefix="client"
      aria-hidden="true"
    >
      <CameraRig offsetX={offsetX} />
      <Dust count={compact ? 250 : 700} color={colors[theme].dots} />
      <group position={[0, compact ? -1.2 : 0, 0]} scale={compact ? 0.85 : 1}>
        <Globe theme={theme} compact={compact} />
      </group>
    </Canvas>
  );
}
