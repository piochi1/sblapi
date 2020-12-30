const snekfetch = require('snekfetch');
const EventEmitter = require('events');
const express = require('express')
class Client {
  
  constructor(token) {
   this.token = token;   
  }

  async postServers(serverCount){
 
  const servers = await snekfetch.post(`https://shadow-bot.fr/api/public/bot/stats`)
    .set('Authorization', this.token)
    .send({ server_count: serverCount, 
    })
    .then(() => console.log(`[SBL API] l'action postServers à était un succès`))
    .catch((e) => console.error(e));

    return servers;
  
}} 

class Webhook extends EventEmitter {
  
  constructor(port,auth,path) {
    super()
    this.server = express()
    this.port = port;
    this.auth = auth;
    if (path) this.path = path;

    this.handle = function (req, res) {
      if (!req.get('Authorization'))
      return res.sendStatus(401);
      if (req.get('Authorization') !== this.auth)
      return res.sendStatus(403);
      req.body = req.body;
      this.emit(req.body.event, req.body.botId, req.body.userId);
      res.sendStatus(200);
    }


  }

  start() {
    this.server.use(express.json());
    this.server.post(this.path, this.handle);

    this.server.listen(this.port);
    console.log('[SBL API] Webhook on')
}
}

   module.exports.Client = Client;
   module.exports.Webhook = Webhook;
  