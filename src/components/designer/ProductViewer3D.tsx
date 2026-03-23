import React, { useState, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html, PresentationControls } from '@react-three/drei';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Eye, RotateCcw, ZoomIn, ZoomOut, Maximize2, Sun } from 'lucide-react';
import * as THREE from 'three';

interface ProductViewer3DProps {
  imageUrl: string;
  title: string;
}

// A rotating product card/plane with the design texture mapped onto it
function ProductMesh({ imageUrl, color }: { imageUrl: string; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [loadError, setLoadError] = useState(false);

  React.useEffect(() => {
    setLoadError(false);
    setTexture(null);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const tex = new THREE.Texture(img);
      tex.needsUpdate = true;
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
    };
    img.onerror = () => {
      setLoadError(true);
    };
    img.src = imageUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  const aspect = texture ? texture.image.width / texture.image.height : 4 / 3;
  const width = 2.4;
  const height = width / aspect;

  return (
    <group>
      {/* Main product plane */}
      <mesh ref={meshRef} castShadow position={[0, 0.3, 0]}>
        <boxGeometry args={[width, height, 0.08]} />
        {texture ? (
          <meshStandardMaterial map={texture} roughness={0.3} metalness={0.1} />
        ) : (
          <meshStandardMaterial color={loadError ? '#ff6b6b' : color} roughness={0.3} metalness={0.1} />
        )}
      </mesh>
      {/* Mannequin stand */}
      <mesh position={[0, -height / 2 - 0.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -height / 2 - 0.5, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.04, 32]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
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
  const [lightIntensity, setLightIntensity] = useState([1.5]);
  const [bgColor, setBgColor] = useState('#1a1a2e');

  const bgOptions = [
    { color: '#1a1a2e', label: 'Dark' },
    { color: '#f0f0f0', label: 'Light' },
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
            <Maximize2 className="w-4 h-4 text-primary" />
            3D Product Viewer — {title}
            <Badge variant="outline" className="text-[10px] ml-auto">VR Ready</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 relative">
          <Canvas shadows camera={{ position: [0, 0.5, 4.5], fov: 45 }}>
            <color attach="background" args={[bgColor]} />
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={lightIntensity[0]}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <spotLight position={[-3, 5, 3]} intensity={0.6} angle={0.5} penumbra={0.5} />
            
            <Suspense fallback={<LoadingFallback />}>
              <PresentationControls
                global
                zoom={0.8}
                rotation={[0, 0, 0]}
                polar={[-Math.PI / 4, Math.PI / 4]}
                azimuth={[-Math.PI / 4, Math.PI / 4]}
              >
                <ProductMesh imageUrl={imageUrl} color="#e0e0e0" />
              </PresentationControls>
              <ContactShadows position={[0, -1.4, 0]} opacity={0.5} scale={8} blur={2} />
              <Environment preset="studio" />
            </Suspense>
            
            <OrbitControls
              enablePan={false}
              minDistance={2}
              maxDistance={8}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 1.5}
            />
          </Canvas>

          {/* Controls overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div className="bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border space-y-2 w-48">
              <div className="flex items-center gap-2">
                <Sun className="w-3 h-3 text-muted-foreground" />
                <Label className="text-[10px] text-muted-foreground">Lighting</Label>
              </div>
              <Slider value={lightIntensity} onValueChange={setLightIntensity} min={0.2} max={3} step={0.1} />
              <div className="flex gap-1 mt-1">
                {bgOptions.map(opt => (
                  <button key={opt.color} onClick={() => setBgColor(opt.color)} className={`w-5 h-5 rounded-full border-2 transition-transform ${bgColor === opt.color ? 'border-primary scale-110' : 'border-transparent'}`} style={{ backgroundColor: opt.color }} title={opt.label} />
                ))}
              </div>
            </div>
            <div className="bg-card/90 backdrop-blur-sm rounded-lg p-2 border border-border">
              <p className="text-[10px] text-muted-foreground text-center">Drag to rotate • Scroll to zoom • Shift+drag to pan</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductViewer3D;
