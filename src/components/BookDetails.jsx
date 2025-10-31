import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BookDetails = () => {
  const { id } = useParams();
  const navigator = useNavigate();
  const [book, setBook] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // fetch book details using the id from params
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}`
        );
        const data = await response.json();
        console.log(data);
        setBook(data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };
    fetchBook();
  }, [id]);

  if (!book) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  const info = book.volumeInfo;
  const description = info.description
    ? info.description.replace(/<[^>]+>/g, "")
    : "No description available for this book.";

  return (
    <div>
      {/* Navbar */}
      <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
        <div className="max-w-10xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* company name */}
          <h3 className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition">
            BookFinder
          </h3>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto p-6 mt-25">
        <div className="flex flex-col md:flex-row gap-8 rounded-lg shadow-[0_0_10px_1px_#202230] p-6">
          {/* Left Image */}
          <div className="flex-shrink-0 w-full md:w-1/3 flex justify-center items-start">
            <img
              src={
                info.imageLinks?.thumbnail ||
                "https://via.placeholder.com/200x300?text=No+Image"
              }
              alt={info.title}
              className="rounded-lg shadow-md w-60 h-auto"
            />
          </div>

          {/* Right Details */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              {info.title}
            </h1>

            {/* Aligned Book Details */}
            <div className="text-gray-700 mb-5 space-y-2">
              <div className="flex">
                <strong className="w-30">Authors:</strong>
                <span>
                  {info.authors ? info.authors.join(", ") : "Unknown Author"}
                </span>
              </div>

              <div className="flex">
                <strong className="w-33">Publisher:</strong>
                <span>{info.publisher || "N/A"}</span>
              </div>

              <div className="flex">
                <strong className="w-44">Published Date:</strong>
                <span>{info.publishedDate || "N/A"}</span>
              </div>

              <div className="flex">
                <strong className="w-37">Page Count:</strong>
                <span>{info.pageCount || "N/A"}</span>
              </div>
            </div>

            {/* Description with "Read More" toggle */}
            <p
              className={`text-gray-800 leading-relaxed text-justify transition-all duration-300 ${
                isExpanded ? "" : "line-clamp-3"
              }`}
            >
              {description}
            </p>

            {description.length > 80 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-600 hover:underline mt-2"
              >
                {isExpanded ? "Show Less" : "Read More"}
              </button>
            )}

          </div>
        </div>
      </div>

       {/* Back Button (bottom-right inside card) */}

            <button
              onClick={() => navigator(-1)}
              className=" bottom-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
              ← Back
            </button>
    </div>
  );
};

export default BookDetails;
