'use client';
import React, { useEffect, useState } from 'react'
import { getcontext } from '../context';
import { doc, getDoc, getDocs } from 'firebase/firestore';
import { firestore_reference } from '../firebase';
import { Firestore } from 'firebase/firestore';
import { collection } from 'firebase/firestore';

export default function Progress() {
 const achieved = 40, total=300, height = 20;
 const {user,loading} = getcontext();
 const [completed,setcompleted] = useState({'lower':[],'sit':[],'upper':[]})
 const [tutorial,settutorial] = useState({'lower':[],'sit':[],'upper':[]})

 useEffect(()=>{
    if (!loading)
    {   const reference = collection(firestore_reference, '/tutorials')
   
        const reference_user = doc(firestore_reference,`/users/${user.id}`)
        getDoc(reference_user).then((snapshot)=>{
            if (snapshot.exists())
            {
            var docs = snapshot.data().completed
            var lower = docs.filter((doc:string)=> doc.startsWith('lower'))
            var sit = docs.filter((doc:string )=> doc.startsWith('sit'))
            var upper = docs.filter((doc : string)=> doc.startsWith('upper'))
            
            setcompleted({'lower':lower,'upper':upper,'sit':sit})
            }
           
         
        })

        getDocs(reference).then((result)=>{
        
            var docs = result.docs
            var lower = docs.filter((doc)=> doc.id.startsWith('lower'))
            var sit = docs.filter((doc)=> doc.id.startsWith('sit'))
            var upper = docs.filter((doc)=> doc.id.startsWith('upper'))

            settutorial({'lower':lower,'upper':upper,'sit':sit})
           
        })
  
    }
 },[])
 if (loading) return <div>loading</div>
if (!loading)
{
    
  return (
    <div>
        <div className='pagetitle'> My progress </div>
                <div style={{padding:'20px',display:'flex',flexDirection:'column',rowGap:'40px'}}>
                <div style={{display:'flex',alignSelf:'center'}}>
                    
                        <div style={{marginRight:'20px',width:'40px',alignSelf:'self-start'}}>Lower</div>
                        
                    
                        <div style={{ width:total,backgroundColor:'#dcdbdbff',height:height,borderStyle:'solid',borderRadius:'10px'}}>
                            <div style={{width:`${(completed['lower'].length/tutorial['lower'].length) *total}px`,backgroundColor:'#08D9D6','height':height,borderLeftStyle:'solid',borderTopLeftRadius:'10px',borderBottomLeftRadius:'10px'}}>
                                
                            </div>

                        </div>
                        <div style={{marginLeft:'10px'}}>{`${(completed['lower'].length/tutorial['lower'].length *100).toFixed(2)} %`}</div>
                </div>

                 <div style={{display:'flex',alignSelf:'center'}}>
                    
                        <div style={{marginRight:'20px',width:'40px',alignSelf:'self-start'}}>Upper</div>
                        
                    
                        <div style={{width:total,backgroundColor:'#dcdbdbff',height:height,borderStyle:'solid',borderRadius:'10px'}}>
                            <div style={{width:`${(completed['upper'].length/tutorial['upper'].length) *total}px`,backgroundColor:'#08D9D6','height':height,borderLeftStyle:'solid',borderTopLeftRadius:'10px',borderBottomLeftRadius:'10px'}}>
                                
                            </div>

                        </div>
                        <div style={{marginLeft:'10px'}}>{`${(completed['upper'].length/tutorial['upper'].length *100).toFixed(2)} %`}</div>
                </div>

                 <div style={{display:'flex',alignSelf:'center'}}>
                    
                        <div style={{marginRight:'20px',width:'40px',alignSelf:'self-start'}}>Sit</div>
                        
                    
                        <div style={{width:total,backgroundColor:'#dcdbdbff',height:height,borderStyle:'solid',borderRadius:'10px'}}>
                            <div style={{width:`${(completed['sit'].length/tutorial['sit'].length) *total}px`,backgroundColor:'#08D9D6','height':height,borderLeftStyle:'solid',borderTopLeftRadius:'10px',borderBottomLeftRadius:'10px'}}>
                                
                            </div>

                        </div>
                        <div style={{marginLeft:'10px'}}>{`${(completed['sit'].length/tutorial['sit'].length *100).toFixed(2)} %`}</div>
                </div>
        
        </div>
    </div>
  )
}
}


//create table students( sid int primary key auto_increment , name varchar(20),age int, gpa  float);
//create table courses (cid  varchar (20) primary key , name varchar (20), dept varchar (20) );
//create table enrolledin (sid int ,cid  varchar(20) ,grade float,primary key(sid,cid), foreign key (sid) references students (sid),foreign key (cid) references courses (cid));