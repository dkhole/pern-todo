import {React, Fragment, useState} from 'react';
import {ReactComponent as Edit} from '../imgs/edit.svg';

const EditCard = ({ allCards, setAllCards, card }) => {
    const [cardName, setCardName] = useState('');

    const renameCard = async(e) => {
        e.stopPropagation();

        try {
            const body= {cardName};
            const jsonHead = new Headers();
            jsonHead.append('Content-type', 'application/json');
            jsonHead.append('token', localStorage.token);

            await fetch(`/todos/card/${card.card_id}`, {
                method: "PUT",
                headers: jsonHead,
                body: JSON.stringify(body)
            })

            //update card list
            const objIndex = allCards.findIndex(c => c.card_id === card.card_id && c.user_id === card.user_id);
            const newObj = {...allCards[objIndex], card_name: cardName}
            const updatedCards = [
                ...allCards.slice(0, objIndex),
                newObj,
                ...allCards.slice(objIndex + 1),
            ];
            
            setAllCards(updatedCards);
            setCardName('');
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <Fragment>
            <Edit type="button"  data-toggle="modal" data-target={`#id${card.card_id}`}/>

            <div className="modal fade" id={`id${card.card_id}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Rename Card</h5>
                </div>
                <div className="modal-body">
                    <input type="text" placeholder={card.card_name} value={cardName} onChange={e => setCardName(e.target.value)}></input>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" onClick={renameCard} data-dismiss="modal">Save changes</button>
                </div>
                </div>
            </div>
            </div>
        </Fragment>
    );
}

export default EditCard;