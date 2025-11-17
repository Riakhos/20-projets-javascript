const customCursorParent = document.querySelector(".custom-cursor")
const cursorOuterCircle = document.querySelector(".custom-cursor__outer-circle")
const cursorInnerDot = document.querySelector(".custom-cursor__inner-dot")


let mouseX = 0, mouseY = 0
let outerCurrentX = 0, outerCurrentY = 0
let innerCurrentX = 0, innerCurrentY = 0

const outerCursorSpeed = 0.1
const innerDotCursorSpeed = 0.25

let isRafIdle = null

window.addEventListener("mousemove", handleWindowMousemove)

function handleWindowMousemove(e) {
  mouseX = e.clientX
  mouseY = e.clientY

  if (!isRafIdle) {
    animateCursor()
  }
}

function animateCursor() {
  // 100 - 0 * 0.1 = 10
  // 100 - 10 * 0.1 = 9
  // 100 - 19 * 0.1 = 8.1
  outerCurrentX += (mouseX - outerCurrentX) * outerCursorSpeed
  outerCurrentY += (mouseY - outerCurrentY) * outerCursorSpeed

  innerCurrentX += (mouseX - innerCurrentX) * innerDotCursorSpeed
  innerCurrentY += (mouseY - innerCurrentY) * innerDotCursorSpeed

  cursorOuterCircle.style.translate = `calc(${outerCurrentX}px - 50%) calc(${outerCurrentY}px - 50%)`
  cursorInnerDot.style.translate = `calc(${innerCurrentX}px - 50%) calc(${innerCurrentY}px - 50%)`

  if (Math.abs(outerCurrentX - mouseX) < 0.1 && Math.abs(outerCurrentY - mouseY) < 0.1) {
    cancelAnimationFrame(isRafIdle)
    isRafIdle = null
    return
  }

  isRafIdle = requestAnimationFrame(animateCursor)

  const hoveredElement = document.elementFromPoint(mouseX, mouseY)

  if (hoveredElement && hoveredElement.closest("a,button,input,textarea")) {
    cursorOuterCircle.style.opacity = "0"
    cursorInnerDot.style.opacity = "0"
  } else {
    cursorOuterCircle.style.opacity = "1"
    cursorInnerDot.style.opacity = "1"
  }
}



const title = document.querySelector(".showcase-header__title")
const subtitle = document.querySelector(".showcase-header__subtitle")


function typewriter({ element, text, delay = 100 }) {
  let index = 0

  const intervalId = setInterval(() => {
    if (index < text.length) {
      element.textContent += text[index]
      index++
    } else {
      clearInterval(intervalId)
    }
  }, delay)
}

typewriter({
  element: title,
  text: "Puissance, liberté.",
  delay: 100
})

title.textContent = ""


const slideInCars = document.querySelectorAll(".showcase-models__car-example")

const intersectionObserver = new IntersectionObserver(handleIntersect, {rootMargin: "-10%"})

slideInCars.forEach(el => intersectionObserver.observe(el))


function handleIntersect(entries){
  console.log(entries)
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add("js-active-car-li")
      intersectionObserver.unobserve(entry.target)
    }
  })
}