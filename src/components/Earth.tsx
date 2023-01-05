import { useFrame, useLoader } from '@react-three/fiber';
import { FirstPersonControls } from '@react-three/drei';
import { useRef } from 'react';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import EarthCloudMap from '../assets/textures/8k_earth_clouds.jpg';
import EarthDayMap from '../assets/textures/8k_earth_daymap.jpg';
import EarthNightMap from '../assets/textures/8k_earth_nightmap.jpg';
import EarthNormalMap from '../assets/textures/8k_earth_normal_map.jpg';
import EarthSpecMap from '../assets/textures/8k_earth_specular_map.jpg';
import { Stars } from '@react-three/drei/core';
import Asteroid from './Asteroid';


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

    function populateAsteroids() {
        console.log(props.asteroids)
        return props.asteroids.map((body: any) => {
            return (
            <Asteroid 
                position={[body.semiMajorAxis * 10, 0, 0]}
                diameter={body.diameter}
                xRadius={body.semiMajorAxis * 10}
                eccentricity={body.eccentricity} //eccentricity
                // incline={}
                textProperties={{
                    name: body.name,
                    bounty: body.bounty,
                }}
                aphelion={body.aphelion * 10} //aphelion * 10
                perihelion={body.perihelion * 10} //perihelion * 10
                speedRatio={body.velocity / 30}
            />
            )
        })
    }

    function defaultAsteroids() {
        return <>
            <Asteroid 
                // position={[9.582667981568604 * Math.cos(7.436867435425389), 9.582667981568604 * Math.sin(7.436867435425389), 0]}
                position={[9.582667981568604, 0, 0]}
                diameter={0.4164305829}
                xRadius={9.582667981568604}
                eccentricity={.08347045379205167} //eccentricity
                // incline={7.436867435425389}
                textProperties={{
                    name: '341843 (2008 EV5)',
                    bounty: '$2000'
                }}
                aphelion={10.3825376265287} //aphelion * 10
                perihelion={8.782798336608509} //perihelion * 10
                speedRatio={6.817303746 / 30}
            />
            <Asteroid 
                // position={[21.70692743796778 * Math.cos(12.01802604414806), 21.70692743796778 * Math.sin(12.01802604414806), 0]} //semi-major axis * 10
                position={[21.70692743796778, 0, 0 ]}
                diameter={1.411050695} 
                xRadius={21.70692743796778}
                eccentricity={.6977429473838328} //eccentricity
                // incline={12.01802604414806}
                textProperties={{
                    name: '349925 (2009 WC26)',
                    bounty: '$5000'
                }}
                aphelion={36.85278296718241} //aphelion * 10
                perihelion={6.561071908753151} //perihelion * 10
                speedRatio={4.8991899774 / 30} //km/s speed / earth km/s speed
            />
        </>
    }

    return (
        <>
            {/* <ambientLight intensity={1}/> */}
            <pointLight color='#f6f3ea' position={[2, 0, 2]} intensity={2.2} />
            <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade={true} />
            {/* @ts-ignore */}
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
            {/* @ts-ignore */}
            <mesh ref={earthRef} rotation-z={0.41}>
                <sphereGeometry args={[ 1, 32, 32 ]}/>
                <meshPhongMaterial specularMap={specularMap} />
                <meshStandardMaterial map={colorMap} normalMap={normalMap} metalness={0.4} roughness={0.7}/>
                {/* <OrbitControls 
                    enableZoom={true} 
                    enablePan={true} 
                    enableRotate={true} 
                    zoomSpeed={0.6} 
                    panSpeed={0.5} 
                    rotateSpeed={0.4}
                /> */}
                <FirstPersonControls enabled={props.enabled} autoForward={false} activeLook={true} constrainVertical={false} movementSpeed={10} lookSpeed={0.075} lookVertical={true}/>
            </mesh>
            {props.asteroids.length > 0 && props.asteroids ? populateAsteroids() : defaultAsteroids()}
            
        </>
    )

}

export default Earth;