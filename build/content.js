const MESSAGES_ENDPOINT = "https://ifetch.novasearch.org/agent/"
// const MESSAGES_ENDPOINT = "localhost"

// Uncomment 'document' field to access the full html
//  document of th store.
const SendMessage = async (
    utterance, userId, sessionId,
    userAction, selectedId, 
    respondeCallback, /*document, */isUpToDate=false) => {
  
    const response = await fetch(MESSAGES_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({
        utterance : utterance, // The users utterance
        user_id : userId, // The users ID 
        session_id : sessionId, // The current session ID
        user_action : userAction, // The users action
        interface_selected_product_id: selectedId, // the ID of the opened product
        image : null
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
        const productID = match.innerText.slice(13) // The id of the opened item

        // Get the id from the DOM 
        //  and select it in the backend
        SendMessage("", message.uID, message.sID, 
            "select", productID, (data, utterance, isUpToDate) => {
            }, false)
        
    }
}

// Fired when a message is sent from either an extension process or a content script.
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);


// Edit the DOM of the page in a way that lets you add the chat 
//  into the window. 
const cssContent = `
  position: fixed;
  bottom: 23px;
  right: 28px;
  width: 404px;
  height: 520px;
  z-index: 10;
  background: white;
`

const myIFrame = `
  <iframe src="${chrome.runtime.getURL('index.html')}" 
    style="
      width: inherit;
      height: inherit;
    ">
  </iframe>
`
let div = document.createElement('div')
div.style.cssText = cssContent
div.innerHTML = myIFrame
document.body.insertBefore(div, document.body.firstChild)
