import React, { useState, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Eye, Sun, RotateCcw } from 'lucide-react';
import * as THREE from 'three';

interface ProductViewer3DProps {
  imageUrl: string;
  title: string;
}

function useImageTexture(url: string) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [error, setError] = useState(false);

  React.useEffect(() => {
    setError(false);
    setTexture(null);
    if (!url) { setError(true); return; }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const tex = new THREE.Texture(img);
      tex.needsUpdate = true;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      setTexture(tex);
    };
    img.onerror = () => setError(true);
    img.src = url;

    return () => { img.onload = null; img.onerror = null; };
  }, [url]);

  return { texture, error };
}

const SKIN_COLOR = '#e8beac';
const HAIR_COLOR = '#3d2b1f';

// Human mannequin with clothing texture mapped onto the torso
function HumanMannequin({ imageUrl, autoRotate }: { imageUrl: string; autoRotate: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { texture, error } = useImageTexture(imageUrl);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  const clothMat = texture
    ? new THREE.MeshPhysicalMaterial({
        map: texture,
        roughness: 0.7,
        metalness: 0.0,
        clearcoat: 0.1,
        side: THREE.DoubleSide,
      })
    : new THREE.MeshPhysicalMaterial({
        color: error ? '#ff4444' : '#6366f1',
        roughness: 0.6,
      });

  const skinMat = new THREE.MeshStandardMaterial({
    color: SKIN_COLOR,
    roughness: 0.8,
    metalness: 0.0,
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: HAIR_COLOR,
    roughness: 0.9,
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* === HEAD === */}
      <mesh position={[0, 2.65, 0]} material={skinMat} castShadow>
        <sphereGeometry args={[0.32, 32, 32]} />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 2.78, -0.05]} material={hairMat}>
        <sphereGeometry args={[0.33, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* === NECK === */}
      <mesh position={[0, 2.25, 0]} material={skinMat} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.2, 16]} />
      </mesh>

      {/* === UPPER TORSO (with clothing texture) === */}
      <mesh position={[0, 1.75, 0]} material={clothMat} castShadow>
        <cylinderGeometry args={[0.52, 0.45, 0.8, 32]} />
      </mesh>

      {/* === LOWER TORSO (with clothing texture) === */}
      <mesh position={[0, 1.15, 0]} material={clothMat} castShadow>
        <cylinderGeometry args={[0.45, 0.38, 0.5, 32]} />
      </mesh>

      {/* === WAIST / HIP (clothing) === */}
      <mesh position={[0, 0.7, 0]} material={clothMat} castShadow>
        <cylinderGeometry args={[0.38, 0.42, 0.4, 32]} />
      </mesh>

      {/* === SHOULDERS === */}
      {/* Left shoulder */}
      <mesh position={[-0.58, 2.0, 0]} material={clothMat} castShadow>
        <sphereGeometry args={[0.16, 16, 16]} />
      </mesh>
      {/* Right shoulder */}
      <mesh position={[0.58, 2.0, 0]} material={clothMat} castShadow>
        <sphereGeometry args={[0.16, 16, 16]} />
      </mesh>

      {/* === UPPER ARMS (with sleeves / clothing) === */}
      {/* Left upper arm */}
      <mesh position={[-0.65, 1.6, 0]} rotation={[0, 0, 0.15]} material={clothMat} castShadow>
        <cylinderGeometry args={[0.11, 0.1, 0.6, 16]} />
      </mesh>
      {/* Right upper arm */}
      <mesh position={[0.65, 1.6, 0]} rotation={[0, 0, -0.15]} material={clothMat} castShadow>
        <cylinderGeometry args={[0.11, 0.1, 0.6, 16]} />
      </mesh>

      {/* === FOREARMS (skin) === */}
      {/* Left forearm */}
      <mesh position={[-0.7, 1.05, 0]} rotation={[0, 0, 0.08]} material={skinMat} castShadow>
        <cylinderGeometry args={[0.09, 0.08, 0.55, 16]} />
      </mesh>
      {/* Right forearm */}
      <mesh position={[0.7, 1.05, 0]} rotation={[0, 0, -0.08]} material={skinMat} castShadow>
        <cylinderGeometry args={[0.09, 0.08, 0.55, 16]} />
      </mesh>

      {/* === HANDS (skin) === */}
      <mesh position={[-0.72, 0.72, 0]} material={skinMat}>
        <sphereGeometry args={[0.08, 12, 12]} />
      </mesh>
      <mesh position={[0.72, 0.72, 0]} material={skinMat}>
        <sphereGeometry args={[0.08, 12, 12]} />
      </mesh>

      {/* === UPPER LEGS (clothing - pants/skirt) === */}
      <mesh position={[-0.2, 0.2, 0]} rotation={[0, 0, 0.03]} material={clothMat} castShadow>
        <cylinderGeometry args={[0.17, 0.14, 0.6, 16]} />
      </mesh>
      <mesh position={[0.2, 0.2, 0]} rotation={[0, 0, -0.03]} material={clothMat} castShadow>
        <cylinderGeometry args={[0.17, 0.14, 0.6, 16]} />
      </mesh>

      {/* === LOWER LEGS (skin or clothing) === */}
      <mesh position={[-0.22, -0.35, 0]} material={skinMat} castShadow>
        <cylinderGeometry args={[0.12, 0.1, 0.5, 16]} />
      </mesh>
      <mesh position={[0.22, -0.35, 0]} material={skinMat} castShadow>
        <cylinderGeometry args={[0.12, 0.1, 0.5, 16]} />
      </mesh>

      {/* === FEET === */}
      <mesh position={[-0.22, -0.65, 0.06]} material={new THREE.MeshStandardMaterial({ color: '#27272a', roughness: 0.9 })}>
        <boxGeometry args={[0.14, 0.1, 0.26]} />
      </mesh>
      <mesh position={[0.22, -0.65, 0.06]} material={new THREE.MeshStandardMaterial({ color: '#27272a', roughness: 0.9 })}>
        <boxGeometry args={[0.14, 0.1, 0.26]} />
      </mesh>

      {/* === STAND === */}
      <mesh position={[0, -0.75, 0]} receiveShadow>
        <cylinderGeometry args={[0.6, 0.65, 0.04, 32]} />
        <meshStandardMaterial color="#52525b" metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-muted-foreground">Loading 3D viewer...</p>
      </div>
    </Html>
  );
}

const ProductViewer3D: React.FC<ProductViewer3DProps> = ({ imageUrl, title }) => {
  const [lightIntensity, setLightIntensity] = useState([1.8]);
  const [bgColor, setBgColor] = useState('#1a1a2e');
  const [autoRotate, setAutoRotate] = useState(true);

  const bgOptions = [
    { color: '#1a1a2e', label: 'Dark' },
    { color: '#f5f5f4', label: 'Light' },
    { color: '#2d1b69', label: 'Purple' },
    { color: '#1b3a2d', label: 'Green' },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5 text-xs">
          <Eye className="w-3 h-3" /> 3D View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[600px] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="text-sm font-heading flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            3D Body Fit Preview — {title}
            <Badge variant="outline" className="text-[10px] ml-auto">Body Fit</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 relative">
          <Canvas
            shadows
            camera={{ position: [0, 1.2, 5.5], fov: 35 }}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
          >
            <color attach="background" args={[bgColor]} />
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[5, 8, 5]}
              intensity={lightIntensity[0]}
              castShadow
              shadow-mapSize={[2048, 2048]}
              shadow-bias={-0.0001}
            />
            <directionalLight position={[-3, 4, -2]} intensity={0.4} color="#b4c6ef" />
            <spotLight position={[0, 6, 3]} intensity={0.5} angle={0.4} penumbra={0.8} />

            <Suspense fallback={<LoadingFallback />}>
              <HumanMannequin imageUrl={imageUrl} autoRotate={autoRotate} />
              <ContactShadows position={[0, -1.1, 0]} opacity={0.6} scale={10} blur={2.5} far={4} />
              <Environment preset="studio" />
            </Suspense>

            <OrbitControls
              target={[0, 1.0, 0]}
              enablePan={false}
              minDistance={2.5}
              maxDistance={9}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 1.5}
              enableDamping
              dampingFactor={0.05}
            />
          </Canvas>

          {/* Controls overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none">
            <div className="bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border space-y-2 w-52 pointer-events-auto">
              <div className="flex items-center gap-2">
                <Sun className="w-3 h-3 text-muted-foreground" />
                <Label className="text-[10px] text-muted-foreground">Lighting</Label>
              </div>
              <Slider value={lightIntensity} onValueChange={setLightIntensity} min={0.2} max={3} step={0.1} />
              <div className="flex gap-1 mt-1">
                {bgOptions.map(opt => (
                  <button
                    key={opt.color}
                    onClick={() => setBgColor(opt.color)}
                    className={`w-5 h-5 rounded-full border-2 transition-transform ${bgColor === opt.color ? 'border-primary scale-110' : 'border-muted'}`}
                    style={{ backgroundColor: opt.color }}
                    title={opt.label}
                  />
                ))}
              </div>
              <button
                onClick={() => setAutoRotate(r => !r)}
                className={`flex items-center gap-1.5 text-[10px] mt-1 ${autoRotate ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <RotateCcw className="w-3 h-3" />
                {autoRotate ? 'Auto-rotate ON' : 'Auto-rotate OFF'}
              </button>
            </div>
            <div className="bg-card/90 backdrop-blur-sm rounded-lg p-2 border border-border pointer-events-auto">
              <p className="text-[10px] text-muted-foreground text-center">Drag to rotate • Scroll to zoom</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductViewer3D;
