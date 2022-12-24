import { Container, Grid } from '@mui/material';
import { SceneContainer } from './SpaceScene.styles';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import React, { Suspense, useRef, useState } from 'react';
import Earth from "../../components/Earth";

function Box(props: ThreeElements['mesh']) {
    const mesh = useRef<THREE.Mesh>(null!)
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    useFrame((state, delta) => (mesh.current.rotation.x += delta))
    return (
        <mesh
            {...props}
            ref={mesh}
            scale={active ? 1.5 : 1}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}

const SpaceScene = () => {

    
    return (
    <Container maxWidth={false} sx={SceneContainer}>
        <Grid container>
            <Grid item xs={12}>
                TOP
            </Grid>
            <Grid item xs={12} sx={{alignItems: 'center', width: '100%', height: '80vh', backgroundColor: '#01040c'}}>
                <Canvas>
                    <Suspense fallback={null}>
                        {/* <ambientLight />
                        <pointLight position={[10, 10, 10]} />
                        <Box position={[-1.2, 0, 0]} />
                        <Box position={[1.2, 0, 0]} /> */}
                        <Earth />
                    </Suspense>
                </Canvas>
            </Grid>
            <Grid item xs={12}>
                BOTTOM
            </Grid>
        </Grid>
    </Container>
    )
}

export default SpaceScene;