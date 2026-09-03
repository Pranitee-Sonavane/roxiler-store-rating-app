import { useState } from "react";

function UpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      alert("Please fill in both password fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/users/password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Password updated successfully!");

      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error(error);
      alert("Unable to update password");
    }
  };

  return (
    <div className="update-password-card">

      <div className="update-password-heading">

        <div className="password-icon">
          🔐
        </div>

        <div>
          <h3>Update Password</h3>

          <p>
            Change your administrator account password securely.
          </p>
        </div>

      </div>

      <form
        className="update-password-form"
        onSubmit={handleUpdatePassword}
      >

        <div className="password-field">

          <label>
            Current Password
          </label>

          <input
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(e.target.value)
            }
          />

        </div>

        <div className="password-field">

          <label>
            New Password
          </label>

          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
          />

          <small>
            8–16 characters, including an uppercase letter
            and a special character.
          </small>

        </div>

        <button
          type="submit"
          className="password-update-button"
        >
          Update Password
        </button>

      </form>

    </div>
  );
}

export default UpdatePassword;