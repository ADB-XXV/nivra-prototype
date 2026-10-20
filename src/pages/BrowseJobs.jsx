
import { useMemo, useState } from "react";

function BrowseJobs({
  jobs,
  onView,
  savedJobs,
  toggleSaved,
  activeTab
}) {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("soonest");
  const [category, setCategory] = useState("All");
  const [minimumPay, setMinimumPay] = useState("Any");
  const [jobType, setJobType] = useState("All");

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    if (activeTab === "Saved") {
      result = result.filter((job) => savedJobs.includes(job.id));
    }

    if (activeTab === "My applications") {
      // Application filtering can be connected to application data later.
      result = result.filter((job) => job.id === 3);
    }

    result = result.filter((job) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        job.title.toLowerCase().includes(keyword) ||
        job.company.toLowerCase().includes(keyword) ||
        job.category.toLowerCase().includes(keyword);

      const matchesLocation = job.location
        .toLowerCase()
        .includes(location.toLowerCase());

      const matchesCategory =
        category === "All" || job.category === category;

      const matchesPay =
        minimumPay === "Any" || job.pay >= Number(minimumPay);

      const matchesType = jobType === "All" || job.type === jobType;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesCategory &&
        matchesPay &&
        matchesType
      );
    });

    if (sort === "pay-high") {
      result.sort((a, b) => b.pay - a.pay);
    } else if (sort === "pay-low") {
      result.sort((a, b) => a.pay - b.pay);
    } else {
      result.sort((a, b) => a.id - b.id);
    }

    return result;
  }, [
    jobs,
    search,
    location,
    sort,
    category,
    minimumPay,
    jobType,
    savedJobs,
    activeTab
  ]);

  const heading =
    activeTab === "Saved"
      ? "Saved jobs"
      : activeTab === "My applications"
        ? "My applications"
        : "Browse jobs";

  return (
    <main className="browse-page">
      <h1>{heading}</h1>

      {activeTab === "Dashboard" || activeTab === "Profile" ? (
        <div className="panel simple-panel">
          <h2>{activeTab}</h2>
          <p>
            Welcome to Nivra. This is a frontend prototype using sample data.
          </p>
          <p>Browse jobs to discover part-time opportunities.</p>
        </div>
      ) : (
        <>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Job title or keyword"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort jobs"
            >
              <option value="soonest">Sort: Soonest</option>
              <option value="pay-high">Pay: High to low</option>
              <option value="pay-low">Pay: Low to high</option>
            </select>
          </div>

          <div className="browse-layout">
            <aside className="panel filters">
              <h3>Filters</h3>

              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="All">All</option>
                <option value="Events">Events</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Retail">Retail</option>
                <option value="Education">Education</option>
                <option value="Delivery">Delivery</option>
              </select>

              <label htmlFor="minimumPay">Minimum pay</label>
              <select
                id="minimumPay"
                value={minimumPay}
                onChange={(event) => setMinimumPay(event.target.value)}
              >
                <option value="Any">Any</option>
                <option value="500">₹500+</option>
                <option value="700">₹700+</option>
                <option value="800">₹800+</option>
              </select>

              <label htmlFor="jobType">Job type</label>
              <select
                id="jobType"
                value={jobType}
                onChange={(event) => setJobType(event.target.value)}
              >
                <option value="All">All</option>
                <option value="One day">One day</option>
                <option value="Short term">Short term</option>
              </select>
            </aside>

            <section className="jobs-section">
              <div className="jobs-count">
                {filteredJobs.length} jobs
              </div>

              <div className="panel jobs-panel">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => {
                    const saved = savedJobs.includes(job.id);

                    return (
                      <article className="job-card" key={job.id}>
                        <div className="job-info">
                          <h3>{job.title}</h3>
                          <p>
                            {job.company} · {job.location}
                          </p>
                          <span>
                            {job.dateLabel} · {job.time} · {job.duration}
                          </span>
                        </div>

                        <div className="job-actions">
                          <div className="job-pay">
                            <strong>₹{job.pay}</strong>
                            <span>/day</span>
                          </div>

                          <button
                            className={`button button-outline save-button ${
                              saved ? "saved" : ""
                            }`}
                            onClick={() => toggleSaved(job.id)}
                          >
                            {saved ? "★ Saved" : "☆ Save"}
                          </button>

                          <button
                            className="button button-primary view-button"
                            onClick={() => onView(job)}
                          >
                            View
                          </button>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <div className="empty-state">
                    <h3>No jobs found</h3>
                    <p>Try changing your search or filters.</p>

                    <button
                      className="button button-outline"
                      onClick={() => {
                        setSearch("");
                        setLocation("");
                        setCategory("All");
                        setMinimumPay("Any");
                        setJobType("All");
                      }}
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </main>
  );
}

export default BrowseJobs;
