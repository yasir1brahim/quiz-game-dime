const questions = ["What color is the ocean?", "What color is a cloud?", "What color is the sun?"]
const answers = ["Blue", "White", "Yellow"]

// Meter JS

// Get all the Meters
const meters = document.querySelectorAll('svg[data-value] .meter');
meters.forEach(path => {
  // Get the length of the path
  let length = path.getTotalLength();
  let value = parseInt(path.parentNode.getAttribute('data-value'));
  let to = length * ((100 - value) / 100);
  path.getBoundingClientRect();
  path.style.strokeDashoffset = Math.max(0, to);
});


// Counter JS
const progressBarShape = document.getElementById('progressBarShape');
progressBarShape.removeAttribute('style');

function startTimer(durationInSeconds) {
  let seconds = durationInSeconds;
  setInterval(function () {
    if (seconds > 0 || progressBarResult < 0) {
      seconds--;
    }
    const remainingSeconds = seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const formattedTime = pad(minutes) + ':' + pad(seconds % 60);
    const progressBarValue = document.getElementById('progressBarShape').getAttribute("stroke-dashoffset");
    const progressBarValueCalc = 350 / countdownDuration;
    const progressBarResult = progressBarValueCalc;

    progressBarShape.setAttribute("stroke-dashoffset", (progressBarValue - progressBarResult));

    document.getElementById('timer-counter-text').innerText = formattedTime;
  }, 1000);
}

function pad(value) {
  return value < 10 ? '0' + value : value;
}

var questionNumber = 0
var quizeScore = 0
const CORRECT_POPUP = {text:"Correct!!", color:"green"};
const TRY_AGAIN_POPUP = {text:"Try Again!", color:"red"};

function updateAnswerFeedback(clickedElement, isCorrect) {
  const circle = clickedElement.querySelector("circle");
  const text = clickedElement.querySelector("text");
  if (isCorrect) {
    displayFeedback(CORRECT_POPUP)
    quizeScore += 3;
    document.getElementById('score').innerText = quizeScore.toString();
    circle.style.fill = "#2ba001a8"; // green
  } else {
    displayFeedback(TRY_AGAIN_POPUP)
    if (quizeScore != 0 ) {
      quizeScore -= 1;
      document.getElementById('score').innerText = quizeScore.toString();
    }
    circle.style.fill = "#db2623"; // red
  }

  circle.style.stroke = "#d1d1d1";
  setTimeout(() => {
    circle.style.fill = isCorrect ? "#ececec" : "#1585fe";
    circle.style.stroke = "#d1d1d1";
    if (isCorrect) {
      circle.style.pointerEvents =  'none';
      text.style.pointerEvents =  'none';
      questionNumber += 1;
      rendersQuestions(questionNumber);
    }
  }, 1500);
}

function selectAnswer(clickedElement) {
  var elementText = $(clickedElement).find('.circle-styling').text();
  var isCorrect = elementText == answers[questionNumber];
  updateAnswerFeedback(clickedElement, isCorrect);
}

function rendersQuestions(questNumber){

      document.querySelector("#questions-graph text").innerHTML = questions[questNumber]? questions[questNumber] : "Quiz End";
      for (let index = 0; index < answers.length; index++) {
      var element = $('.orbit-event')[index]
      element.style.display = "block";
      element.setAttribute('onclick', 'selectAnswer(this)');
      var elementText = $('.orbit-event text')[index]
      elementText.textContent = answers[index]
    }
    $('.orbit-event').css('pointer-events', 'unset');
    $('#questions-graph').css('pointer-events', 'none');
    
}

function displayFeedback(feedbackProp) {
  
  let feedback = $("#feedback-popup")[0]
  feedback.innerText = feedbackProp.text
  feedback.style.color = feedbackProp.color
  gsap.to("#feedback-popup", {
    duration: 2,
    y: -700,
    opacity: 1,
    ease: "power2.out",
    onComplete: resetFeedback
  });
}

function resetFeedback() {
  gsap.to("#feedback-popup", {
    duration: 0,
    y: 0,
    opacity: 0,
    onComplete: () => {
    }
  });
}

// Set the countdown duration in seconds (e.g., 1 hour = 3600 seconds)
const countdownDuration = 30;

// Start the countdown timer when the page loads
let startTimerBtn = document.getElementById('startTimer');
let questionOrbits = $('.orbits-animate circle');
startTimerBtn.addEventListener('click', function () {
  startTimer(countdownDuration);
  this.style.display = 'none';
  rendersQuestions(questionNumber);
});

// Animation JS
window.onresize = window.onload = function () { gsap.set('.m1_stage', { x: '55%', y: '45%', opacity: 1 }) }

gsap.timeline({ defaults: { duration: 45 } })
  .from('.main1', { duration: 1, autoAlpha: 0, ease: 'power1.inOut' }, 0)
  .fromTo('.m1_cGroup', { opacity: 0 }, { duration: 0.3, opacity: 1, stagger: -0.1 }, 0)
  .from('.m1_cGroup', { duration: 2.5, scale: -0.3, transformOrigin: '50% 50%', stagger: -0.05, ease: 'elastic' }, 0)
  .fromTo('.m1Bg', { opacity: 0 }, { duration: 1, opacity: 1, ease: 'power2.inOut' }, 0.2)

  .add('orbs', 1.2)
  .add(function () {
    $('.main1').on('mousemove', function (e) {
      gsap.to('.m1_cGroup', { duration: 1, x: function (i) { return (e.clientX / window.innerWidth) / (i + 1) * 150 }, y: function (i) { return i * -20 * (e.clientY / window.innerHeight) }, rotation: Math.random() * 0.1, overwrite: 'auto' });
      gsap.to('.c1_solid, .c1_line', { duration: 1, attr: { opacity: 1.1 - 0.75 * (e.clientY / window.innerHeight) } })
      gsap.to('.m1OrbBlank', { duration: 1, opacity: 0.2 + 0.55 * (e.clientY / window.innerHeight) })
    });

    // All Oribits Animate
    $('.orbits-animate').on('click', function (e) {
      if (gsap.getProperty('.m1_cGroup', 'scale') != 1) return; //prevent overlapping bouncy tweens
      for (var i = 0; i < $('.m1_cGroup').length; i++) {
        gsap.fromTo($('.m1_cGroup')[i], { transformOrigin: '50% 50%', scale: 1 }, { duration: 0.7 - i / 25, scale: 0.9, ease: 'back.in(10)', yoyo: true, repeat: 1 });
      }
    }
    );
  }, 'orbs+=0.5')

  .fromTo('.orb1', { xPercent: -120, yPercent: 50 }, {
    motionPath: {
      path: function () { return MotionPathPlugin.convertToPath('.c1_line1', false)[0] },
      start: 1.03,
      end: 1.22
    }, ease: 'none', yoyo: true, repeat: -1
  }, 'orbs')

  .fromTo('.orb2', { xPercent: -100, yPercent: -10 }, {
    motionPath: {
      path: function () { return MotionPathPlugin.convertToPath('.c1_line2', false)[0] },
      start: 0.98,
      end: 1.2
    }, ease: 'none', yoyo: true, repeat: -1
  }, 'orbs')

  .fromTo('.orb3', { xPercent: -50, yPercent: -15 }, {
    motionPath: {
      path: function () { return MotionPathPlugin.convertToPath('.c1_line3', false)[0] },
      start: 1.06,
      end: 1.31
    }, ease: 'none', yoyo: true, repeat: -1
  }, 'orbs')

  .fromTo('.orb3b', { xPercent: -100, yPercent: -25 }, {
    motionPath: {
      path: function () { return MotionPathPlugin.convertToPath('.c1_line3', false)[0] },
      start: 1.49,
      end: 1.65
    }, ease: 'none', yoyo: true, repeat: -1
  }, 'orbs')

  .fromTo('.orb3c', { xPercent: 10, yPercent: -105 }, {
    motionPath: {
      path: function () { return MotionPathPlugin.convertToPath('.c1_line3', false)[0] },
      start: 0.95,
      end: 1.2
    }, ease: 'none', yoyo: true, repeat: -1
  }, 'orbs')

  .fromTo('.orb4', { xPercent: -50, yPercent: -25 }, {
    motionPath: {
      path: function () { return MotionPathPlugin.convertToPath('.c1_line4', false)[0] },
      start: 1.14,
      end: 1.26
    }, ease: 'none', yoyo: true, repeat: -1
  }, 'orbs')

  .fromTo('.orb4b', { xPercent: -100, yPercent: -25 }, {
    motionPath: {
      path: function () { return MotionPathPlugin.convertToPath('.c1_line4', false)[0] },
      start: 1.41,
      end: 1.6
    }, ease: 'none', yoyo: true, repeat: -1
  }, 'orbs')

  .fromTo('.m1Orb', { scale: 0, transformOrigin: '50% 50%' }, { duration: 0.8, scale: 1.5, ease: 'back.out(3)', stagger: 0.15, overwrite: 'auto' }, 'orbs')
  .fromTo('.m1OrbBlank', { opacity: 0 }, { duration: 0.8, opacity: function (i) { return 0.2 + i / 7 }, stagger: 0.1, overwrite: 'auto' }, 'orbs')
  .fromTo('.m1OrbBlank', { x: function (i) { return 620 - i / 4 * 380 }, transformOrigin: function (i) { return -(620 - i / 4 * 380) + 'px 0px' }, rotation: function (i) { return [99, -10, 55, 110, 120][i] } }, { rotation: '+=75', yoyo: true, repeat: -1 }, 'orbs')

