import { Container, createTheme, Paper, Typography, ThemeProvider } from "@mui/material";
import { Box } from "@mui/system";

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
});
const About = () => (
    <ThemeProvider theme={theme}>
        <Container maxWidth={false}>
            <Box component={Paper} sx={{border: '2px solid #27163c', textAlign: 'left', mt: 2 }}>
                <Typography sx={{ mt: 4, mb: 2, ml: 2 }} variant="h6" component="div">
                    Our Mission
                </Typography>
                <Typography sx={{ mt: 4, mb: 1, ml: 5, mr: 5 }} variant="body1" component="p">
                Welcome to OrbitalEye – the NEO Data Bounty DAO! Our mission is to help make the exploration of Near Earth Objects (NEOs) safer and easier.
                NEOs are asteroids, comets, and other objects that pass close to Earth. Although they can be awesome to observe and study, they can also be dangerous. By knowing where they are and what they're doing, we can be better prepared for any potential impacts.
                </Typography>
                <Typography sx={{ mt: 4, mb: 1, ml: 5, mr: 5 }} variant="body1" component="p">
                That's where OrbitalEye comes in. With our DAO, users can submit NEO data and get paid in $TEA. This data is then voted on by our members, and the most valuable information is sent to the NASA JPL Asteroid Team to help with their research.
                So why not join us? With OrbitalEye, you can help make the exploration of NEOs safer and easier, and get rewarded for your efforts. So come aboard and be part of the NEO revolution!
                </Typography>
            </Box>
        </Container>
    </ThemeProvider>
)

export default About