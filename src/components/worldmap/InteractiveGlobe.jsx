
import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { WorldMapPin } from '@/api/entities';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, Send, MapPin, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function InteractiveGlobe({ isCompact = false, userLocation, onPinCountUpdate }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const globeRef = useRef(null);
  const atmosphereRef = useRef(null);
  const cameraRef = useRef(null);
  const frameId = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  
  const [pins, setPins] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [showCreatePin, setShowCreatePin] = useState(false);
  const [newPinLocation, setNewPinLocation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [texturesLoaded, setTexturesLoaded] = useState(false);

  // Load pins from database
  const loadPins = useCallback(async () => {
    try {
      const worldPins = await WorldMapPin.list('-created_date', 100);
      setPins(worldPins.filter(pin => pin.is_approved));
      onPinCountUpdate?.(worldPins.length);
    } catch (error) {
      console.error('Failed to load world map pins:', error);
    }
  }, [onPinCountUpdate]);

  // Detect device performance level
  const getDevicePerformanceLevel = useCallback(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return 'low';
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
    
    // Simple heuristic based on screen size and potential GPU
    if (window.innerWidth > 1920 || renderer.includes('RTX') || renderer.includes('GTX')) {
      return 'high';
    } else if (window.innerWidth > 768) {
      return 'medium';
    }
    return 'low';
  }, []);

  // Create fallback texture if external textures fail
  const createFallbackTexture = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    
    // Create a more detailed fallback
    const gradient = context.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#001133');
    gradient.addColorStop(0.5, '#003366');
    gradient.addColorStop(1, '#004499');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1024, 512);
    
    // Add land masses with more detail
    context.fillStyle = '#2d5a2d';
    // North America
    context.fillRect(150, 120, 120, 80);
    // Europe/Asia  
    context.fillRect(400, 100, 200, 100);
    // Africa
    context.fillRect(360, 220, 80, 120);
    // South America
    context.fillRect(220, 280, 60, 140);
    // Australia
    context.fillRect(700, 320, 100, 60);
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Load Earth textures based on performance
  const loadEarthTextures = useCallback(() => {
    const performanceLevel = getDevicePerformanceLevel();
    const loader = new THREE.TextureLoader();
    
    // High-quality NASA Blue Marble textures
    const textureUrls = {
      high: {
        day: 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg',
        night: 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/5_night_4k.jpg',
        bump: 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/elev_bump_4k.jpg'
      },
      medium: {
        day: 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_2k.jpg', 
        night: 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/5_night_2k.jpg',
        bump: 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/elev_bump_2k.jpg'
      },
      low: {
        day: 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_1k.jpg',
        night: 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/5_night_1k.jpg', 
        bump: null // Skip bump map for low performance
      }
    };

    const urls = textureUrls[performanceLevel] || textureUrls.low;
    
    return new Promise((resolve) => {
      let loadedCount = 0;
      const totalTextures = urls.bump ? 3 : 2;
      
      const textures = {};
      
      // Load day texture
      loader.load(urls.day, (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        textures.day = texture;
        loadedCount++;
        if (loadedCount === totalTextures) resolve(textures);
      }, undefined, () => {
        // Fallback to basic texture if loading fails
        textures.day = createFallbackTexture();
        loadedCount++;
        if (loadedCount === totalTextures) resolve(textures);
      });

      // Load night texture
      loader.load(urls.night, (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        textures.night = texture;
        loadedCount++;
        if (loadedCount === totalTextures) resolve(textures);
      }, undefined, () => {
        // Skip night texture if loading fails
        loadedCount++;
        if (loadedCount === totalTextures) resolve(textures);
      });

      // Load bump map if performance allows
      if (urls.bump) {
        loader.load(urls.bump, (texture) => {
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          textures.bump = texture;
          loadedCount++;
          if (loadedCount === totalTextures) resolve(textures);
        }, undefined, () => {
          // Skip bump map if loading fails
          loadedCount++;
          if (loadedCount === totalTextures) resolve(textures);
        });
      }
    });
  }, [getDevicePerformanceLevel, createFallbackTexture]);

  // Create atmosphere effect
  const createAtmosphere = useCallback(() => {
    const atmosphereGeometry = new THREE.SphereGeometry(5.3, 32, 32);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.3, 0.1, 0.8, 0.8) * intensity;
        }
      `
    });
    
    return new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  }, []);

  // Convert lat/lng to 3D position
  const latLngTo3D = useCallback((lat, lng, radius = 5) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    return {
      x: -(radius * Math.sin(phi) * Math.cos(theta)),
      y: radius * Math.cos(phi),
      z: radius * Math.sin(phi) * Math.sin(theta)
    };
  }, []);

  // Add pins to globe
  const addPinsToGlobe = useCallback((scene) => {
    pins.forEach(pin => {
      const position = latLngTo3D(pin.latitude, pin.longitude, 5.1);
      
      // Pin geometry
      const pinGeometry = new THREE.SphereGeometry(0.05, 8, 8);
      const pinMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.9
      });
      
      const pinMesh = new THREE.Mesh(pinGeometry, pinMaterial);
      pinMesh.position.set(position.x, position.y, position.z);
      pinMesh.userData = pin;
      
      // Add glow effect
      const glowGeometry = new THREE.SphereGeometry(0.08, 8, 8);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.3
      });
      
      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      glowMesh.position.set(position.x, position.y, position.z);
      
      scene.add(pinMesh);
      scene.add(glowMesh);
    });
  }, [pins, latLngTo3D]);

  // Handle pin submission
  const handleSubmitPin = async () => {
    if (!newMessage.trim() || !newPinLocation || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const user = await User.me();
      
      // Reverse geocoding for city/country (simplified)
      const city = "Unknown City";
      const country = "Unknown Country";
      
      await WorldMapPin.create({
        latitude: newPinLocation.lat,
        longitude: newPinLocation.lng,
        city,
        country,
        message: newMessage.trim(),
        color: 'purple'
      });
      
      toast.success("Your encouragement has been pinned to the map! 💜");
      setNewMessage('');
      setShowCreatePin(false);
      setNewPinLocation(null);
      await loadPins();
    } catch (error) {
      console.error('Error creating pin:', error);
      toast.error("Failed to create pin. Please try again.");
    }
    setIsSubmitting(false);
  };

  // Initialize Three.js scene
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      isCompact ? 1 : currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      isCompact ? 64 : currentMount.clientWidth, 
      isCompact ? 64 : currentMount.clientHeight
    );
    renderer.setClearColor(0x000011, isCompact ? 0 : 1);
    renderer.shadowMap.enabled = !isCompact;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    currentMount.appendChild(renderer.domElement);

    // Load textures and create globe
    loadEarthTextures().then((textures) => {
      // Create Earth geometry and material
      const geometry = new THREE.SphereGeometry(5, 64, 64);
      const material = new THREE.MeshPhongMaterial({
        map: textures.day,
        bumpMap: textures.bump,
        bumpScale: 0.3,
        transparent: false
      });
      
      const globe = new THREE.Mesh(geometry, material);
      globe.castShadow = true;
      globe.receiveShadow = true;
      scene.add(globe);
      
      // Add atmosphere if not compact
      if (!isCompact) {
        const atmosphere = createAtmosphere();
        scene.add(atmosphere);
        atmosphereRef.current = atmosphere;
      }
      
      globeRef.current = globe;
      setTexturesLoaded(true);
    });

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(-1, 1, 1);
    directionalLight.castShadow = !isCompact;
    if (!isCompact) {
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
    }
    scene.add(directionalLight);

    // Position camera
    camera.position.z = isCompact ? 15 : 12;

    // Store refs
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Mouse interaction for non-compact mode
    if (!isCompact) {
      const handleMouseDown = (event) => {
        isDraggingRef.current = true;
        mouseRef.current.x = event.clientX;
        mouseRef.current.y = event.clientY;
      };

      const handleMouseMove = (event) => {
        if (!isDraggingRef.current || !globeRef.current) return;
        
        const deltaX = event.clientX - mouseRef.current.x;
        const deltaY = event.clientY - mouseRef.current.y;
        
        globeRef.current.rotation.y += deltaX * 0.005;
        globeRef.current.rotation.x += deltaY * 0.005;
        
        // Limit vertical rotation
        globeRef.current.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, globeRef.current.rotation.x));
        
        mouseRef.current.x = event.clientX;
        mouseRef.current.y = event.clientY;
      };

      const handleMouseUp = () => {
        isDraggingRef.current = false;
      };

      const handleDoubleClick = (event) => {
        if (!userLocation) return;
        
        const rect = renderer.domElement.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        setNewPinLocation(userLocation);
        setShowCreatePin(true);
      };

      renderer.domElement.addEventListener('mousedown', handleMouseDown);
      renderer.domElement.addEventListener('mousemove', handleMouseMove);
      renderer.domElement.addEventListener('mouseup', handleMouseUp);
      renderer.domElement.addEventListener('dblclick', handleDoubleClick);
    }

    // Animation loop
    const animate = () => {
      frameId.current = requestAnimationFrame(animate);
      
      if (globeRef.current && isCompact) {
        globeRef.current.rotation.y += 0.005;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize for full-screen mode
    const handleResize = () => {
      if (!isCompact && cameraRef.current && rendererRef.current && currentMount) {
        const width = currentMount.clientWidth;
        const height = currentMount.clientHeight;
        
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    };

    if (!isCompact) {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
      
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      
      if (!isCompact) {
        window.removeEventListener('resize', handleResize);
      }
      
      renderer.dispose();
    };
  }, [isCompact, userLocation, loadEarthTextures, createAtmosphere]);

  // Add pins when loaded
  useEffect(() => {
    if (texturesLoaded && sceneRef.current && pins.length > 0) {
      addPinsToGlobe(sceneRef.current);
    }
  }, [pins, texturesLoaded, addPinsToGlobe]);

  // Load pins on mount
  useEffect(() => {
    loadPins();
  }, [loadPins]);

  return (
    <div className={`relative ${isCompact ? 'w-16 h-16' : 'w-full h-full'}`}>
      <div ref={mountRef} className="w-full h-full" />
      
      {!isCompact && (
        <>
          {/* Pin Details Modal */}
          <AnimatePresence>
            {selectedPin && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 left-4 max-w-sm z-30"
              >
                <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
                  <CardHeader className="relative">
                    <button
                      onClick={() => setSelectedPin(null)}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-3 h-3 text-gray-600" />
                    </button>
                    <CardTitle className="flex items-center gap-2 text-lg text-purple-800">
                      <MapPin className="w-5 h-5" /> A message from
                    </CardTitle>
                    <p className="text-sm text-gray-600">{selectedPin.city}, {selectedPin.country}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-lg text-gray-800 leading-relaxed italic">
                      "{selectedPin.message}"
                    </p>
                    <div className="flex justify-end">
                      <Badge variant="secondary" className="flex items-center gap-1.5 bg-pink-100 text-pink-700">
                        <Heart className="w-3 h-3" />
                        {selectedPin.hearts_count || 0}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Create Pin Modal */}
          <AnimatePresence>
            {showCreatePin && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-purple-900/30 backdrop-blur-sm z-40 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ y: 20, scale: 0.9, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ y: 20, scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="w-full max-w-lg"
                >
                  <Card className="bg-white/95 shadow-2xl rounded-3xl border-0">
                    <CardHeader className="relative text-center">
                      <button 
                        onClick={() => setShowCreatePin(false)} 
                        className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                      <CardTitle className="text-2xl font-bold text-purple-800">
                        Share Encouragement
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Pin an anonymous, uplifting message to your location.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder="Type a short, kind note for the world..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        maxLength={280}
                        className="rounded-2xl h-32 border-gray-300 focus:ring-purple-500"
                        rows={4}
                      />
                      <div className="text-right text-xs text-gray-500 font-medium">
                        {280 - newMessage.length} characters remaining
                      </div>
                      
                      <div className="pt-2">
                        <Button
                          onClick={handleSubmitPin}
                          disabled={!newMessage.trim() || isSubmitting}
                          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          {isSubmitting ? (
                            'Sharing...'
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Pin to World Map
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Instructions */}
          {!showCreatePin && !selectedPin && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-4 right-4 bg-purple-800/80 text-white px-4 py-2 rounded-2xl backdrop-blur-sm"
            >
              <p className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Double-click to share encouragement
              </p>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
