import {React, Fragment, useState} from 'react';

const EditCard = ({ cardList, setCardList, card }) => {
    const [cardName, setCardName] = useState('');

    const renameCard = async() => {
        try {
            const body= {cardName};
            const jsonHead = new Headers();
            jsonHead.append('Content-type', 'application/json');
            jsonHead.append('token', localStorage.token);

            await fetch(`http://localhost:5000/todos/card/${card.card_id}`, {
                method: "PUT",
                headers: jsonHead,
                body: JSON.stringify(body)
            })

            //update card list
            const objIndex = cardList.findIndex(c => c.card_id === card.card_id && c.user_id === card.user_id);
            const newObj = {...cardList[objIndex], card_name: cardName}
            const updatedCards = [
                ...cardList.slice(0, objIndex),
                newObj,
                ...cardList.slice(objIndex + 1),
              ];
            
            setCardList(updatedCards);
            setCardName('');
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <Fragment>
            <button type="button" className="btn btn-primary" data-toggle="modal" data-target={`#id${card.card_id}`}>
            Rename
            </button>

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