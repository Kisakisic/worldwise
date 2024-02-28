import {
  createContext,
  useState,
  useEffect,
  useContext,
  useReducer,
} from "react";

const CitiesContext = createContext();
const BASE_URL = "http://localhost:8000";

const initialState = {
  cities: [],
  currentCity: {},
  isLoading: false,
  error: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "isLoading":
      return { ...state, isLoading: true };
    case "setCities":
      return { ...state, cities: action.payload, isLoading: false };
    case "setCurrentCity":
      return { ...state, currentCity: action.payload, isLoading: false };
    case "createCity":
      return {
        ...state,
        currentCity: action.payload,
        cities: [...state.cities, action.payload],
        isLoading: false,
      };
    case "deleteCity":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
      };
    case "rejected":
      return { ...state, error: action.payload, isLoading: false };
    default:
      throw new Error("Unknown action");
  }
};

function CitiesProvider({ children }) {
  const [{ cities, currentCity, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function fetchCities() {
      try {
        dispatch({ type: "isLoading" });
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "setCities", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading cities",
        });
      }
    }

    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      dispatch({ type: "isLoading" });
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "setCurrentCity", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error loading citie",
      });
    }
  }

  async function createCity(newCity) {
    try {
      dispatch({ type: "isLoading" });
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "createCity", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating cities",
      });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "isLoading" });
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "deleteCity", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting cities",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        getCity,
        currentCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

const useCities = () => {
  const context = useContext(CitiesContext);
  return context;
};

export { CitiesProvider, useCities };
