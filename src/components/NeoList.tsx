import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
const NeoList = ({ items, deleteHandler }: any) => {
    return (
        <Box component={Paper} sx={{border: '2px solid #27163c', mt: 2, textAlign: 'left' }}>
            <Typography sx={{ mt: 4, mb: 2, ml: 1 }} variant="h6" component="div">
                Selected NEOs
            </Typography>
            <List dense={false}>
                {items.map((item: any) =>
                    <ListItem
                    secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => deleteHandler(item)}>
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
    )
}

export default NeoList