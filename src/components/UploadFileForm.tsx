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

const UploadFileForm = ({neos}: any) => {
    const [studiedBody, setStudiedBody ] = useState('');
    const [file, setFile] = useState<any>({});
    const [uploading, setUploading] = useState(false);
    function handleChangeNeo(name: string) {
        setStudiedBody(name);
    }

    async function addFile(e: any) {
        setUploading(true);
        const files = e.target.files;
        try {
            console.log(files[0]);
            setFile(files[0]);
            // const added = await client.add(files[0]); ipfs connection TODO
            // setFile({ filename: files[0].name, hash: added.path });
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
        setUploading(false);
    }

    function getSelectNEOs() {
        if(neos.length > 0) 
            return neos.map((value: NEODataObject) => <MenuItem onClick={() => handleChangeNeo(value.name)}value={value.name}>{value.name}</MenuItem>)
        return <MenuItem value={undefined}>No NEO Selected</MenuItem>
    }

    function sendFile() {
        if(!uploading) console.log("Sending file...", file);
        //TODO: Send file to ipfs
        setStudiedBody('');
        setFile({});
    }

    const checkData = () => {
        const shouldUpload = uploading || !file || studiedBody === '';
        return shouldUpload;
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
                    <InputLabel sx={{textAlign: 'left', ml: 2}} id="demo-simple-select-label">Data Zip File</InputLabel>
                    <Button variant="outlined" sx={{margin: 'auto', alignItems: 'center', mb: 5}}>
                        <input style={{textAlign: 'center' }} onChange={addFile} type="file" accept='.zip,.rar,.7zip'/>
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={sendFile} sx={{ mt: 2, mb: 5 }} disabled={checkData()} variant="contained">Get NEOs</Button>
                </Grid>
            </Grid>
        </Box>
    )
}

export default UploadFileForm;