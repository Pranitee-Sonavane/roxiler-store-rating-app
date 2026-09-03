import { useEffect, useState } from "react";
import UpdatePassword from "../components/UpdatePassword";

function OwnerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");


  const fetchDashboard = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/users/owner/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setDashboard(data);
    } catch (error) {
      console.error(error);
      alert("Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);


  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };


  if (loading) {
    return (
      <div className="owner-page">
        <div className="owner-loading">
          <div className="loading-icon">⏳</div>
          <h2>Loading dashboard...</h2>
          <p>Please wait while we load your store information.</p>
        </div>
      </div>
    );
  }


  if (!dashboard) {
    return (
      <div className="owner-page">
        <div className="owner-error">
          <div className="error-icon">⚠️</div>
          <h2>Unable to load dashboard</h2>
          <p>
            We couldn't retrieve your store information.
          </p>

          <button
            className="owner-primary-button"
            onClick={fetchDashboard}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="owner-page">


      <header className="owner-header">

        <div className="owner-brand">

          <h1>Roxiler</h1>

          <span>Store Owner Dashboard</span>

        </div>

        <button
          className="owner-logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </header>

      <main className="owner-content">


        <section className="owner-intro">

          <div>

            <h2>Store Overview</h2>

            <p>
              Monitor your store's ratings and customer feedback.
            </p>

          </div>

        </section>


        <section className="owner-section">

          <div className="owner-section-title">

            <div>

              <h3>Your Store</h3>

              <p>
                Store information and performance.
              </p>

            </div>

          </div>

          <div className="owner-store-card">

            <div className="owner-store-icon">
              🏪
            </div>

            <div className="owner-store-info">

              <h2>
                {dashboard.store.name}
              </h2>

              <p>
                Your assigned store
              </p>

            </div>

          </div>

        </section>


        <section className="owner-section">

          <div className="owner-section-title">

            <h3>Rating Statistics</h3>

          </div>

          <div className="owner-stats-grid">

            <div className="owner-stat-card">

              <div className="owner-stat-icon">
                ⭐
              </div>

              <div>

                <span>
                  Average Rating
                </span>

                <strong>
                  {dashboard.averageRating}
                </strong>

              </div>

            </div>

            <div className="owner-stat-card">

              <div className="owner-stat-icon">
                👥
              </div>

              <div>

                <span>
                  Total Ratings
                </span>

                <strong>
                  {dashboard.totalRatings}
                </strong>

              </div>

            </div>

          </div>

        </section>


        <section className="owner-section">

          <div className="owner-section-title">

            <div>

              <h3>Account Settings</h3>

              <p>
                Manage your store owner account.
              </p>

            </div>

          </div>

          <UpdatePassword />

        </section>


        <section className="owner-section">

          <div className="owner-section-title">

            <div>

              <h3>Customer Ratings</h3>

              <p>
                Customers who have submitted ratings for your store.
              </p>

            </div>

            <span className="owner-result-count">
              {dashboard.ratings.length} ratings
            </span>

          </div>

          <div className="owner-table-card">

            {dashboard.ratings.length === 0 ? (

              <div className="owner-table-empty">

                <div className="empty-icon">
                  ⭐
                </div>

                <h3>No ratings yet</h3>

                <p>
                  Customer ratings will appear here once they
                  submit feedback for your store.
                </p>

              </div>

            ) : (

              <div className="owner-table-wrapper">

                <table className="owner-table">

                  <thead>

                    <tr>

                      <th>
                        Customer
                      </th>

                      <th>
                        Email
                      </th>

                      <th>
                        Rating
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {dashboard.ratings.map((rating) => (

                      <tr key={rating.user_id}>

                        <td className="owner-customer-name">
                          {rating.user_name}
                        </td>

                        <td>
                          {rating.user_email}
                        </td>

                        <td>

                          <span className="rating-badge">
                            ⭐ {rating.rating}
                          </span>

                          <div className="rating-stars">

                            {[1, 2, 3, 4, 5].map((star) => (

                              <span
                                key={star}
                                className={
                                  star <= rating.rating
                                    ? "star-filled"
                                    : "star-empty"
                                }
                              >
                                ★
                              </span>

                            ))}

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default OwnerDashboard;