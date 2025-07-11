import React, { useState } from 'react';

const Attempt = () => {
  const [active, setActive] = useState(1); 

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-gray-800 text-white p-4 space-y-3">
        {[1, 2, 3].map((num) => (
          <button
            key={num}
            onClick={() => setActive(num)}
            className={`block w-full text-left px-3 py-2 rounded transition ${
              active === num ? 'bg-teal-500' : 'bg-gray-700 hover:bg-teal-500'
            }`}
          >
            Interview {num}
          </button>
        ))}
      </aside>

      <main className="flex-1 p-6 bg-white">
        {active === 1 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Interview 1</h2>
            <div className="mb-4">
              <p className="font-semibold text-gray-700">Q: What is HTML?</p>
              <p className="ml-4 text-gray-600">A: It’s the standard language for creating webpages.</p>
            </div>
            <div className="mb-4">
              <p className="font-semibold text-gray-700">Q: What is a tag?</p>
              <p className="ml-4 text-gray-600">A: A keyword used to define elements in HTML.</p>
            </div>
          </section>
        )}

        {active === 2 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Interview 2</h2>
            <div className="mb-4">
              <p className="font-semibold text-gray-700">Q: What is CSS?</p>
              <p className="ml-4 text-gray-600">A: CSS is used to style HTML content.</p>
            </div>
            <div className="mb-4">
              <p className="font-semibold text-gray-700">Q: What is a class?</p>
              <p className="ml-4 text-gray-600">A: A reusable style definition in CSS.</p>
            </div>
          </section>
        )}

        {active === 3 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Interview 3</h2>
            <div className="mb-4">
              <p className="font-semibold text-gray-700">Q: What is JavaScript?</p>
              <p className="ml-4 text-gray-600">A: A scripting language for web interactivity.</p>
            </div>
            <div className="mb-4">
              <p className="font-semibold text-gray-700">Q: What is an event?</p>
              <p className="ml-4 text-gray-600">A: An action that triggers a response (e.g., click).</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Attempt;
