"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { styled, alpha } from '@mui/material/styles';
import { Button } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import { doc, updateDoc, arrayRemove, arrayUnion, getDoc, collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { firestore_reference, storage_reference } from '../../firebase';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { getcontext } from "@/app/context";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { BorderAll } from "@mui/icons-material";
import Image from "next/image";
import { useSession } from "next-auth/react";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Comment {
  id: string;
  commenter: string;
  date: string;
  comment: string;
  editing: boolean;
}

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: 'rgb(55, 65, 81)',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
    ...theme.applyStyles('dark', {
      color: theme.palette.grey[300],
    }),
  },
}));

export default function Page({ params }: { params: Promise<{ dynamic?: string[] }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ dynamic?: string[] } | null>(null);
 
  useEffect(() => {
  
    params.then((resolved) => {
      setResolvedParams(resolved);
    });
  }, [params]);

  if (!resolvedParams) {
    return <div>Loading...</div>;
  }

  const segments = resolvedParams.dynamic?.join("/") || "No segments provided";

  if (!resolvedParams.dynamic || resolvedParams.dynamic.length > 2) {
    notFound();
  }

  const tutorialType = resolvedParams.dynamic[0];

  if (!["lower", "upper", "sit"].includes(tutorialType)) {
    notFound();
  }

  if (resolvedParams.dynamic.length === 1) {
    return (
      <div className="test">

        <TricksGrid tutorialType={tutorialType} />
      </div>
    );
  }

  if (resolvedParams.dynamic.length === 2) {
    const videoName = resolvedParams.dynamic[1];
    return (
      <div>

        <Tutorial_page tutorial={videoName} path={resolvedParams!.dynamic.join('/')} />
      </div>
    );
  }

  notFound();
}

function TricksGrid({ tutorialType }: { tutorialType: string }) {
  const [tricks, setTricks] = useState<{name: string; url: string}[]>([]);

  const getThumbnail = async (pathname: string) => {
    try {
      const reference = ref(storage_reference, pathname);
      return await getDownloadURL(reference);
    } catch (error) {
      console.error("Error getting thumbnail:", error);
      return ""; // Return empty string or a placeholder image URL
    }
  };

  useEffect(() => {
    const fetchTricks = async () => {
     // console.log(storage_reference)
    
      const reference = ref(storage_reference, `/tutorials/${tutorialType}`);
      const files = await listAll(reference);
      
      const tricksWithThumbnails = await Promise.all(
        files.items
          .filter(item => item.name.endsWith('.mp4'))
          .map(async (video) => {
          
            const thumbPath = `/tutorials/${tutorialType}/${video.name.split('.')[0]}.png`;
            const url = await getThumbnail(thumbPath).catch(() => "");
            return {
              name: video.name.split('.')[0],
              url: url
            };
          })
      );

      setTricks(tricksWithThumbnails);
    };

    fetchTricks();
  }, [tutorialType]);

return (
  <>
  <div style={{fontSize:'35px',display:'flex',justifyContent:'center'}}>{`${tutorialType.slice(0,1).toUpperCase()+tutorialType.slice(1)} Tutorials`}</div>
  <div className="grid">
    {tricks.map((video, index) => (
      <div key={index} className="cell">
      
        <Link href={`/tutorials/${tutorialType}/${video.name}`} passHref>
          <div style={{display:'flex',justifyContent:'center',fontSize:'20px'}}>{video.name}</div>
            {video.url && (
              <Image 
                src={video.url} 
                width={200}
                height={200}
                // This makes the image fill the container
                objectFit="cover"
                alt={`${video.name} thumbnail`}
                quality={80}  // Optimize image loading
              />
            )}
            
        
        </Link>
      </div>
    ))}
  </div>
  </>
);}
function Tutorial_page({ tutorial, path }: { tutorial: string, path: string }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLElement>, comment: Comment) => {
    setAnchorEl(event.currentTarget);
    setSelectedComment(comment);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const pathname = path;
  const tutorial_type = path.split('/')[0].slice(0, 1).toUpperCase() + path.split('/')[0].slice(1);
  const [comment, setComment] = useState('');
  const firestore_path = pathname.split('/').slice(0, 2).join('/') + '/' + pathname.split('/').slice(2).join('-');
  const [url, setUrl] = useState('');
  
  const [data, setData] = useState<{
    likes: number;
    comments: Comment[];
  }>({
    likes: 0,
    comments: [],
  });

  const { user,loading } = getcontext();
  const {status} = useSession()
  const [editing, setEditing] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  const updateEditing = (newValue: string) => { setEditing(newValue) };
  
  const getdata = async (pathname: string) => {
    const firestore_path = 'tutorials/' + pathname.split('/')[0] + '-' + tutorial;
    const document = doc(firestore_reference, `${firestore_path}`);
    const comments_reference = collection(firestore_reference, `${firestore_path}/comments`);
    const comments = (await getDocs(comments_reference)).docs
      .filter((doc) => doc.data().comment  !=null)
      .map((f) => ({ ...f.data(), id: f.id } as Comment));
    
    const data = (await getDoc(document)).data();
    return { 
      ...data, 
      comments: [...comments], 
      path: `gs://${process.env.NEXT_PUBLIC_STORAGE_BUCKET}/tutorials/${pathname}.mp4` 
    };
  };

  const updatelike = (field: string) => {
    const video_name = pathname;
    const ref_user = doc(firestore_reference, `/users/${user.id}`);

    const ref_video = doc(firestore_reference,`tutorials/${pathname.split('/').slice(0, 2).join('-')}` );
    
    if (field === 'like') {
      const liked = user.data().liked.includes(video_name);
      if (!liked) {
        updateDoc(ref_user, { 'liked': arrayUnion(video_name) });
        updateDoc(ref_video, { 'likes': data.likes + 1 });
      } else {
        updateDoc(ref_user, { 'liked': arrayRemove(video_name) });
        updateDoc(ref_video, { 'likes': data.likes>0? data.likes - 1:0 });
      }
    } else if (field === 'bookmark') {
      const bookmarked = user.data().bookmarked.includes(video_name);
      if (!bookmarked) {
        updateDoc(ref_user, { 'bookmarked': arrayUnion(video_name) });
      } else {
        updateDoc(ref_user, { 'bookmarked': arrayRemove(video_name) });
      }
    }

    else if (field === 'complete') {
      const completed = user.data().completed.includes(video_name);
      if (!completed) {
        updateDoc(ref_user, { 'completed': arrayUnion(video_name) });
      } else {
        updateDoc(ref_user, { 'completed': arrayRemove(video_name) });
      }
    }
    
      
  };

  useEffect(() => {
    setComments(data.comments);
  }, [data.comments]);

  useEffect(() => {
//    console.log(user.data().liked,pathname)
    getdata(pathname).then((value) => {
      
      setData(value);
      const reference = ref(storage_reference, value['path']);
      getDownloadURL(reference).then((videourl) => {
        setUrl(videourl);
      });
    });
  }, [comment, user.data().liked]);

  const handleEditComment = (comment: Comment) => {
    setEditing(comment.comment);
    setComments(comments.map(c => 
      c.id === comment.id ? { ...c, editing: true } : c
    ));
    handleClose();
  };

  const handleCancelEdit = (comment: Comment) => {
    setComments(comments.map(c => 
      c.id === comment.id ? { ...c, editing: false } : c
    ));
  };

  const handleUpdateComment = async (comment: Comment) => {
    try {
      const ref = doc(
        firestore_reference,
        `tutorials/${firestore_path.replaceAll('/', '-').slice(0, firestore_path.replaceAll('/', '-').length - 1)}/comments/${comment.id}`
      );
      
      await updateDoc(ref, { ...comment, 'comment': editing, 'editing': false });
      setComments(comments.map(c => 
        c.id === comment.id ? { ...c, comment: editing, editing: false } : c
      ));
    } catch (e) {
      console.error("Error updating comment:", e);
    }
  };

  const handleDeleteComment = async (comment: Comment) => {
    try {
      const comment_reference = doc(
        firestore_reference,
        `tutorials/${firestore_path.replaceAll('/', '-').slice(0, firestore_path.replaceAll('/', '-').length - 1)}/comments/${comment.id}`
      );
      
      await deleteDoc(comment_reference);
      const updatedData = await getdata(pathname);
      setData(updatedData);
      handleClose();
    } catch (e) {
      console.error("Error deleting comment:", e);
    }
  };
//console.log(comments)
if (loading || status.localeCompare('loading')==0) {
  return <div>Loading user...</div>;
}

// Handle no user
if (!user || !user.id) {
  return <div>Please sign in to view this content.</div>;
}
  return data.likes >= 0 ? (
    <div className='main'>
      <div className='title'> {tutorial_type} trick</div>
      <div className='content'>
        <div className='left'>
          <div className='lefttitle'> {tutorial}</div>
          {url && (
            <div className='video'>
              <video style={{ height: '400px', width:'100%', objectFit:'cover' }} controls src={url}></video>
            </div>
          )}
          <div className='buttons'  style={{ display: 'flex', flexDirection: 'row', width:'100%' }}>
            <div style={{display:'flex',flexDirection:'row' ,alignItems:'center'}}>
              {data.likes > 0 && <h1 style={{ fontSize: '20px', marginRight:'2px' }}> {data.likes} </h1>}
              <div onClick={() => { updatelike('like') }}>
                { 
                  user.data().liked.includes(pathname) ?
                  <FavoriteIcon style={{color:'red'}} fontSize='large' /> :
                  <FavoriteBorderIcon fontSize='large' />
                  
                }
              </div>
              
            </div>

            <div onClick={() => { updatelike('bookmark') }}>
              {
                
                user.data().bookmarked.includes(pathname) ?
                <BookmarkIcon fontSize='large' /> :
                <BookmarkBorderIcon fontSize='large' />
                
              }
            </div>

             <div  onClick={() => { updatelike('complete') }}>
              {
                
                user.data().completed.includes(pathname) ?
                <CheckCircleIcon style={{color:'green'}} fontSize='large' /> :
                < CheckCircleOutlineIcon fontSize='large' />
                
              }
            </div>

           {// <ShareIcon fontSize='large'></ShareIcon> 
           }
          </div>
        </div>
        {
/*
        <div className='right'>
          <div className="righttitle" style={{paddingBottom:'20px' }}>Advices</div>
          <ul style={{display: 'flex', flexDirection: 'column',alignItems: 'center'}}>
            <li className="advice"> Lift the ball as much as you can </li>
            <li className="advice"> Avoid making the first rev too low or too high</li>
          </ul>
        </div>
        */
        }
      </div>
        
      <div className='wrapper'>
        <div className='commentsection'>
          <div className='bottomtitle'>Comments</div>
          <div style={{ display: 'flex', flexDirection: 'column', rowGap: '20px' }}>
            {comments.map((c) => (
              <div key={c.id} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems:'self-start' }}>
                  <div> {`@${c.commenter}`} </div>
                </div>

                <div>
                 {!c.editing ? (
  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: "flex-start" }}>
      <div>{c.comment}</div>
      <div className='date'>{c.date}</div>
    </div>
    <Button
      id={`comment-menu-${c.id}`}
      aria-controls={open && selectedComment?.id === c.id ? `comment-menu-${c.id}` : undefined}
      aria-haspopup="true"
      aria-expanded={open && selectedComment?.id === c.id ? 'true' : undefined}
      variant="contained"
      disableElevation
      onClick={(event) => handleClick(event, c)}
    >
      <MoreVertIcon />
    </Button>
  </div>
) : (
  <div style={{
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    margin: '10px 0'
  }}>
    <textarea
      style={{
        resize: 'vertical',
        minHeight: '100px',
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        border: '2px solid #1976d2',
        borderRadius: '6px',
        marginBottom: '10px'
      }}
      value={editing}
      onChange={(event) => updateEditing(event.target.value)}
      autoFocus
    />
    <div style={{ display: 'flex', gap: '10px' }}>
      <Button 
        variant='outlined' 
        onClick={() => handleCancelEdit(c)}
        style={{ flex: 1 }}
      >
        Cancel
      </Button>
      <Button 
        variant='contained' 
        color='primary'
        onClick={() => handleUpdateComment(c)}
        style={{ flex: 1 }}
      >
        Update
      </Button>
    </div>
  </div>
)}

                  <StyledMenu
                    id={`comment-menu-${c.id}`}
                    MenuListProps={{
                      'aria-labelledby': `comment-menu-${c.id}`,
                    }}
                    anchorEl={anchorEl}
                    open={open && selectedComment?.id === c.id}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={() => handleEditComment(c)} disableRipple>
                      <EditIcon />
                      Edit
                    </MenuItem>
                    <MenuItem onClick={() => handleDeleteComment(c)}>
                      <DeleteIcon />
                      Delete
                    </MenuItem>
                  </StyledMenu>
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <textarea
    className="comment-input" // Better class naming
    placeholder="Enter your comment..."
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    style={{width:'80%',
   
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      resize: 'none', // Disables resizing
      minHeight: '40px',
      outline: 'none',
      transition: 'border 0.2s',
      fontFamily: 'inherit',
      fontSize: '14px',
      ':focus': { // If using CSS-in-JS (e.g., styled-components)
        border: '1px solid #007bff',
      },
    }}
  />
              <div>
                <Button variant='contained' onClick={async () => {
                  try {
                    const comments_reference = collection(
                      firestore_reference,
                      `tutorials/${firestore_path.replaceAll('/', '-').slice(0, firestore_path.replaceAll('/', '-').length - 1)}/comments`
                    );
                    var months = {'January':'01', 'February':'02', 'March':'03', 
                      'April':'04', 'May':'05', 'June':'06', 'July':'07', 'August':'08', 'September':'09', 'October':'10', 'November':'11', 'December':'12'};
                    var date = new Date().toString().split(' ').slice(0, -4)
                    date =`${months[date[1]]}/${date[2]}/${date[3]} ${date[4].split(':').slice(0,2).join(':')}`
                     
                    
                    await addDoc(comments_reference, {
                      'commenter': user.name,
                      'comment': comment,
                      'date': date,
                      
                      'editing': false
                    });
                    setComment('');
                    const updatedData = await getdata(pathname);
                    setData(updatedData);
                  } catch (e) {
                    console.error("Error adding comment:", e);
                  }
                }}>
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div> loading</div>
  );
}