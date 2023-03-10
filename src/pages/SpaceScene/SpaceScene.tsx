import { Button, Container, Grid } from '@mui/material';
import { SceneContainer } from './SpaceScene.styles';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import Earth from "../../components/Earth";
import { Html, useProgress } from '@react-three/drei';
import NeoDataLayer from '../../components/NeoDataLayer';
import { ThemeProvider, createTheme } from '@mui/material/styles';

function Loader() {
    const { active, progress, errors, item, loaded, total } = useProgress()
    return <Html center>{progress} % loaded</Html>
}
const theme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const SpaceScene = () => {
    const [asteroids, setAsteroids] = useState([])
    const [enabled, setEnabled] = useState(false);

    function toggleEnable() {
        setEnabled(!enabled);
    }

    return (
        <ThemeProvider theme={theme} >
            <Container maxWidth={false} sx={SceneContainer}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sx={{alignItems: 'center', width: '100%', height: '80vh', backgroundColor: '#01040c', mt: 2, ml: 2 }}>
                        <Canvas shadows camera={{ position: [0, 20, 25], fov: 45 }}>
                            <Suspense fallback={<Loader />}>
                                <Earth asteroids={asteroids} enabled={enabled}/>
                            </Suspense>
                        </Canvas>
                    </Grid>
                    <Button sx={{width: '100%', mt: 1, mb: 2, ml: 2 }} onClick={toggleEnable}>
                            {enabled ? 'Pause' : 'Enable Control'}
                    </Button>
                    <NeoDataLayer pushItemsUp={setAsteroids}/>
                </Grid>
            </Container>
        </ThemeProvider>
    )
}

export default SpaceScene;