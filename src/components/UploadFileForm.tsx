import { useState } from 'react';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { NEODataObject } from '../models/INEODataObject';
const UploadFileForm = ({neos}: any) => {
    const [studiedBody, setStudiedBody ] = useState('');
    const [file, setFile] = useState();

    function handleChangeNeo(name: string) {
        setStudiedBody(name);
    }

    function addFile(e: any) {
        setFile(e.target.value);
    }

    function getSelectNEOs() {
        if(neos.length > 0) 
            return neos.map((value: NEODataObject) => <MenuItem onClick={() => handleChangeNeo(value.name)}value={value.name}>{value.name}</MenuItem>)
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
                <Grid item xs={12}>
                    <InputLabel sx={{textAlign: 'left', ml: 2}} id="demo-simple-select-label">PDF File</InputLabel>
                    <Button variant="outlined" sx={{margin: 'auto', alignItems: 'center', mb: 5}}>
                        <input style={{textAlign: 'center', marginLeft:'10%'}} onChange={addFile} type="file" accept='application/pdf'/>
                    </Button>
                </Grid>
            </Grid>
        </Box>
    )
}

export default UploadFileForm;