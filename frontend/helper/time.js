export const delay = (timeOfMilisecond) => {
  return new Promise((resol) => {
    setTimeout(() => {
      resol(true)
    }, timeOfMilisecond)
  })
}

