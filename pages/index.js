"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MLInputPage() {
  const [formData, setFormData] = useState({
    Age: "",
    Income: "",
    Family: "1",
    CCAvg: "",
    Education: "1",
    Mortgage: "",
    Securities_Account: false,
    CD_Account: false,
    Online: false,
    CreditCard: false,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("https://loan-default-backend.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "❌ Could not connect to Flask server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center p-6 text-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-3xl border border-gray-800"
      >
        <h1 className="text-4xl font-bold text-center text-indigo-400 mb-8">
          💡 Customer Default Prediction
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Numeric Inputs */}
          {["Age", "Income", "CCAvg","Mortgage"].map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-gray-300 font-medium mb-1">{key.replace(/_/g, " ")}</label>
              <input
                type="number"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="bg-gray-950 border border-gray-700 rounded-lg p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          ))}

          {/* Dropdowns */}
          <div className="flex flex-col">
            <label className="text-gray-300 font-medium mb-1">Family Members</label>
            <select
              name="Family"
              value={formData.Family}
              onChange={handleChange}
              className="bg-gray-950 border border-gray-700 rounded-lg p-2 text-gray-200 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="1">1 Member</option>
              <option value="2">2 Members</option>
              <option value="3">3 Members</option>
              <option value="4">4+ Members</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-300 font-medium mb-1">Education Level</label>
            <select
              name="Education"
              value={formData.Education}
              onChange={handleChange}
              className="bg-gray-950 border border-gray-700 rounded-lg p-2 text-gray-200 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="1">Undergraduate</option>
              <option value="2">Graduate</option>
              <option value="3">Advanced/Professional</option>
            </select>
          </div>

          {/* Boolean Toggles */}
          {[
            "Securities_Account",
            "CD_Account",
            "Online",
            "CreditCard",
          ].map((key) => (
            <label key={key} className="flex items-center gap-3 text-gray-300 font-medium">
              <input
                type="checkbox"
                name={key}
                checked={formData[key]}
                onChange={handleChange}
                className="w-5 h-5 accent-indigo-500 cursor-pointer"
              />
              {key.replace(/_/g, " ")}
            </label>
          ))}

          <motion.button
            whileTap={{ scale: 0.96 }}
            type="submit"
            disabled={loading}
            className="col-span-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:bg-indigo-400"
          >
            {loading ? "Predicting..." : "🔍 Predict"}
          </motion.button>
        </form>

        {/* RESULT SECTION */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-8 p-6 rounded-xl bg-gray-950/80 border border-gray-800 text-center shadow-lg"
            >
              {result.error ? (
                <p className="text-red-400 font-semibold">{result.error}</p>
              ) : result.default === true ? (
                <div>
                  <h2 className="text-2xl font-bold text-red-500 mb-2 animate-pulse">
                    ⚠️ Customer Will Default
                  </h2>
                  <p className="text-gray-300">
                    The model predicts a high risk of loan default.
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-green-400 mb-2 animate-pulse">
                    ✅ Customer Will Not Default
                  </h2>
                  <p className="text-gray-300">
                    The model predicts the customer is unlikely to default.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
