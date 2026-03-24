import SectionDivider from "./SectionDivider";
import Map from "./Map";

function ContactBody() {
  return (


    <div id="container" className="px-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">

        <SectionDivider text={"Napisz do nas maila!"}/>
        <section>
          <div className="d-flex justify-content-center">
            <form id="contact-form"> {/*action="mail.php" method="POST"*/}
            <div data-mdb-input-init className="form-outline mb-4">
                <input type="text" id="name" name="name" className="form-control border border-secondary" />
                <label className="form-label" htmlFor="name">Name</label>
            </div>

            <div data-mdb-input-init className="form-outline mb-4">
                <input type="email" id="email" name="email" className="form-control border border-secondary" />
                <label className="form-label" htmlFor="email">Email address</label>
            </div>

            <div data-mdb-input-init className="form-outline mb-4">
                <input type="text" id="subject" name="subject" className="form-control border border-secondary" />
                <label className="form-label" htmlFor="subject">Subject</label>
            </div>

            <div data-mdb-input-init className="form-outline mb-4">
              <textarea className="form-control border border-secondary" id="message" name="message" rows={4}></textarea>
                <label className="form-label" htmlFor="message">Message</label>
            </div>

            <button data-mdb-button-init id="submit-form" type="submit" data-mdb-ripple-init className="btn btn-primary btn-block mb-4">
                Send
            </button>
            </form>
          </div>
        </section>

        <SectionDivider text={"Lub znajdź nas tutaj"} />
          <section>
            <Map/>
          </section>
        </div>
       </div>
    </div>

  )
}

export default ContactBody
