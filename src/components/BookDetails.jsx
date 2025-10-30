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
    <div className="max-w-5xl mx-auto p-6">
      <button
        onClick={() => navigator(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <div className="flex flex-col md:flex-row gap-8 rounded-lg shadow-[0_0_8px_2px_#892DE1] p-6">
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
          <h1 className="text-3xl font-bold mb-3">{info.title}</h1>
          <p className="text-gray-600 mb-2">
            <strong>Authors:</strong>{" "}
            {info.authors ? info.authors.join(", ") : "Unknown Author"}
          </p>

          <p className="text-gray-600 mb-2">
            <strong>Publisher:</strong> {info.publisher || "N/A"}
          </p>

          <p className="text-gray-600 mb-2">
            <strong>Published Date:</strong> {info.publishedDate || "N/A"}
          </p>

          <p className="text-gray-600 mb-2">
            <strong>Page Count:</strong> {info.pageCount || "N/A"}
          </p>

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
              className="text-blue-600 hover:underline mt-1"
            >
              {isExpanded ? "Show Less" : "Read More"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
