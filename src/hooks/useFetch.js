import { useEffect, useState } from "react";

const useFetch = ({ initData = [], fetchDataFn = () => {} }) => {
  const [data, setData] = useState(initData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      if (data.length > 0) return;

      setLoading(true);
      try {
        const response = await fetchDataFn();
        setData(response);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, setData, loading, error };
};

export default useFetch;
