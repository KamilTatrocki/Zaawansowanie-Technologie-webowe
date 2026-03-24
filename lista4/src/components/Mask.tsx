import logo_image from '../assets/office.jpeg'

function Mask() {
    return (
      <div className="bg-image w-100" style={{height: `25vh`}}>
            <img
              src={logo_image}
                className="w-100"
                alt="Background office image"
            />
        <div className="mask" style={{ backgroundColor: `hsla(0, 0%, 0%, 0.6)` }}>
            <div className="d-flex justify-content-center align-items-center h-100">
                <figure className="text-center animate-on-load delay-200">
                <blockquote className="blockquote text-white">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                </blockquote>
                <figcaption className="blockquote-footer text-light">
                    Someone famous in <cite title="Source Title">Source Title</cite>
                </figcaption>
                </figure>
            </div>
        </div>
      </div>
    )
}

export default Mask
