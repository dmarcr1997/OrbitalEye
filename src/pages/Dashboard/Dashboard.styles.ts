import { withTheme } from '@emotion/react';
import background from '../../assets/images/DashboardImg2.jpg';

export const dashboardContainer = { 
    backgroundImage: `url(${background})`, 
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: '100vw',
    height: '120vh',
};
export const dashboardNEOTable = { color: 'white', backgroundColor: 'black', maxWidth: '100%', maxHeight: '100%', overflow: 'scrollbar', boxSizing: 'content-box' };