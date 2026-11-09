
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
    return (
        <div className="dashboard">

            <div className="dashboard-hero">
                <div className="hero-content">
                    <span className="hero-badge">
                        ✦ Website Intelligence Platform
                    </span>

                    <h1>
                        Understand your website.
                        <span> Improve your visibility.</span>
                    </h1>

                    <p>
                        Analyze your website's SEO, AEO and GEO
                        performance with intelligent insights
                        and AI-powered recommendations.
                    </p>

                    <Link to="/audit" className="audit-btn">
                        Start Website Audit
                        <span>→</span>
                    </Link>
                </div>

                <div className="hero-visual">
                    <div className="visual-circle circle-one"></div>
                    <div className="visual-circle circle-two"></div>

                    <div className="visual-card">
                        <div className="visual-card-header">
                            <span>Website Health</span>
                            <span className="health-dot"></span>
                        </div>

                        <div className="visual-score">SEO</div>
                        <div className="visual-score-number">92<span>/100</span></div>

                        <div className="visual-progress">
                            <div></div>
                        </div>

                        <div className="visual-footer">
                            <span>SEO</span>
                            <span>AEO</span>
                            <span>GEO</span>
                        </div>
                    </div>
                </div>
            </div>

            <section className="features-section">
                <div className="section-heading">
                    <span>OUR CAPABILITIES</span>
                    <h2>Everything your website needs</h2>
                    <p>
                        Three powerful analysis dimensions
                        to improve your online presence.
                    </p>
                </div>

                <div className="features-grid">

                    <div className="feature-card seo-card">
                        <div className="feature-icon">⌕</div>
                        <h3>SEO Analysis</h3>
                        <p>
                            Discover technical SEO issues,
                            metadata problems, broken links,
                            heading structure and optimization
                            opportunities.
                        </p>
                        <span className="feature-label">Search Engine Optimization</span>
                    </div>

                    <div className="feature-card aeo-card">
                        <div className="feature-icon">✧</div>
                        <h3>AEO Analysis</h3>
                        <p>
                            Improve your website's readiness
                            for answer engines with structured
                            content, FAQs and clear answers.
                        </p>
                        <span className="feature-label">Answer Engine Optimization</span>
                    </div>

                    <div className="feature-card geo-card">
                        <div className="feature-icon">◎</div>
                        <h3>GEO Analysis</h3>
                        <p>
                            Evaluate content structure,
                            semantic relevance and readiness
                            for generative AI search experiences.
                        </p>
                        <span className="feature-label">Generative Engine Optimization</span>
                    </div>

                </div>
            </section>

            <section className="dashboard-bottom">
                <div>
                    <span className="bottom-tag">READY TO GET STARTED?</span>
                    <h2>Your website's next improvement starts here.</h2>
                    <p>
                        Run an audit and discover actionable
                        improvements for your website.
                    </p>
                </div>

                <Link to="/audit" className="bottom-btn">
                    Analyze My Website →
                </Link>
            </section>

            <footer className="dashboard-footer">
                © {new Date().getFullYear()} SiteltyicsIQ.
                Website Intelligence Platform.
            </footer>

        </div>
    );
}

export default Dashboard;
