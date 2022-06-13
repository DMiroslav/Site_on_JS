class Block {
     constructor(content, options){
          this.content = content
          this.options = options
     }
     toHTML() {
          throw new Error("метод має бути")
     }
}

class TitleBlock extends Block {
     constructor(content, options) {
          super(content, options)
     }
     toHTML() {
          const {tag = "h1", styles} = this.options
          return row(col(`<${tag}>${this.content}</${tag}>`), css(styles))   
     }
}

class ImageBlock extends Block {
     constructor(content, options) {
          super(content, options)
     }
     toHTML() {
          const {imageStyles: iS, alt = "", styles} = this.options
          return  row(`<img style="${css(iS)}" alt="${alt}" src="${this.content}"/>`, css(styles))
     }
}

class ColomnsBlock extends Block {
     constructor(content, options) {
          super(content, options)
     }
     toHTML() {
          const html = this.content.map(col).join('')
          return  row(html, css(this.options.styles))
     }
}

class MaintextBlock extends Block {
     constructor(content, options) {
          super(content, options)
     }
     toHTML() {
          return  row(col(`<p>${this.content}</p>`) , css(this.options.styles))
     }
}

class Site {
     constructor(selector){
          this.$el = document.querySelector(selector)
     }
     render(module){
          this.$el.innerHTML = ""
          module.forEach(modul => this.$el.insertAdjacentHTML('beforeend', modul.toHTML()))
     }
}

class Sidebar {
     constructor(selector, updateModule){
          this.$el = document.querySelector(selector)
          this.update = updateModule
          this.init()          
     }
     init(){
          this.$el.insertAdjacentHTML("afterbegin", this.template)
          this.$el.addEventListener("submit", this.add.bind(this))
     }
     get template() {
          return [
               sidebarpanel("text"),
               sidebarpanel("title")
          ].join("")
     }
     add (event){
          event.preventDefault()
          const type = event.target.name
          const value = event.target.value.value
          const styles = event.target.styles.value

          const newBlock = type === "text"
          ? new MaintextBlock (value, {styles})
          : new TitleBlock (value, {styles})

          this.update(newBlock)

          event.target.value.value = ""
          event.target.styles.value = ""
     }
}

class App {
     constructor(module){
          this.module = module
     }
     init () {
          const site = new Site("#site")
          site.render(this.module)
          
          const updateModule = newBlock => {
               this.module.push(newBlock)
               site.render(this.module)
            }
          
          new Sidebar("#panel", updateModule)
     }
}

const text = "JavaScript is a multi-paradigm language that supports event-driven, functional, object-oriented, and prototype-based programming styles. JavaScript was initially used only for the client-side but, in more recent times, it has also been used as a server-side programming language."

const module = [
     new TitleBlock("Site createed on JS", {
          tag: "h2",
     styles: {
              background: "linear-gradient(to right, #ff0099, #493240);",
              color: "#fff;",
              "text-align": "center;",
              padding: "1.5rem;"
     }

     }),
     new ImageBlock("js.jpg", {styles: {
          padding: "1rem 0;",
          display: "flex;",
          "justify-content": "center;"
     },
     imageStyles: {
          width: "500px;",
          height: "200px;"
     },
     alt: "this is image"

     }),

     new ColomnsBlock([
     "If it looks like a class and it walks like a class, it’s probably just a prototype function.",
     "Beauty is in eye of the sample documentation.",
     "Necessity is the mother of no JavaScript framework.",
     "You can’t fit a square peg in a round hole, said someone who doesn’t understand JavaScript type coercion."
     ],{
          styles: {
               background: "linear-gradient(to right, #8e2de2, #4a00e0);",
               color: "#fff;",
               "font-weight": "bold;",
               padding: "2rem;"
      }
     }),

     new MaintextBlock(text,{
          styles: {
               background: "linear-gradient(to left, #f2994a, #f2c94c);",
               "font-weight": "bold;",
               padding: "1rem;"
      }
     })
]

new App (module).init()

function row (value, styles=""){
     return `<div class="row" style="${styles}">${value}</div>`
}
function col (value){
     return `<div class="col-sm" z>${value}</div>`
}
function css (styles = {}) {
     if (typeof styles === "string") return styles
     const toString = key =>`${key}: ${styles[key]}`
     return Object.keys(styles).map(toString).join("")
}

function sidebarpanel(type){
 return `
 <form name="${type}">
 <h5>${type}</h5>
 <div class="form-group">
 <input class="form-control form-control-sm" name="value" placeholder="value">
 </div>
 <div class="form-group">
 <input class="form-control form-control-sm" name="styles" placeholder="styles">
 </div>
 <button type="submit" class="btn btn-primary btn-sm">Add</button>
 </form>
 <hr />
 `
}
