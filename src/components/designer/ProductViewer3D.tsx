import React, { useState, Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html, RoundedBox } from '@react-three/drei';
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
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      setTexture(tex);
    };
    img.onerror = () => setError(true);
    img.src = url;

    return () => { img.onload = null; img.onerror = null; };
  }, [url]);

  return { texture, error };
}

// Front panel with design texture
function DesignPanel({ imageUrl, autoRotate }: { imageUrl: string; autoRotate: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { texture, error } = useImageTexture(imageUrl);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const aspect = texture ? texture.image.width / texture.image.height : 3 / 4;
  const height = 2.8;
  const width = height * aspect;
  const clampedWidth = Math.min(width, 3.5);

  return (
    <group ref={groupRef} position={[0, 0.4, 0]}>
      {/* Main design surface — slightly rounded box */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[clampedWidth, height, 0.06]} />
        {texture ? (
          <meshPhysicalMaterial
            map={texture}
            roughness={0.45}
            metalness={0.05}
            clearcoat={0.3}
            clearcoatRoughness={0.4}
            side={THREE.FrontSide}
          />
        ) : (
          <meshPhysicalMaterial
            color={error ? '#ff4444' : '#d4d4d8'}
            roughness={0.5}
            metalness={0.1}
          />
        )}
      </mesh>

      {/* Back side */}
      <mesh position={[0, 0, -0.031]}>
        <boxGeometry args={[clampedWidth, height, 0.001]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.8} />
      </mesh>

      {/* Frame / border */}
      <mesh>
        <boxGeometry args={[clampedWidth + 0.06, height + 0.06, 0.04]} />
        <meshStandardMaterial color="#a1a1aa" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Stand pole */}
      <mesh position={[0, -height / 2 - 0.35, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.7, 16]} />
        <meshStandardMaterial color="#71717a" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Stand base */}
      <mesh position={[0, -height / 2 - 0.7, 0]} receiveShadow>
        <cylinderGeometry args={[0.5, 0.55, 0.05, 32]} />
        <meshStandardMaterial color="#71717a" metalness={0.9} roughness={0.15} />
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
            3D Product Viewer — {title}
            <Badge variant="outline" className="text-[10px] ml-auto">Interactive</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 relative">
          <Canvas
            shadows
            camera={{ position: [0, 0.5, 5], fov: 40 }}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
          >
            <color attach="background" args={[bgColor]} />

            {/* Lighting */}
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
              <DesignPanel imageUrl={imageUrl} autoRotate={autoRotate} />
              <ContactShadows
                position={[0, -1.1, 0]}
                opacity={0.6}
                scale={10}
                blur={2.5}
                far={4}
              />
              <Environment preset="studio" />
            </Suspense>

            <OrbitControls
              enablePan={false}
              minDistance={2.5}
              maxDistance={8}
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
