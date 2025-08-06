'use client';
import React, { useEffect, useState } from 'react'
import { getcontext } from '../context';
import { doc, DocumentData, getDoc, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { firestore_reference } from '../firebase';

import { collection } from 'firebase/firestore';
type TutorialState = {
  lower: QueryDocumentSnapshot<DocumentData, DocumentData>[];
  sit: QueryDocumentSnapshot<DocumentData, DocumentData>[];
  upper: QueryDocumentSnapshot<DocumentData, DocumentData>[];
};



export default function Progress() {
 const  total=300, height = 20;
 const {user,loading} = getcontext();
 const [completed,setcompleted] = useState<TutorialState> ({'lower':[],'sit':[],'upper':[]})
 const [tutorial, settutorial] = useState<TutorialState>({
  lower: [],
  sit: [],
  upper: []
});

 useEffect(()=>{
    if (!loading)
    {   const reference = collection(firestore_reference, '/tutorials')
       
        const reference_user = doc(firestore_reference,`/users/${user.id}`)
        getDoc(reference_user).then((snapshot)=>{
            if (snapshot.exists())
            {
            const docs = snapshot.data().completed
            const lower = docs.filter((doc:string)=> doc.startsWith('lower'))
            const sit = docs.filter((doc:string )=> doc.startsWith('sit'))
            const upper = docs.filter((doc : string)=> doc.startsWith('upper'))
            
            setcompleted({'lower':lower,'upper':upper,'sit':sit})
            }
           
         
        })

        getDocs(reference).then((result)=>{
        
            const docs = result.docs
            const lower = docs.filter((doc)=> doc.id.startsWith('lower'))
            const sit = docs.filter((doc)=> doc.id.startsWith('sit'))
            const upper = docs.filter((doc)=> doc.id.startsWith('upper'))

            settutorial({'lower':lower,'upper':upper,'sit':sit})
           
        })
  
    }
 },[loading, user.id])
 if (loading) return <div>loading</div>
if (!loading)
{
    console.log(completed['sit'].length)
  return (
    <div>
        <div className='pagetitle'> My progress </div>
                <div style={{padding:'20px',display:'flex',flexDirection:'column',rowGap:'40px',minWidth:'458px'}}>
                <div style={{display:'flex',alignSelf:'center'}}>
                    
                        <div style={{marginRight:'20px',width:'40px',alignSelf:'self-start'}}>Lower</div>
                        
                    
                        <div style={{ width:total,backgroundColor:'#dcdbdbff',height:height,borderStyle:'solid',borderRadius:'10px'}}>
                            <div style={{width:`${(completed['lower'].length!=0? completed['lower'].length/tutorial['lower'].length :0) *total}px`,backgroundColor:'#08D9D6','height':height,borderLeftStyle:'solid',borderTopLeftRadius:'10px',borderBottomLeftRadius:'10px'}}>
                                
                            </div>

                        </div>
                        <div style={{marginLeft:'10px'}}>{`${(completed['lower'].length!=0? completed['lower'].length/tutorial['lower'].length *100:0).toFixed(2)} %`}</div>
                </div>

                 <div style={{display:'flex',alignSelf:'center'}}>
                    
                        <div style={{marginRight:'20px',width:'40px',alignSelf:'self-start'}}>Upper</div>
                        
                    
                        <div style={{width:total,backgroundColor:'#dcdbdbff',height:height,borderStyle:'solid',borderRadius:'10px'}}>
                            <div style={{width:`${(completed['upper'].length!=0? completed['upper'].length/tutorial['upper'].length :0) *total}px`,backgroundColor:'#08D9D6','height':height,borderLeftStyle:'solid',borderTopLeftRadius:'10px',borderBottomLeftRadius:'10px'}}>
                                
                            </div>

                        </div>
                        <div style={{marginLeft:'10px'}}>{`${(completed['upper'].length!=0? completed['upper'].length/tutorial['upper'].length *100: 0).toFixed(2)} %`}</div>
                </div>

                 <div style={{display:'flex',alignSelf:'center'}}>
                    
                        <div style={{marginRight:'20px',width:'40px',alignSelf:'self-start'}}>Sit</div>
                        
                    
                        <div style={{width:total,backgroundColor:'#dcdbdbff',height:height,borderStyle:'solid',borderRadius:'10px'}}>
                            <div style={{width:`${(completed['sit'].length!=0? completed['sit'].length/tutorial['sit'].length:0) *total}px`,backgroundColor:'#08D9D6','height':height,borderLeftStyle:'solid',borderTopLeftRadius:'10px',borderBottomLeftRadius:'10px'}}>
                                
                            </div>

                        </div>
                        <div style={{marginLeft:'10px'}}>{`${(completed['sit'].length!=0? completed['sit'].length/tutorial['sit'].length *100:0).toFixed(2)} %`}</div>
                </div>
        
        </div>
    </div>
  )
}
}


