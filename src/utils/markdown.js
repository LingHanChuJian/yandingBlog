import hljs from 'highlight.js'
import ClipboardJS from 'clipboard'
import LineNumbers from '@/utils/lineNumbers'

class Markdown {
  static getInstance (e) {
    if (!this.instance) {
      this.instance = new Markdown()
    }
    this.instance.e = e
    this.instance.hljsCode()
    return this.instance
  }

  hljsCode () {
    let blocks = this.e.querySelectorAll('pre code')
    Array.prototype.forEach.call(blocks, hljs.highlightBlock)
    this.lineNumbers = new LineNumbers()
    this.lineNumbers.addStyles()
    this.lineNumbers.initLineNumbersOnLoad({ singleLine: true, el: this.e })
    this.e.addEventListener('copy', e => this.copySelection(e))
    this.codeListener()
  }

  copySelection (e) {
    let selection = window.getSelection()
    if (this.lineNumbers.isHljsLnCodeDescendant(selection.anchorNode)) {
      let selectionText
      if (window.navigator.userAgent.indexOf('Edge') !== -1) {
        selectionText = this.lineNumbers.edgeGetSelectedCodeLines(selection)
      } else {
        selectionText = selection.toString()
      }
      e.clipboardData.setData('text/plain', selectionText)
      e.preventDefault()
    }
  }

  codeListener () {
    let cy = this.e.querySelectorAll('.copy-code')
    for (let i = 0, len = cy.length; i < len; i++) {
      cy[i].removeEventListener('click', this.copyCode)
      cy[i].addEventListener('click', this.copyCode)
    }
  }

  copyCode (e) {
    for (let i = 0, len = e.path.length; i < len; i++) {
      if (e.path[i].className.indexOf('copy-code') > -1) {
        let tag = e.path[i].getAttribute('data-clipboard-target')
        console.log(tag)
        let code = document.querySelector(tag)
        console.log(code)
        this.clipboard = new ClipboardJS('.copy-code', { container: code })
        this.clipboard.on('error', e => {
          console.error(`Action: ${e.action}`)
          console.error(`Trigger: ${e.trigger}`)
        })
        break
      }
    }
  }
}

export default Markdown
