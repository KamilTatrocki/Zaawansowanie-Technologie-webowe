interface Props {
   image: string
   header: string
   body: string
}


function Card({image, header, body}: Props) {
    return (
      <div className="card">
        <img src={image} className="card-img-top" alt="Zdjęcie pracownika"/>
        <div className="card-body">
          <h5 className="card-title">{header}</h5>
          <p className="card-text">{body}</p>
        </div>
      </div>
    )
}

export default Card
