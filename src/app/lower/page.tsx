'use client'
import React, { use, useEffect, useState } from 'react'
import FavoriteBorderIcon   from '@mui/icons-material/FavoriteBorder' ;
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import {app, storage_reference} from '@/app/page'
import { addDoc, collection, doc, Firestore, getDoc, getFirestore } from 'firebase/firestore';
import { getStorage,ref,getDownloadURL, listAll } from 'firebase/storage';
import firebase from 'firebase/compat/app';
import { Dvr } from '@mui/icons-material';
import { Button } from '@mui/material';

/* vido name : string
        number of like :int 
        comments : list
                name of commenter : string
                date and time     : string
                comment : string
*/
var video = {
  'title':'Skatw',
  'likes': 2,

 'comments' : [
    {'commenter':'peter',
      'date':'2024-12-09 12:48',
      'comment' :'thanks'
    },

    {'commenter':'Michael',
        'date':'2024-12-09 12:48',
        'comment' :'this is hard'
      },

      {'commenter':'Jane',
        'date':'2024-12-09 12:48',
        'comment' :'I love that one'
      },

      {'commenter':'paul',
        'date':'2024-12-09 12:48',
        'comment' :'I will try it today'
      },
]
}

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


export default function Lower() {
  

  
  //const analytics = getAnalytics(app);
  const [comment,setcomment] = useState('')
  const[url,seturl] = useState('')
  
 
  const update_comment = (newcomment:string)=>{  setcomment(newcomment)}
  return (
    <div className='main'>
       <div className='title'> Lower</div> 
       <button className='test' onClick={ async()=>{
       // await addDoc(collection( db,'users'), {'name':'peter','nickname':'paul'}).then((e)=>{
       //   console.log(e.id)
        //})
       // const filee = ref(storage_reference,'gs://freestyle-5f2df.firebasestorage.app/tutorials/lower/VID_20241013_103059(0).mp4')        
        //const reff = ref(storage_reference,'/tutorials/lower')
       // const url = await getDownloadURL(filee)
        //seturl(url)
        //console.log(url)
       //const list = await listAll(reff)
      // console.log(list)

       }}> test</button>
       <div className='content'>
            <div className='left'>
                <div className='lefttitle'> {video ['title'] }</div>
                <div className='video'> 
                  <video style={{height:'100%'}} controls  src={url}></video>
                </div>
                <div className='buttons'> 
                    <div style={{display:'flex',alignItems:'center',flexDirection:'row'}}>
                        <FavoriteBorderIcon fontSize='large'></FavoriteBorderIcon> 
                       { video['likes']>0 && <h1 style={{fontSize:'20px'}}> {video['likes']} </h1>}
                    </div>
                    <BookmarkBorderIcon fontSize='large'/>
                    <ShareIcon fontSize='large'></ShareIcon>
                </div>
            </div>
            <div className='right'>
                <div className='righttitle'>Comments</div>
                <div style={{display:'flex',flexDirection:'column',rowGap:'20px'}}>
                {
                    video['comments'].map((c)=> 
                    <div key={video['comments'].indexOf(c)}> 
                    
                   <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}> 
                      <div> {c.commenter} </div>  
                      <div className='date'>  {c.date} </div>
                    </div>
                    <div>  {c.comment}  </div>
                    </div> )
                }
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                     
                        <textarea className='inputt' placeholder='enter your comment' value={comment} onChange={(e)=>{
                          update_comment(e.target.value)
                        }}></textarea>
                      
                      <div>
                      <Button variant='contained'>Comment</Button>
                      </div>
                  </div>
                </div>
            </div>
       </div>
    </div>
  )
}
