import React from 'react';
import Card from './Card';

const styles = {
    container: {
        width: '100vw',
        height: ' 50vh',
        display: 'flex',
        justifyContent: 'space-evenely',
        color: 'white'
    }
}

export default function Cards(props) { 
    return (
        <div style={styles.container}>
            {props.cards.map(card => <Card judge={props.judge}clicked={props.clicked} text={card.card} user={card.user} />)}
        </div>
    )
}