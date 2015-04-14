![](http://i.telegraph.co.uk/multimedia/archive/00999/Tea-Biscuits_999906c.jpg)

http://challengepost.com/software/tea-and-biscuits

##Inspiration

During this hackathon, tea and biscuits were our inspiration to keep going, thus we created an app in their honour. Tea: it might not cure cancer, but it'll get you on the bus.

##How it works

TEA is delightful Android app that guides the user through figuring out which Denver metro area bus or train they should get on, when it is coming, and updates that estimate in real-time based on data pulled from other people who have recently taken the same bus.

It's incredibly simple to use: you'll choose a bus route and a direction (pulled from up to date RTD listings), a preferred departure time, and a stop on that route where you'd like to be picked up. Then you land on a timer (which displays the estimated time until the bus gets to you), which increments and decrements based on the input of other users in transit who have recently taken the same route.

Additionally, we push updates to the Pebble, a smart watch, so that when the bus is late or when the bus is almost there, your Pebble will display an alert and vibrate.

##Challenges we ran into

RTD data is static, so we needed to implement functionality similar to Waze where user input is taken into account. We average RTD-supplied stop timings (which aren't necessarily accurate) with updates supplied by users who have just been on the same route when transportation arrival timings are calculated for a given user based on route, direction, and stop.

Additionally, prior to this past Friday, the Pebble had not yet been integrated with Cordova, so we made it possible to integrate a Cordova-compiled Android app with wearable tech. Mike wrote the Cordova plugin to make pushing alerts to the Pebble possible. (We are going for the Pebble prize.)

##Accomplishments we are proud of

Getting all of this somehow working in roughly 36 hours without any unnecessary spontaneous combustion. Including a piece of technology none of us had ever seen in person before!

##What we learned

We now know a lot more about Postgres, Angular, the Pebble, and DDoSing Heroku nodes in real time.

##What's next for Tea and Biscuits

We plan to improve on and open source the Pebble plugin to Cordova (and add it to Cordova's plugin list!) and maybe also put this thing in the app store once it's rather cleaned up.


