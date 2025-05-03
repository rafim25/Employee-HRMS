import axios from 'axios';

const API_KEY = process.env.COUNTRY_STATE_CITY_API_KEY;

const BASE_URL = 'https://api.countrystatecity.in/v1';

export const getIndianStates = async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/countries/IN/states`, {
      headers: {
        'X-CSCAPI-KEY': API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({ message: 'Failed to fetch states' });
  }
};

export const getDistrictsByState = async (req, res) => {
  try {
    const { stateCode } = req.params;
    const response = await axios.get(`${BASE_URL}/countries/IN/states/${stateCode}/cities`, {
      headers: {
        'X-CSCAPI-KEY': API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching districts:', error);
    res.status(500).json({ message: 'Failed to fetch districts' });
  }
};

export const getCitiesByDistrict = async (req, res) => {
  try {
    const { stateCode, districtCode } = req.params;
    const response = await axios.get(`${BASE_URL}/countries/IN/states/${stateCode}/cities/${districtCode}`, {
      headers: {
        'X-CSCAPI-KEY': API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ message: 'Failed to fetch cities' });
  }
}; 