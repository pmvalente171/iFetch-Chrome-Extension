// import React from 'react';
// import {useSettingsStore} from '../common/settings'


const MESSAGES_ENDPOINT = "https://ifetch.novasearch.org/agent/"

const SendMessage = async (
    utterance, userId, sessionId,
    userAction, selectedId, 
    respondeCallback, isUpToDate=false) => {
  
    const response = await fetch(MESSAGES_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({
        utterance : utterance,
        user_id : userId, // TODO: Randomize
        session_id: sessionId, // TODO: Randomize
        user_action: userAction,
        interface_selected_product_id: selectedId 
      }),
      headers: {
        "Content-type": "application/json"
      },
      }).then((response) => response.json())
      .then((data) => {
        console.log(data)
        respondeCallback(data, utterance, isUpToDate)
      })
      .catch((err) => {
        console.log(err.message)
      })

    return response
  }


// const [settings] = useSettingsStore();
// console.log(settings)

// const temp = document.getElementsByClassName('ltr-4y8w0i-Body e1s5vycj0')
// const productId = temp[19].innerText

// SendMessage("I want off-white sneakers", "12938", "fihgsidg", "", "", (data, utterance, isUpToDate) => {}, false)
// SendMessage("Unisex", "12938", "fihgsidg", "", "", (data, utterance, isUpToDate) => {}, false)
// SendMessage("Select the first one", "12938", "fihgsidg", "", "", (data, utterance, isUpToDate) => {}, false)


const messagesFromReactAppListener = (message, sender, response) => {
    console.log('[content.js]. Message received', {
        message,
        sender,
    })

    if (message.message === 'Hello from React') {
        // console.log("AAAAAAAAAAAAAAAAAAH!")
        // response('Hello from content.js')
        const text = 'FARFETCH ID: ';
        const elements = Array.from(document.querySelectorAll('p'));
        const match = elements.find(el => {
            return el.textContent.toLowerCase().includes(text.toLowerCase());
        });
        const productID = match.innerText.slice(13)

        // Get the id from the DOM 
        //  and select it in the backend
        SendMessage("", message.uID, message.sID, 
            "select", productID, (data, utterance, isUpToDate) => { // 18534514
            }, false)
        
    }
}

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
