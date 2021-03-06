import lcc from './utils/lcc'

export default class Element {
  /**
   * This class makes a connection between an actual element
   * of the editor's value and the rendered element by MathJax.
   * 
   * @param {HTMLElement}  $el
   * @param {HTMLElement}  $rendered
   * 
   * @constructor
   */
  constructor($el, $rendered) {
    /** @type {HTMLElement} */
    this.$el = $el
    /** @type {HTMLElement} */
    this.$rendered = $rendered
    /** @type {Line} */
    this.line = null
    /** @type {Rendered} */
    this.rendered = null

    if ($rendered) {
      const bounding = $rendered.getBoundingClientRect()
      /** @type {Number} */
      this.width = bounding.width
      /** @type {Number} */
      this.height = bounding.height
      /** @type {Number} */
      this.x1 = bounding.left
      /** @type {Number} */
      this.x2 = bounding.right
      /** @type {Number} */
      this.y1 = bounding.top
      /** @type {Number} */
      this.y2 = bounding.bottom
      /** @type {Number} */
      this.cx = this.x1 + (this.width / 2)
      /** @type {Number} */
      this.cy = this.y1 + (this.height / 2)
      /** @type {Number} */
      this.top = $rendered.offsetTop
      /** @type {Number} */
      this.left = $rendered.offsetLeft
    }
  }

  /**
   * Get the element.
   * 
   * @return {HTMLElement}
   */
  getElement() {
    return this.$el
  }

  /**
   * Get the tag name of the element.
   * 
   * @return {String}
   */
  getTagName() {
    if (!this.$el) {return 'null'}
    return lcc(this.$el.tagName)
  }

  /**
   * Check the element's tag name.
   * 
   * @param {String} tag 
   * 
   * @return {Boolean}
   */
  isTagName(tag) {
    return this.getTagName() === tag
  }

  /**
   * Check if the element has children.
   * 
   * @return {Boolean}
   */
  hasChildren() {
    return !!this.$el.children.length
  }

  /**
   * Get the last child of the element.
   * 
   * @return {Null|HTMLElement}
   */
  getLastChild() {
    return this.$el.children[this.$el.children.length - 1]
  }

  /**
   * Determines the position of the caret on the display based
   * on the position of this rendered element on the display.
   * 
   * @return {Object}
   */
  getCaretPosition() {
    if (!this.$el) {
      return {
        top: this.line.top,
        left: this.line.left,
        height: this.line.height,
        $parent: this.line.$rendered.parentNode
      }
    }
    
    let height = this.line.height

    if (this.isTagName('mrow')) {
      const styles = window.getComputedStyle(this.$rendered)
      const paddingLeft = parseFloat(styles.paddingLeft)
      return {
        top: 0,
        left: paddingLeft,
        height: this.height,
        $parent: this.$rendered
      }
    }
    if (lcc(this.$el.parentNode.tagName, 'mrow')) {
      const parent = this.rendered.findElement(this.$el.parentNode)
      height = parent.$rendered.clientHeight
    }
    return {
      top: 0,
      left: this.left + this.width,
      height,
      $parent: this.$rendered.parentNode
    }
  }
}