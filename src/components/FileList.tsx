import { Typography, Grid, List, IconButton, ListItemText } from "@mui/material";
import ListItem from "@mui/material/ListItem";

const FileList = ({ files }: any) => {
    return (
    <Grid container sx={{ ml: 2, alignItems: 'center'}} spacing={2}>
        <List dense={false}>
            {files.map((file: any) => 
                <ListItem key={file._id}>
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