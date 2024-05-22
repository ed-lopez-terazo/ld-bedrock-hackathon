"use client";

import { useFlags } from "launchdarkly-react-client-sdk";
import { useState } from "react";

export default function Home() {

  const [queryText, setQueryText] = useState("");
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submitQuery() {
    setLoading(true);
    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: queryText })
    });
    const data = await response.json();
    setAnswer(data.message)
    setLoading(false);
    console.log(data);
  }

  async function submitEvaluation(value: boolean) {
    console.log(value)
    setEvaluation(value);
    const response = await fetch("/evaluations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ evaluation })
    });
    const data = await response.json();
    setAnswer(data.message)
    console.log(data);
  }

  return (
    <div className="grid mx-auto text-center mt-8">
      <div>
        <p className="text-4xl font-bold">Hello DevWeek I am Dee Dee</p>
        <div className="pt-8">I am a Delivery Director from Terazo, let's work together!</div>
        <div className="pt-8">
          <input type="text"
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="My Question"
            className="border-2 border-gray-300 text-black p-2 m-2" />
          <button onClick={submitQuery} className="bg-blue-500 text-white p-2 m-2">Submit</button>
          <div className="pt-8">
            <button onClick={() => submitEvaluation(true)} className="bg-green-500 text-white p-2 m-2">Good</button>
            <button onClick={() => submitEvaluation(false)} className="bg-red-500 text-white p-2 m-2">Bad</button>
          </div>
          {loading ? <div>loading ...</div> : <div><p>{answer}</p></div>}
        </div>
      </div>
    </div>
  );
}
