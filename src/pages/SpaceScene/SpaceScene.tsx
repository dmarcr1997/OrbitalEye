import { Container, Grid } from '@mui/material';
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

const useKeyPress = targetKey => {
    const [keyPressed, setKeyPressed] = React.useState(false);
    const downHandler = ({ key }) => {
        if (key === targetKey) setKeyPressed(true);
    };
    const upHandler = ({ key }) => {
        if (key === targetKey) setKeyPressed(false);
    };
    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);
        return () => {
            window.removeEventListener('keydown', downHandler);
            pwindow.removeEventListener('keyup', upHandler);
        };
    }, []);
    return keyPressed;
};

const SpaceScene = () => {
    const [asteroids, setAsteroids] = useState([])
    const [enabled, setEnabled] = useState(false);
    const spacePressed = useKeyPress('p');

    useEffect(() => {
        setEnabled(!enabled);
    },[spacePressed])
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
                    <NeoDataLayer pushItemsUp={setAsteroids}/>
                </Grid>
            </Container>
        </ThemeProvider>
    )
}

export default SpaceScene;