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

  const state = Array(12)
    .fill()
    .map(() => ({}))

  ratedQuestions.forEach((reatedQuestion, index) => {
    const textArea = document.createElement('textarea')
    textArea.style.cssText = 'width:100%; height:6em;'
    textArea.onkeyup = e => {
      const comment = e.target.value
      state[index].comment = comment
    }
    reatedQuestion.appendChild(textArea)
  })
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
