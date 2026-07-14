import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const register = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://food-recipe-1-845a.onrender.com/api/auth/register",
        form
      );

      alert(res.data.message);

      if (res.data.message === "Registration Successful") {
        navigate("/login");
      }
    } catch (err) {
      console.log("Register error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center">
      <div className="card shadow-lg p-4">
        <div className="text-center mb-4">
          <h2 className="text-success fw-bold">🍽 Food Recipe</h2>
          <p className="text-muted">Create Your Account</p>
        </div>

        <form onSubmit={register}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
          </div>

          <button className="btn btn-success w-100" type="submit">
            Register
          </button>
        </form>

        <div className="text-center mt-3">
          Already have an account?
          <Link
            to="/login"
            className="text-success text-decoration-none ms-2 fw-bold"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
