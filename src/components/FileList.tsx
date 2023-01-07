import { Typography, Grid, List, IconButton, ListItemText } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import { useEffect, useState } from "react";

const FileList = () => {

    const [files, setFiles] = useState([]);
    useEffect(() => {
        async function getFiles() {
            const response = await fetch('https://orbital-eye-back-end.vercel.app/files')
            const fetchedFiles = await response.json();
            setFiles(fetchedFiles);
        }
        getFiles();
    }, [])
    //@ts-ignore
    return (
    <Grid container sx={{ ml: 2, alignItems: 'center'}} spacing={2}>
        <List dense={false}>
            {files.map((file: any) => 
                <ListItem>
                <ListItemText
                    primary={<>{file.fileName} -- {file.subject}</>}
                    secondary={file.creator}
                />
                </ListItem>
            )}
        </List>
    </Grid>)
};

export default FileList;