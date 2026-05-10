import { useNavigate } from "react-router-dom";
import "./FoodCard.css";

function FoodCard({ food, onAddToCart }) {
  const navigate = useNavigate();

  return (
    <div
      className="food-card"
      onClick={() => navigate(`/food/${food._id}`)}
    >

      {/* IMAGE */}
      <div className="food-card-img">
        <img
          src={`https://source.unsplash.com/400x300/?food,${food.name}`}
          alt={food.name}
        />

        {/* CATEGORY BADGE */}
        <span className="food-badge">
          {food.category?.name}
        </span>
      </div>

      {/* BODY */}
      <div className="food-card-body">

        <h3>{food.name}</h3>

        {/* RATING (UI only) */}
        <div className="food-rating">
          ⭐ 4.3 <span>(120)</span>
        </div>

        <div className="food-bottom">
          <p className="price">₹{food.price}</p>

          <button
            className="add-btn"
            onClick={(e) => {
              e.stopPropagation(); // prevent navigation
              onAddToCart(food._id);
            }}
          >
            + Add
          </button>
        </div>

      </div>

    </div>
  );
}

export default FoodCard;