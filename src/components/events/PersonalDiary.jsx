import React,{useEffect,useState} from 'react';
//import { useHistory } from 'react-router';
import axios from 'axios';
import Appbar from '../Appbar';
import {Stack,Button,Container,Box,LinearProgress,Snackbar,Alert,TextField,Typography} from '@mui/material';
import {DatePicker,LocalizationProvider,LoadingButton} from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {API_PERSONAL_DIARY,dateOnly} from '../../Utilities'

export default function PersonalDiary({props}){

    const path=props.path;
    //const history=useHistory();
    const authToken=localStorage.getItem('auth-token');
    // const styles={
    //     typography:{color:'white',display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}
    // }
    const [diaryContent,setDiaryContent]=useState('');
    const [diaryId,setDiaryId]=useState('');
    const [loading,setLoading]=useState(true);
    const [disabled,setDisabled]=useState(false);
    const [date,setDate]=useState(new Date());
    const [alert,setAlert]=useState({show:false,vertical:'top',horizontal:'right',type:'success',message:''});
    const {show,vertical,horizontal,type,message}=alert;
    
    const handleText=(e)=>setDiaryContent(e.target.value);
    const closeAlert=()=>setAlert({...alert,show:false});

    const writeDiary=async()=>{
        
        if (dateOnly(date)===dateOnly(new Date()) && diaryId.length<0){
            await axios.post(API_PERSONAL_DIARY,{
                date:dateOnly(date),content:diaryContent,
            },{
                headers:{auth:authToken},
                }).then(function(res){
                    if(res.status===200) setAlert({...alert,show:true,type:'success',message:'Diary written successfully'});
                }).catch(function(err){
                    editDiary();
                    // if(err.response.data.message) setAlert({...alert,show:true,message:err.response.data.message,type:'error'});
                    // else setAlert({...alert,show:true,message:err.response.data,type:'error'});
                })
            } else {
                editDiary();
            }
    }

    const editDiary=async()=>{
        await axios.put(`${API_PERSONAL_DIARY}/${diaryId}`,{
            date:dateOnly(date),content:diaryContent,
        },{
            headers:{auth:authToken},
            }).then(function(res){
                if(res.status===200) setAlert({...alert,show:true,type:'success',message:'Diary edited successfully'});
            }).catch(function(err){
                if(err.response.data.message) setAlert({...alert,show:true,message:err.response.data.message,type:'error'});
                else setAlert({...alert,show:true,message:err.response.data,type:'error'});
            })
    }

    useEffect(()=>{

        async function getDiaryDetails(){
            setLoading(true);
            await axios.get(`${API_PERSONAL_DIARY}?date=${dateOnly(date)}`,{
                headers:{auth:authToken},
            }).then(function(res){
                if (res.data) {
                    setDiaryContent(res.data.content);
                    setDiaryId(res.data._id);
                }
                else setDiaryContent('');
                if (dateOnly(date)!==dateOnly(new Date())) setDisabled(true);
                else setDisabled(false);
            }).catch(function(err){
                console.log(err);
            })
            setLoading(false);
        }
        getDiaryDetails();
       
        
    },[path,authToken,date])
    
    return(
        <>
        <Appbar/>
        <Stack spacing={1}>
        {loading?<LinearProgress color="secondary"/>:<></>}
        </Stack>
        <Container>
        <Typography variant="h4" sx={{mt:2}}>Personal diary</Typography>
        <Box sx={{mt:2,width:'100%'}}>
        <Stack direction="row" spacing={1} justifyContent="flex-end">

        </Stack>    
        <Stack direction="row" spacing={1} justifyContent="flex-start">
        <LocalizationProvider dateAdapter={AdapterDateFns} >
            <DatePicker
                label="Select date"
                value={date}
                inputFormat='dd-MM-yyyy'
                onChange={(newDate)=>{
                    setDate(newDate);
                    }}
                renderInput={(params)=><TextField fullWidth required {...params}/>}
                ></DatePicker>
        </LocalizationProvider>
            <Button variant="contained" color="primary" size="large" onClick={()=>setDate(new Date())}>Refresh</Button>
        </Stack>
        <Stack sx={{mt:2}}>
           <TextField disabled={disabled} onChange={handleText} value={diaryContent} multiline fullwidth="true" name="content" variant="outlined" label="Diary content" rows={14} maxRows={14} ></TextField>
        </Stack>
        <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center" sx={{mt:2}}>
            <Typography variant="h6" sx={{marginRight:'auto',color:'red'}}>Personal diary can be written and edited only in the corresponding or same date</Typography>
            <LoadingButton onClick={writeDiary} loading={loading} variant="contained" size="large" color="primary">Write / Edit</LoadingButton>
        </Stack>
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