
function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary animate-on-load delay-100">
            <div className="container-fluid">
                <button
                data-mdb-collapse-init
                className="navbar-toggler"
                type="button"
                data-mdb-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
                >
                <i className="fas fa-bars"></i>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">

                <a className="navbar-brand mt-2 mt-lg-0" href="#">
                    <img
                    src="https://mdbcdn.b-cdn.net/img/logo/mdb-transaprent-noshadows.webp"
                    height="15"
                    alt="MDB Logo"
                    loading="lazy"
                    />
                </a>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                    <a className="nav-link" href="#">Home</a>
                    </li>
                  {/*
                    <li className="nav-item">
                    <a className="nav-link" href="#">FAQ</a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="#">Contact</a>
                    </li>
                    */}
                </ul>
                </div>
            </div>
        </nav>
    )

}

export default Navbar
