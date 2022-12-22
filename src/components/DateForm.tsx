import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const DateForm = ({ startChange, endChange, update, now, later}: any) => {
    return (
        <Box component={Paper} sx={{border: '2px solid #27163c', mt: 2, }}>
            <Grid container>
                <Grid item xs={12}>
                    <Typography sx={{ mt: 4, mb: 2, ml: 1 }} variant="h6" component="div">
                        NEOs Search Dates
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <InputLabel sx={{textAlign: 'left', ml: 2}}>
                        Start Date: {now.toISOString()}
                    </InputLabel>
                    <OutlinedInput value={now} onChange={startChange} type='date' sx={{width: '90%'}}></OutlinedInput>
                </Grid>
                <Grid item xs={12}>
                    <InputLabel sx={{textAlign: 'left', ml: 2}}>
                        End Date: {later.toISOString()}
                    </InputLabel>
                    <OutlinedInput value={later} onChange={endChange} type='date' sx={{width: '90%'}}></OutlinedInput>
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={update} sx={{ mt: 2, mb: 5 }} variant="outlined">Get NEOs</Button>
                </Grid>
            </Grid>       
        </Box>
    )
}

export default DateForm;