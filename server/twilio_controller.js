function sendMessage(data, socket, AUTH, SID, number) {
    const client = require("twilio")(SID, AUTH);
    const { pin, username } = data;
    
    console.log(pin);
    console.log(username)

    client.messages.create({
      body: `${username} wants to play what do you meme in lobby ${pin}!`,
      from: "+12183668652",
      to: number
    }).then(message => { 
        socket.emit('message sent')
    })

}

module.exports = {
    sendMessage
}
    
    

