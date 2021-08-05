/*
 *  Author: tylers1st <https://github.com/tylers1st>
 *  Version: 0.1
 *
 *  Desc: This is a macro designed to automate a set of lines from a journal into a token as chat bubbles
 */


/*
 *  Looks for any controlled tokens on currently viewed scene. If there aren't controlled tokens,
 *  the program asks for the journal with the names of the tokens.
 *  If there are tokens controlled, it only asks for the journal with the lines.
 *
 */


// checking if there are any controlled tokens in the currently viewed scene
if (canvas.tokens.controlled.length < 1){
  let d = new Dialog({
    title: 'Auto Script Reader',
    content: `
      <form class="flexcol">
        <div class="form-group">
          <label for="tokenNameInput">Token Name</label>
          <input type="text" name="tokenNameInput" placeholder="Enter Token's Name">
        </div>
        <div class="form-group">
          <label for="journalInput">Journal Name</label>
          <input type="text" name="journalInput" placeholder="Enter Journal">
        </div>
      </form>
      `,
      buttons: {
        no: {
          icon: '<i class="fas fa-times"></i>',
          label: 'Cancel'
        },
        yes: {
          icon: '<i class="fas fa-check"></i>',
          label: 'Yes',
          callback: (html) => {
            let tokenInput = html.find(`[name="tokenNameInput"]`).val();
            let journalName = html.find('[name="journalInput"]').val();
            console.log(tokenInput, journalName);
            tokenInput = tokenInput.split(",");
            var spkr; //The object
            for (const tokenNameAtIndex of tokenInput){
              console.log(tokenNameAtIndex.name + " is current speaker in for loop");
              spkr = canvas.tokens.objects.children.find(e => e.name === tokenNameAtIndex); // Finds a token on the current screen with the same name as the dialog input

              let messageIndex = 0;
              let messageList = game.journal.getName(journalName).data.content.split(`<p>${spkr.name}:`);
              console.log(`attempted to load \n\`game.journal.getName(${journalName}).data.content.split(\`<p>${spkr.name}:\`)`);
              let messageArr = []; //This will be the actual list of messages to send
              let arrTemp; //temporary array delcaration

              for(let i = 0; i < messageList.length; i++){ // for each message in the original list, phase out text past the next </p>
                arrTemp = messageList[i].split(`</p>`);
                console.log(`Attempted to tokenize phrase \"${messageList[i]}\" \n|| -----AND GOT----- ||\n \"${arrTemp}\"`);
                messageArr[i] = i == 0 ? arrTemp[1] : arrTemp[0];
                if (i == 0) console.log(`added \"${arrTemp[1]}\" to message array`);
                else console.log(`added \"${arrTemp[0]}\" to message array`);
              }
              console.log(`||messageIndex|| = ${messageIndex}\n||messageArr|| = ${messageArr}`);

              tokenUpdaterFunction(spkr,messageArr,messageIndex+1);
              }
            }
          }
        },
    default: 'yes',
    close: () => {
      console.log('Example Dialog Closed');
    },
  }).render(true);
}
else if (canvas.tokens.controlled.length >= 1){
  let d = new Dialog({
    title: 'Auto Script Reader',
    content: `
      <form class="flexcol">
        <div class="form-group">
          <label for="journalInput">Journal Name</label>
          <input type="text" name="journalInput" placeholder="Enter Journal">
          </div>
      </form>
      `,
      buttons: {
        no: {
          icon: '<i class="fas fa-times"></i>',
          label: 'Cancel'
        },
        yes: {
          icon: '<i class="fas fa-check"></i>',
          label: 'Yes',
          callback: (html) => {
            let controlledTokens = canvas.tokens.controlled;
            let journalName = html.find('[name="journalInput"]').val();
            console.log(controlledTokens, journalName);
            var spkr;

            for (const tokenNameAtIndex of controlledTokens){
              console.log(tokenNameAtIndex.name + " is current speaker in for loop");
              spkr = tokenNameAtIndex; // Finds a token on the current screen with dialog input

              let messageIndex = 0;
              let messageList = game.journal.getName(journalName).data.content.split(`<p>${spkr.name}:`);
              console.log(`attempted to load \n\`game.journal.getName(${journalName}).data.content.split(\`<p>${spkr.name}:\`)`);
              let messageArr = []; //This will be the actual list of messages to send
              let arrTemp;

              for(let i = 0; i < messageList.length; i++){ //for each message in the original list, phase out text past the next </p>
                arrTemp = messageList[i].split(`</p>`);
                console.log(`Attempted to tokenize phrase \"${messageList[i]}\" \n|| and got ||\n \"${arrTemp}\"`);
                messageArr[i] = i == 0 ? arrTemp[1] : arrTemp[0];
                if (i == 0) console.log(`added \"${arrTemp[1]}\" to message array`);
                  else console.log(`added \"${arrTemp[0]}\" to message array`);
                }
                console.log(`||messageIndex|| = ${messageIndex}\n ||messageArr|| = ${messageArr}`);

                tokenUpdaterFunction(spkr,messageArr,messageIndex+1);
              }
          }
        }
      },
    default: 'yes',
    close: () => {
      console.log('Example Dialog Closed');
    },
  }).render(true);
}
/**
 * @param {Object} tokenObject The token you wish to use
 * @param {(string|string[])} messageArray The array of messages tokenObject is mean to speak
 * @param {number} messagIndexParam The messageArray index to start on
 *
 */
async function tokenUpdaterFunction(speaker, messageArray,messageIndexParam){
  let tokenUpdater = new Dialog({
    title: `${speaker.name}`,
    content: 'Do you want to continue to the next line?',
    buttons: {
      Next:{
        label: "<p>Next</p>",
        callback: () => {
          canvas.hud.bubbles.say(speaker, messageArray[messageIndexParam]);
          console.log(`speaker = ${speaker.name} || messageArray[messageIndexParam] = ${messageArray[messageIndexParam+1]}`);
          messageIndexParam++;
          if (messageIndexParam < messageArray.length){
            tokenUpdater.render(true);
          }
        }
      }
    },
    },
    {
      id: 'updater'
    }
  ).render(true);
}
