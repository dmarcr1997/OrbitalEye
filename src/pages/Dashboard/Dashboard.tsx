import { useEffect, useMemo, useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { dashboardContainer } from './Dashboard.styles';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import NeoList from '../../components/NeoList';
import DateForm from '../../components/DateForm';
import NeoTable from '../../components/NeoTable';
import UploadFileForm from '../../components/UploadFileForm';
import { NEODataObject } from '../../models/INEODataObject';
import { useAddress } from '@thirdweb-dev/react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({setAstroids}: any) => {
    const [items, setItems] = useState<NEODataObject[]>([]);
    const [rows, setRows] = useState<NEODataObject[]>([]);
    const [now, setNow] = useState(new Date());
    const maxDate = new Date()
    maxDate.setDate(now.getDate() + 7);
    const [later, setLater] = useState(maxDate);
    const [loading, setLoading] = useState(false);

    const address = useAddress();
    const navigate = useNavigate();

    useEffect(() => {
        const goToLanding = () => navigate('/');
        if(!address){
            console.log('No Wallet Connected');
            goToLanding()
        } else {
            setLoading(true);
        }
    }, [address, navigate]);
    
    useEffect(() => {
        if(loading === true){
            const startDate = now.toISOString().split('T')[0];
            const endDate = later.toISOString().split('T')[0];
            setRows([]);
            fetch(`https://www.neowsapp.com/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&detailed=false`)
                    .then(data => data.json())
                    .then(data => {
                        // console.log(data.near_earth_objects);
                        const NEOS = Object.values(data.near_earth_objects);
                        NEOS.forEach((value: any) => value.map((v: any) => addRow(v)));
                        setLoading(false);
                    })
                    .catch(err => console.error(err))
        }
    },[loading]);

    async function addNEO(neo: NEODataObject) {
        if(items.find(item => item.id === neo.id))
            return;
        await fetch(neo.link)
            .then(response => response.json())
            .then(data => {          
                const orbitData = data.orbital_data;
                neo.semiMajorAxis = Number(orbitData.semi_major_axis);
                neo.eccentricity = Number(orbitData.eccentricity);
                neo.aphelion = Number(orbitData.aphelion_distance);
                neo.perihelion =  Number(orbitData.perihelion_distance);
            })
        setItems(values => [
            ...values,
            neo
        ]);
    }

    useEffect(() => {
        if(items)
            setAstroids(items);
    }, [items])

    function changeStart(e: any) {
        const date = new Date(e.target.value);
        setNow(date);
    }

    function changeEnd(e: any) {
        const date = new Date(e.target.value);
        setLater(date);
    }

    function updateNEOs() {
        setLoading(true);
    }

    function deleteNEO(neo: NEODataObject) {
        const filteredItems = items.filter(n => n.id !== neo.id );
        setItems(filteredItems);
    }

    function addRow(neo: any) {
        const { id, name, links, estimated_diameter, close_approach_data, absolute_magnitude_h, is_potentially_hazardous_asteroid, is_sentry_object } = neo;
        const closestApproachData = close_approach_data[0];
        const hazardMultiplier = is_potentially_hazardous_asteroid ? 2 : 1;
        const avgEstDiameter = (estimated_diameter.kilometers.estimated_diameter_max + estimated_diameter.kilometers.estimated_diameter_min) / 2;
        const bounty = (avgEstDiameter * absolute_magnitude_h * hazardMultiplier) / 0.01;
        const newRow = {
            id: id,
            name: name,
            link: links.self,
            bounty: floorItTwoPlaces(bounty),
            velocity: floorItTwoPlaces(closestApproachData.relative_velocity.kilometers_per_second),
            missDistance: floorItTwoPlaces(closestApproachData.miss_distance.kilometers),
            diameter: floorItTwoPlaces(avgEstDiameter),
            closestApproachDate: closestApproachData.close_approach_date,
            absoluteMagnitude: floorItTwoPlaces(absolute_magnitude_h),
            hazardous: is_potentially_hazardous_asteroid,
            sentry: is_sentry_object
        }
        createDataRow(newRow);
    }

    const floorItTwoPlaces = (num: number) => {
        return Math.floor(num * 100) / 100;
    }
    const createDataRow = (newRow: NEODataObject) => {
        setRows((rows: NEODataObject[]) => [
            ...rows,
            newRow
        ]);
    }
    const theme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth={false} sx={dashboardContainer}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <UploadFileForm neos={items}/>
                    </Grid>
                    <Grid item xs={6}>
                        <NeoList items={items} deleteHandler={deleteNEO}/>
                    </Grid>
                    <Grid item xs={6}>
                        <DateForm startChange={changeStart} endChange={changeEnd} update={updateNEOs} now={now} later={later} />
                    </Grid>
                    <Grid item xs={12}>
                        <NeoTable data={rows} handleClick={addNEO} />
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    )
}

export default Dashboard;