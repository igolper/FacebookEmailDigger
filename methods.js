"use strict";


//adding listener to the page
document.addEventListener('DOMContentLoaded', function() {

  var emailRegex = null;

  //adding digBtn listener
  document.getElementById('digBtn').addEventListener("click", (e) => {

      console.log('click');
      // getting the current tab object
      var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});

      gettingActiveTab.then((tabs) => {

        //send initial message to content script
        var messageRes = browser.tabs.sendMessage(tabs[0].id, {cmd: "getData"});
        var messageData = null;
        messageRes.then(function (message){

          var i = 0;
          var reRes = null;
          var csvText = "Nome,Sobrenome,E-mail\n";
          var indexLastName = 0;

          messageData = message;

          var intervalVar = setInterval(function(){

            // if data isn't received due to "show more messages" link, add a Interval and keeping sending messages
            if(messageData.comments == "sendAgain_Again_Again" && messageData.actors == "sendAgain_Again_Again"){
              console.log('send message');
              messageRes = browser.tabs.sendMessage(tabs[0].id, {cmd: "getData"});

              messageRes.then(function (messageInt){

                    messageData = messageInt;

              }, false);

            }
            else{
              console.log('end interval');
              clearInterval(intervalVar);

              // generating csvText
              for(i = 0; i  < messageData.comments.length; i++){

                  emailRegex = emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
                  if(reRes = emailRegex.exec(messageData.comments[i])){

                    indexLastName = messageData.actors[i].indexOf(' ');
                    csvText += messageData.actors[i].substring(0, indexLastName) + "," + messageData.actors[i].substring(indexLastName + 1, messageData.actors[i].length) + "," + reRes[0] + '\n';

                  }

              }

              console.log(csvText);

              var d = new Date();

              //create an page object in memory
              var a = document.createElement('a');
              var file = new Blob([ csvText ], { type: 'text/plain' });

              a.href = URL.createObjectURL(file);

              // download CSV file
              var stateDownload = browser.downloads.download({

                url : a.href,
                filename : tabs[0].title + "_" + d.getDay().toString() + "_" + d.getHours().toString() + "-" + d.getMinutes().toString() + "-" + d.getSeconds().toString() + ".csv",
                conflictAction : 'uniquify'

              });

              // show on console download ID
              stateDownload.then(function (id){

                console.log(`Download ID: ${id}` );

              }, false);

            }

          }, 3000);

        }, false);

      });

  });

});
