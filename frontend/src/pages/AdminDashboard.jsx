import { useEffect, useState } from "react";
import UpdatePassword from "../components/UpdatePassword";

function AdminDashboard() {
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });

  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "user",
  });

  const [storeForm, setStoreForm] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });


  const fetchDashboard = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/users/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error(error);
    }
  };


  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();

      if (filters.name) {
        params.append("name", filters.name);
      }

      if (filters.email) {
        params.append("email", filters.email);
      }

      if (filters.address) {
        params.append("address", filters.address);
      }

      if (filters.role) {
        params.append("role", filters.role);
      }

      params.append("sortBy", sortBy);
      params.append("order", order);

      const response = await fetch(
        `http://localhost:5000/api/users/admin/users?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUsers(data);
      }
    } catch (error) {
      console.error(error);
    }
  };


  const fetchStores = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/users/admin/stores",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStores(data);
      }
    } catch (error) {
      console.error(error);
    }
  };


  const handleViewUser = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/admin/users/${userId}`,
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

      setSelectedUser(data[0]);
    } catch (error) {
      console.error(error);
      alert("Unable to load user details");
    }
  };


  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      email: "",
      address: "",
      role: "",
    });

    setSortBy("name");
    setOrder("asc");
  };


  const refreshDashboard = () => {
    fetchDashboard();
    fetchUsers();
    fetchStores();
  };

  useEffect(() => {
    fetchUsers();
  }, [filters, sortBy, order]);

  useEffect(() => {
    fetchDashboard();
    fetchStores();
  }, []);


  const handleUserChange = (e) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/admin/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userForm),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("User created successfully!");

      setUserForm({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "user",
      });

      refreshDashboard();
    } catch (error) {
      console.error(error);
      alert("Unable to create user");
    }
  };


  const handleStoreChange = (e) => {
    setStoreForm({
      ...storeForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddStore = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/admin/stores",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...storeForm,
            owner_id: Number(storeForm.owner_id),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Store created successfully!");

      setStoreForm({
        name: "",
        email: "",
        address: "",
        owner_id: "",
      });

      refreshDashboard();
    } catch (error) {
      console.error(error);
      alert("Unable to create store");
    }
  };


  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="admin-page">


      <header className="admin-header">
        <div>
          <h1>Roxiler</h1>
          <span>Admin Dashboard</span>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <main className="admin-content">


        <section className="admin-intro">
          <h2>Dashboard Overview</h2>

          <p>
            Manage users, stores and ratings from one place.
          </p>
        </section>


        <section className="admin-section">

          <div className="admin-section-title">
            <h3>Platform Statistics</h3>
          </div>

          <div className="stats-grid">

            <div className="stat-card">
              <div className="stat-icon">👥</div>

              <div>
                <span>Total Users</span>
                <strong>{stats.totalUsers}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🏪</div>

              <div>
                <span>Total Stores</span>
                <strong>{stats.totalStores}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⭐</div>

              <div>
                <span>Total Ratings</span>
                <strong>{stats.totalRatings}</strong>
              </div>
            </div>

          </div>

        </section>


        <section className="admin-section">

          <div className="admin-section-title">
            <h3>Quick Management</h3>
          </div>

          <div className="management-grid">


            <div className="admin-form-card">

              <div className="form-card-heading">

                <div className="form-card-icon">
                  👤
                </div>

                <div>
                  <h3>Add User</h3>

                  <p>
                    Create an administrator, user or store owner.
                  </p>
                </div>

              </div>

              <form
                className="admin-form"
                onSubmit={handleAddUser}
              >

                <div className="admin-form-group">

                  <label>Name</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Name (20-60 characters)"
                    value={userForm.name}
                    onChange={handleUserChange}
                    required
                  />

                </div>

                <div className="admin-form-group">

                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={userForm.email}
                    onChange={handleUserChange}
                    required
                  />

                </div>

                <div className="admin-form-group">

                  <label>Address</label>

                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={userForm.address}
                    onChange={handleUserChange}
                    required
                  />

                </div>

                <div className="admin-form-group">

                  <label>Password</label>

                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={userForm.password}
                    onChange={handleUserChange}
                    required
                  />

                </div>

                <div className="admin-form-group">

                  <label>Role</label>

                  <select
                    name="role"
                    value={userForm.role}
                    onChange={handleUserChange}
                  >

                    <option value="user">
                      Normal User
                    </option>

                    <option value="admin">
                      Administrator
                    </option>

                    <option value="store_owner">
                      Store Owner
                    </option>

                  </select>

                </div>

                <button
                  type="submit"
                  className="admin-primary-button"
                >
                  Add User
                </button>

              </form>

            </div>


            <div className="admin-form-card">

              <div className="form-card-heading">

                <div className="form-card-icon">
                  🏪
                </div>

                <div>
                  <h3>Add Store</h3>

                  <p>
                    Register a new store and assign its owner.
                  </p>
                </div>

              </div>

              <form
                className="admin-form"
                onSubmit={handleAddStore}
              >

                <div className="admin-form-group">

                  <label>Store Name</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Store name (20-60 characters)"
                    value={storeForm.name}
                    onChange={handleStoreChange}
                    required
                  />

                </div>

                <div className="admin-form-group">

                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Store email"
                    value={storeForm.email}
                    onChange={handleStoreChange}
                    required
                  />

                </div>

                <div className="admin-form-group">

                  <label>Address</label>

                  <input
                    type="text"
                    name="address"
                    placeholder="Store address"
                    value={storeForm.address}
                    onChange={handleStoreChange}
                    required
                  />

                </div>

                <div className="admin-form-group">

                  <label>Store Owner ID</label>

                  <input
                    type="number"
                    name="owner_id"
                    placeholder="Enter owner user ID"
                    value={storeForm.owner_id}
                    onChange={handleStoreChange}
                    required
                  />

                </div>

                <button
                  type="submit"
                  className="admin-primary-button"
                >
                  Add Store
                </button>

              </form>

            </div>

          </div>

        </section>


        <section className="admin-section">

          <div className="admin-section-title">

            <div>
              <h3>Account Settings</h3>

              <p>
                Manage your administrator account.
              </p>
            </div>

          </div>

          <UpdatePassword />

        </section>


        <section className="admin-section">

          <div className="admin-section-title">

            <div>
              <h3>User Management</h3>

              <p>
                Search, filter and manage registered users.
              </p>
            </div>

            <span className="result-count">
              {users.length} users
            </span>

          </div>


          <div className="filter-card">

            <div className="filter-field">

              <label>Name</label>

              <input
                type="text"
                name="name"
                placeholder="Search name..."
                value={filters.name}
                onChange={handleFilterChange}
              />

            </div>

            <div className="filter-field">

              <label>Email</label>

              <input
                type="text"
                name="email"
                placeholder="Search email..."
                value={filters.email}
                onChange={handleFilterChange}
              />

            </div>

            <div className="filter-field">

              <label>Address</label>

              <input
                type="text"
                name="address"
                placeholder="Search address..."
                value={filters.address}
                onChange={handleFilterChange}
              />

            </div>

            <div className="filter-field">

              <label>Role</label>

              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
              >

                <option value="">
                  All Roles
                </option>

                <option value="user">
                  Normal User
                </option>

                <option value="admin">
                  Administrator
                </option>

                <option value="store_owner">
                  Store Owner
                </option>

              </select>

            </div>

          </div>


          <div className="sort-bar">

            <div>

              <label>Sort by</label>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
              >

                <option value="name">
                  Name
                </option>

                <option value="email">
                  Email
                </option>

                <option value="address">
                  Address
                </option>

                <option value="role">
                  Role
                </option>

              </select>

            </div>

            <div>

              <label>Order</label>

              <select
                value={order}
                onChange={(e) =>
                  setOrder(e.target.value)
                }
              >

                <option value="asc">
                  Ascending
                </option>

                <option value="desc">
                  Descending
                </option>

              </select>

            </div>

            <button
              className="clear-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>

          </div>


          <div className="table-card">

            <div className="table-wrapper">

              <table className="admin-table">

                <thead>

                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {users.length === 0 ? (

                    <tr>

                      <td
                        colSpan="5"
                        className="table-empty"
                      >
                        No users found.
                      </td>

                    </tr>

                  ) : (

                    users.map((user) => (

                      <tr key={user.id}>

                        <td className="user-name-cell">
                          {user.name}
                        </td>

                        <td>
                          {user.email}
                        </td>

                        <td>
                          {user.address}
                        </td>

                        <td>

                          <span
                            className={`role-badge ${user.role}`}
                          >
                            {user.role === "user"
                              ? "Normal User"
                              : user.role === "admin"
                              ? "Administrator"
                              : "Store Owner"}
                          </span>

                        </td>

                        <td>

                          <button
                            className="view-button"
                            onClick={() =>
                              handleViewUser(user.id)
                            }
                          >
                            View Details
                          </button>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>


          {selectedUser && (

            <div className="user-details-card">

              <div className="details-header">

                <div>

                  <h3>User Details</h3>

                  <p>
                    Detailed information about this user.
                  </p>

                </div>

                <button
                  className="close-button"
                  onClick={() =>
                    setSelectedUser(null)
                  }
                >
                  ×
                </button>

              </div>

              <div className="details-grid">

                <div>

                  <span>Name</span>

                  <strong>
                    {selectedUser.name}
                  </strong>

                </div>

                <div>

                  <span>Email</span>

                  <strong>
                    {selectedUser.email}
                  </strong>

                </div>

                <div>

                  <span>Address</span>

                  <strong>
                    {selectedUser.address}
                  </strong>

                </div>

                <div>

                  <span>Role</span>

                  <strong>
                    {selectedUser.role}
                  </strong>

                </div>

                {selectedUser.role === "store_owner" &&
                  selectedUser.store_name && (
                    <>

                      <div>

                        <span>Store</span>

                        <strong>
                          {selectedUser.store_name}
                        </strong>

                      </div>

                      <div>

                        <span>Store Rating</span>

                        <strong>
                          ⭐ {selectedUser.store_rating}
                        </strong>

                      </div>

                    </>
                  )}

              </div>

            </div>

          )}

        </section>


        <section className="admin-section">

          <div className="admin-section-title">

            <div>

              <h3>Store Management</h3>

              <p>
                View all registered stores and their ratings.
              </p>

            </div>

            <span className="result-count">
              {stores.length} stores
            </span>

          </div>

          <div className="table-card">

            <div className="table-wrapper">

              <table className="admin-table">

                <thead>

                  <tr>
                    <th>Store Name</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Rating</th>
                  </tr>

                </thead>

                <tbody>

                  {stores.length === 0 ? (

                    <tr>

                      <td
                        colSpan="4"
                        className="table-empty"
                      >
                        No stores found.
                      </td>

                    </tr>

                  ) : (

                    stores.map((store) => (

                      <tr key={store.id}>

                        <td className="user-name-cell">
                          {store.name}
                        </td>

                        <td>
                          {store.email}
                        </td>

                        <td>
                          {store.address}
                        </td>

                        <td className="store-rating-cell">
                          ⭐ {store.rating}
                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;