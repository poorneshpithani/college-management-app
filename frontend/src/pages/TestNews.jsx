import { useEffect, useState } from "react";
import axios from "axios";

const TestNews = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/news") // direct call, no interceptor
      .then((res) => setNews(res.data))
      .catch((err) => console.error("❌ Test fetch failed:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl">Test News</h1>
      <pre>{JSON.stringify(news, null, 2)}</pre>
    </div>
  );
};

export default TestNews;
