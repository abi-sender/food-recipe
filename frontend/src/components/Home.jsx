import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [favoriteDocs, setFavoriteDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?._id;

  useEffect(() => {
    fetchRecipes();

    if (userId) {
      fetchFavorites();
    }
  }, [userId]);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/recipes");
      setFeaturedRecipes(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/favorites/${userId}`
      );

      setFavoriteDocs(res.data);

      const recipeIds = res.data.map((fav) => fav.recipeId._id);
      setFavorites(recipeIds);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleFavorite = async (recipeId) => {
    try {
      if (!userId) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      if (favorites.includes(recipeId)) {
        const favoriteToDelete = favoriteDocs.find(
          (fav) => fav.recipeId._id === recipeId
        );

        if (favoriteToDelete) {
          await axios.delete(
            `http://localhost:5000/api/favorites/${favoriteToDelete._id}`
          );

          setFavorites((prev) => prev.filter((id) => id !== recipeId));

          setFavoriteDocs((prev) =>
            prev.filter((fav) => fav._id !== favoriteToDelete._id)
          );
        }
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/favorites",
          {
            userId,
            recipeId,
          }
        );

        const newFav = {
          ...res.data,
          recipeId: {
            _id: recipeId,
          },
        };

        setFavorites((prev) =>
          prev.includes(recipeId) ? prev : [...prev, recipeId]
        );

        setFavoriteDocs((prev) => [...prev, newFav]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const categories = [
    { id: 0, name: "All", icon: "🍽️" },
    { id: 1, name: "Breakfast", icon: "🍳" },
    { id: 2, name: "Lunch", icon: "🍛" },
    { id: 3, name: "Dinner", icon: "🍕" },
    { id: 4, name: "Dessert", icon: "🍰" },
    { id: 5, name: "Snacks", icon: "🍔" },
    { id: 6, name: "Drinks", icon: "🥤" },
  ];

  const filteredRecipes = featuredRecipes.filter((recipe) => {
    const matchesCategory =
      selectedCategory === "All" ||
      recipe.category === selectedCategory;

    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success"></div>
      </div>
    );
  }

  return (
    <>
      {/* Navbar */}

      <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow sticky-top">
        <div className="container">

          <Link className="navbar-brand fw-bold fs-3" to="/">
            🍽 Food Recipe
          </Link>

          <button
            className="navbar-toggler"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-lg-center">

              <li className="nav-item">
                <Link className="nav-link active" to="/">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#recipes">
                  Recipes
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#categories">
                  Categories
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#about">
                  About
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#contact">
                  Contact
                </a>
              </li>

              <li className="nav-item ms-lg-3">
                {user ? (
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      localStorage.removeItem("user");
                      localStorage.removeItem("token");
                      navigate("/login");
                    }}
                  >
                    Logout
                  </button>
                ) : (
                  <Link className="btn btn-warning" to="/login">
                    Login
                  </Link>
                )}
              </li>

            </ul>
          </div>
        </div>
      </nav>

      {/* Hero */}

      <section
        className="text-white d-flex align-items-center"
        style={{
          minHeight: "550px",
          background:
            "linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)),url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80') center/cover",
        }}
      >
        <div className="container text-center">

          <h1 className="display-3 fw-bold">
            Discover Delicious Recipes
          </h1>

          <p className="lead mt-3">
            Find thousands of easy and healthy recipes for every occasion.
          </p>

          <div className="row justify-content-center mt-4">
            <div className="col-lg-6">

              <div className="input-group input-group-lg">

                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search recipes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

              </div>

            </div>
          </div>

          <button
            className="btn btn-warning btn-lg mt-4 px-5"
            onClick={() =>
              document
                .getElementById("recipes")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore Recipes
          </button>

        </div>
      </section>
            {/* Categories */}
      <section id="categories" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">
            Browse by Category
          </h2>

          <div className="row">
            {categories.map((category) => (
              <div
                className="col-lg-2 col-md-4 col-6 mb-4"
                key={category.id}
              >
                <div
                  className={`card border-0 shadow h-100 text-center ${
                    selectedCategory === category.name
                      ? "border border-success"
                      : ""
                  }`}
                  style={{
                    cursor: "pointer",
                    transition: "0.3s",
                  }}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <div className="card-body py-4">
                    <div style={{ fontSize: "50px" }}>
                      {category.icon}
                    </div>

                    <h5 className="mt-3">
                      {category.name}
                    </h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section id="recipes" className="py-5">
        <div className="container">

          <h2 className="text-center fw-bold mb-5">
            ⭐{" "}
            {selectedCategory === "All"
              ? "Featured Recipes"
              : `${selectedCategory} Recipes`}
          </h2>

          <div className="row">

            {filteredRecipes.length === 0 ? (

              <div className="text-center">
                <h4>No recipes found.</h4>
              </div>

            ) : (

              filteredRecipes.map((recipe) => (

                <div
                  className="col-lg-4 col-md-6 mb-4"
                  key={recipe._id}
                >
                  <div className="card shadow border-0 h-100">

                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="card-img-top"
                      style={{
                        height: "240px",
                        objectFit: "cover",
                      }}
                    />

                    <div className="card-body">

                      <div className="d-flex justify-content-between">
                        <span className="badge bg-success">
                          {recipe.category}
                        </span>

                        <span className="text-warning fw-bold">
                          ⭐ {recipe.rating}
                        </span>
                      </div>

                      <h4 className="mt-3">
                        {recipe.title}
                      </h4>

                      <p className="text-muted">
                        {recipe.description}
                      </p>

                      <div className="d-flex justify-content-between align-items-center">

                        <small>
                          ⏱ {recipe.time}
                        </small>

                        <button
                          className={`btn btn-sm ${
                            favorites.includes(recipe._id)
                              ? "btn-danger"
                              : "btn-outline-danger"
                          }`}
                          onClick={() =>
                            toggleFavorite(recipe._id)
                          }
                        >
                          {favorites.includes(recipe._id)
                            ? "❤️"
                            : "🤍"}
                        </button>

                      </div>

                      <Link
                        to={`/recipe/${recipe._id}`}
                        className="btn btn-success w-100 mt-3"
                      >
                        View Recipe
                      </Link>

                    </div>

                  </div>
                </div>

              ))

            )}

          </div>

        </div>
      </section>

      {/* Favorite Recipes */}

      <section className="py-5 bg-light">
        <div className="container">

          <h2 className="text-center fw-bold mb-5">
            ❤️ Favorite Recipes
          </h2>

          <div className="row">

            {featuredRecipes
              .filter((recipe) =>
                favorites.includes(recipe._id)
              )
              .map((recipe) => (

                <div
                  className="col-lg-4 col-md-6 mb-4"
                  key={recipe._id}
                >
                  <div className="card shadow border-0 h-100">

                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="card-img-top"
                      style={{
                        height: "220px",
                        objectFit: "cover",
                      }}
                    />

                    <div className="card-body">

                      <h4>{recipe.title}</h4>

                      <p>{recipe.description}</p>

                      <Link
                        to={`/recipe/${recipe._id}`}
                        className="btn btn-success w-100"
                      >
                        View Recipe
                      </Link>

                    </div>

                  </div>
                </div>

              ))}

            {favorites.length === 0 && (
              <div className="text-center">
                <h5>No favorite recipes yet ❤️</h5>
              </div>
            )}

          </div>

        </div>
      </section>
            {/* Popular Categories */}
      <section className="py-5 bg-light">
        <div className="container">

          <h2 className="text-center fw-bold mb-5">
            🔥 Popular Categories
          </h2>

          <div className="row text-center">

            <div className="col-lg-3 col-md-6 mb-4">
              <div
                className="card border-0 shadow p-4 h-100"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedCategory("Dinner");
                  document
                    .getElementById("recipes")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <h1>🍕</h1>
                <h4>Italian</h4>
                <p>Pizza, Pasta & More</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4">
              <div
                className="card border-0 shadow p-4 h-100"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedCategory("Lunch");
                  document
                    .getElementById("recipes")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <h1>🍜</h1>
                <h4>Asian</h4>
                <p>Noodles & Rice</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4">
              <div
                className="card border-0 shadow p-4 h-100"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedCategory("Breakfast");
                  document
                    .getElementById("recipes")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <h1>🥗</h1>
                <h4>Healthy</h4>
                <p>Fresh & Nutritious</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4">
              <div
                className="card border-0 shadow p-4 h-100"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedCategory("Dessert");
                  document
                    .getElementById("recipes")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <h1>🍰</h1>
                <h4>Desserts</h4>
                <p>Cakes & Ice Cream</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* About */}
      <section id="about" className="py-5">
        <div className="container">

          <div className="row align-items-center">

            <div className="col-lg-6 mb-4">
              <img
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80"
                alt="Food"
                className="img-fluid rounded shadow"
              />
            </div>

            <div className="col-lg-6">

              <h2 className="fw-bold mb-4">
                About Food Recipe
              </h2>

              <p className="text-muted">
                Food Recipe is a simple and user-friendly application
                that helps everyone discover delicious meals from
                around the world. Whether you are a beginner or
                an experienced cook, you'll find recipes that are
                easy to prepare.
              </p>

              <p className="text-muted">
                Browse recipes by category, search for your favorite
                dishes, save recipes you love, and enjoy healthy,
                tasty meals for breakfast, lunch, dinner, desserts,
                snacks, and drinks.
              </p>

              <div className="row mt-4">

                <div className="col-6 mb-3">
                  <div className="card border-0 shadow-sm text-center p-3">
                    <h3 className="text-success">500+</h3>
                    <p className="mb-0">Recipes</p>
                  </div>
                </div>

                <div className="col-6 mb-3">
                  <div className="card border-0 shadow-sm text-center p-3">
                    <h3 className="text-success">100+</h3>
                    <p className="mb-0">Categories</p>
                  </div>
                </div>

                <div className="col-6">
                  <div className="card border-0 shadow-sm text-center p-3">
                    <h3 className="text-success">10K+</h3>
                    <p className="mb-0">Happy Users</p>
                  </div>
                </div>

                <div className="col-6">
                  <div className="card border-0 shadow-sm text-center p-3">
                    <h3 className="text-success">4.9★</h3>
                    <p className="mb-0">User Rating</p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Testimonials */}
      <section className="py-5 bg-light">
        <div className="container">

          <h2 className="text-center fw-bold mb-5">
            ❤️ What Our Users Say
          </h2>

          <div className="row">

            <div className="col-md-4 mb-4">
              <div className="card shadow border-0 p-4 text-center h-100">
                <h1>😊</h1>
                <p>"Amazing recipes! Easy to cook and very delicious."</p>
                <h5>- Priya</h5>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card shadow border-0 p-4 text-center h-100">
                <h1>😍</h1>
                <p>"The search feature helped me quickly find recipes."</p>
                <h5>- Rahul</h5>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card shadow border-0 p-4 text-center h-100">
                <h1>🤩</h1>
                <p>"Beautiful design and excellent food collection."</p>
                <h5>- Anjali</h5>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Newsletter */}
      <section className="py-5 bg-success text-white">
        <div className="container text-center">

          <h2>Subscribe to Our Newsletter</h2>

          <p>
            Get the latest recipes delivered directly to your inbox.
          </p>

          <div className="row justify-content-center mt-4">

            <div className="col-md-6">

              <div className="input-group">

                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                />

                <button className="btn btn-warning">
                  Subscribe
                </button>

              </div>

            </div>

          </div>

        </div>
      </section>
            {/* Contact */}
      <section id="contact" className="py-5">
        <div className="container">

          <h2 className="text-center fw-bold mb-5">
            Contact Us
          </h2>

          <div className="row">

            <div className="col-md-6">

              <input
                type="text"
                className="form-control mb-3"
                placeholder="Your Name"
              />

              <input
                type="email"
                className="form-control mb-3"
                placeholder="Email Address"
              />

              <textarea
                rows="5"
                className="form-control mb-3"
                placeholder="Your Message"
              ></textarea>

              <button className="btn btn-success">
                Send Message
              </button>

            </div>

            <div className="col-md-6">

              <div
                className="rounded shadow overflow-hidden"
                style={{ height: "350px" }}
              >
                <iframe
                  title="Google Map"
                  src="https://www.google.com/maps?q=coimbatore&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                ></iframe>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white pt-5 pb-3">

        <div className="container">

          <div className="row">

            <div className="col-md-4">

              <h3>🍽 Food Recipe</h3>

              <p>
                Discover delicious recipes from around the world.
                Cook healthy and tasty meals every day.
              </p>

            </div>

            <div className="col-md-4">

              <h4>Quick Links</h4>

              <ul className="list-unstyled">

                <li>
                  <a
                    href="/"
                    className="text-white text-decoration-none"
                  >
                    Home
                  </a>
                </li>

                <li>
                  <a
                    href="#recipes"
                    className="text-white text-decoration-none"
                  >
                    Recipes
                  </a>
                </li>

                <li>
                  <a
                    href="#about"
                    className="text-white text-decoration-none"
                  >
                    About
                  </a>
                </li>

                <li>
                  <a
                    href="#contact"
                    className="text-white text-decoration-none"
                  >
                    Contact
                  </a>
                </li>

              </ul>

            </div>

            <div className="col-md-4">

              <h4 className="mb-3">
                Follow Us
              </h4>

              <div className="d-flex gap-3 fs-3">

                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-light"
                >
                  <i className="bi bi-facebook"></i>
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-light"
                >
                  <i className="bi bi-instagram"></i>
                </a>

                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-light"
                >
                  <i className="bi bi-twitter-x"></i>
                </a>

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-light"
                >
                  <i className="bi bi-youtube"></i>
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-light"
                >
                  <i className="bi bi-linkedin"></i>
                </a>

              </div>

            </div>

          </div>

          <hr />

          <p className="text-center mb-0">
            © 2026 Food Recipe Application. All Rights Reserved.
          </p>

        </div>

      </footer>

    </>
  );
}

export default Home;