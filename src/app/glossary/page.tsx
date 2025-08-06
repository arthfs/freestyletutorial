import React from 'react'

export default function Glossary() {
  const ref: { [x: string]: string  }  = {'latw':'Lemmens around the world','hmatw':'homie mitch around the world','laatw':'lemmens abbas around the world','htatw':"homie touzani around the world",'atw':'around the world','tatw':'touzani around the world','lmatw':'lemmens mitch around the world',
    'mgmatw' :'magellan mitch around the world','alatw':'alternative lemmens arround the world','mgatw':'magellan around the world','htaatw':'homie touzani abbas around the world',
    'amatw':'alternative mitch around the world','ahmatw':'alternative homie mitch around the world','atatw':'alternative touzani around the world','htw':'hop the world',
    'rlebatw':'reverse lebioda around the world','matw':'mitch around the world','aatw':'abbas around the world','ahtatw':'alternative homie touzani around the world'
  }
  const tricks = ['latw','hmatw','htatw','tatw','lmatw','mgatw','alatw','htaatw','laatw','atw','amatw','ahmatw','ahtatw','atatw','htw','matw','rlebatw','aatw'].sort()

  return (
    <div>
      <div className='pagetitle'>   Glossary </div>
      <div className='tricks'>
        {
          tricks.map((trick: string)=>  
          <div key={trick} className='trick' >
            <div>{`${trick.charAt(0).toUpperCase()}${trick.slice(1)}`+'  :'}</div>  <div>{ `${ref[trick].charAt(0).toUpperCase()}${ref[trick].slice(1)} `}</div>
          </div>)
        }
      
      </div>
      
      </div>
  )
}
