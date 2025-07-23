'use client'
import React, { useEffect, useState } from 'react'
import { firestore_reference,storage_reference  } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import  { getcontext } from '../context'
import Link from 'next/link'
import { ref } from 'firebase/storage'
import { getDownloadURL } from 'firebase/storage'
import Image from 'next/image'

export default function page() {
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
        const videoUrlMap = bookmarkedVideos.reduce((acc, video, index) => {
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
        const [folder, filename] = video.split('/');
        return (
          <div className='cell1' key={video}> {/* Use full video as key for uniqueness */}
            <Link href={`tutorials/${video}`}> 
              <div style={{display:'flex',justifyContent:'center'}}>{filename}</div>
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
        );
      })}
    </div>
  </div>
);

  return (
    <div>
        <div className='pagetitle'>Bookmarked</div>
        <div className='bookmarkscontainer'>
        {
            bookmarks.map((video)=>{ return (
            <div className='cell1' key={video.split('/')[1]}>
               <Link href={`tutorials/${video}`}> 
                   <div> {video.split('/')[1]} </div>
                    <Image className='test2' src={reference[video]} width={50} height={50} alt='image'></Image>
               
               </Link> 
                
                </div>)  })
        }
        </div>
    </div>
  )
}
