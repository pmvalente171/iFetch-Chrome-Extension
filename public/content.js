
// const MESSAGES_ENDPOINT = "https://ifetch.novasearch.org/agent/"
const MESSAGES_ENDPOINT = "localhost"

const SendMessage = async (
    utterance, userId, sessionId,
    userAction, selectedId, 
    respondeCallback, /*document, */isUpToDate=false) => {
  
    const response = await fetch(MESSAGES_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({
        utterance : utterance, // The users utterance
        user_id : userId, // The users ID 
        session_id: sessionId, // The current session ID
        user_action: userAction, // The users action
        interface_selected_product_id: selectedId, // the ID of the opened product
        // document: document // The HTML of the page
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


const messagesFromReactAppListener = (message, sender, response) => {
    console.log('[content.js]. Message received', {
        message,
        sender,
    })

    if (message.message === 'Hello from React') {
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

// Fired when a message is sent from either an extension process or a content script.
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
