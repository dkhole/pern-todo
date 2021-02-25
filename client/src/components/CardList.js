import React from 'react';
import EditCard from './EditCard';

const CardList = ({ setCardList, cardList, deleteCard, viewCard }) => {
    if(cardList.length > 0) {
        return (
            <div>
                {cardList.map((card) => {
                    return <li id={card.card_id} key={card.card_id}>{card.card_name}<button onClick={deleteCard}>Delete</button><button onClick={viewCard}>View</button><EditCard setCardList={setCardList} cardList={cardList} card={card}/></li>
                })}
            </div>
        )
    } else {
        return (
            <div>No cards</div>
        )
    }
}

export default CardList;