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
import { dashboardContainer, dashboardNEOTable } from './Dashboard.styles';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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
                    const NEOS = Object.values(data.near_earth_objects);
                    NEOS.forEach((value: any) => value.map((v: any) => addRow(v)));
                })
                .catch(err => console.error(err))
    },[])

    function addNEO(neo: NEODataObject) {
        setItems(values => [
            ...values,
            neo
        ]);
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
                <Box maxWidth='sm' component={Paper} sx={{border: '2px solid #27163c', mt: 2, mb: 5, textAlign: 'left' }}>
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
                <TableContainer sx={{ maxHeight: 400, border: '2px solid #27163c' }} component={Paper}>
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>NAME</TableCell>
                            <TableCell align="right">VELOCITY&nbsp;(km/s)</TableCell>
                            <TableCell align="right">DISTANCE&nbsp;(km)</TableCell>
                            <TableCell align="right">DIAMETER&nbsp;(km)</TableCell>
                            <TableCell align="right">MAGNITUDE</TableCell>
                            <TableCell align="right">CLOSEST APPROACH</TableCell>
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
            </Container>
        </ThemeProvider>
    )
}

export default Dashboard;