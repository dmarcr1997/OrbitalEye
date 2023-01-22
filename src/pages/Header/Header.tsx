import * as React from 'react';
import { 
    AppBar, 
    Box,
    Toolbar,
    IconButton,
    Menu,
    Button,
    MenuItem,
    Container,
    Typography,
    Tooltip
}from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
    useAddress, 
    useDisconnect 
} from '@thirdweb-dev/react';
import { useNavigate } from 'react-router-dom';

const pages = [{ name: 'Dashboard', route: '/dashboard'}, { name: 'View', route: '/bounty'}, { name: 'About', route: '/about'}];
const settings = ['Profile', 'Membership', 'Disconnect'];

const Header = () => {
    const address = useAddress();
    const navigate = useNavigate();
    const disconnect = useDisconnect();
    
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [showProfile, setShowProfile] = React.useState<boolean>(false);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleClickNavMenu = (route: string) => {
        if(address){
            navigate(route);
        }
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const daoPage = () => {
        navigate('/member')
    }

    const handleClickMenuItem = (item: string) => {
        switch(item) {
            case 'Disconnect':
                disconnect();
                break;
            case 'Membership':
                daoPage()
                break;
        }
        if(item === 'Disconnect'){
            disconnect();
        } else {
            setShowProfile((value: boolean) => !value);
        }
    }

    const shortAddress = () => {
        return address?.substring(0, 6) + '...' + address?.substring(address.length - 4);
    }

    const theme = createTheme({
        palette: {
            mode: 'dark',
        },
    });
    return (
        <ThemeProvider theme={theme} >
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.2rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            }}
                        >
                            OrbitalEye
                        </Typography>
                        {/* @ts-ignore */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => (
                            <Button
                                key={page.name}
                                onClick={() => handleClickNavMenu(page.route)}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page.name}
                            </Button>
                            ))}
                        </Box>
                        <Box sx={{ flexGrow: 0}}>
                            {showProfile && address ? <Typography>{shortAddress()}&nbsp;</Typography> : ''}
                        </Box>
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <FaceIcon />
                                </IconButton>
                            </Tooltip>
                            <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                            >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={() => handleClickMenuItem(setting)}>
                                <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider>
    )
}

export default Header;