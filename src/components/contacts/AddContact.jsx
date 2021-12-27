import React,{useEffect, useState} from 'react';
import { Container,Box,Typography,TextField,Stack,LinearProgress } from "@mui/material"
import { LoadingButton } from '@mui/lab';
import Appbar from "../Appbar";
import {API_CONTACTS} from '../../Utilities';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AddContact({props}){

    const path=props.path;
    const contactId=props.computedMatch.params.id;
    const history=useHistory();
    const authToken=localStorage.getItem('auth-token');
    const contactDefaults={name:'',email:'',phone:''}
    const [contactDetails,setContactDetails]=useState(contactDefaults);
    const [loading,setLoading]=useState(false);
    const [requestType,setRequestType]=useState('Add');

    const handleChange=({target:{name,value}})=>setContactDetails({...contactDetails,[name]:value});

    const addContact=async()=>{
        setLoading(true);
        await axios.post(API_CONTACTS,{
            ...contactDetails,
        },{
            headers:{auth:authToken}
        }).then(function(res){
            if(res.status===200) {
                //setAlert({...alert,show:true,message:`${eventDetails.type} added successfully`,type:'success'});
               toast.success(`Contact added successfully`);
               clearInputFields();
               history.push('/contacts');
            }
        }).catch(function(err){
            console.log(err.response);
            if(err.response.status===401) {
                toast.error('Log in to continue, redirecting');
                history.push('/login');
            } else{
               toast.error(err.response.data.message);
                setLoading(false);
            }
            
        })
        setLoading(false);
    }

    const updateContact=async()=>{
        setLoading(true);
        await axios.put(`${API_CONTACTS}/${contactId}`,{
            ...contactDetails,
        },{
            headers:{auth:authToken}
        }).then(function(res){
            if(res.status===200){
                //setAlert({...alert,show:true,message:`${eventDetails.type} updated successfully`,type:'success'});
                toast.error(`Contact updated successfully`);
                clearInputFields();
            }
        }).catch(function(err){
            console.log(err.response);
            if(err.response.status===401) {
                toast.error('Log in to continue, redirecting');
                history.push('/login');
            } else{
                toast.error(err.response.data.message);
            }
            
        })
        setLoading(false);
    }

    const clearInputFields=()=>setContactDetails(contactDefaults);

    useEffect(()=>{

        function findType(){
            if(path==='/contacts/edit/:id') {
                setRequestType('Edit');
                getContactById(contactId);
            }
        }

        async function getContactById(contactId){
            await axios.get(`${API_CONTACTS}/id/${contactId}`,{
                headers:{auth:authToken}
            }).then(function(res){
                if(res.data) {
                    console.log(res.data);
                    delete res.data._id;
                    delete res.data.userId;
                    delete res.data.createdAt;
                    console.log(res.data);
                    setContactDetails({...res.data});
                }
            }).catch(function(err){
                console.log(err.response);
            })
        }

        findType();

    },[path,contactId,authToken])

    return (
        <>
        <Appbar/>
        {loading?<LinearProgress color="secondary"/>:<></>}
        <Container sx={{mt:2}}>
            <Box>
                <Typography variant="h4">{requestType} contact</Typography>
            </Box>
            <Stack direction="column" spacing={2} sx={{mt:2}}>
                <Stack direction="row" spacing={2}>
                    <TextField onChange={handleChange} value={contactDetails.name} fullWidth type="text" required variant="outlined" name="name" label="Name"></TextField>
                    <TextField onChange={handleChange} value={contactDetails.email} fullWidth type="email" variant="outlined" required name="email" label="Email"></TextField>
                    <TextField onChange={handleChange} value={contactDetails.phone} fullWidth variant="outlined" name="phone" label="Phone"></TextField>
                </Stack>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    {requestType==='Add'
                    ?<LoadingButton onClick={addContact} loading={loading} variant="contained" size="large" color="primary">Add Contact</LoadingButton>
                    :<LoadingButton onClick={updateContact} loading={loading} variant="contained" size="large">Update Contact</LoadingButton>}
                    <LoadingButton  onClick={()=>setContactDetails(contactDefaults)} variant="contained" size="large" color="warning">Clear</LoadingButton>
                    <LoadingButton onClick={()=>history.push(`/contacts`)} variant="contained" size="large" color="error">Close</LoadingButton>
                </Stack>
            </Stack>
        </Container>
        </>
    )

}