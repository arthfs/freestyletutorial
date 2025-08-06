'use client'
import React, { useEffect, useState } from 'react'
import { firestore_reference,storage_reference  } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import  { getcontext } from '../context'
import Link from 'next/link'
import { ref } from 'firebase/storage'
import { getDownloadURL } from 'firebase/storage'
import Image from 'next/image'

export default function Page() {
const {user,loading} = getcontext()
const [reference, setReference] = useState<Record<string, string>>({});
const [bookmarks, setBookmarks] = useState<string[]>([]);

useEffect(() => {
  if (!loading && user?.id) {
    const fetchBookmarks = async () => {
      try {
        const userRef = doc(firestore_reference, `users/${user.id}`);
        const snapshot = await getDoc(userRef);
        
        if (!snapshot.exists()) return;

        const bookmarkedVideos = snapshot.data().bookmarked || [];
        setBookmarks(bookmarkedVideos);

        // Fetch all URLs in parallel
        const urlPromises = bookmarkedVideos.map(async (video: string) => {
          const [folder, filename] = video.split('/');
          const videoRef = ref(storage_reference, `tutorials/${folder}/${filename}.png`);
          try {
            return await getDownloadURL(videoRef);
          } catch (error) {
            console.error(`Failed to fetch image for ${video}`, error);
            return ''; // Return empty string as fallback
          }
        });

        const urls = await Promise.all(urlPromises);
        
        // Create the mapping object
        const videoUrlMap = bookmarkedVideos.reduce((acc:Record<string,string>, video:string, index:number) => {
          acc[video] = urls[index];
          return acc;
        }, {} as Record<string, string>);

        setReference(videoUrlMap);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      }
    };

    fetchBookmarks();
  }
}, [loading, user?.id]);

return (
  <div>
    <div className='pagetitle'>Bookmarked</div>
    <div className='bookmarkscontainer'>
      {bookmarks.map((video) => {
        const [ filename] = video.split('/');
        return (   <div key={video}>
                     <div style={{display:'flex',justifyContent:'center'}}>{filename.charAt(0).toLocaleUpperCase()+filename.substring(1)}</div>
           
          <div className='cell1' >
           
            <Link href={`tutorials/${video}`}> 
        {reference[video] && (
                <Image 
                  className='test2' 
                  unoptimized ={true}
                  quality={85}
                  src={reference[video]} 
                  width={50} 
                  height={50} 
                  alt={`Thumbnail for ${filename}`}
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </Link> 
          </div>
      </div>    
        );
      })}
      
    </div>
    
  </div>
);

 
}