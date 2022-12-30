import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import { NEODataObject } from '../models/INEODataObject';
import DateForm from './DateForm';
import NeoList from './NeoList';
import NeoTable from './NeoTable';

const NeoDataLayer = ({pushItemsUp}: any) => {
    const [items, setItems] = useState<NEODataObject[]>([]);
    const [rows, setRows] = useState<NEODataObject[]>([]);
    const [nowDate, setNowDate] = useState(new Date());
    const maxDate = new Date()
    maxDate.setDate(nowDate.getDate() + 7);
    const [later, setLater] = useState(maxDate);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const startDate = nowDate.toISOString().split('T')[0];
        const endDate = later.toISOString().split('T')[0];
        setRows([]);
        setLoading(true);
        fetch(`https://www.neowsapp.com/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&detailed=false`)
                .then(data => data.json())
                .then(data => {
                    // console.log(data.near_earth_objects);
                    const NEOS = Object.values(data.near_earth_objects);
                    NEOS.forEach((value: any) => value.map((v: any) => addRow(v)));
                    setLoading(false);
                })
                .catch(err => console.error(err))
    },[nowDate]);


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

    async function addNEO(neo: NEODataObject) {
        if(items.find(item => item.id === neo.id) || items.length >= 7)
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
        pushItemsUp((values: NEODataObject[]) => [
            ...values,
            neo
        ]);
        setItems(values => [
            ...values,
            neo
        ]);
    }

    function changeStart(e: any) {
        const date = new Date(e.target.value);
        const maxDate = new Date()
        maxDate.setDate(date.getDate() + 7);
        setNowDate(date);
        setLater(date);
        setItems([])
        pushItemsUp([]);
    }

    function deleteNEO(neo: NEODataObject) {
        const filteredItems = items.filter(n => n.id !== neo.id );
        setItems(filteredItems);
        pushItemsUp(filteredItems);
    }

    function sortedRows() {
        return rows.sort(function(a: NEODataObject,b: NEODataObject){return new Date(a.closestApproachDate).getTime() - new Date(b.closestApproachDate).getTime()})
    }

    return (
        <>
            <Grid item xs={6}>
                <NeoList items={items} deleteHandler={deleteNEO}/>
            </Grid>
            <Grid item xs={6}>
                <DateForm startChange={changeStart} now={nowDate} />
            </Grid>
            <Grid item xs={12}>
                <NeoTable data={sortedRows()} handleClick={addNEO} />
            </Grid>
        </>
    )
}

export default NeoDataLayer