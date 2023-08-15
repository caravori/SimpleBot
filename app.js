
const {Client, LocalAuth, Chat} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');


let disable = true;
let times = 3;
let frases = ['vendo ru', 'eu to vendendo ru', 'vendendo ru', 'alguem quer ru?', 'alguem quer ru', 'eu vendo ru','vendo ru de hoje', 'vendo ru de hj','vendo ru de amanha', 'vendo ru de amn', 'vendo ru de sexta','to vendendo ru de sexta','to vendendo ru de amn']

listen = (client) =>{
   
    client.on('qr', qr => {
        qrcode.generate(qr, {small:true}, qrcode=>{
            console.log('QrCode: ')
            console.log(qrcode);   
        });
    })
    
    
    client.on('ready',()=> {
        console.log('Client is ready\n');
    })
    
    
    
    client.on('message_create', async message =>{
        
        const chat = await message.getChat()
        if(message.body === 'Bot disable' && message.fromMe){
            disable = true;
            times = 0;
            if(chat.sendSeen()){
                chat.sendMessage('Disabled')
            }
        }
        if(message.body === 'Bot enable' && message.fromMe){
            disable = false;
            times = 3;
            if(chat.sendSeen()){
                chat.sendMessage('enabled')
            }
        }

        if(message.body.includes('Bot set times') && message.fromMe){
            let splited = message.body.split(" ");
            if(!isNaN(splited[3])){
                times = parseInt(splited[3]);
                disable = false;
            }
            if(chat.sendSeen()){
                chat.sendMessage('Times set to '+ times)
            }
        }

        if(frases.includes(message.body.toString().toLowerCase())&& !disable){
            console.log('olha o RU! '+message.body.toString().toLowerCase()+' <- AQUI no chat: ' + chat.name )
            if(chat.sendSeen()){
                chat.sendMessage('Compro')
                times = times-1;
            }
            if(times <=0){
                times = 0;
                disable = true;
            }
        }
        if(message.body === 'Bot Status' && message.fromMe){
            if(chat.sendSeen()){
                if (disable){
                    chat.sendMessage('disabled')
                }
                else{
                    chat.sendMessage('enabled, times remaining: ' + times )
                }
            }
        }
        
    })

}

App = () =>{
    let client = new Client({
        authStrategy : new LocalAuth()
    })
    listen(client);
    client.initialize();

}

App()