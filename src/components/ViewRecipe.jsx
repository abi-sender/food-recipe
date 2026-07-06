import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ViewRecipe() {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        setRecipe(res.data);
      } catch (error) {
        console.log("Recipe fetch error:", error.response?.data || error.message);
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <h2 className="text-center mt-5">Loading...</h2>;
  }

  if (!recipe) {
    return <h2 className="text-center mt-5">Recipe Not Found</h2>;
  }

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="card-img-top"
          style={{ height: "400px", objectFit: "cover" }}
        />

        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-success fw-bold">{recipe.title}</h2>
            <span className="badge bg-warning text-dark fs-6">
              ⭐ {recipe.rating}
            </span>
          </div>

          <div className="row text-center my-4">
            <div className="col-md-3">
              <div className="border rounded p-2">
                <strong>Category</strong>
                <br />
                {recipe.category}
              </div>
            </div>

            <div className="col-md-3">
              <div className="border rounded p-2">
                <strong>Time</strong>
                <br />
                {recipe.time}
              </div>
            </div>

            <div className="col-md-3">
              <div className="border rounded p-2">
                <strong>Calories</strong>
                <br />
                {recipe.calories}
              </div>
            </div>

            <div className="col-md-3">
              <div className="border rounded p-2">
                <strong>Difficulty</strong>
                <br />
                {recipe.difficulty}
              </div>
            </div>
          </div>

          <h4 className="text-success text-start">🥘 Ingredients</h4>
          <ul className="list-group mb-4 text-start">
            {recipe.ingredients?.map((item, index) => (
              <li key={index} className="list-group-item d-flex align-items-center">
                ✅ {item}
              </li>
            ))}
          </ul>

          <h4 className="text-success text-start">👨‍🍳 Preparation</h4>
          <ol className="list-group list-group-numbered mb-4 text-start">
            {recipe.steps?.map((step, index) => (
              <li key={index} className="list-group-item">
                {step}
              </li>
            ))}
          </ol>

          <h4 className="text-success text-start">🥗 Nutrition</h4>
          <ul className="list-group mb-4 text-start">
            <li className="list-group-item">
              Protein: {recipe.nutrition?.protein}
            </li>
            <li className="list-group-item">
              Carbs: {recipe.nutrition?.carbs}
            </li>
            <li className="list-group-item">
              Fat: {recipe.nutrition?.fat}
            </li>
            <li className="list-group-item">
              Fiber: {recipe.nutrition?.fiber}
            </li>
          </ul>

          <h4 className="text-success text-start">💡 Tips</h4>
          <ul className="list-group mb-4 text-start">
            {recipe.tips?.map((tip, index) => (
              <li key={index} className="list-group-item">
                {tip}
              </li>
            ))}
          </ul>

          <h4 className="text-success text-start">❤️ Benefits</h4>
          <ul className="list-group mb-4 text-start">
            {recipe.benefits?.map((benefit, index) => (
              <li key={index} className="list-group-item">
                {benefit}
              </li>
            ))}
          </ul>

          <div className="alert alert-info">
            <strong>Storage:</strong> {recipe.storage}
          </div>

          <h4 className="text-success text-start">🍽 Best Served With</h4>
          <ul className="list-group mb-4 text-start">
            {recipe.pairWith?.map((pair, index) => (
              <li key={index} className="list-group-item">
                {pair}
              </li>
            ))}
          </ul>

          <div className="text-center">
            <button
              className="btn btn-success"
              onClick={() => window.history.back()}
            >
              ← Back to Recipes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}