import React, { FC, useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../../Provider/AuthProvider';
import { useNavigate } from 'react-router-dom';
import styles from './NavBar.module.scss';
import AccountCircle from '@mui/icons-material/AccountCircle';
// import SearchBar from '../SearchBar/SearchBar';

const ResponsiveAppBar: FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { currentUser, signOut } = useAuth();
  // const uid = currentUser?.uid;
  const navigate = useNavigate();
  // Add a state to manage the visibility of the search TextField
  const [searchVisible, setSearchVisible] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreateClick = () => {
    navigate('/new-post');
  };


  return (
    <Box className={styles.root}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        // paddingTop: (theme) => theme.mixins.toolbar.minHeight,
      }}
    >
      <Box>
        <AppBar className={styles.navBar}
          position="static"
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="/"
                sx={{
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                Japan Intro
              </Typography>
              {currentUser && (
                <div>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleCreateClick}>Create</MenuItem>
                    <MenuItem onClick={handleClose}>Settings</MenuItem>
                  </Menu>
                </div>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
      {/* Conditionally render the TextField below the AppBar based on the state */}
      {searchVisible && (
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'blue',
            flexGrow: 1,
            display: { xs: 'flex', md: 'none' }
          }}
        >
          {/* <SearchBar
            color='white'
            characterColor='black'
            callback={() => setSearchVisible(false)}
          /> */}
        </Box>
      )}
    </Box>
  );
}
export default ResponsiveAppBar;
