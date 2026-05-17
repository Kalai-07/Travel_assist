import { useState } from 'react';
import { C } from '../constants/theme';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Btn from '../components/common/Btn';
import Icon from '../components/common/Icon';
import { generateDayByDayPlan, formatCurrency, formatDistance, getRestaurantsForLocation, getStaysForLocation } from '../utils/tripPlanner';

const INTERESTS_OPTIONS = ['Culture', 'Food & Dining', 'Adventure', 'Shopping', 'Nature', 'Relaxation'];
const STYLES = ['Budget', 'Comfort', 'Luxury'];
const API_BASE_URL = 'http://localhost:5000/api';

const TripPlanning = ({ user }) => {
  const [from, setFrom] = useState('Chennai');
  const [to, setTo] = useState('Madurai');
  const [distance, setDistance] = useState(461);
  const [budget, setBudget] = useState(30000);
  const [days, setDays] = useState(3);
  const [interests, setInterests] = useState(['Food & Dining']);
  const [style, setStyle] = useState('Comfort');
  const [vegOnly, setVegOnly] = useState(false);
  const [planned, setPlanned] = useState(false);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);

  // Load available cities on mount
  const loadCities = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/trip-planning/cities`);
      const data = await response.json();
      if (data.success) {
        setCities(data.cities);
      }
    } catch (error) {
      console.error('Error loading cities:', error);
    }
  };

  // Load cities once on component mount
  useState(() => { loadCities(); }, []);

  const handleInterestToggle = (interest) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handlePlanTrip = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/trip-planning/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_city: from,
          to_city: to,
          distance_km: distance,
          budget_inr: budget,
          days: days,
          style: style.toLowerCase(),
          interests: interests,
          veg_only: vegOnly,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Convert API response to plan format
        const mlData = data.data;
        const generatedPlan = generateDayByDayPlan(
          from,
          to,
          days,
          interests,
          budget,
          style.toLowerCase(),
          user?.fuel || 'Petrol'
        );
        generatedPlan.mlData = mlData;
        setPlan(generatedPlan);
        setPlanned(true);
      } else {
        alert('Error planning trip: ' + data.error);
      }
    } catch (error) {
      console.error('Error planning trip:', error);
      alert('Failed to plan trip. Make sure ML Service is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ padding: '32px 28px', maxWidth: 1220, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: C.dark, marginBottom: 4 }}>Trip Planning</h1>
        <p style={{ color: C.muted, fontSize: 14 }}>Plan your perfect journey with AI-powered recommendations</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: planned ? '340px 1fr' : '1fr', gap: 18 }}>

        {/* Left column - Input form */}
        <div>
          <Card style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 20 }}>Plan Your Route</h3>

            {/* City inputs */}
            {['From', 'To'].map((label, idx) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
                <input
                  style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, background: '#fff', color: C.dark }}
                  value={idx === 0 ? from : to}
                  onChange={(e) => idx === 0 ? setFrom(e.target.value) : setTo(e.target.value)}
                  placeholder={label === 'From' ? 'Starting city' : 'Destination city'}
                  list={`${label.toLowerCase()}-cities`}
                />
                <datalist id={`${label.toLowerCase()}-cities`}>
                  {cities.map(city => <option key={city} value={city} />)}
                </datalist>
              </div>
            ))}

            {/* Distance */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Distance (km)</label>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>{distance} km</span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={distance}
                onChange={(e) => setDistance(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: C.primary }}
              />
            </div>

            {/* Budget slider */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Budget</label>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>{formatCurrency(budget)}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="100000"
                step="5000"
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: C.primary }}
              />
            </div>

            {/* Days slider */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Days</label>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>{days} day{days > 1 ? 's' : ''}</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: C.primary }}
              />
            </div>

            {/* Travel Style */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Travel Style</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {STYLES.map((s) => (
                  <div
                    key={s}
                    onClick={() => setStyle(s)}
                    style={{
                      padding: '10px',
                      borderRadius: 10,
                      border: `2px solid ${style === s ? C.primary : C.border}`,
                      background: style === s ? `${C.primary}10` : '#fff',
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontSize: 13,
                      fontWeight: style === s ? 600 : 500,
                      color: style === s ? C.primary : C.sub,
                      transition: 'all .2s',
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: 'block', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Interests</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {INTERESTS_OPTIONS.map((interest) => (
                  <label key={interest} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                    <input
                      type="checkbox"
                      checked={interests.includes(interest)}
                      onChange={() => handleInterestToggle(interest)}
                      style={{ cursor: 'pointer', width: 16, height: 16, accentColor: C.primary }}
                    />
                    {interest}
                  </label>
                ))}
              </div>
            </div>

            {/* Veg only checkbox */}
            <div style={{ marginBottom: 14, padding: 12, background: C.pLight, borderRadius: 10 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={vegOnly}
                  onChange={(e) => setVegOnly(e.target.checked)}
                  style={{ cursor: 'pointer', width: 16, height: 16, accentColor: C.primary }}
                />
                <span style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>Vegetarian Only</span>
              </label>
            </div>

            <Btn
              onClick={handlePlanTrip}
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', fontSize: 14, opacity: loading ? 0.6 : 1 }}
            >
              {loading ? '⏳ Planning...' : '🗺️ Plan My Trip'}
            </Btn>
          </Card>
        </div>

        {/* Right column - Itinerary */}
        {planned && plan && (
          <div className="fade-in">
            {/* Summary card */}
            <Card style={{ marginBottom: 16, background: `linear-gradient(135deg, ${C.primary}08, ${C.green}08)` }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 16 }}>🤖 AI-Powered Trip Summary</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                <div>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>Predicted Cost</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.primary }}>{formatCurrency(plan.mlData?.predicted_cost || 0)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>Budget Status</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: plan.mlData?.budget_status === 'within' ? C.green : C.red }}>
                    {plan.mlData?.budget_status === 'within' ? '✓ Within Budget' : '⚠️ Over Budget'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>Recommended Style</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.orange }}>{plan.mlData?.recommended_style}</div>
                </div>
              </div>
            </Card>

            {/* Hotels */}
            {plan.mlData?.hotels?.length > 0 && (
              <Card style={{ marginBottom: 14 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="hotel" size={18} color={C.green} /> Recommended Hotels
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {plan.mlData.hotels.map((hotel, idx) => (
                    <div key={idx} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, background: '#fff' }}>
                      <div style={{ fontWeight: 700, color: C.dark, marginBottom: 4 }}>{hotel.name}</div>
                      <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>{'★'.repeat(hotel.stars)}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.green }}>{formatCurrency(hotel.cost_per_night)}/night</div>
                      <div style={{ fontSize: 11, color: C.sub, marginTop: 4 }}>Rating: {hotel.rating}/5</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Restaurants */}
            {plan.mlData?.restaurants?.length > 0 && (
              <Card style={{ marginBottom: 14 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="fork" size={18} color={C.primary} /> Recommended Restaurants
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {plan.mlData.restaurants.map((rest, idx) => (
                    <div key={idx} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, background: '#fff' }}>
                      <div style={{ fontWeight: 700, color: C.dark, marginBottom: 4 }}>{rest.name}</div>
                      <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{rest.cuisine} • {rest.veg_type}</div>
                      <div style={{ fontSize: 11, color: C.sub, marginBottom: 4 }}>Dish: {rest.famous_dish}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.primary }}>{formatCurrency(rest.cost_per_head)}/head</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Places */}
            {plan.mlData?.places?.length > 0 && (
              <Card style={{ marginBottom: 14 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="map" size={18} color={C.orange} /> Things to Do
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {plan.mlData.places.map((place, idx) => (
                    <div key={idx} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, background: '#fff' }}>
                      <div style={{ fontWeight: 700, color: C.dark, marginBottom: 4 }}>{place.name}</div>
                      <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{place.category}</div>
                      <div style={{ fontSize: 11, color: C.sub, marginBottom: 4 }}>⏱️ {place.duration}</div>
                      <div style={{ fontSize: 11, color: C.sub, marginBottom: 4 }}>Entry: {place.entry_fee > 0 ? formatCurrency(place.entry_fee) : 'Free'}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripPlanning;
