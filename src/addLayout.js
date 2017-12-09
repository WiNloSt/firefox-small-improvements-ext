console.log('run')

// Select the node that will be observed for mutations
var targetNode = document.querySelector('#spa-router-root > [data-reactroot] > div')

var config = { childList: true }

var callback = function(mutationsList) {
  for (var mutation of mutationsList) {
    if (mutation.type == 'childList') {
      debug()
    }
  }
}

var observer = new MutationObserver(callback)

observer.observe(targetNode, config)
console.log('done!!!')

function addTextarea() {
  const ratedQuestions = Array.from(
    document.querySelectorAll('.feedback-provide-sections-section')
  ).filter(el => el.querySelector('section-rated-question'))

  // questions 2 5 5
  const state = Array(12).fill()

  ratedQuestions.forEach((ratedQuestion, index) => {
    const handler = {
      set(obj, prop, value) {
        obj[prop] = value
        calculateSummary()
      }
    }
    const questionState = (state[index] = new Proxy({}, handler))
    const textArea = document.createElement('textarea')
    textArea.style.cssText = 'width:100%; height:6em;'

    setCommentOnKeyUp(textArea, questionState)
    setQuestion(questionState, ratedQuestion)
    setScoreOnSelection(questionState, ratedQuestion)
    ratedQuestion.appendChild(textArea)
  })

  function setCommentOnKeyUp(textArea, questionState) {
    textArea.onkeyup = e => {
      const comment = e.target.value
      questionState.comment = comment
    }
  }

  function setQuestion(questionState, ratedQuestion) {
    questionState.question = ratedQuestion.querySelector('.rich-text-view').innerText
  }

  function setScoreOnSelection(questionState, ratedQuestion) {
    Array.from(ratedQuestion.querySelectorAll('li')).forEach((li, index) => {
      li.onclick = () => {
        questionState.score = index + 1
      }
    })
    questionState.value
  }

  function calculateSummary() {
    const firstSection = state.slice(0, 2)
    const secondSection = state.slice(2, 7)
    const thirdSection = state.slice(7, 12)

    console.log(firstSection[0].score, firstSection[0].question, firstSection[0].comment)
    console.log(secondSection)
    console.log(thirdSection)
  }
}

function disableRichTextArea() {
  Array.from(document.querySelectorAll('.ui-rte-container'))
    .slice(0, -2)
    .forEach(richTextArea => {
      richTextArea.classList.add('disabledButton')
      richTextArea.style.cssText = 'pointer-events: none;'
      richTextArea.querySelector('.ql-editor').style.cssText = 'pointer-events: none;'
    })
}

function debug() {
  addTextarea()
  disableRichTextArea()
}

debug()

// console.log(document.querySelectorAll('.ql-editor'))

// data 2 5 5 0 0

const state = [[{ question: '', score: null, comment: '' }, { value: null, comment: '' }], [1], [1]]
