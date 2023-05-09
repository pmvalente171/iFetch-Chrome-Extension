/*global chrome*/
import './App.css'
import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, ScrollView, View } from 'react-native';

// Material UI imports
import { TextField, InputAdornment, IconButton,
  Divider, Box, Typography, Button } from '@mui/material';
import { Card, CardMedia, CardContent, CardActions } from '@mui/material';
import { Grid, Container} from '@mui/material';

import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';

const dummy_data = {
  is_user : false,
  provider_id : "iFetch",
  utterance : "Hi! Here are some recommendations for you!",
  image : null,
  recommendations : [
    {
      brand : "Balenciaga",
      description : "Calça jeans reta cintura baixa.\n Lavagem escura, cintura baixa, passantes para cinto, fechamento frontal por botão e zíper, cinco bolsos e corte reto. Material: algodão. Cor: Preto.",
      id : "1234",
      image_path : "https://cdn-images.farfetch-contents.com/17/33/46/07/17334607_37617774_1000.jpg",
      product_url : "https://cdn-images.farfetch-contents.com/17/33/46/07/17334607_37617774_1000.jpg"
    },{
      brand : "Balenciaga",
      description : "Calça jeans reta cintura baixa.\n Lavagem escura, cintura baixa, passantes para cinto, fechamento frontal por botão e zíper, cinco bolsos e corte reto. Material: algodão. Cor: Preto.",
      id : "1234",
      image_path : "https://cdn-images.farfetch-contents.com/17/33/46/07/17334607_37617774_1000.jpg",
      product_url : "https://cdn-images.farfetch-contents.com/17/33/46/07/17334607_37617774_1000.jpg"
    },{
      brand : "Balenciaga",
      description : "Calça jeans reta cintura baixa.\n Lavagem escura, cintura baixa, passantes para cinto, fechamento frontal por botão e zíper, cinco bolsos e corte reto. Material: algodão. Cor: Preto.",
      id : "1234",
      image_path : "https://cdn-images.farfetch-contents.com/17/33/46/07/17334607_37617774_1000.jpg",
      product_url : "https://cdn-images.farfetch-contents.com/17/33/46/07/17334607_37617774_1000.jpg"
    },{
      brand : "Balenciaga",
      description : "Calça jeans reta cintura baixa.\n Lavagem escura, cintura baixa, passantes para cinto, fechamento frontal por botão e zíper, cinco bolsos e corte reto. Material: algodão. Cor: Preto.",
      id : "1234",
      image_path : "https://cdn-images.farfetch-contents.com/17/33/46/07/17334607_37617774_1000.jpg",
      product_url : "https://cdn-images.farfetch-contents.com/17/33/46/07/17334607_37617774_1000.jpg"
    },{
      brand : "Balenciaga",
      description : "Calça jeans reta cintura baixa.\n Lavagem escura, cintura baixa, passantes para cinto, fechamento frontal por botão e zíper, cinco bolsos e corte reto. Material: algodão. Cor: Preto.",
      id : "1234",
      image_path : "https://cdn-images.farfetch-contents.com/17/33/46/07/17334607_37617774_1000.jpg",
      product_url : "https://cdn-images.farfetch-contents.com/17/33/46/07/17334607_37617774_1000.jpg"
    },{
      brand : "Balenciaga",
      description : "Calça jeans reta cintura baixa.\n Lavagem escura, cintura baixa, passantes para cinto, fechamento frontal por botão e zíper, cinco bolsos e corte reto. Material: algodão. Cor: Preto.",
      id : "1234",
      image_path : "https://cdn-images.farfetch-contents.com/17/33/46/07/17334607_37617774_1000.jpg",
      product_url : "https://cdn-images.farfetch-contents.com/17/33/46/07/17334607_37617774_1000.jpg"
    },
  ],
}

// const MESSAGES_ENDPOINT = "https://ifetch.novasearch.org/agent/"
const MESSAGES_ENDPOINT = "localhost:4000"

const styles = StyleSheet.create({
  container: {
    marginTop:"20px",
    flex: 1,
    height: "350px"
  }
});

function Recomenadation(props) {

  const recommendations = props.message.recommendations
  const [index, setIndex] = useState(0)

  const message = recommendations[index].message
  const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

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
        }}>{"<"}
        </button>
        <Grid 
          container justifyContent="space-evenly" 
          alignItems="center" >
          <Card 
              sx={{ width: 220 }}>
            <CardMedia
              sx={{ height: 220 }}
              image={recommendations[index].image_path}
            />
            <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {recommendations[index].brand}
            </Typography>
            </CardContent>
            <CardActions>
              <Button onClick={() => { // Add the option to show the uploaded image
                window.open(recommendations[index].product_url)
                }} size="small">Learn More</Button> 
            </CardActions>
          </Card>
        </Grid>
        <button className={index == recommendations.length - 1 ? "invisible-button" : "regular-arrows"} 
        onClick={() =>{
          click(1)
        }}>{">"}
        </button>
      </div>
    </div>
  )
}

// Method for showing an image in a message
function Image(props) {
  
  return (
    <Grid 
      container justifyContent="space-evenly" 
      alignItems="center" sx={{ marginBottom: 1, marginBottom: 2 }} >
      <Card >
        <CardMedia
          sx={{ height: 180, width: 180 }}
          image={props.image}
        />
      </Card>
    </Grid>
  )
}

// function for printing a message
function Message(props) {
  const ref = useRef()

  var message = props.message // has field for the 
                              // image uploaded by the user
  var is_user = props.message.is_user
  var recommendations = message.recommendations

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, []);

  return (
    <Box component="div" className={is_user ? 'message-user' : 'message-bot'} ref={ref}>
      <Typography variant="body1" className={is_user ? 'message-content-user' : 'message-content-bot'}>
        {message.utterance}
      </Typography>
      {message.image ? <Image image={message.image}/> : <></>}
      {recommendations.length != 0 ? <Recomenadation message = {message} is_user={is_user}/> : <></>}
      <Typography variant="caption" className={is_user ? 'message-timestamp-user' : 'message-timestamp-bot'}>
        {message.provider_id}
      </Typography>
    </Box>
  )
}

// Function responsible for printing all the messages
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
      <Message message={dummy_data}/>
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
      <TextField
        autoComplete='off'
        onChange={handleChange}
        value={message} label="Message" fullWidth
        placeholder="Type your message and hit ENTER"
        type="text"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <input
                accept='image/*'
                ref = {props.inputRef}  
                type = 'file' onChange={props.selectFileHandler}
                id = 'file-upload'
                style = {{ display: 'none' }}
              />
              <label htmlFor="file-upload">
                <IconButton variant="contained" color="primary" component="span">
                  { !props.isImageSelected ? <AddCircleOutlineSharpIcon/> : <CheckCircleSharpIcon/>}
                </IconButton>
              </label>
            </InputAdornment>
          ),
        }}/>
    </form>
  )
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

  const [userID] = useState(`${randomNumberInRange(0, 10000)}`)
  const [sessionID] = useState(`${randomNumberInRange(0, 10000)}`)

  const [selectedImage, setSelectedImage] = useState(null)
  const inputRef = useRef(null)

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

    const user_message = {
      is_user : true,
      provider_id : "user " + userID,
      utterance : message,
      image : selectedImage,
      recommendations : []
    }

    setMessages([...messages, user_message])
    SendMessage(message, userID, sessionID, "", "", recieveMessage, selectedImage)

    // Set references to null
    setSelectedImage(null)
    inputRef.current.value = null
  }

  // Added new field to message and assumed 
  //  the existance of a provider_id value
  const recieveMessage = (message, utterance, isUpToDate=false) => {
    // if (!message.has_response) return // safety code
    
    const agent_message = {
      is_user : false,
      provider_id : message.user_id == "iFetch" ? message.user_id : "user " + message.user_id,
      utterance : message.response,
      image : null,
      recommendations : message.recommendations == null ? [] : message.recommendations
    }

    if (isUpToDate) {
      setMessages([...messages, agent_message])
      return
    }

    // bug fix for a bug that happens when 
    //  the user sends a message
    const user_message = {
      is_user : true,
      provider_id : "user " + userID,
      utterance : utterance,
      image : selectedImage,
      recommendations : []
    }

    setMessages([...messages, user_message, agent_message])
  }

  useEffect(() => {
    const response = SendMessage("Hi!", userID, sessionID, "", "", recieveMessage, null, true)
    initialMessage()

  }, [])
  
  const selectFileHandler = event => {
    console.log(event.target.files[0])
    let reader = new FileReader()

    var file = event.target.files[0]
    reader.readAsDataURL(file)
    
    reader.onload = () => {
      setSelectedImage(reader.result)
    }
    reader.onerror = function (error) {
      console.log('Error: ', error);
    }
  }
  
  // TODO: Add icon of the selected image.

  return (
    <div className='chat-container'>
      <div className='title-container'>
        <h1 className='message-content-bot'>iFetch</h1>
      </div>
      <View style={styles.container}>
        <Messages messages={messages}/>
      </View>
      <Divider variant="middle" />
      <Box sx={{ m: 2 }}>
        <SendMessageForm handleSubmit = {handleSubmit}
          selectFileHandler = {selectFileHandler}
          isImageSelected = {selectedImage}
          inputRef = {inputRef}/>
      </Box>
    </div>
  );
}


export default App;
