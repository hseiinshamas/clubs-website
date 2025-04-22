import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
  return (
    <div className='cards'>
      <h1>Explore our clubs</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem 
            src='images/img-10.jpg'
            text = 'Fashion Club'
            label='Fashion'
            path = '/clubs'
            />
            
            <CardItem 
            src='images/img-11.jpg'
            text = 'Music Club'
            label='Music'
            path = '/clubs'
            />
            
            <CardItem 
            src='images/img-13.jpg'
            text = 'Animal Rescue Club'
            label='Animal Rescue'
            path = '/clubs'
            />
            
            <CardItem 
            src='images/img-12.jpg'
            text = 'Theater Club'
            label='Theater'
            path = '/clubs'
            />

            <CardItem 
            src='images/img-14.jpg'
            text = 'Books Club'
            label='Books'
            path = '/clubs'
            />
            
            <CardItem 
            src='images/img-15.jpg'
            text = 'Dance Club'
            label='Dance' // hay lmfrud l label fo2 lsora lal club
            path = '/clubs'
            />
            
            <CardItem 
            src='images/img-16.jpg'
            text = 'Design Club'
            label='Design' // hay lmfrud l label fo2 lsora lal club
            path = '/clubs'
            />
            
            <CardItem 
            src='images/img-17.jpg'
            text = 'Arabic Club'
            label='Arabic' // hay lmfrud l label fo2 lsora lal club
            path = '/clubs'
            />
            
            <CardItem 
            src='images/img-18.jpg'
            text = 'Hospitality Club'
            label='Hospitality' // hay lmfrud l label fo2 lsora lal club
            path = '/clubs'
            />
            
            <CardItem 
            src='images/img-19.jpg'
            text = 'Pharmacy Club'
            label='Pharmacy' // hay lmfrud l label fo2 lsora lal club
            path = '/clubs'
            />
            
            <CardItem 
            src='images/img-20.jpg'
            text = 'Audio Visual Club'
            label='Audio Visual' // hay lmfrud l label fo2 lsora lal club
            path = '/clubs'
            />
            
            <CardItem 
            src='images/img-21.jpg'
            text = 'First Aid Club'
            label='First Aid' // hay lmfrud l label fo2 lsora lal club
            path = '/clubs'
            />
            
            <CardItem 
            src='images/img-22.jpg'
            text = 'Events Club'
            label='Events' // hay lmfrud l label fo2 lsora lal club
            path = '/clubs'
            />


          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;