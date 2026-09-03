import { useEffect, useState } from "react";

function AdminDashboard() {
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);

  // Add User form
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "user",
  });

  // Add Store form
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
      const response = await fetch(
        "http://localhost:5000/api/users/admin/users",
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

  const refreshDashboard = () => {
    fetchDashboard();
    fetchUsers();
    fetchStores();
  };

  useEffect(() => {
    refreshDashboard();
  }, []);

  // ---------------- ADD USER ----------------

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

      // Refresh users + dashboard count
      refreshDashboard();

    } catch (error) {
      console.error(error);
      alert("Unable to create user");
    }
  };

  // ---------------- ADD STORE ----------------

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

      // Refresh stores + dashboard count
      refreshDashboard();

    } catch (error) {
      console.error(error);
      alert("Unable to create store");
    }
  };

  // ---------------- LOGOUT ----------------

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div>

      <h1>Admin Dashboard</h1>

      <button onClick={handleLogout}>
        Logout
      </button>

      <hr />

      {/* DASHBOARD STATS */}

      <h2>Dashboard Statistics</h2>

      <div>
        <div>
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>

        <div>
          <h3>Total Stores</h3>
          <p>{stats.totalStores}</p>
        </div>

        <div>
          <h3>Total Ratings</h3>
          <p>{stats.totalRatings}</p>
        </div>
      </div>

      <hr />

      {/* ADD USER */}

      <h2>Add User</h2>

      <form onSubmit={handleAddUser}>

        <input
          type="text"
          name="name"
          placeholder="Name (20-60 characters)"
          value={userForm.name}
          onChange={handleUserChange}
        />

        <br />
        <br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userForm.email}
          onChange={handleUserChange}
        />

        <br />
        <br />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={userForm.address}
          onChange={handleUserChange}
        />

        <br />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userForm.password}
          onChange={handleUserChange}
        />

        <br />
        <br />

        <select
          name="role"
          value={userForm.role}
          onChange={handleUserChange}
        >
          <option value="user">Normal User</option>
          <option value="admin">Administrator</option>
          <option value="store_owner">Store Owner</option>
        </select>

        <br />
        <br />

        <button type="submit">
          Add User
        </button>

      </form>

      <hr />

      {/* ADD STORE */}

      <h2>Add Store</h2>

      <form onSubmit={handleAddStore}>

        <input
          type="text"
          name="name"
          placeholder="Store Name (20-60 characters)"
          value={storeForm.name}
          onChange={handleStoreChange}
        />

        <br />
        <br />

        <input
          type="email"
          name="email"
          placeholder="Store Email"
          value={storeForm.email}
          onChange={handleStoreChange}
        />

        <br />
        <br />

        <input
          type="text"
          name="address"
          placeholder="Store Address"
          value={storeForm.address}
          onChange={handleStoreChange}
        />

        <br />
        <br />

        <input
          type="number"
          name="owner_id"
          placeholder="Store Owner User ID"
          value={storeForm.owner_id}
          onChange={handleStoreChange}
        />

        <br />
        <br />

        <button type="submit">
          Add Store
        </button>

      </form>

      <hr />

      {/* USERS TABLE */}

      <h2>Users</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      {/* STORES TABLE */}

      <h2>Stores</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Rating</th>
          </tr>
        </thead>

        <tbody>
          {stores.map((store) => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>{store.email}</td>
              <td>{store.address}</td>
              <td>⭐ {store.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default AdminDashboard;