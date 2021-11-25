import { useHistory } from 'react-router-dom';
import {Container,TextField,Link,Button,Stack,Typography} from '@mui/material';

export default function ForgotPassword(){

    const history=useHistory();

    const resendLink=()=>{

    }

    return (
        <>
        <Container maxWidth="sm">
            <Stack spacing={2} sx={{mt:3}} alignItems="center">
                <Typography variant="h4" sx={{mt:5}}>Forgot password</Typography>
                <TextField required fullWidth variant="outlined" name="email" type="email" label="Email address"></TextField>
                <Button fullWidth variant="contained" sx={{padding:1.5}}>Reset password</Button>
                <Link sx={{cursor:'pointer'}} onClick={()=>resendLink()} variant="body2">Resend password reset link</Link>
                <Link sx={{cursor:'pointer'}} onClick={()=>history.push('/login')} variant="body2">Go back to login</Link>
            </Stack>
        </Container>
        </>
    )

}
