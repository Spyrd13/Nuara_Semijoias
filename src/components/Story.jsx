import { useContent } from '../context/ContentContext'

function Story() {
  const { story } = useContent()

  return (
    <section className="story" id="historia">
      <div className="placeholder story-ph">✦</div>
      <div>
        <h2>{story.title}</h2>
        <p>{story.paragraph1}</p>
        <p>{story.paragraph2}</p>
        <a className="btn" href="#colecao">Conhecer mais</a>
      </div>
    </section>
  )
}

export default Story