'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { addDoc, collection } from 'firebase/firestore';
import { firestore_reference } from '@/app/firebase';
import { getcontext } from '@/app/context';

import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


export default function FormDialog() {
  const [opensnackbar, setOpensnackbar] = React.useState(false);

  const handleClick = () => {
    setOpensnackbar(true);
  };

  const handleClosesnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpensnackbar(false);
  };
const action = (
    <React.Fragment>
      <Button color="inherit" size="small" onClick={handleClosesnackbar}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClosesnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );


  const [open, setOpen] = React.useState(false);
  const [trick,settrick] = React.useState('')
 const {user} = getcontext() 
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    settrick('')
    setOpen(false);
  };
React.useEffect(()=>{
 
    return ()=>{ settrick('')}
},[])

  return (
    <React.Fragment>
      <h1  onClick={handleClickOpen}>
        Request a tutorial
      </h1>
      <Dialog className='requesttrick'
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
           
           
         
            handleClose();
          },
        }}
      >
        <DialogTitle>Tutorial request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the name of the trick you would like i make a tutorial about in the future.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="tutorial"
            label="Name of the trick"
            type="text"
            fullWidth
            variant="standard"
            value={trick}
            onChange={(e)=>{settrick(e.target.value)}}
            
          />

        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick= {handleClose}
        
            >Cancel</Button>
          <Button variant='contained'  onClick={ async()=>{
           
            const date = new Date()
            const reference =  collection(firestore_reference,'/requests')

         try
         { 
            await addDoc(reference ,
                {
                'name':user._document.data.value.mapValue.fields.name,
                'trick': trick ,
                'date': date.toLocaleDateString()+' '+ date.toLocaleTimeString()
                })
            handleClose()
            handleClick()
         }
         catch(e) 
         {
            console.log(e)
           
         }
          
          }}>Submit</Button>
        </DialogActions>
      </Dialog>
       
      <div  >
          
      
      <Snackbar
       
        open={opensnackbar}
        autoHideDuration={4000}
        onClose={handleClosesnackbar}
        message="Thanks for your sugestion"
        action={action}
        ContentProps={{
          sx: {
            backgroundColor: '#4caf50', // your custom color
            color: '#ffffff' // text color
          }
        }}
      />

 </div>
    </React.Fragment>
  );
}
