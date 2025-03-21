export default (element: string, animation: string) =>
  new Promise((resolve, reject) => {
    const animationName = `animate__${animation}`
    const node = document.querySelector(element) as Element

    node.classList.add(`animate__animated`, animationName)

    node.addEventListener(
      'animationend',
      (event) => {
        event.stopPropagation()
        node.classList.remove(`animate__animated`, animationName)
        resolve('Animation ended')
      },
      { once: true },
    )
  })
