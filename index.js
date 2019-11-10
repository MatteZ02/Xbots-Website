const express = require('express');
const path = require('path');
const launch_timestamp = Date.now();
const Discord = require('discord.js');
const client = new Discord.Client(); // Client = FutoX
const app = express();
const port = process.env.PORT || 5000;
const coredevs = []; 
const activity = [];
let avatars = {};
let colors = {};
require('dotenv/config');
app.use(express.json({ limit: '1mb', }));
if (!process.env.API_KEY) process.env.API_KEY = '12345';

client.login(process.env.FUTOXTOKEN);

client.on('ready', async () => {
  client.user.setStatus('idle');
  console.log('- Futox Ready -');
  await client.users.fetch('607266889537945605');

  const devs = client.guilds.get('583597555095437312' /* xbots support */).roles.get('632915758422163476' /* futox devs */ ).members;
  devs.forEach(guildMember => {
    coredevs.push({
      tag: guildMember.user.tag,
      id: guildMember.user.id,
      avatarURL: guildMember.user.displayAvatarURL({ format: 'png', size: 256, }),
    });
  });
  avatars = {
    futox: client.user.displayAvatarURL({ format: 'png', size: 1024, }),
    musix: client.users.get('607266889537945605').displayAvatarURL({ format: 'png', size: 1024, }),
  };
  colors = {
    futox: client.guilds.get('583597555095437312' /* xbots support */).roles.find(x => x.name === 'FutoX' && x.managed).hexColor,
    musix: client.guilds.get('583597555095437312' /* xbots support */).roles.find(x => x.name === 'Musix' && x.managed).hexColor,
  }
});

app.listen(port, () => console.log(`- Active on port ${port} -`));
app.get('/api', (rep, res) => { 
  if (coredevs.length === 0 || Object.keys(avatars).length === 0) {
    res.status(501).send('Error 501 (Not Implemented) Server lacks ability to fulfill the request, try again soon.');
  } else {
    res.json({
      coredevs,
      avatars,
      launch_timestamp,
      colors,
    });
  }
});
app.get('/api/activity', (req, res) => { 
  res.json({
    activity,
  });
});
app.use('/', express.static('public/home'));
app.use('/activity', express.static('public/activity'));
app.post('/activity', (req, res) => {
  console.log('request');
  if (!req.body.api_key || req.body.api_key !== process.env.API_KEY) return res.sendStatus(401);
  if (req.body) {
    res.sendStatus(200);
  } else {
    return res.sendStatus(400);
  }
  console.log(req.body);
  activity.push(req.body.type);
  if (activity.length > 50) activity.shift();
});