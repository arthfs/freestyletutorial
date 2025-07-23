'use client'
import React from 'react'
import { useRef } from 'react';
import { useState } from 'react';


var messagess : Array<{role:string, content:string}> =[ {
  'role':'gpt',
  'content': "I am good"
  },

  {'role':'user',
  'content': "I appreciate you",
  }
]
export default function assistant() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userInput,setinput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  //var userInput='how to do atw'
 // app/assistant/page.tsx
  const updateinput = (newinput:string)=>setinput(newinput)
async function getResponse() {
  try {

const response = await fetch('/api/coaching', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    messages: [
      ...messages,
      { role: "user", content: userInput }
    ]
  })
});

    if (!response.ok) {
      // Try to parse error message from API
      let errorMsg = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMsg = errorData.error;
        }
      } catch {}
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      setError(`Expected JSON, got: ${text.substring(0, 100)}`);
      throw new Error(`Expected JSON, got: ${text.substring(0, 100)}`);
    }

    const data = await response.json();
    setError(null); // Clear error on success
    return data.reply;

  } catch (error) {
    console.error('API call failed:', error);
    if (!error) setError("Sorry, I couldn't process that request. Please try again.");
    return "Sorry, I couldn't process that request. Please try again.";
  }
}
//console.log(messages)
  return (
    <div className='coachingcontent'>
      <div> 
          <button onClick={getResponse}> assistant </button>
          {error && (
            <div style={{ color: 'red', marginTop: '1em' }}>Error: {error}</div>
          )}
      </div>


<div className='convo'>
  <div>
  {messagess.map((data,index) => {
    return (
      <div key={index} >  
        <div style={{textAlign: data.role.localeCompare('user')? 'right' : 'left'}}>{data.content}</div> 
      </div>
    );
  })}
  </div>

  <div className='bottom'> 
    <input placeholder='enter your message'></input>
    <div className='sendbutton' style={{width:'50px'}}> <button>send</button> </div>
  </div>


</div>
    </div>
  )
}
