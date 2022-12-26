import Ecliptic from './Ecliptic';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import AsteroidColorMap from '../assets/textures/asteroid/ground_0010_color_4k.jpg';
import AsteroidNormalMap from '../assets/textures/asteroid/ground_0010_normal_4k.png';
import AsteroidSpecMap from '../assets/textures/asteroid/ground_0010_height_4k.png';
import { useRef } from 'react';
const EARTH_DIAMETER = 12742;

function Asteroid(props: any) {

    const [colorMap, normalMap, specularMap] = useLoader(TextureLoader, [AsteroidColorMap, AsteroidNormalMap, AsteroidSpecMap]);

    const zRad = props.xRadius* Math.sqrt(1- props.eccentricity);
    const radius = ((props.diameter / EARTH_DIAMETER) / 2) * 10000;
    const planetRef = useRef();
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * props.speedRatio;
        const x = props.xRadius * Math.sin(t);
        const z = zRad * Math.cos(t);
        planetRef.current.position.x = x;
        planetRef.current.position.z = z;
    })
    console.log(zRad, radius)
    return (
        <>
            {/* <pointLight color='#f6f3ea' position={[2, 0, 2]} intensity={1.2} /> */}
            <mesh position={props.position} ref={planetRef}>
                <sphereGeometry args={[radius, 32, 32]} />
                <meshPhongMaterial specularMap={specularMap} />
                <meshStandardMaterial map={colorMap} normalMap={normalMap} metalness={0.4} roughness={0.7} />
            </mesh>
            <Ecliptic xRadius={props.xRadius} zRadius={zRad} inclination={props.incline || 0}/>
        </>
    );
}

export default Asteroid;
