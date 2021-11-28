import React,{useEffect,useState} from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';
import Appbar from '../Appbar';
import {Stack,Typography,Button,Container,Card,IconButton,Box,LinearProgress,Snackbar,Alert} from '@mui/material';
import { Delete,Edit,Today,AccessTime } from '@mui/icons-material';
import {API_CONTACTS} from '../../Utilities'

export default function Contacts(){

    const history=useHistory();
    const authToken=localStorage.getItem('auth-token');
    const styles={
        typography:{display:'flex',flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}
    }
    const [contacts,setContacts]=useState([]);
    const [loading,setLoading]=useState(true);
    const [deleted,setDeleted]=useState(false);
    const [alert,setAlert]=useState({show:false,vertical:'top',horizontal:'right',type:'success',message:''});
    const {show,vertical,horizontal,type,message}=alert;

    const deleteEvent=async(id)=>{
        setLoading(true);
        await axios.delete(`${API_CONTACTS}/${id}`,{
            headers:{auth:authToken}
        }).then(function(res){
            console.log(res);
            if(res.status===200) setDeleted(id);
        }).catch(function(err){
            console.log(err);
        })
        setLoading(false);
    }

    const closeAlert=()=>setAlert({...alert,show:false});

    useEffect(()=>{
        
        async function getContacts(){
            setLoading(true);
            await axios.get(API_CONTACTS,{
                headers:{auth:authToken},
            }).then(function(res){
                setContacts(res.data);
            }).catch(function(err){
                console.log(err);
            })
            setLoading(false);
        }

        getContacts();
          
    },[authToken,deleted])

    return(
        <>
        <Appbar/>
        {loading?<LinearProgress color="secondary"/>:<></>}
        <Container>
        <Box sx={{mt:2,width:'100%'}}>
        <Stack direction="row" spacing={1} justifyContent="flex-end">

        </Stack>    
        <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button variant="contained" color="primary" size="large" onClick={()=>history.push(`/contacts/add`)}>Add contact</Button>
        </Stack>
           {(contacts.length>0)? contacts.map((contact,index)=>{
                return(
                    <Box key={index}>
                        <Card sx={{height:'100px',padding:2,mb:1,mt:1,display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                            <Stack direction="column" spacing={1}>
                                <Typography variant="h4" sx={{fontSize:'32px',fontWeight:'semi-bold'}}>{contact.name}</Typography>
                                <Stack direction="row" spacing={2}>
                                    <Typography sx={styles.typography}><Today sx={{pr:1}}/>{contact.email}</Typography>
                                    <Typography sx={styles.typography}><AccessTime sx={{pr:1}}/>{contact.phone}</Typography>
                                </Stack>
                            </Stack>
                            <Stack direction="row" sx={{height:'auto'}}>
                                <IconButton onClick={()=>history.push(`/contacts/edit/${contact._id}`)} color="secondary" size="large"><Edit fontSize="large"/></IconButton>
                                <IconButton onClick={()=>deleteEvent(contact._id)} color="error" size="large"><Delete fontSize="large"/></IconButton>
                            </Stack>
                        </Card>
                    </Box>
                )
            }):loading?<p>{`Loading contacts`}</p>:<p>{`No contacts to display`}</p>}
        </Box>
        </Container>
        <Snackbar open={show} autoHideDuration={6000} onClose={closeAlert} anchorOrigin={{vertical,horizontal}}>
            <Alert severity={type} variant="filled" sx={{width:'100%',pr:30}}>
                {message}
            </Alert>
        </Snackbar>
        </>
    )

}