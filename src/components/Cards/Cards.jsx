import React from 'react';
import Card from './Card';
import './Cards.css';


export default function Cards(props) { 
    return (
        <div className = 'containerr'>
            {props.cards.map(card => <Card judge={props.judge}clicked={props.clicked} text={card.card} user={card.user} />)}
        </div>
    )
}