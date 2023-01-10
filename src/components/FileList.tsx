import { Typography, Grid, List, IconButton, ListItemText } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import ListItem from "@mui/material/ListItem";
import useIPFS from "../hooks/useIPFS";

const FileList = ({ files }: any) => {

    const downloadFile = (hash: string, name: string) => {
        const file = useIPFS(hash, name);
        return (
            <a href={file} download={name}><DownloadIcon /></a>
        )

    } 
    return (
    <Grid container sx={{ alignItems: "flex-start", ml: 1}} spacing={2}>
        <List sx={{alignContent: "center", width: '95%'}} dense={false}>
            {files.map((file: any) => 
                <ListItem key={file._id} 
                    secondaryAction={downloadFile(file.ipfsHash, file.fileName)}>
                <ListItemText
                    primary={<>{file.fileName} -- {file.subject}</>}
                    secondary={<>{file.creator} ... ${file.bountyAmt}</>}
                />
                </ListItem>
            )}
        </List>
    </Grid>)
};

export default FileList;