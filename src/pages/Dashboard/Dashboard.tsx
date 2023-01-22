import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import UploadFileForm from '../../components/UploadFileForm';
import { NEODataObject } from '../../models/INEODataObject';
import { useAddress } from '@thirdweb-dev/react';
import { useNavigate } from 'react-router-dom';
import NeoDataLayer from '../../components/NeoDataLayer';
import backgroundImg from '../../assets/images/DashboardImg2.jpg';

const dashboardContainer = { 
    backgroundImage: `url(${backgroundImg})`, 
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: '100vw',
    height: '120vh',
};

const Dashboard = () => {
    const [items, setItems] = useState<NEODataObject[]>([]);
    const address = useAddress();
    const navigate = useNavigate();

    useEffect(() => {
        const goToLanding = () => navigate('/');
        if(!address){
            console.log('No Wallet Connected');
            goToLanding();
        }
    }, [address, navigate]);

    return (
        <Container maxWidth={false} sx={dashboardContainer}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <UploadFileForm neos={items}/>
                </Grid>
                <NeoDataLayer pushItemsUp={setItems}/>
            </Grid>
        </Container>
    )
}

export default Dashboard;