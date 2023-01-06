import { Typography, Grid } from "@mui/material";
import { useEffect, useState } from "react";

const FileList = () => {
    //DONE:Call backend to get list of file names and hashes
    //TODO: use ipfs hook and file hashes to get all files
    //TODO: Create list of files that show authors name, file, and asteroid 
    //TODO: Bounty proposal button
    const [files, setFiles] = useState([]);
    useEffect(() => {
        async function getFiles() {
            const response = await fetch('http://localhost:4000/files')
            const fetchedFiles = await response.json();
            setFiles(fetchedFiles);
        }
        getFiles();
    }, [])
    //@ts-ignore
    return (<Grid container sx={{ ml: 2, alignItems: 'center'}} spacing={2}>{files.map((file) => <Grid item xs={12}><Typography variant="body2">{file.fileName} - - {file.ipfsHash}</Typography></Grid>)}</Grid>)
};

export default FileList;