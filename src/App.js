/*global chrome*/
import './App.css'
import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, ScrollView, View } from 'react-native';


// const MESSAGES_ENDPOINT = "https://ifetch.novasearch.org/agent/"
const MESSAGES_ENDPOINT = "localhost:4000"
// Idea have an aditional hash field contaioning the user id
// we already have user ID field, so it makes sense just printing
// Have the session id not be public

function Recomenadation(props) {
  const recommendations = props.message.recommendations

  const [img, setImg] = useState()
  const [index, setIndex] = useState(0)
  const message = recommendations[index].message

  const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

  const fetchImage = async (imageUrl) => {
    const res = await fetch(imageUrl)
    const imageBlob = await res.blob()
    const imageObjectURL = URL.createObjectURL(imageBlob)
    setImg(imageObjectURL)
    return imageObjectURL
  }

  var click = (dir) => {
    setIndex(clamp(index + (dir * 1), 0, recommendations.length - 1))
  }

  return (
    <div className='response'>
    <div className={props.is_user ? 'message-content-user' : 'message-content-bot'}>
        {message}
    </div>
    <div className='landscape-view'>
      <button className={index == 0 ? "invisible-button" : "regular-arrows"} onClick={() =>{
        click(-1)
      }}>{"<"}</button>
      <img src={recommendations[index].image_path} onClick={() => {
        window.open(recommendations[index].product_url)
      }}  style={{ alignSelf: 'center' }}  /> 
      <button className={index == recommendations.length - 1 ? "invisible-button" : "regular-arrows"} onClick={() =>{
        click(1)
      }}>{">"}</button>
    </div>
    </div>
  )
}

// function for printing a message
function Message(props) {
  const ref = useRef()

  var message = props.message
  var is_user = props.message.is_user
  var recommendations = message.recommendations

  console.log(message)

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
      {recommendations.length != 0 ? <Recomenadation message = {message} is_user={is_user}/> : <></>}
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
    if (message == "" || !message) 
      return;
    
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

function AudioRecorder(props) {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState(null);

  const getMicrophonePermission = async () => {
      if ("MediaRecorder" in window) {
          try {
              const streamData = await navigator.mediaDevices.getUserMedia({
                  audio: true,
                  video: false,
              });
              setPermission(true);
              setStream(streamData);
          } catch (err) {
              alert(err.message);
          }
      } else {
          alert("The MediaRecorder API is not supported in your browser.");
      }
    };

    return (
        <div>
            <h2>Audio Recorder</h2>
            <main>
                <div className="audio-controls">
                    {!permission ? (
                        <button onClick={getMicrophonePermission} type="button">
                            Get Microphone
                        </button>
                    ): null}
                    {permission ? (
                        <button type="button">
                            Record
                        </button>
                    ): null}
                </div>
            </main>
        </div>
    );
}

// Function responsible for sending 
//  a message to the backend
async function SendMessage (
  utterance, userId, sessionId,
  userAction, selectedId, 
  respondeCallback, image=null, isUpToDate=false) {

  const response = await fetch(MESSAGES_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({
      utterance : utterance, // The users utterance
      user_id : userId, // The users ID 
      session_id : sessionId, // The current session ID
      user_action : userAction, // The users action
      interface_selected_product_id : selectedId, // the ID of the opened product
      file : image, // the image uploaded by the user
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

// Function that gets a random value between 
//  min and max
function randomNumberInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function App() {
  const [messages, setMessages] = useState([])
  const [showContent, setShowContent] = useState(true)
  const [userID, setUserID] = useState(`${randomNumberInRange(0, 10000)}`)
  const [sessionID, setSessionID] = useState(`${randomNumberInRange(0, 10000)}`)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const setChatbox = () => {
    setShowContent(!showContent)
  }

  const initialMessage = () => {
    const message = {
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
                console.log(response)
            });
      });
      
  };

  const handleSubmit = (message) => {
    // if (!hasResponded) return // safety code

    const temp = {
      is_user : true,
      provider_id : "user " + userID,
      utterance : message,
      recommendations : []
    }

    setMessages([...messages, temp])
    SendMessage(message, userID, sessionID, "", "", recieveMessage, selectedImage)
    setSelectedImage(null)
    setSelectedFile(null)
  }

  // Added new field to message and assumed 
  //  the existance of a provider_id value
  const recieveMessage = (message, utterance, isUpToDate=false) => {
    // if (!message.has_response) return // safety code
    
    const temp1 = {
      is_user : false,
      provider_id : message.user_id == "iFetch" ? 
        message.user_id : "user " + message.user_id,
      utterance : message.response,
      recommendations : message.recommendations == null ? [] : message.recommendations
    }

    if (isUpToDate) {
      setMessages([...messages, temp1])
      return
    }

    const temp2 = {
      is_user : true,
      provider_id : "user " + userID,
      utterance : utterance,
      recommendations : []
    }

    setMessages([...messages, temp2, temp1])
  }

  useEffect(() => {
    const response = SendMessage("Hi!", userID, sessionID, "", "", recieveMessage, null, true)
    initialMessage()

  }, [])
  
  const selectFileHandler = event => {
    console.log(event.target.files[0])
    let reader = new FileReader()

    reader.readAsDataURL(event.target.files[0])
    setSelectedFile(event.target.files[0])
    
    reader.onload = () => {      
     setSelectedImage(reader.result)
    }
  }

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
        <input 
          className= 'image-input' 
          type='file' 
          id='file' 
          name="file"
          placeholder="Upload an Image" 
          required
          onChange={selectFileHandler} 
        />
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
