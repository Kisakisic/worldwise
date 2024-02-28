import { useSearchParams } from "react-router-dom";

export const useUrlLocation = () => {
  const [searchParams, setSearhParams] = useSearchParams();
  const mapLat = searchParams.get("lat");
  const mapLng = searchParams.get("lng");

  return [mapLat, mapLng];
};
