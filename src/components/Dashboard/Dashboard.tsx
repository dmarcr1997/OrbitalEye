import { useEffect, useMemo, useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import { dashboardContainer, dashboardNEOTable } from './Dashboard.styles';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';

interface NEODataObject {
    id: number;
    name: string;
    link: string;
    velocity: number;
    missDistance: number;
    diameter: number;
    closestApproachDate: string;
    absoluteMagnitude: number;
    hazardous: boolean;
    sentry: boolean;
};

const Dashboard = () => {
    const [items, setItems] = useState<NEODataObject[]>([]);
    const [rows, setRows] = useState<NEODataObject[]>([]);
    const [now, setNow] = useState(new Date());
    const maxDate = new Date()
    maxDate.setDate(now.getDate() + 7);
    const [later, setLater] = useState(maxDate);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const startDate = now.toISOString().split('T')[0];
        const endDate = later.toISOString().split('T')[0];
        setRows([]);
        console.log(startDate, endDate);
        fetch(`https://www.neowsapp.com/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&detailed=false`)
                .then(data => data.json())
                .then(data => {
                    console.log(data.near_earth_objects);
                    const NEOS = Object.values(data.near_earth_objects);
                    NEOS.forEach((value: any) => value.map((v: any) => addRow(v)));
                    setLoading(false);
                })
                .catch(err => console.error(err))
    },[loading]);

    function addNEO(neo: NEODataObject) {
        if(items.find(item => item.id === neo.id))
            return;
        setItems(values => [
            ...values,
            neo
        ]);
    }

    function changeStart(e: any) {
        const date = new Date(e.target.value);
        console.log("Start: ", date)
        setNow(date);
    }

    function changeEnd(e: any) {
        const date = new Date(e.target.value);
        console.log("End: ", date)
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
        const avgEstDiameter = (estimated_diameter.kilometers.estimated_diameter_max + estimated_diameter.kilometers.estimated_diameter_min) / 2;
        const newRow = {
            id: id,
            name: name,
            link: links.self,
            velocity: closestApproachData.relative_velocity.kilometers_per_hour,
            missDistance: closestApproachData.miss_distance.kilometers,
            diameter: avgEstDiameter,
            closestApproachDate: closestApproachData.close_approach_date,
            absoluteMagnitude: absolute_magnitude_h,
            hazardous: is_potentially_hazardous_asteroid,
            sentry: is_sentry_object
        }
        createDataRow(newRow);
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
                    <Grid item xs={6}>
                        <Box component={Paper} sx={{border: '2px solid #27163c', mt: 2, textAlign: 'left' }}>
                        <Typography sx={{ mt: 4, mb: 2, ml: 1 }} variant="h6" component="div">
                            Selected NEOs
                        </Typography>
                            <List dense={false}>
                                {items.map(item =>
                                    <ListItem
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete" onClick={() => deleteNEO(item)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                    >
                                    <ListItemText
                                        primary={item.name}
                                    />
                                    </ListItem>,
                                )}
                            </List>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box component={Paper} sx={{border: '2px solid #27163c', mt: 2, }}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography sx={{ mt: 4, mb: 2, ml: 1 }} variant="h6" component="div">
                                        NEOs Search Dates
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel sx={{textAlign: 'left', ml: 2}}>
                                        Start Date: {now.toISOString()}
                                    </InputLabel>
                                    <OutlinedInput value={now} onChange={changeStart} type='date' sx={{width: '90%'}}></OutlinedInput>
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel sx={{textAlign: 'left', ml: 2}}>
                                        End Date: {later.toISOString()}
                                    </InputLabel>
                                    <OutlinedInput value={later} onChange={changeEnd} type='date' sx={{width: '90%'}}></OutlinedInput>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button onClick={updateNEOs} sx={{ mt: 2, mb: 5 }} variant="outlined">Get NEOs</Button>
                                </Grid>
                            </Grid>       
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <TableContainer sx={{ maxHeight: 400, border: '2px solid #27163c' }} component={Paper}>
                            <Table stickyHeader aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell>NAME&nbsp;(Click to Add)</TableCell>
                                    <TableCell align="right">VELOCITY&nbsp;(km/s)</TableCell>
                                    <TableCell align="right">DISTANCE&nbsp;(km)</TableCell>
                                    <TableCell align="right">DIAMETER&nbsp;(km)</TableCell>
                                    <TableCell align="right">CLOSEST APPROACH</TableCell>
                                    <TableCell align="right">MAGNITUDE</TableCell>
                                    <TableCell align="right">HAZARDOUS</TableCell>
                                    <TableCell align="right">SENTRY</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell onClick={() => addNEO(row)} component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">{row.velocity}</TableCell>
                                        <TableCell align="right">{row.missDistance}</TableCell>
                                        <TableCell align="right">{row.diameter}</TableCell>
                                        <TableCell align="right">{row.closestApproachDate}</TableCell>
                                        <TableCell align="right">{row.absoluteMagnitude}</TableCell>
                                        <TableCell align="right">{row.hazardous ? 'Potentially' : 'Non-Hazardous'}</TableCell>
                                        <TableCell align="right">{row.sentry ? 'YES' : 'NO'}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    )
}

export default Dashboard;