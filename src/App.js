/*global chrome*/
import './App.css'
import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, ScrollView, SafeAreaView, StatusBar, View, Text } from 'react-native';


const DUMMY_DATA = [
  {
    provider_id : "user",
    utterance : "Hi!"
  },
  {
    provider_id : "iFetch",
    utterance : "Hi! My name is iFetch, how can I help you?"
  }
]

// const MESSAGES_ENDPOINT = "https://ifetch.novasearch.org/agent/"
const MESSAGES_ENDPOINT = "localhost"



function Recomenadation(props) {
  const recommendations = props.message.recommendations
  const hasRecommendations = false

  const [img, setImg] = useState()
  const [index, setIndex] = useState(0)

  const clamp = (num, min, max) => Math.min(Math.max(num, min), max)
  const fetchImage = async (imageUrl) => {
    const res = await fetch(imageUrl)
    const imageBlob = await res.blob()
    const imageObjectURL = URL.createObjectURL(imageBlob)
    setImg(imageObjectURL)
    return imageObjectURL
  }

  var click = (dir) => {
    // console.log("çlkjnlsdfjkhgbklujdfgv")
    //  clamp(index + (dir * 1), 0, recommendations.length - 1)
    setIndex(clamp(index + (dir * 1), 0, recommendations.length - 1))
  }

  return (
    <div className='landscape-view'>
      <button className={index == 0 ? "invisible-button" : "regular-arrows"} onClick={() =>{
        click(-1)
      }}>{"<"}</button>
      <img src={(recommendations[index].image_path)} style={{ alignSelf: 'center' }} />
      <button className={index == recommendations.length - 1 ? "invisible-button" : "regular-arrows"} onClick={() =>{
        click(1)
      }}>{">"}</button>
    </div>
  )
}

// function for printing a message
function Message(props) {
  const ref = useRef()

  var message = props.message
  var is_user = props.message.provider_id != "iFetch"
  var recommendations = message.recommendations

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, []);

  return (
    <div className={is_user ? 'message-user' : 'message-bot'} ref={ref}>
      <div className={is_user ? 'message-content-user' : 'message-content-bot'}>
        {message.utterance}
      </div>
      {recommendations.length != 0 ? <Recomenadation message = {message}/> : <></>}
      <div className={is_user ? 'message-timestamp-user' : 'message-timestamp-bot'}>
        {message.provider_id}
      </div>
    </div>
  )
}

// Fnction responsible for printing all the messages
function Messages(props) {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1}}>
      {props.messages.map((message, i) => {
        return (
          <View key={message.provider_id + i}>
            <Message message={message}/>
          </View>
        )
      })}
    </ScrollView>
  )
}

// Function that sends a message form
function SendMessageForm (props) {
  const [message, setMessage] = useState("")
  
  var handleChange = (e) => {
    setMessage(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    props.handleSubmit(message)
    setMessage("")
  }

  return (
    <form
      onSubmit={handleSubmit}>
      <input
        className='text-form'
        onChange={handleChange}
        value={message}
        placeholder="Type your message and hit ENTER"
        type="text"/>
    </form>
  )
}

// Function responsible for sending 
//  a message to the backend
async function SendMessage (
  utterance, userId, sessionId,
  userAction, selectedId, 
  respondeCallback, isUpToDate=false) {

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

// Function that gets a random value between 
//  min and max
function randomNumberInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function App() {
  const [messages, setMessages] = useState([])
  const [userID, setUserID] = useState(`${randomNumberInRange(0, 10000)}`)
  const [sessionID, setSessionID] = useState(`${randomNumberInRange(0, 10000)}`)

  const sendTestMessage = () => {
    const message = {
        // from: Sender.React,
        message: "Hello from React",
        uID: userID,
        sID: sessionID
    }

    const queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
        const currentTabId = tabs[0].id;
        chrome.tabs.sendMessage(
            currentTabId,
            message,
            (response) => {
                // setResponseFromContent(response);
                console.log(response)
            });
      });
  };

  const handleSubmit = (message) => {
    // if (!hasResponded) return
    // console.log(settings)
    const temp = {
      provider_id : "user",
      utterance : message,
      recommendations : []
    }

    setMessages([...messages, temp])
    SendMessage(message, userID, sessionID, "", "", recieveMessage)
  }

  const recieveMessage = (message, utterance, isUpToDate=false) => {
    // if (!message.has_response) return
    
    const temp1 = {
      provider_id : "iFetch",
      utterance : message.response,
      recommendations : message.recommendations == null ? [] : message.recommendations
    }

    if (isUpToDate) {
      setMessages([...messages, temp1])
      return
    }

    const temp2 = {
      provider_id : "user",
      utterance : utterance,
      recommendations : []
    }

    setMessages([...messages, temp2, temp1])
    // console.log(messages)
  }

  useEffect(() => {
    const response = SendMessage("Hi!", userID, sessionID, "", "", recieveMessage, true)
    sendTestMessage()
  }, [])

  return (
    <div className='chat-container'>
      <div className='title-container'>
        <h1 className='message-content-bot'>iFetch</h1>
      </div>
      <View style={styles.container}>
        <Messages messages={messages}/>
      </View>
      <div className='form-container'>
        <SendMessageForm handleSubmit = {handleSubmit}/>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop:"20px",
    flex: 1,
    height: "350px"
  }
});

export default App;
