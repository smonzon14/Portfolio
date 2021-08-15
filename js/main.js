

function pointer() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

  var rAF;


  var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    particles = [],
    mouseX = 0,
    mouseY = 0,
    total = 15,
    followSpeed = 0.04,
    size = 20;
  var rect = canvas.getBoundingClientRect();
  window.addEventListener("mousemove", onMousemove);

  function onMousemove(e) {
    var m_posx = 0, m_posy = 0, e_posx = 0, e_posy = 0,
      obj = canvas;
    //get mouse position on document crossbrowser
    if (!e) { e = window.event; }
    if (e.pageX || e.pageY) {
      m_posx = e.pageX;
      m_posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      m_posx = e.clientX + document.body.scrollLeft
        + document.documentElement.scrollLeft;
      m_posy = e.clientY + document.body.scrollTop
        + document.documentElement.scrollTop;
    }
    //get parent element position in document
    if (obj.offsetParent) {
      do {
        e_posx += obj.offsetLeft;
        e_posy += obj.offsetTop;
      } while (obj = obj.offsetParent);
    }
    mouseY = (m_posy - e_posy);
    mouseX = (m_posx - e_posx);
    if (mouseY <= 10 || mouseY >= height || mouseX <= 10 || mouseX >= width - 10) {
      mouseX = 0;
      mouseY = 0;
    }

  }

  window.addEventListener('resize', function () {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  function init() {
    cancelAnimationFrame(rAF);

    particles = [];

    for (var i = 0; i < total; i += 1) {
      particles.push(new Particle(i));
    }

    draw();
  }

  function draw() {
    context.clearRect(0, 0, width, height);

    for (var i = 0; i < total; i += 1) {
      particles[i].update();
    }

    rAF = requestAnimationFrame(draw);
  }


  /**
   * Particle
   */
  var Particle, p;

  Particle = function (index) {
    this.initialize(index);
  };

  p = Particle.prototype;

  p.initialize = function (index) {
    this.x = width;
    this.y = height;
    this.id = index + 1;
    this.angleX = Math.PI * 2 * Math.random();
    this.angleY = Math.PI * 2 * Math.random();
    this.speedX = .02 * Math.random() + 0.005;
    this.speedY = .02 * Math.random() + 0.005;
    this.radius = 450;

    return this;
  };
  p.update = function () {
    var aim, dx, dy, scale, angle;

    if (this.id > 1) {
      aim = particles[this.id - 1 - 1];

      dx = aim.x - this.x;
      dy = aim.y - this.y;

      this.x += dx * followSpeed;
      this.y += dy * followSpeed;
    } else {
      if (mouseX === 0 && mouseY === 0) {
        dx = width / 2 + Math.cos(this.angleX) * this.radius - this.x;
        dy = height / 2 + Math.sin(this.angleY) * this.radius - this.y;

        this.x = (width / 2 + Math.cos(this.angleX) * this.radius + 10 * this.x) / 11;
        this.y = (height / 2 + Math.sin(this.angleY) * this.radius + 10 * this.y) / 11;

        this.angleX += this.speedX;
        this.angleY += this.speedY;

      } else {
        dx = mouseX - this.x;
        dy = mouseY - this.y;

        this.x += dx * followSpeed;
        this.y += dy * followSpeed;
      }
    }

    angle = Math.atan2(dy, dx);
    scale = Math.cos(Math.PI / 2 * (this.id / total)) + (this.y) / 1000;

    context.save();
    context.translate(this.x, this.y);
    context.rotate(angle);
    context.scale(scale, scale);
    context.beginPath();
    context.moveTo(-size / 2 * 1, -size / 2);
    context.lineTo(0, 0);
    context.lineTo(-size / 2 * 1, size / 2);
    context.lineTo(-size / 2 * 1.632, size / 2);
    context.lineTo(-size / 2 * 0.8, 0);
    context.lineTo(-size / 2 * 1.632, -size / 2);
    context.fillStyle = 'white';
    context.fill();
    context.beginPath();


    context.restore();
  };
  init();
}



let sectionHidden = [true, true, true, true, true, true];

function load() {
  let bar = $('.loading > .bar').first();
  let label = $('.loading > .label').first();
  let loading = $('#loadingContainer');

  let progress = 0;

  sphere();
  hideSections();
  pointer();
  function doneLoading() {
    loading.fadeOut(1000);
    typeGlitchTitle(['Web Developer', 'App Inventor', 'Entrepreneur'], "#g");
    window.addEventListener("scroll", onScroll);
    onScroll();
  }
  window.addEventListener('load', (event) => {
    progress = 99;
    setTimeout(doneLoading,100);
  });
  function isSectionVisible(el) {
    var rect = el.getBoundingClientRect(),
      vWidth = window.innerWidth || document.documentElement.clientWidth,
      vHeight = window.innerHeight || document.documentElement.clientHeight;

    if (rect.top < vHeight - 600 && rect.bottom > vHeight - 200) {
      return true;
    }
    return false;
  }
  function isElementVisible(el) {
    var rect = el.getBoundingClientRect(),
      vWidth = window.innerWidth || document.documentElement.clientWidth,
      vHeight = window.innerHeight || document.documentElement.clientHeight,
      efp = function (x, y) { return document.elementFromPoint(x, y) };

    // Return false if it's not in the viewport
    if (rect.right < 0 || rect.bottom < 0
      || rect.left > vWidth || rect.top > vHeight)
      return false;

    // Return true if any of its four corners are visible
    return (
      el.contains(efp(rect.left, rect.top))
      || el.contains(efp(rect.right, rect.top))
      || el.contains(efp(rect.right, rect.bottom))
      || el.contains(efp(rect.left, rect.bottom))
    );
  }
  function onScroll(e) {
    let scrollPosition = window.scrollY;
    for (let i = 2; i < 6; ++i) {

      if (sectionHidden[i] && isSectionVisible(document.querySelector('#section0' + i))) {
        sectionHidden[i] = false;
        console.log("showing section 0" + i);
        showSection(i);
      }

    }
    // if (isSectionVisible(document.querySelector('#section03'))) {
    //   startSphere();
    // } else {
    //   stopSphere();
    // }

  }
  function hideSections() {
    for (var i = 2; i < 6; ++i) {
      $("#section0" + i + " .text-section").hide();
      $("#section0" + i + " .display-section").hide();
    }
  }
  function showSection(i) {
    $("#section0" + i + " .text-section").fadeIn(1000);
    $("#section0" + i + " .display-section").fadeIn(4000);
    switch (i) {
      case 2:
        typeGlitchTitle(['Projects'], "#projects-subtitle", false);
        break;
      case 3:
        typeGlitchTitle(['About Me'], "#about-me-subtitle", false);
        break;
      case 4:
        typeGlitchTitle(['My Skills'], "#my-skills-subtitle", false);
        break;
      case 5:
        typeGlitchTitle(['Contact'], "#contact-subtitle", false);

        break;
      default:
        console.log("");
    }
  }
  function increment() {
    if (progress >= 100) {
      
      return;
    }
    progress += 1;
    bar.css("width", progress + "%");
    label.html("" + progress + "%");
    setTimeout(increment, 10);
  }
  increment();
}

load();


var rellax = new Rellax('.rellax');

function initGlitch(text, target) {
  target.text('');
  let obj = '<span aria-hidden="true">' + text + '</span>';
  for (let i = 0; i < 3; ++i) {
    target.append(obj);
  }
}

function typeGlitchTitle(li, id, glitch = true) {
  /* The text */
  var speed = 70; /* The speed/duration of the effect in milliseconds */
  function typeWriter(lines, identifier, typedText, i, j) {


    if (j < lines.length) {
      if (glitch) {

        initGlitch(typedText, $(identifier));
      } else {

        $(identifier).html(typedText);
      }
      if (i < lines[j].length) {
        typedText = typedText.slice(0, -1) + lines[j].charAt(i) + "_";

        i++;
        if (j === lines.length - 1 && i == lines[j].length) {
          typedText = typedText.slice(0, -1);
          typedText += "<span class='cursor'>_</span>";

        }

      } else {
        typedText = typedText.slice(0, -1) + "<br>_";
        j++;
        i = 0;
      }
      setTimeout(function () {
        typeWriter(lines, identifier, typedText, i, j);
      }, speed);
    } else {
      if (!cursorThread) {
        blinkCursor();
      }
    }

  }
  typeWriter(li, id, "", 0, 0);
};

let cursor = true;
let cursorThread = false;
function blinkCursor() {
  cursorThread = true;
  cursor = !cursor;
  Array.from(document.getElementsByClassName('cursor')).forEach(function (c) {
    c.style.visibility = cursor ? "visible" : "hidden";
  })
  // jQuery("cursor").fadeToggle();
  setTimeout(blinkCursor, 750);
}