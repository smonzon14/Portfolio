function transpose(matrix) {
  return matrix[0].map((col, i) => matrix.map(row => row[i]));
}
window.makeGuess = function (state) {
  const guess = state.guess;
  const numGuess = state.numGuess;
  const date = new Date();
  const word = window.cheeses[(date.getFullYear() * date.getMonth() + date.getDay() + 1) % window.cheeses.length];
  const d = 5;

  if (guess.length == d && (window.cheeses.indexOf(guess) >= 0 || window.words.indexOf(guess) >= 0)) {
      let score = 0;
      let matches = Array(d).fill().map(() => Array(d).fill(0));
      for (let c = 0; c < d; c++) {
        if (guess[c] == word[c]) {
          matches[c][c] = 2;
          score++;
        }
      }
      for (let c = 0; c < d; c++) {
        for (let w = 0; w < d; w++) {
          if (!matches[c][w] && guess[c] == word[w] && !matches[c].some((x) => x != 0)
            && !transpose(matches)[w].some((x) => x != 0)) {
            matches[c][w] = 1;
            break;
          }
        }
      }
      let result = matches.map((r) => r.reduce((a, b) => Math.max(a, b)));
      let green = {};
      let yellow = {};
      let black = {};
      for (let r = 0; r < d; r++) {
        switch (result[r]) {
          case 0:
            if (black.hasOwnProperty(guess[r])) {
              black[guess[r]].push(r);
            } else {
              black[guess[r]] = [r];
            }
            break;
          case 1:
            if (yellow.hasOwnProperty(guess[r])) {
              yellow[guess[r]].push(r);
            } else {
              yellow[guess[r]] = [r];
            }
            if (black.hasOwnProperty(guess[r])) {
              delete black[guess[r]];
            }
            break;
          case 2:
            if (green.hasOwnProperty(guess[r])) {
              green[guess[r]].push(r);
            } else {
              green[guess[r]] = [r];
            }
            if (yellow.hasOwnProperty(guess[r])) {
              delete yellow[guess[r]];
            }
            if (black.hasOwnProperty(guess[r])) {
              delete black[guess[r]];
            }
            break;
        }
        
      }
      return {
        black: black, green: green, yellow: yellow,
        result: result, score: score, msg: "Guess Results", word: score == 5 || numGuess == 5 ? word : undefined
      };
    } else {
      return { err: "guess not a 5 letter word" };
    }
}

const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false
  },
  state: {
    gameOver: false,
    numGuess: 0,
    letter: 0,
    guess:"",
  },
  colors: {
    green: "#538D4E",
    black: "#3A3A3C",
    yellow: "#B59F3B",
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll(".use-keyboard-input").forEach(element => {
        element.addEventListener("click", () => {
            this.open(element.value, currentValue => {
                element.value = currentValue;
            });
        });
    });
    this.type = (key) => {
      if (this.state.letter > 4 || this.state.gameOver) {
        return;
      }
      const element = document.getElementsByClassName('grid-row')[this.state.numGuess];
      let tile = document.createElement("div");
      tile.className = "tile";
      tile.innerHTML = key.toUpperCase();
      element.children[this.state.letter].appendChild(tile);
      
      this.state.letter += 1;
      this._triggerEvent("oninput");
      this.state.guess = this.state.guess.concat(key);
    };
    this.delete = () => {
      if (this.state.letter == 0) {
        return;
      }
      const element = document.getElementsByClassName('grid-row')[this.state.numGuess];
      this.state.letter -= 1;
      
      element.children[this.state.letter].innerHTML = "";
      this.state.letter = Math.max(this.state.letter, 0);
      this._triggerEvent("oninput");
      
      this.state.guess = this.state.guess.substring(0,this.state.guess.length - 1);
    };
    this.enter = () => {
      if (this.state.gameOver) {
        return;
      }
      let data = makeGuess(this.state);
      if (data.err) {
        this.errorTiles();
        const dialog = document.getElementById("dialog");
        
        dialog.style.opacity = 1.0;
        setTimeout(() => {
          dialog.style.opacity = 0.0;
        }, 2000);
      } else {
        console.log(data);
        this.colorTiles(data);
        this.colorKeyboard(data.black, data.yellow, data.green);

        this.state.gameOver = data.score == 5 || this.state.numGuess == 5;
        if (this.state.gameOver) {
          const theword = document.getElementById("the-word");
          theword.innerHTML = data.word;
          const container = document.getElementById("stats-container");
          container.style.display = "flex";
          setTimeout(() => {
            
            container.style.opacity = 1.0;
          }, 600);
          function showTime(){
            var date = new Date();
            var h = date.getHours(); // 0 - 23
            var m = date.getMinutes(); // 0 - 59
            var s = date.getSeconds(); // 0 - 59
            
            // Turn the clock to count down
            h = 23-h;
            m = 59-m;
            s = 59-s;
            
            
            
            // if (Correction if h<0)
            // else if (1:1:1 -> 01:01:01)
            if(h < 0){
                h="xx"
                m="xx"
                s="xx"  
            }
            else if(h < 10){
            h = (h < 10) ? "0" + h : h;}
            m = (m < 10) ? "0" + m : m;
            s = (s < 10) ? "0" + s : s;
            
            
            
            var time = h + ":" + m + ":" + s;
            document.getElementById("countdown").innerText = time;
            document.getElementById("countdown").textContent = time;
            setTimeout(showTime, 1000);
          }
          showTime();
        } else {
          this.state.letter = 0;
          this.state.numGuess += 1;
          this.state.guess = "";
        }

      }
        
      
      
      
    }
    document.onkeydown = (e) => {
      let key = e.key;
      
      
      
      if (key === "Backspace") {
        this.delete();
      } else if (key === "Enter") { 
        this.enter();
      } else if(key.length == 1 && (key.toLowerCase() >= "a" && key.toLowerCase() <= "z")){
        this.type(key);
      }
      
      
    };
  },
  errorTiles() {
    const row = document.getElementsByClassName('grid-row')[this.state.numGuess];
    for (let r = 0; r < 5; r++){
      let color = "#700"
      
      row.children[r].style.borderColor = color;
    }
  },
  colorTiles(data) {
    let result = data.result;
    const row = document.getElementsByClassName('grid-row')[this.state.numGuess];
    let r = 0;
    let time = data.score == 5 ? 100 : 200;
    function step(k) {
      let color = k.colors.black;
      switch (result[r]) {
        case 1:
          color = k.colors.yellow;
          break;
        case 2:
          color = k.colors.green;
          break;
      }
      row.children[r].style.backgroundColor = color;
      row.children[r].style.borderColor = "#3A3A3C";
      r++;
      if (r >= 5) { return;}
      setTimeout(() => {
        step(k);
      }, time);
    }
    step(this);
    
    
  },
  colorKeyboard(black, yellow, green) {
    const keys = document.getElementsByClassName('keyboard__key');
    let kb = Object.keys(black);
    let ky = Object.keys(yellow);
    let kg = Object.keys(green);
    console.log(yellow)
    for (let b = 0; b < kb.length; b++){
      Array.from(keys).find(e => e.innerHTML === kb[b]).style.backgroundColor = this.colors.black;
    }
    for (let b = 0; b < ky.length; b++){
      Array.from(keys).find(e => e.innerHTML === ky[b]).style.backgroundColor = this.colors.yellow;
    }
    for (let b = 0; b < kg.length; b++){
      Array.from(keys).find(e => e.innerHTML === kg[b]).style.backgroundColor = this.colors.green;
    }
  },
  _createKeys() {
      const fragment = document.createDocumentFragment();
      const keyLayout = [
          
          "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
          "a", "s", "d", "f", "g", "h", "j", "k", "l",
          "enter","z", "x", "c", "v", "b", "n", "m","backspace",
      ];

      // Creates HTML for an icon
      const createIconHTML = (icon_name) => {
          return `<i class="material-icons">${icon_name}</i>`;
      };

      keyLayout.forEach(key => {
          const keyElement = document.createElement("button");
          const insertLineBreak = ["backspace", "p", "l", "?"].indexOf(key) !== -1;

          // Add attributes/classes
          keyElement.setAttribute("type", "button");
          keyElement.classList.add("keyboard__key");

          switch (key) {
              case "backspace":
                  keyElement.classList.add("keyboard__key--wide");
                  keyElement.innerHTML = createIconHTML("backspace");

                  keyElement.addEventListener("click", ()=>this.delete());

                  break;

              

              case "enter":
                  keyElement.classList.add("keyboard__key--wide");
                  keyElement.innerHTML = createIconHTML("keyboard_return");

                  keyElement.addEventListener("click", ()=>this.enter());

                  break;

              case "space":
                  keyElement.classList.add("keyboard__key--extra-wide");
                  keyElement.innerHTML = createIconHTML("space_bar");

                  keyElement.addEventListener("click", () => {
                      this.properties.value += " ";
                      this._triggerEvent("oninput");
                  });

                  break;

              case "done":
                  keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
                  keyElement.innerHTML = createIconHTML("check_circle");

                  keyElement.addEventListener("click", () => {
                      this.close();
                      this._triggerEvent("onclose");
                  });

                  break;

              default:
                  keyElement.textContent = key.toLowerCase();
                  keyElement.addEventListener("click", () => { this.type(key); });

                  break;
          }

          fragment.appendChild(keyElement);

          if (insertLineBreak) {
              fragment.appendChild(document.createElement("br"));
          }
      });

      return fragment;
  },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    }
};

window.addEventListener("DOMContentLoaded", async function () {
  await fetch("cheeses.txt").then((res) => {
    return res.text();
  }).then(text => {
    window.cheeses = text.split("\r\n");
  });
  await fetch("words.txt").then((res) => {
    return res.text();
  }).then(text => {
    window.words = text.split("\r\n");
  });
  document.getElementById("share-button").addEventListener("click", function () {
  if(navigator.share) {
    navigator.share({
      title: 'Curdle Cheese Game',
      text: 'Try to guess today\'s cheese on Curdle!',
      url: 'https://smonzon.dev/Curdle'
    });
  }
})
  Keyboard.init();
  Keyboard.open();
  
});

