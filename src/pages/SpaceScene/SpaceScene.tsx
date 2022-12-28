import { Container, Grid } from '@mui/material';
import { SceneContainer } from './SpaceScene.styles';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import React, { Suspense, useRef, useState } from 'react';
import Earth from "../../components/Earth";
import { Html, useProgress } from '@react-three/drei';

function Loader() {
    const { active, progress, errors, item, loaded, total } = useProgress()
    return <Html center>{progress} % loaded</Html>
}

const SpaceScene = (props: any) => {
    return (
    <Container maxWidth={false} sx={SceneContainer}>
        <Grid container>
            <Grid item xs={12}>
                TOP
            </Grid>
            <Grid item xs={12} sx={{alignItems: 'center', width: '100%', height: '80vh', backgroundColor: '#01040c'}}>
                <Canvas camera={{ position: [0, 20, 25], fov: 45 }}>
                    <Suspense fallback={<Loader />}>
                        <Earth asteroids={props.asteroids}/>
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