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

  ratedQuestions.forEach(reatedQuestion => {
    const textArea = document.createElement('textarea')
    textArea.style.cssText = 'width:100%; height:6em;'
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
