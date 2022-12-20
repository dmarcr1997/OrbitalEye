import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { dashboardContainer } from './Dashboard.styles';
import { useEffect, useState } from 'react';
const Dashboard = () => {
    const [asteroids, setAsteroids] = useState([]);
    const now = new Date();
    const maxDate = new Date()
    maxDate.setDate(now.getDate() + 7);
    useEffect(() => {
        const startDate = now.toISOString().split('T')[0];
        const endDate = maxDate.toISOString().split('T')[0];
        console.log(startDate, endDate);
        fetch(`https://www.neowsapp.com/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&detailed=false`)
                .then(data => data.json())
                .then(data => {
                    console.log(data.near_earth_objects);
                    console.log('Dates: ', Object.keys(data.near_earth_objects));
                    console.log('NEO: ', Object.values(data.near_earth_objects));
                })
                .catch(err => console.error(err))
    },[])
    return (
        <Container maxWidth='xl' sx={dashboardContainer}>
            <Box>1</Box>
            <Box>2</Box>
            <Box>3</Box>

        </Container>
    )
}

export default Dashboard;