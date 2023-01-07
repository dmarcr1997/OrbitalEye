import { useState } from 'react';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { NEODataObject } from '../models/INEODataObject';
import UploadFile from './UploadFile';
import { useAddress } from '@thirdweb-dev/react';

const UploadFileForm = ({neos}: any) => {
    const address = useAddress();
    const [studiedBody, setStudiedBody ] = useState('');
    const [bountyAmount, setBountyAmount] = useState(0);
    function handleChangeNeo(item: NEODataObject) {
        setStudiedBody(item.name);
        setBountyAmount(item.bounty);
    }

    function getSelectNEOs() {
        if(neos.length > 0) 
            return neos.map((value: NEODataObject) => <MenuItem onClick={() => handleChangeNeo(value)} value={value.name}>{value.name}</MenuItem>)
        return <MenuItem value={undefined}>No NEO Selected</MenuItem>
    }

    return (
        <Box component={Paper} sx={{border: '2px solid #27163c', mt: 2, }}>
            <Grid container>
                <Grid item xs={12}>
                    <Typography sx={{ mt: 4, mb: 2, ml: 1 }} variant="h6" component="div">
                        Upload Selected NEO Observations
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <InputLabel sx={{textAlign: 'left', ml: 2 }} id="demo-simple-select-label">Studied Body</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={studiedBody}
                        sx={{mt: 5, mb: 5, width:'90%'}}
                    >
                        {getSelectNEOs()}
                    </Select>
                </Grid>
                { bountyAmount !== 0 ? <Typography sx={{mt: 0, mb: 4, ml: 11}} variant="body2">Award Amount if Selected: $METEORite {bountyAmount} Tokens </Typography> : '' }
                <UploadFile asteroidName={studiedBody} address={address} reset={() => setStudiedBody('')} amount={bountyAmount}/>
            </Grid>
        </Box>
    )
}

export default UploadFileForm;