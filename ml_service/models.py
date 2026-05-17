import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
import joblib
import json
import os

# Load datasets
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(BASE_DIR)

hotels_df = pd.read_csv(f'{PARENT_DIR}/../hotels_tn_kerala.csv')
restaurants_df = pd.read_csv(f'{PARENT_DIR}/../restaurants_tn_kerala.csv')
places_df = pd.read_csv(f'{PARENT_DIR}/../places_tn_kerala.csv')

STYLES = ['budget', 'comfort', 'luxury']
INTERESTS_ALL = ['Culture', 'Food & Dining', 'Adventure', 'Shopping', 'Nature', 'Relaxation']

# Interest mappings
INTEREST_TO_CAT = {
    'Culture': ['culture'],
    'Nature': ['nature'],
    'Adventure': ['adventure', 'nature'],
    'Food & Dining': ['food'],
    'Shopping': ['shopping'],
    'Relaxation': ['nature', 'relaxation'],
}

INTEREST_TO_CUISINE = {
    'Food & Dining': ['South Indian', 'Kerala', 'Malabar', 'Chettinad', 'Biryani', 'Seafood'],
    'Culture': ['South Indian', 'Kerala', 'Tamil Home Food'],
    'Adventure': ['Cafe', 'Continental', 'Multi-cuisine'],
    'Relaxation': ['Cafe', 'Continental', 'French/Cafe'],
    'Shopping': ['Multi-cuisine', 'Continental'],
    'Nature': ['Kerala', 'South Indian', 'Healthy/Vegan'],
}


def predict_trip_cost(distance_km, days, style, num_interests=2):
    """Estimate trip cost based on parameters."""
    style = style.lower()
    FUEL_COST_KM = {'petrol': 6.5, 'diesel': 5.2, 'ev': 2.0}
    STYLE_MULT = {'budget': 0.6, 'comfort': 1.0, 'luxury': 1.8}

    fuel = 'petrol'
    fuel_cost = distance_km * FUEL_COST_KM[fuel] / max(days, 1)
    meal_day = np.random.uniform(250, 400) * STYLE_MULT[style]
    stay_night = np.random.uniform(800, 1200) * STYLE_MULT[style]
    attr_boost = 1 + 0.1 * num_interests
    attr_day = np.random.uniform(100, 250) * STYLE_MULT[style] * attr_boost

    daily_total = meal_day * 3 + stay_night + fuel_cost + attr_day
    total_cost = daily_total * days

    return round(total_cost, 2)


def recommend_hotels(city, style, budget_per_night=None, top_n=5):
    """Recommend hotels using content-based filtering."""
    style = style.lower()
    filtered = hotels_df[
        (hotels_df['city'].str.lower() == city.lower()) &
        (hotels_df['style'] == style)
    ].copy()

    if budget_per_night:
        filtered = filtered[filtered['cost_per_night'] <= budget_per_night]

    if filtered.empty:
        filtered = hotels_df[hotels_df['city'].str.lower() == city.lower()].copy()

    if filtered.empty:
        return []

    # Score calculation
    max_cost = filtered['cost_per_night'].max() + 1
    filtered['cost_fit'] = 1 - (filtered['cost_per_night'] / max_cost)
    filtered['amenity_score'] = (
        filtered['pool'].astype(int) +
        filtered['breakfast'].astype(int) +
        filtered['wifi'].astype(int) +
        filtered['parking'].astype(int) +
        filtered['ac'].astype(int)
    ) / 5
    filtered['score'] = (
        filtered['rating'] * 0.50 +
        filtered['cost_fit'] * 0.30 +
        filtered['amenity_score'] * 0.20
    )

    top = filtered.sort_values('score', ascending=False).head(top_n)
    return top[[
        'name', 'city', 'state', 'style', 'stars', 'rating',
        'cost_per_night', 'amenities', 'breakfast', 'pool', 'wifi'
    ]].to_dict('records')


def recommend_restaurants(city, interests, veg_only=False, style='comfort', top_n=4):
    """Recommend restaurants based on interests and preferences."""
    preferred_cuisines = []
    for interest in interests:
        preferred_cuisines += INTEREST_TO_CUISINE.get(interest, [])
    preferred_cuisines = list(set(preferred_cuisines))

    filtered = restaurants_df[restaurants_df['city'].str.lower() == city.lower()].copy()

    if filtered.empty:
        return []

    if veg_only:
        filtered = filtered[filtered['veg_type'] == 'veg']

    if style:
        style_filtered = filtered[filtered['style'] == style.lower()]
        if not style_filtered.empty:
            filtered = style_filtered

    # Cuisine relevance score
    filtered['cuisine_score'] = filtered['cuisine'].apply(
        lambda c: sum(1 for p in preferred_cuisines if p.lower() in c.lower())
    )
    filtered['final_score'] = (filtered['rating'] * 0.6 + filtered['cuisine_score'] * 0.4)

    result = filtered.sort_values('final_score', ascending=False).head(top_n)
    return result[[
        'name', 'city', 'cuisine', 'veg_type', 'rating',
        'cost_per_head', 'style', 'famous_dish'
    ]].to_dict('records')


def recommend_places(city, interests, top_n=5):
    """Recommend tourist places based on interests."""
    preferred_cats = []
    for interest in interests:
        preferred_cats += INTEREST_TO_CAT.get(interest, [])
    preferred_cats = list(set(preferred_cats))

    filtered = places_df[places_df['city'].str.lower() == city.lower()].copy()

    if filtered.empty:
        return []

    filtered['cat_score'] = filtered['category'].apply(
        lambda c: 2 if c in preferred_cats else 0
    )
    filtered['fee_score'] = 1 - filtered['entry_fee'].clip(0, 500) / 500
    filtered['final_score'] = (
        filtered['rating'] * 0.55 +
        filtered['cat_score'] * 0.30 +
        filtered['fee_score'] * 0.15
    )

    result = filtered.sort_values('final_score', ascending=False).head(top_n)
    return result[[
        'name', 'city', 'category', 'rating', 'entry_fee',
        'duration', 'best_time', 'description'
    ]].to_dict('records')


def get_available_cities():
    """Get all available cities."""
    cities = set(
        list(hotels_df['city'].unique()) +
        list(restaurants_df['city'].unique()) +
        list(places_df['city'].unique())
    )
    return sorted(list(cities))


def full_trip_plan(from_city, to_city, distance_km, budget_inr, days, style, interests, veg_only=False):
    """Complete trip planning using all ML models."""
    style_lower = style.lower()

    # Predict cost
    predicted_cost = predict_trip_cost(distance_km, days, style_lower, len(interests))
    budget_status = 'within' if predicted_cost <= budget_inr else 'over'
    budget_diff = abs(budget_inr - predicted_cost)

    # Estimate per-night budget
    budget_per_night = min((budget_inr / days) * 0.4, 25000) if days > 0 else budget_inr * 0.4

    # Get recommendations
    hotels = recommend_hotels(to_city, style_lower, budget_per_night, top_n=5)
    restaurants = recommend_restaurants(to_city, interests, veg_only, style_lower, top_n=5)
    places = recommend_places(to_city, interests, top_n=5)

    return {
        'predicted_cost': predicted_cost,
        'budget_status': budget_status,
        'budget_difference': budget_diff,
        'recommended_style': style_lower,
        'hotels': hotels,
        'restaurants': restaurants,
        'places': places,
        'available_cities': get_available_cities()
    }
