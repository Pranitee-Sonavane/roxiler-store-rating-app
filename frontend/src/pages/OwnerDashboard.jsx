import { useEffect, useState } from "react";

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
    return <h2>Loading dashboard...</h2>;
  }

  if (!dashboard) {
    return <h2>Unable to load dashboard</h2>;
  }

  return (
    <div>
      <h1>Store Owner Dashboard</h1>

      <button onClick={handleLogout}>
        Logout
      </button>

      <hr />

      <h2>{dashboard.store.name}</h2>

      <div>
        <div>
          <h3>Average Rating</h3>
          <p>⭐ {dashboard.averageRating}</p>
        </div>

        <div>
          <h3>Total Ratings</h3>
          <p>{dashboard.totalRatings}</p>
        </div>
      </div>

      <hr />

      <h2>Customers Who Rated Your Store</h2>

      {dashboard.ratings.length === 0 ? (
        <p>No ratings yet.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Rating</th>
            </tr>
          </thead>

          <tbody>
            {dashboard.ratings.map((rating) => (
              <tr key={rating.user_id}>
                <td>{rating.user_name}</td>
                <td>{rating.user_email}</td>
                <td>⭐ {rating.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OwnerDashboard;