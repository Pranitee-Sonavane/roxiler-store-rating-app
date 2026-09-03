import { useEffect, useState } from "react";

function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRatings, setSelectedRatings] = useState({});

  const token = localStorage.getItem("token");

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
    <div>
      <h1>Roxiler Store Rating</h1>

      <button onClick={handleLogout}>
        Logout
      </button>

      <h2>Stores</h2>

      <input
        type="text"
        placeholder="Search by store name or address"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div>
        {stores.map((store) => (
          <div key={store.id}>

            <h3>{store.name}</h3>

            <p>
              Address: {store.address}
            </p>

            <p>
              Overall Rating: ⭐ {store.overall_rating}
            </p>

            <p>
              Your Rating: ⭐ {store.user_rating || "Not rated"}
            </p>

            <div>
              {[1, 2, 3, 4, 5].map((number) => (
                <button
                  key={number}
                  onClick={() =>
                    setSelectedRatings({
                      ...selectedRatings,
                      [store.id]: number,
                    })
                  }
                >
                  {number}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleRating(store.id)}
            >
              Submit Rating
            </button>

            <hr />

          </div>
        ))}
      </div>
    </div>
  );
}

export default UserDashboard;