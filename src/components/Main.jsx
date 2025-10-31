import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const [query, setQuery] = useState(""); // search input
  const [books, setBooks] = useState([]); // all books
  const [filteredBooks, setFilteredBooks] = useState([]); // displayed books
  const [suggestions, setSuggestions] = useState([]); // for title suggestions
  const navigate = useNavigate();
  // Fetch data from API when component mounts
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          "https://www.googleapis.com/books/v1/volumes?q=.&maxResults=40"
        );
        const data = await response.json();
        // console.log(data);

        const allBooks = data.items || [];

        // shuffle and pick random 4
        const shuffled = allBooks.sort(() => Math.random() - 0.5);
        const randomFour = shuffled.slice(0, 4);

        setBooks(allBooks);
        setFilteredBooks(randomFour);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  // Handle typing in search input (show live suggestions)
  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    // If input box is empty — show 4 random books again
    if (value.trim() === "") {
      setSuggestions([]);

      const randomFour = books.sort(() => Math.random() - 0.5).slice(0, 4);

      setFilteredBooks(randomFour);
      return;
    }

    // 🔍 Filter books by title or author
    const filtered = books.filter((book) => {
      const title = book.volumeInfo?.title?.toLowerCase() || "";
      const authors = book.volumeInfo?.authors?.join(" ").toLowerCase() || "";
      // console.log(book);

      // Match starting letters
      return title.startsWith(value) || authors.startsWith(value);
    });

    // Prepare suggestions with both title and author
    const suggestionData = filtered.map((book) => ({
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors?.join(", ") || "Unknown Auther",
    }));

    // remove duplicates & limit suggestions
    const uniqueSuggestions = Array.from(
      new Map(suggestionData.map((item) => [item.title, item])).values()
    ).slice(0, 5);

    setSuggestions(uniqueSuggestions);
  };

  // When user selects a suggestion
  const handleSuggestionClick = (title) => {
    setQuery(title);
    setSuggestions([]);

    const filtered = books.filter(
      (book) => book.volumeInfo.title.toLowerCase() === title.toLowerCase()
    );
    setFilteredBooks(filtered);
  };

  // Optional: Search button click (filters books)
  const handleSearch = () => {
    const searchValue = query.toLowerCase();

    const filtered = books.filter((book) => {
      const title = book.volumeInfo?.title?.toLowerCase() || "";
      const authors = book.volumeInfo?.authors?.join(" ").toLowerCase() || "";
      return title.includes(searchValue) || authors.includes(searchValue);
    });

    setFilteredBooks(filtered);
    setSuggestions([]);
  };

  // clear search input and reset books random 4
  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    const randomFour = books.sort(() => Math.random() - 0.5).slice(0, 4);
    setFilteredBooks(randomFour);
  };

  return (
    <div className="">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
        <div className="max-w-10xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* company name */}
          <h3
            className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition"
            onClick={() => navigate("/")}
          >
            BookFinder
          </h3>
        </div>
      </nav>
      <div className="p-6">
        {/* 🧭 Heading */}
        <div className="text-center mb-8 relative">
          <h1 className="text-3xl font-bold text-blue-700 mb-4 mt-6">
            BookFinder
          </h1>
          <h2 className="text-2xl font-sm-bold text-black mb-4 mt-6">
            Find Your Book
          </h2>

          {/* 🔍 Search bar */}
          <div className="flex justify-center gap-2 relative">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Enter your book name..."
                className="border border-gray-400 rounded-l-lg px-4 py-2 w-145 focus:outline-none focus:border-blue-500"
              />

              {/* show cross only when query is not empty */}
              {query && (
                <button
                  onClick={clearSearch}
                  style={{
                    position: "relative",
                    right: "20px",
                    top: "30%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    fontSize: "18px",
                    cursor: "pointer",
                    color: "#888",
                    transition: "all 0.2s ease-in-out",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#ff4d4d";
                    e.target.style.transform = "translateY(-50%) scale(1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#888";
                    e.target.style.transform = "translateY(-50%) scale(1)";
                  }}
                >
                  X
                </button>
              )}

              {/* 💡 Suggestions dropdown */}
              {suggestions.length > 0 && (
                <ul className="absolute left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1 z-10">
                  {suggestions.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(item.title)}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-left"
                    >
                      <span className="font-medium">{item.title}</span>
                      <br />
                      <span className="text-sm text-gray-500">
                        {item.authors}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              onClick={handleSearch}
              disabled={!query.trim()}
              className={`px-4 py-2 rounded-r-lg transition 
                ${
                  query.trim()
                    ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              Search
            </button>
          </div>
        </div>

        {/* 📚 Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => {
              const info = book.volumeInfo;
              return (
                <div
                  key={book.id}
                  onClick={() => navigate(`/book/${book.id}`)} // navigate to detail page
                  className="bg-white border border-gray-200 rounded-2xl shadow-md 
                          hover:shadow-2xl hover:shadow-blue-200 
                          transition-all duration-300 transform 
                          hover:-translate-y-2 hover:scale-105 
                          overflow-hidden flex flex-col cursor-pointer"
                >
                  {/* 🖼️ Book Thumbnail */}
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        info.imageLinks?.thumbnail ||
                        "https://via.placeholder.com/128x180?text=No+Image"
                      }
                      alt={info.title}
                      className="w-full h-58 object-cover transition-transform duration-300 hover:scale-110"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  </div>

                  {/* 📖 Book Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition">
                        {info.title}
                      </h2>
                      <p className="text-sm text-gray-600 mt-2">
                        {info.authors
                          ? info.authors.join(", ")
                          : "Unknown Author"}
                      </p>
                    </div>

                    <p className="text-xs text-gray-500 mt-3">
                      Published: {info.publishedDate || "N/A"}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No books found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
