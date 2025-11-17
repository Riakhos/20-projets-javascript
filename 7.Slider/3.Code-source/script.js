const slides = [...document.querySelectorAll(".slider__slide")]

const sliderData = {
  locked: false,
  direction: 0,
  slideOutIndex: 0,
  slideInIndex: 0
}

const directionButtons = [...document.querySelectorAll(".slider__direction-btn")]

directionButtons.forEach(btn => btn.addEventListener("click", handleSliderDirectionBtn))

function handleSliderDirectionBtn(e) {
  if (sliderData.locked) return
  sliderData.locked = true

  getDirection(e.target)

  slideManagement()
}

function getDirection(btn) {
  sliderData.direction = Number(btn.getAttribute("data-direction"))

  sliderData.slideOutIndex = slides.findIndex(slide => slide.classList.contains("js-active-slide"))

  if (sliderData.slideOutIndex + sliderData.direction > slides.length - 1) {
    sliderData.slideInIndex = 0
  }
  else if (sliderData.slideOutIndex + sliderData.direction < 0) {
    sliderData.slideInIndex = slides.length - 1
  }
  else {
    sliderData.slideInIndex = sliderData.slideOutIndex + sliderData.direction
  }
}


function slideManagement() {
  updateElementStyle({
    el: slides[sliderData.slideInIndex],
    props: {
      display: "flex",
      transform: `translateX(${sliderData.direction < 0 ? "100%" : "-100%"})`,
      opacity: 0
    }
  })

  slides[sliderData.slideOutIndex].addEventListener("transitionend", slideIn)

  updateElementStyle({
    el: slides[sliderData.slideOutIndex],
    props: {
      transition: "transform 0.4s cubic-bezier(0.74, -0.34, 1, 1.19), opacity 0.4s ease-out",
      transform: `translateX(${sliderData.direction < 0 ? "-100%" : "100%"})`,
      opacity: 0
    }
  })
}

function updateElementStyle(animationObject) {
  for (const prop in animationObject.props) {
    animationObject.el.style[prop] = animationObject.props[prop]
  }
}


function slideIn(e) {
  updateElementStyle({
    el: slides[sliderData.slideInIndex],
    props: {
      transition: "transform 0.4s ease-out, opacity 0.6s ease-out",
      transform: `translateX(0)`,
      opacity: 1
    }
  })

  slides[sliderData.slideInIndex].classList.add("js-active-slide")
  slides[sliderData.slideOutIndex].classList.remove("js-active-slide")

  // e.target.removeEventListener("transitionend", slideIn)

  // slides[sliderData.slideOutIndex].style.display = "none"

  slides[sliderData.slideInIndex].addEventListener("transitionend", unlockNewAnimation)

  function unlockNewAnimation(){
    sliderData.locked = false
    slides[sliderData.slideInIndex].removeEventListener("transitionend", unlockNewAnimation)
  }
}