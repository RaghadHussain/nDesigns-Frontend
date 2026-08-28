import { Link } from "react-router";

function Footer() {
    return (
        <footer>
            <div>
                <h2>ndesign</h2>
                <p>
                    Premium abayas and jalabiyas, stitched with elegance for the
                    discerning modern woman.
                </p>
                <ul>
                    <li>
                        <a href="https://www.instagram.com/n.designs.bh?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==">Instagram</a>
                    </li>
                </ul>
            </div>

            <div>
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

            <div>
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
