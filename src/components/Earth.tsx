import { useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import React, { useRef } from 'react';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import EarthCloudMap from '../assets/textures/8k_earth_clouds.jpg';
import EarthDayMap from '../assets/textures/8k_earth_daymap.jpg';
import EarthNightMap from '../assets/textures/8k_earth_nightmap.jpg';
import EarthNormalMap from '../assets/textures/8k_earth_normal_map.jpg';
import EarthSpecMap from '../assets/textures/8k_earth_specular_map.jpg';
import { Stars } from '@react-three/drei/core';


const Earth = (props: any) => {

    const [colorMap, normalMap, specularMap, cloudMap, nightMap] = useLoader(TextureLoader, [EarthDayMap, EarthNormalMap, EarthSpecMap, EarthCloudMap, EarthNightMap]);

    const earthRef = useRef()
    const cloudRef = useRef()
    useFrame(({ clock }) => {
        const elapsedTime = clock.getElapsedTime();
        //@ts-ignore
        earthRef.current.rotation.y = elapsedTime / 6;
        //@ts-ignore
        cloudRef.current.rotation.y = elapsedTime / 7;
        
    })


    return (
        <>
            {/* <ambientLight intensity={1}/> */}
            <pointLight color='#f6f3ea' position={[2, 0, 2]} intensity={1.2} />
            <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade={true} />
            <mesh ref={cloudRef}>
                <sphereGeometry args={[ 1.005, 32, 32 ]}/>
                <meshPhongMaterial
                    map={cloudMap} 
                    opacity={0.4} 
                    depthWrite={true} 
                    transparent={true} 
                    side={THREE.DoubleSide}
                />
            </mesh>
            <mesh ref={earthRef}>
                <sphereGeometry args={[ 1, 32, 32 ]}/>
                <meshPhongMaterial specularMap={specularMap} />
                <meshStandardMaterial map={colorMap} normalMap={normalMap} metalness={0.4} roughness={0.7}/>
                <OrbitControls 
                    enableZoom={true} 
                    enablePan={true} 
                    enableRotate={true} 
                    zoomSpeed={0.6} 
                    panSpeed={0.5} 
                    rotateSpeed={0.4}
                />
            </mesh>
        </>
    )

}

export default Earth;