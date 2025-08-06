'use client'
import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { firestore_reference,storage_reference} from '../firebase'
import { getcontext } from '../context'
import { deleteDoc } from 'firebase/firestore'
import { getDoc,doc,updateDoc } from 'firebase/firestore'
import { uploadBytes,ref, getDownloadURL, deleteObject } from 'firebase/storage'
import Image from 'next/image'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { signOut } from 'next-auth/react'
import AutohideSnackbar from '../components/snackbar'

let originalname = '',originalphotoname = '', originalphotourl:string;
export default function Page() {
    const [profilepicture,setprofilepicture] = useState('')
   
    const[name,setname] = useState('')
    const {user,loading} = getcontext()
    const user_ref = doc(firestore_reference,`users/${user!.id}`)
    const [file, setFile] = useState<File | null>(null);
    const [opendialog, setOpen] = React.useState(false);
    const [opened,setopened] = useState(false)
    const updateopen = ()=>{setopened(true)
      console.log(opened)
    }
      const handleClickOpen = () => {
        setOpen(true);
        
      };
    
      const handleClosedialog = () => {
        setOpen(false);
      };
    

    useEffect(()=>{
        if (!loading)
        {   const ref_user = doc(firestore_reference, `/users/${user!.id}`);
            getDoc(ref_user).then((snapshot)=>{
                if (snapshot.exists())
                {
                   
                setprofilepicture(snapshot.data()['photourl'])
                setname(snapshot.data()['name'])
                 originalname = snapshot.data()['name']
                 originalphotourl = snapshot.data()['photourl']
                 originalphotoname = snapshot.data()['photoname']
                }
                
            })
           

        }
    },[user,loading])

   
if (loading) {
  return <div>Loading user...</div>;
}

// Handle no user
if (!user || !user.id) {
  return <div>Please sign in to view this content.</div>;
}

const handleupload = async (filename:string,file:File)=>{
    const storage_ref = ref(storage_reference, `profilepictures/${filename}`);
    const task = uploadBytes(storage_ref,file)
    await task;
    const url = await getDownloadURL(storage_ref)
   
    updateDoc(user_ref,{'photoname':filename,'photourl':url})

}

  return (
    <div>
        <div className='pagetitle'> Settings</div>
        <div className='formcontainer'>
            <div className='settingsform'>
                <div className='profilepicture'>
                    {
                      profilepicture &&  <Image className='settingsprofilepicture' src={profilepicture} width={40} height={40} alt='profilepicture'></Image> 
                    }
                
                </div>
                { profilepicture &&
                  <div> 
                     <HighlightOffIcon style={{'color':'red'}}></HighlightOffIcon>
                     <button onClick={async()=>{
                    
                          
                            const deleteref = ref(storage_reference,`profilepictures/${originalphotoname}`)
                            await   deleteObject(deleteref)
                            await updateDoc(user_ref,{'photoname':'','photourl':''})
                        
                                    }}> Remove picture
                    </button> 
                  </div>
                }
                <div className='settingsformfield'> 
                    <label style={{width:'100%'}}  > Display name</label>
                    <div className='inputwrapper'> <input style={{textAlign:'end'}}  type='text' value={name} onChange={(event)=>{ if (event.target!=null) setname(event?.target.value)}} ></input>  </div>
                </div>
                
                <div className='settingsformfield'>
                    <label  > Update my picture</label>
                    <div className='inputwrapper'></div>  
                            <input style={{textAlign:'end'}}  type='file' accept='image/*' onChange={(event)=>{
                            if (event.target.files!=null) 
                            {
                            setFile(event?.target.files[0])
                            setprofilepicture(URL.createObjectURL(event?.target.files[0]))
                            }
                           }}>
                            </input> 
                    </div>
               
               </div>

                 <div className='buttons' style={{}}>     
                    <Button className='settingsbtn' variant='outlined' onClick={async()=>{
                       
                        const user_ref = doc(firestore_reference,`users/${user.id}`)
                       if (name.localeCompare(originalname)!=0)
                        { 
                          await updateDoc(user_ref,{'name':name})
                           updateopen()
                        }
                        if (file!=null)
                        {
                            if (originalname.localeCompare(file.name)!=0)  {
                              handleupload(file?.name,file)
                               updateopen()
                            }
                        }
                      
                    
                    }}> Save changes </Button> 
                    <AutohideSnackbar opened = {opened} onClose={()=>{setopened(false) } } severity='success'autoHideDuration={5000} notif={"Changes made successfully"}></AutohideSnackbar>
                    <Button variant='outlined' onClick={()=>{
                       
                        setname(originalname)
                        try{
                        setprofilepicture(originalphotourl)
                        } catch (e) 
                      {
                        setprofilepicture('')
                        console.log(e)
                      }
                    }}> Cancel </Button> 
                 </div>
                  <div> <Button variant='contained' onClick={handleClickOpen} >Delete my account</Button> </div>
                    <React.Fragment>
                       
                              <Dialog
                                open={opendialog}
                                onClose={handleClosedialog}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                              >
                                <DialogTitle id="alert-dialog-title">
                                  {"Are you sure you want to delete your account"}
                                </DialogTitle>
                                <DialogContent>
                                  <DialogContentText id="alert-dialog-description">
                                    
                                  </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                  <Button onClick= {async()=>{
                                    handleClosedialog()
                                    await deleteDoc( doc(firestore_reference,`users/${user.id}`))
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
      
          
        </div>
    
  )
}
