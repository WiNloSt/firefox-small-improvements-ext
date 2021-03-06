try {
  console.log('run')

  // Select the node that will be observed for mutations
  var targetNode = document.querySelector('#spa-router-root > [data-reactroot] > div')

  var config = { childList: true }

  var callback = function(mutationsList) {
    for (var mutation of mutationsList) {
      if (mutation.type == 'childList') {
        startScript()
      }
    }
  }

  var observer = new MutationObserver(callback)

  observer.observe(targetNode, config)
  console.log('done!!!')

  // questions 2 5 5
  const state = Array(12).fill()

  function addTextArea() {
    const ratedQuestions = Array.from(
      document.querySelectorAll('.feedback-provide-sections-section')
    ).filter(el => el.querySelector('section-rated-question'))
    initState(ratedQuestions)
    initTextAreaState(ratedQuestions)
    initStateProxy()
    addTextAreaAndSetupHandlers(ratedQuestions)
  }

  function initState(ratedQuestions) {
    ratedQuestions.forEach((ratedQuestion, index) => {
      const checkedRadioButton = ratedQuestion.querySelector('li > input:checked')

      state[index] = { score: checkedRadioButton && +checkedRadioButton.value + 1 }
    })
  }

  function addTextAreaAndSetupHandlers(ratedQuestions) {
    ratedQuestions.forEach((ratedQuestion, index) => {
      const questionState = state[index]
      const textArea = document.createElement('textarea')
      textArea.value = state[index].comment || ''
      textArea.style.cssText = 'width:100%; height:6em;'

      setCommentOnKeyUp(textArea, questionState)
      setQuestion(questionState, ratedQuestion)
      setScoreOnSelection(questionState, ratedQuestion)
      ratedQuestion.appendChild(textArea)
    })
  }

  function initTextAreaState(ratedQuestions) {
    const comments = flatMap(getRichTextAreaList(), richTextArea =>
      Array.from(richTextArea.querySelectorAll('p'))
        .map(p => p.innerText)
        .filter(comment => comment.indexOf('→') > -1)
        .map(comment => /(.+):.*→ (.+)/.exec(comment).slice(1))
    )

    comments.forEach(comment => {
      ratedQuestions.some((ratedQuestion, index) => {
        const questionText = getQuestionText(ratedQuestion)
        const [questionTextFromRichTextArea, commentText] = comment
        if (questionTextFromRichTextArea === questionText) {
          state[index].comment = commentText
          return true
        }
      })
    })
  }

  function initStateProxy() {
    const handler = {
      set(obj, prop, value) {
        obj[prop] = value
        if (prop === 'comment' || prop === 'score') {
          calculateSummaryAll()
        }
      }
    }

    state.forEach((_, index) => {
      state[index] = new Proxy(state[index] || {}, handler)
    })
  }

  function flatMap(map, fun) {
    return map.map(fun).reduce((a, b) => a.concat(b), [])
  }

  function setCommentOnKeyUp(textArea, questionState) {
    textArea.onkeyup = e => {
      const comment = e.target.value
      questionState.comment = comment
    }
  }

  function setQuestion(questionState, ratedQuestion) {
    questionState.question = getQuestionText(ratedQuestion)
  }

  function getQuestionText(ratedQuestion) {
    return ratedQuestion.querySelector('.rich-text-view').innerText.replace(/\n/g, '')
  }

  function setScoreOnSelection(questionState, ratedQuestion) {
    Array.from(ratedQuestion.querySelectorAll('li')).forEach((li, index) => {
      li.onclick = () => {
        questionState.score = index + 1
      }
    })
    questionState.value
  }

  function calculateSummaryAll() {
    const firstSection = state.slice(0, 2)
    const secondSection = state.slice(2, 7)
    const thirdSection = state.slice(7, 12)
    const richTextAreas = getRichTextAreaList()
    clearRichTextArea()
    calculateSummarySection(firstSection, richTextAreas[0])
    calculateSummarySection(secondSection, richTextAreas[1])
    calculateSummarySection(thirdSection, richTextAreas[2])
  }

  function clearRichTextArea() {
    getRichTextAreaList()
      .map(textArea => textArea.querySelector('.ql-editor'))
      .forEach(editor => {
        while (editor.firstChild) {
          editor.removeChild(editor.firstChild)
        }
      })
  }

  function calculateSummarySection(partialState, richTextArea) {
    return calculateSummary(partialState).forEach(p =>
      richTextArea.querySelector('.ql-editor').appendChild(p)
    )
  }

  function calculateSummary(partialState) {
    return partialState
      .map(calculateAnswerText)
      .filter(hasValue)
      .map(wrapInParagraph)
  }

  function calculateAnswerText(partialState) {
    return partialState.score && partialState.comment
      ? `${partialState.question}: ${partialState.score} → ${partialState.comment}`
      : null
  }

  function hasValue(a) {
    return a
  }

  function wrapInParagraph(text) {
    const p = document.createElement('p')
    p.append(text)
    return p
  }

  function disableRichTextArea() {
    getRichTextAreaList().forEach(richTextArea => {
      richTextArea.classList.add('disabledButton')
      richTextArea.style.cssText = 'pointer-events: none;'
      richTextArea.querySelector('.ql-editor').style.cssText = 'pointer-events: none;'
    })
  }

  function getRichTextAreaList() {
    return Array.from(document.querySelectorAll('.ui-rte-container')).slice(0, -2)
  }

  function startScript() {
    addTextArea()
    disableRichTextArea()
  }
} catch (e) {
  console.error(e)
}
