import React, { Fragment } from 'react';
import EditCard from './EditCard';
import {ReactComponent as Delete} from '../imgs/x-mark.svg';
import {ReactComponent as View} from '../imgs/view.svg';

const CardList = ({ deleteCard, viewCard, allCards, setAllCards }) => {
    if(allCards.length > 0) {
        return (
            <Fragment>
                {allCards.map((card) => {
                    return <div className="card" id={card.card_id} key={card.card_id} >
                                <div className="card-title-wrap">
                                    <span className="title">{card.card_name}</span>
                                    <span className="task-num">{card.todos.length} Tasks</span>
                                </div>
                                <div className="button-wrap">
                                    <div className="edit-wrap">
                                        <EditCard allCards={allCards} setAllCards={setAllCards} card={card}/>
                                    </div>
                                    <div className="view-wrap" onClick={viewCard}>
                                        <View />
                                    </div>
                                    <div className="del-wrap" onClick={deleteCard}>
                                        <Delete  />
                                    </div>
                                </div>
                            </div>
                })}
            </Fragment>
        )
    } else {
        return (
            <div>No cards</div>
        )
    }
}

export default CardList;