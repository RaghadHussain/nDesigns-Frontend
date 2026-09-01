import { Link } from "react-router";

function Footer() {
    return (
        <footer className='site-footer'>
            <div className='site-footer__inner'>
                <div className='site-footer__brand'>
                    <h2>ndesign</h2>
                    <p>
                        Premium abayas and jalabiyas, stitched with elegance for the
                        discerning modern woman.
                    </p>
                    <ul className='site-footer__social'>
                        <li>
                            <a href="https://www.instagram.com/n.designs.bh?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==">Instagram</a>
                        </li>
                    </ul>
                </div>

                <div className='site-footer__col'>
                    <h3>Customer Care</h3>
                    <ul>
                        <li>
                            <Link to="/size-guide">Size Guide</Link>
                        </li>
                        <li>
                            <Link to="/shipping-returns">Shipping & Returns</Link>
                        </li>
                        <li>
                            <Link to="/faqs">FAQs</Link>
                        </li>
                        <li>
                            <Link to="/contact">Contact Us</Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className='site-footer__bottom'>
                <p>© 2026 ndesign. All rights reserved. Built with elegance.</p>
                <p>
                    <Link to="/privacy">Privacy Policy</Link>
                    {" • "}
                    <Link to="/terms">Terms & Conditions</Link>
                </p>
            </div>
        </footer>
    );
}

export default Footer;
