export function resizeImage(file, maxWidth = 800, qualidade = 0.8) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader()

    leitor.onload = (evento) => {
      const img = new Image()

      img.onload = () => {
        const escala = Math.min(1, maxWidth / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = img.width * escala
        canvas.height = img.height * escala

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        resolve(canvas.toDataURL('image/jpeg', qualidade))
      }

      img.onerror = reject
      img.src = evento.target.result
    }

    leitor.onerror = reject
    leitor.readAsDataURL(file)
  })
}