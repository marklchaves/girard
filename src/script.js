"use strict";

class CharacterCounter {
  constructor() {}

  static getFacebookMax() {
    return 500; // For Mailchimp.
  }

  // This seems to be Zapier's max for LinkedIn.
  static getLinkedInMax() {
    return 1300;
  }

  static getTwitterMax() {
    return 280;
  }

  static cleanText(textEntered) {
    let cleanedText = textEntered.replace(" [LINKEDIN MAX] ", "");
    cleanedText = cleanedText.replace(" [FACEBOOK MAX] ", "");
    cleanedText = cleanedText.replace(" [TWITTER MAX] ", "");
    return cleanedText;
  }

  static countCharacters(e) {
    let textArea = document.getElementById("tweet");
    let textEntered = textArea.value;
    let cleanedText = CharacterCounter.cleanText(textEntered);

    // console.log('cleanedText = ' + cleanedText);

    // To do: Add support for previewer.
    //let previewer = document.getElementById("previewer");
    //previewer.innerHTML = textArea.value;
    
    switch (cleanedText.length) {
      case CharacterCounter.getFacebookMax():
        textArea.value += " [FACEBOOK MAX] ";
        break;
      case CharacterCounter.getLinkedInMax():
        textArea.value += " [LINKEDIN MAX] ";
        break;
      case CharacterCounter.getTwitterMax():
        textArea.value += " [TWITTER MAX] ";
        break;
    }

    // Default is the IG max for Mailchimp.
    let counter = 2200 - (cleanedText.length + 1);
    let countEntered = document.getElementById("charactersEntered");
    let countRemaining = document.getElementById("charactersRemaining");

    countEntered.textContent = (cleanedText.length + 1) + " chacters entered";
    countRemaining.textContent = counter + " characters remaining for IG";
  } // countCharacters()

  static spliceSlice(str, index, count, add) {
    // We cannot pass negative indexes directly to the
    // 2nd slicing operation.
    if (index < 0) {
      index = str.length + index;
      if (index < 0) {
        index = 0;
      }
    }
    return str.slice(0, index) + (add || "") + str.slice(index + count);
  } // spliceSlice()

  static handlePaste(e) {
    let textEntered = (event.clipboardData || window.clipboardData).getData(
      "text"
    );

    // To do: Need a switch here too, but
    // no breaks;
    let x = CharacterCounter.spliceSlice(
      textEntered,
      CharacterCounter.getTwitterMax(),
      0,
      " [TWITTER MAX] "
    );
    
    let offset1 = 0;
    
    if (/TWITTER MAX/.test(x)) {
      offset1 =  " [TWITTER MAX] ".length;
    }

    let y = CharacterCounter.spliceSlice(
      x,
      CharacterCounter.getFacebookMax() + offset1,
      0,
      " [FACEBOOK MAX] "
    );
    
    let offset2 = 0;
    
    if (/FACEBOOK MAX/.test(y)) {
      offset2 =  " [FACEBOOK MAX] ".length;
    }

    let z = CharacterCounter.spliceSlice(
      y,
      CharacterCounter.getLinkedInMax() + offset1 + offset2,
      0,
      " [LINKEDIN MAX] "
    );
    
    let offset3 = 0;
    
    if (/LINKEDIN MAX/.test(y)) {
      offset3 =  " [LINKEDIN MAX] ".length;
    }
    
    document.getElementById("tweet").value = z + '\n\n[ORIGINAL TEXT STARTS HERE]\n';
    // It would be nice to clear the clipboard here.

    let counter = 220000 - (z.length + offset1 + offset2 + offset3 + 6);
    let countEntered = document.getElementById("charactersEntered");
    let countRemaining = document.getElementById("charactersRemaining");
    countEntered.textContent = (z.length - (offset1 + offset2 + offset3 + 6)) + " characters entered";
    countRemaining.textContent = counter + " characters remaining for LinkedIn";

  } // handlePaste()
} // end class CharacterCounter

/* Run time */

(function () {
  let el;
  el = document.getElementById("tweet");
  el.addEventListener("keydown", CharacterCounter.countCharacters, false);
  el.addEventListener("paste", CharacterCounter.handlePaste, false);
})();