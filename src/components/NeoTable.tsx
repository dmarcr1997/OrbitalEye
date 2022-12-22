import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
const NeoTable = ({data, handleClick}: any) => {
    return (
        <TableContainer sx={{ maxHeight: 400, border: '2px solid #27163c' }} component={Paper}>
            <Table stickyHeader aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>NAME&nbsp;(Click to Add)</TableCell>
                    <TableCell align="right">VELOCITY&nbsp;(km/s)</TableCell>
                    <TableCell align="right">DISTANCE&nbsp;(km)</TableCell>
                    <TableCell align="right">DIAMETER&nbsp;(km)</TableCell>
                    <TableCell align="right">CLOSEST APPROACH</TableCell>
                    <TableCell align="right">MAGNITUDE</TableCell>
                    <TableCell align="right">HAZARDOUS</TableCell>
                    <TableCell align="right">SENTRY</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {data.map((row: any) => (
                    <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell onClick={() => handleClick(row)} component="th" scope="row">
                            {row.name}
                        </TableCell>
                        <TableCell align="right">{row.velocity}</TableCell>
                        <TableCell align="right">{row.missDistance}</TableCell>
                        <TableCell align="right">{row.diameter}</TableCell>
                        <TableCell align="right">{row.closestApproachDate}</TableCell>
                        <TableCell align="right">{row.absoluteMagnitude}</TableCell>
                        <TableCell align="right">{row.hazardous ? 'Potentially' : 'Non-Hazardous'}</TableCell>
                        <TableCell align="right">{row.sentry ? 'YES' : 'NO'}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default NeoTable;