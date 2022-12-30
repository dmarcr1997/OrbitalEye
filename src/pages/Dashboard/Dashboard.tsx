import { useEffect, useMemo, useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { dashboardContainer } from './Dashboard.styles';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import UploadFileForm from '../../components/UploadFileForm';
import { NEODataObject } from '../../models/INEODataObject';
import { useAddress } from '@thirdweb-dev/react';
import { useNavigate } from 'react-router-dom';
import NeoDataLayer from '../../components/NeoDataLayer';

const Dashboard = () => {
    const [items, setItems] = useState<NEODataObject[]>([]);
    const [loading, setLoading] = useState(false);

    const address = useAddress();
    const navigate = useNavigate();

    useEffect(() => {
        const goToLanding = () => navigate('/');
        if(!address){
            console.log('No Wallet Connected');
            goToLanding()
        } else {
            setLoading(true);
        }
    }, [address, navigate]);
    
    const theme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth={false} sx={dashboardContainer}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <UploadFileForm neos={items}/>
                    </Grid>
                    <NeoDataLayer pushItemsUp={setItems}/>
                </Grid>
            </Container>
        </ThemeProvider>
    )
}

export default Dashboard;