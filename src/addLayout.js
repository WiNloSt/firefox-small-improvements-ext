console.log('run')

// Select the node that will be observed for mutations
var targetNode = document.querySelector('#spa-router-root > [data-reactroot] > div')

var config = { childList: true }

var callback = function(mutationsList) {
  for (var mutation of mutationsList) {
    if (mutation.type == 'childList') {
      console.log(document.querySelector('feedback-provide'))
      console.log(document.querySelectorAll('.ql-editor'))
    }
  }
}

var observer = new MutationObserver(callback)

observer.observe(targetNode, config)
console.log('done!!!')
