import { Container, Grid } from '@mui/material';
import { SceneContainer } from './SpaceScene.styles';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import React, { Suspense, useRef, useState } from 'react';
import Earth from "../../components/Earth";

const SpaceScene = () => {

    
    return (
    <Container maxWidth={false} sx={SceneContainer}>
        <Grid container>
            <Grid item xs={12}>
                TOP
            </Grid>
            <Grid item xs={12} sx={{alignItems: 'center', width: '100%', height: '80vh', backgroundColor: '#01040c'}}>
                <Canvas camera={{ position: [0, 20, 25], fov: 45 }}>
                    <Suspense fallback={null}>
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