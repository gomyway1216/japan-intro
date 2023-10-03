import React, { FC, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../../Provider/AuthProvider';
import { useNavigate } from 'react-router-dom';
import styles from './NavBar.module.scss';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Theme } from '@mui/material/styles';

const ResponsiveAppBar: FC = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const { currentUser } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  // Inside your component function:
  const theme = useTheme();  // <-- Import useTheme from MUI and use it to get the theme object.

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleSearchIconClick = () => {
    setSearchVisible(!searchVisible);
  };

  const getStyles = (searchVisible: boolean, theme: Theme): Record<string, any> => ({
    width: searchVisible ? '100%' : '0ch',
    '&:focus': {
      width: searchVisible ? '20ch' : '100%',
    },
    transition: theme.transitions.create('width'),
    marginRight: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      width: searchVisible ? '20ch' : '0ch',
    }
  });

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
    <AppBar position="static" color="default">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {!searchVisible && (
            <>
              <Typography
                variant="h5"
                noWrap
                component="span"
                style={{ flexGrow: 1, cursor: 'pointer' }}
                onClick={handleLogoClick}
              >
                Japan Intro
              </Typography>

              <IconButton color="inherit" onClick={handleSearchIconClick}>
                <SearchIcon />
              </IconButton>
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
            </>
          )}

          {searchVisible && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <IconButton color="inherit" onClick={handleSearchIconClick}>
                <SearchIcon />
              </IconButton>
              <InputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                sx={getStyles(searchVisible, theme)}
              />
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
