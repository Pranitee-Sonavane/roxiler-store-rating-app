import { useEffect, useState } from "react";
import UpdatePassword from "../components/UpdatePassword";

function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRatings, setSelectedRatings] = useState({});

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchStores = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/stores?search=${encodeURIComponent(search)}`,
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

      setStores(data);
    } catch (error) {
      console.error(error);
      alert("Unable to load stores");
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search]);

  const handleRating = async (storeId) => {
    const rating = selectedRatings[storeId];

    if (!rating) {
      alert("Please select a rating");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/ratings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            store_id: storeId,
            rating: rating,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Rating submitted successfully!");

      setSelectedRatings({
        ...selectedRatings,
        [storeId]: rating,
      });

      fetchStores();
    } catch (error) {
      console.error(error);
      alert("Unable to submit rating");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-page">


      <header className="dashboard-header">
        <div>
          <h1>Roxiler</h1>
          <span>Store Rating</span>
        </div>

        <div className="header-actions">
          <span className="welcome-text">
            Hi, {user?.name}
          </span>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>


      <main className="dashboard-content">

        <div className="page-heading">
          <div>
            <h2>Find a Store</h2>
            <p>
              Discover stores and share your experience.
            </p>
          </div>
        </div>


        <div className="search-container">
          <span className="search-icon">⌕</span>

          <input
            type="text"
            placeholder="Search stores by name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>


        <div className="password-section">
          <UpdatePassword />
        </div>


        <section className="stores-section">

          <div className="section-heading">
            <h3>Available Stores</h3>

            <span className="store-count">
              {stores.length}{" "}
              {stores.length === 1 ? "store" : "stores"}
            </span>
          </div>

          {stores.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏪</div>
              <h3>No stores found</h3>
              <p>
                Try searching with a different name or address.
              </p>
            </div>
          ) : (
            <div className="store-grid">

              {stores.map((store) => {

                const selectedRating =
                  selectedRatings[store.id];

                const currentRating =
                  selectedRating || store.user_rating;

                return (
                  <div
                    className="store-card"
                    key={store.id}
                  >

                    <div className="store-card-top">

                      <div className="store-icon">
                        🏪
                      </div>

                      <div>
                        <h3>{store.name}</h3>

                        <p className="store-address">
                          📍 {store.address}
                        </p>
                      </div>

                    </div>

                    <div className="rating-summary">

                      <div className="rating-item">
                        <span className="rating-label">
                          Overall Rating
                        </span>

                        <strong>
                          ⭐ {store.overall_rating}
                        </strong>
                      </div>

                      <div className="rating-item">
                        <span className="rating-label">
                          Your Rating
                        </span>

                        <strong>
                          {store.user_rating
                            ? `⭐ ${store.user_rating}`
                            : "Not rated yet"}
                        </strong>
                      </div>

                    </div>

                    <div className="rate-section">

                      <span className="rate-label">
                        {store.user_rating
                          ? "Update your rating"
                          : "Rate this store"}
                      </span>

                      <div className="star-rating">

                        {[1, 2, 3, 4, 5].map(
                          (number) => (
                            <button
                              key={number}
                              className={
                                number <= currentRating
                                  ? "star active"
                                  : "star"
                              }
                              onClick={() =>
                                setSelectedRatings({
                                  ...selectedRatings,
                                  [store.id]: number,
                                })
                              }
                            >
                              ★
                            </button>
                          )
                        )}

                      </div>

                      <button
                        className="rate-button"
                        onClick={() =>
                          handleRating(store.id)
                        }
                      >
                        {store.user_rating
                          ? "Update Rating"
                          : "Submit Rating"}
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default UserDashboard;