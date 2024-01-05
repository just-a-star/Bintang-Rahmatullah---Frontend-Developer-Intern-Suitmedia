import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./ListPost.scss";
import { FaAngleLeft, FaAnglesLeft, FaAngleRight, FaAnglesRight } from "react-icons/fa6"; // icons utk pagination
import dayjs from "dayjs";
import "dayjs/locale/id";
const ListPost = () => {
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [sortOrder, setSortOrder] = useState(localStorage.getItem("sortOrder") || "-published_at");
  const [itemsPerPage, setItemsPerPage] = useState(parseInt(localStorage.getItem("itemsPerPage"), 10) || 10);
  const [currentPage, setCurrentPage] = useState(parseInt(localStorage.getItem("currentPage"), 10) || 1);

  const fetchPosts = useCallback(async () => {
    const apiUrl = "https://suitmedia-backend.suitdev.com/api/ideas";
    const params = new URLSearchParams({
      "page[number]": currentPage,
      "page[size]": itemsPerPage,
      sort: sortOrder,
    });

    // Append each item in the array separately
    params.append("append", "small_image");
    params.append("append", "medium_image");

    const options = {
      headers: {
        Accept: "application/json",
      },
    };

    try {
      const response = await axios.get(`${apiUrl}?${params}`, options);

      // Logging the full request URL
      const fullRequestUrl = response.config.url;
      console.log("Request URL:", fullRequestUrl);

      if (response.data?.data) {
        setPosts(response.data.data);
        console.log("Response data:", response.data.data); // Log the posts here
        setTotalPosts(response.data.meta.total);
      }
    } catch (error) {
      console.error(`Error fetching posts:`, error);
    }
  }, [currentPage, itemsPerPage, sortOrder]);

  useEffect(() => {

    
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    localStorage.setItem("sortOrder", sortOrder);
    localStorage.setItem("itemsPerPage", itemsPerPage);
    localStorage.setItem("currentPage", currentPage);
  }, [sortOrder, itemsPerPage, currentPage]);

  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    setCurrentPage(1); // Reset to first page on sort change
    localStorage.setItem("sortOrder", newSortOrder);
    localStorage.setItem("currentPage", "1");
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page on items per page change
    localStorage.setItem("itemsPerPage", newItemsPerPage.toString());
    localStorage.setItem("currentPage", "1");
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const goToNextPage = () => {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));
  };

  /// new method
  const renderPagination = () => {
    let pages = [];
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + 3, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button key={i} disabled={i === currentPage} onClick={() => goToPage(i)} className={i === currentPage ? "active" : ""}>
          {i}
        </button>
      );
    }

    return pages;
  };
  const totalPages = Math.ceil(totalPosts / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalPosts);

  useEffect(() => {
    let timer = setTimeout(() => {
      console.log("timer finished!");
    }, 10);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="app__listPost-wrapper">
      <div className="app__listPost-filter">
        <div className="app__listPost-showing">
          Showing {startIndex} - {endIndex} of {totalPosts}
        </div>
        <div className="app_list-filterShowPage">
          <label htmlFor="itemsPerPage">Show per page:</label>
          <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="app_list-filterSort">
          <label htmlFor="sortOrder">Sort by:</label>
          <select id="sortOrder" value={sortOrder} onChange={handleSortChange}>
            <option value="-published_at">Newest</option>
            <option value="published_at">Oldest</option>
          </select>
        </div>
      </div>

      <div className="app__listPost-content">
        {posts.map((post) => (
          <div className="post" key={post.id}>
            {/* Check if medium_image array is not empty and then access its first element */}
            {post.medium_image && post.medium_image.length > 0 && <img src={post.medium_image[0].url} alt={post.title} loading="lazy" />}
            <div className="post-info">
              <p className="post-publishedAt">{dayjs(post.published_at).locale("id").format("D MMMM YYYY")} </p>
              {/* <p className="post-publishedAt">{new Date(post.published_at).toLocaleDateString()}</p> */}
              <h3 className="post-title">{post.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="app__listPost-pagination">
        <FaAnglesLeft onClick={goToFirstPage} className={currentPage === 1 ? "disabled" : ""} />
        <FaAngleLeft onClick={goToPreviousPage} className={currentPage === 1 ? "disabled" : ""} />
        {renderPagination()}
        <FaAngleRight onClick={goToNextPage} className={currentPage === totalPages ? "disabled" : ""} />
        <FaAnglesRight onClick={goToLastPage} className={currentPage === totalPages ? "disabled" : ""} />
      </div>
    </div>
  );
};

export default ListPost;
