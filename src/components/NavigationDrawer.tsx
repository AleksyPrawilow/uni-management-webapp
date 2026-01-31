import { Home, School, Person } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import {
  Drawer,
  List,
  ListItem,
  Tooltip,
  ListItemButton,
  ListItemIcon,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function NavigationDrawer() {
  const navigate = useNavigate();
  const theme = useTheme();
  const drawerWidth = 64;

  const navItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Courses', icon: <School />, path: '/courses' },
    { text: 'Students', icon: <Person />, path: '/students' },
  ];
  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
        }}
      >
        <List sx={{ height: '100%', alignContent: 'center' }}>
          {navItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <Tooltip title={item.text} placement="right">
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => {
                    navigate(item.path);
                  }}
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                    },
                    '&.Mui-selected:hover': {
                      bgcolor: 'primary.dark',
                    },
                    minHeight: 48,
                    justifyContent: 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color:
                        location.pathname === item.path
                          ? theme.palette.secondary.main
                          : theme.palette.primary.main,
                      minWidth: 0,
                      py: 2,
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
