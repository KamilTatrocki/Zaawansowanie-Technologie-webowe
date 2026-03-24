interface Props {
   text: string
}

function SectionDivider({text}: Props) {
  return (
    <div className="scroll-animate scroll-fade-up">
      <div className="d-flex justify-content-center mt-3">
        <h1 className="fs-1 fw-bold">{text}</h1>
      </div>
      <hr className="hr"/>
    </div>
  )
}

export default SectionDivider
