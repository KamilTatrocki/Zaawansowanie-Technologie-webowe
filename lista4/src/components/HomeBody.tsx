import SectionDivider from "./SectionDivider";
import Card from "./Card";
import Carousel from "./Carousel";
import Faq from "./Faq";

function HomeBody() {
  return (
    <div id="container" className="px-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
        <SectionDivider text={"Nazwa firmy - O nas"}/>
        <section>
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque massa odio, commodo quis pretium ac,
            ultricies ut risus. Nam tincidunt massa laoreet dolor mattis, ut finibus augue sollicitudin. Aliquam eget tellus at metus
            rutrum pharetra vitae a erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tellus lorem, tincidunt vel tellus et,
            pulvinar venenatis lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In hac habitasse platea dictumst.
            Integer pulvinar eget libero nec condimentum. Vivamus placerat aliquam turpis nec tincidunt. Vivamus tincidunt, sem eu imperdiet bibendum,
                magna ligula finibus neque, nec feugiat nisl nibh non enim.
            </p>
            <p>
            Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam eu urna sodales,
            venenatis ligula eget, fringilla velit. Sed posuere lacus eu erat interdum, sed blandit ante sollicitudin. Sed non magna vel nulla
            </p>
        </section>
        <SectionDivider text={"Poznaj nasz team"}/>
          <section>
            <Carousel>
                <Card image={"https://mdbcdn.b-cdn.net/img/new/standard/nature/184.webp"} header={"Test image 1"} body={"Description for test image 1"}></Card>
                <Card image={"https://mdbcdn.b-cdn.net/img/new/standard/nature/184.webp"} header={"Test image 2"} body={"Description for test image 2"}></Card>
                <Card image={"https://mdbcdn.b-cdn.net/img/new/standard/nature/184.webp"} header={"Test image 3"} body={"Description for test image 3"}></Card>
            </Carousel>
          </section>
          <SectionDivider text="FAQ"/>
            <section>
              <Faq/>
            </section>
        </div>

       </div>
    </div>
  )
}

export default HomeBody
