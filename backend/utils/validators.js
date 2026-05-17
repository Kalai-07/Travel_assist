export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

export const validateLocation = (location) => {
  return (
    location &&
    location.latitude &&
    location.longitude &&
    location.address &&
    typeof location.latitude === 'number' &&
    typeof location.longitude === 'number'
  );
};

export const validateDate = (date) => {
  return !isNaN(Date.parse(date));
};
