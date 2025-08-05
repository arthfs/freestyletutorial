"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import { signOut } from 'next-auth/react';
import { usePathname } from "next/navigation";
import FormDialog from '../request/page';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
 const [opendialog, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClosedialog = () => {
    setOpen(false);
  };


  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const pathname = usePathname();

  // Define routes where the menu should not appear
  const hideMenuRoutes = ["/login", "/register"];

  if (hideMenuRoutes.includes(pathname)) {
    return null; // Do not render the menu
  }
  return (
    <div className='menubtn'  >
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
       <MenuIcon fontSize='large'/>
      </Button>
      <Menu 
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
       <Link href={'/'}> <MenuItem onClick={handleClose}>  Home </MenuItem> </Link>
       <Link  href={'/tutorials/lower'}> <MenuItem  onClick={handleClose}>  Tuto Lower </MenuItem> </Link>
       <Link href={'/tutorials/sit'}>  <MenuItem onClick={handleClose}> Tuto Sit </MenuItem> </Link>
       <Link href={'/tutorials/upper'}>  <MenuItem onClick={handleClose}> Tuto Upper </MenuItem> </Link>
       <Link href={'/progress-tracker'}>  <MenuItem onClick={handleClose}> My progress </MenuItem> </Link>
       <Link href={'/bookmarked'}>  <MenuItem onClick={handleClose}> Bookmarked </MenuItem> </Link>
       <Link href={'/glossary'}>  <MenuItem onClick={handleClose}> Glossary </MenuItem> </Link>
       <MenuItem> <FormDialog/></MenuItem>
       <Link href={'mailto:arthursaintlouis96@gmail.com'}>  <MenuItem onClick={handleClose}> Contact me </MenuItem> </Link>
       <Link href={'/about'}>  <MenuItem onClick={handleClose}> About me </MenuItem> </Link>
       <Link href={'/settings'}>  <MenuItem onClick={handleClose}> Settings </MenuItem> </Link>
      
       <form action={ async()=>  {
        handleClickOpen()
            //await signOut({redirectTo:'/login'})
         }} 
            
        >
          <MenuItem>  <button type='submit'> Logout </button> </MenuItem>
        </form>
      </Menu>
       <React.Fragment>
     
            <Dialog className='logoutdialog'
              open={opendialog}
              onClose={handleClosedialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Are you sure you want to sign out?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick= {async()=>{
                  handleClosedialog()
                  await signOut({redirectTo:'/login'})
                }}
                  
                  >Yes</Button>
                <Button onClick={handleClosedialog} autoFocus>
                  No
                </Button>
              </DialogActions>
            </Dialog>
    </React.Fragment>
    </div>
  );
}

