import {AppBar,Button,Typography,Toolbar,IconButton,Drawer,List,ListItem,ListItemText,ListItemIcon,ListItemButton,Divider} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {Home,Event,DateRange,MeetingRoom,ViewDay,MenuBook,Contacts,CalendarViewMonth} from '@mui/icons-material';
import '../App.css';
import {useHistory} from 'react-router-dom';
import {useState} from 'react';

export default function Appbar(){

    const history=useHistory();
    const [drawerOpen,setDrawerOpen]=useState(false);
    const eventItems=[
        {
            item:'Appointments',icon:<DateRange/>,link:'/appointments',
        },{
            item:'Events',icon:<Event/>,link:'/events',
        },{
            item:'Meetings',icon:<MeetingRoom/>,link:'/meetings',
        },{
            item:'Day planner',icon:<ViewDay/>,link:'/day-planner',
        },{
            item:'Calendar view',icon:<CalendarViewMonth/>,link:'/calendar-view',
        }
    ];

    const handleMenuItemClick=(item)=>{
        history.push(item);
        menuClose();
    }

    const menuOpen=()=>setDrawerOpen(true);
    const menuClose=()=>setDrawerOpen(false);

    const logoutUser=()=>{
        localStorage.removeItem('auth-token');
        history.push('/login');
    }

    const menuItems=()=>{
       return(
        <>
        <List>
            <ListItem button onClick={()=>history.push('/dashboard')}>
                <ListItemIcon><Home/></ListItemIcon>
                <ListItemText primary="Dashboard"/>
            </ListItem>
        </List>
        <Divider/>
        {eventItems.map(({item,icon,link},index)=>{
            return(
                <List key={index}>
                <ListItem disablePadding>
                    <ListItemButton onClick={()=>handleMenuItemClick(link)}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={item}/>
                    </ListItemButton>
                </ListItem>
            </List>
            )
        })
        }
        <Divider/>
        <List>
            <ListItem button onClick={()=>history.push('/personal-diary')}>
                <ListItemIcon><MenuBook/></ListItemIcon>
                <ListItemText primary="Personal diary"/>
            </ListItem>
        </List>
        <Divider/>
        <List>
            <ListItem button onClick={()=>history.push('/contacts')}>
                <ListItemIcon><Contacts/></ListItemIcon>
                <ListItemText primary="Contacts"/>
            </ListItem>
        </List>
        </>
       )
    }


    return(
        <>
        <AppBar position="static">
            <Toolbar>
                <IconButton 
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{mr:2}}
                    onClick={menuOpen}
                    >
                <MenuIcon/>
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Diary manager
                </Typography>
                <Button color="inherit" onClick={()=>logoutUser()}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Drawer
            sx={{
                width: '240px',
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: '240px', boxSizing: 'border-box' },
              }}
            anchor="left"
            open={drawerOpen}
            onClose={menuClose}
            >
            {menuItems()}
          </Drawer>
        </>
    )

}