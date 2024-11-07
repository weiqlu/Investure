import { useState, useEffect } from "react";

function Graph() {
  const [data, setData] = useState([]);

  // fetches data only once when mounted
  useEffect(() => {
    fetch("http://localhost:5000/investure")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
}

export default Graph;
