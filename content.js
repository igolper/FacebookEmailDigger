
function getInnerText(request, sender, sendResponse) {
  var commentActors = commentBodys = null;
  var actors_ = [];
  var comments_ = [];
  var pagerLinker;

  var i;
  console.log("recv content request");

  if(request.cmd == "getData"){

    // check if there is "show more..." link
    // if yes, request message again
    // if not, get all comment actors and comments
    pagerLinker = document.getElementsByClassName('UFIPagerLink');
    if(pagerLinker.length > 0){

      pagerLinker[0].click();
      console.log(pagerLinker[0].innerText);
      sendResponse({actors: "sendAgain_Again_Again", comments: "sendAgain_Again_Again"});

    }
    else{

      commentActors = document.getElementsByClassName(' UFICommentActorName');
      commentBodys = document.getElementsByClassName('UFICommentBody');

      for(i = 0; i < commentActors.length; i++){
        actors_.push(commentActors[i].innerText);
        comments_.push(commentBodys[i].innerText);
      }

      sendResponse({actors: actors_, comments: comments_});

    }

  }

}

//add listener to receive messages and register callback
browser.runtime.onMessage.addListener(getInnerText);
