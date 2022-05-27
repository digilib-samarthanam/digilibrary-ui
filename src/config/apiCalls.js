import React from "react";
import axios from "axios";

const success = (response) => {
  return response.data;
};

const error = (e) => {
  return Promise.reject(e);
};

export function HomePageBooksPDF(currentUserId) {
  return fetch(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/home_page_books?user_id=" +
      currentUserId +
      "&book_type=BOOK"
  );
}

export function readPDF(file_name) {
  return axios.get(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/download_url?file_name=" +
      file_name +
      ".pdf"
  );
}

export function recentlyAddedPDFPage() {
  return fetch(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/recently_added_books?book_type=BOOK"
  );
}

export function bookmarkedPDFPage(currentUserId) {
  return fetch(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/users/" +
      currentUserId +
      "/bookmarked_books?book_type=BOOK"
  );
}

export function viewedPDFPage(currentUserId) {
  return fetch(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/users/" +
      currentUserId +
      "/recently_viewed_books?book_type=BOOK"
  );
}

export function savePDFCall(requestBody, requestConfig) {
  return axios.post(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/bookmarked_books",
    requestBody,
    requestConfig
  );
}

export function recentlyViewedPDFCall(requestBody, requestConfig) {
  return axios.post(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/recently_viewed_books",
    requestBody,
    requestConfig
  );
}

export function HomePageBooksAudio(currentUserId) {
  return fetch(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/home_page_books?user_id=" +
      currentUserId +
      "&per_page=3&book_type=AUDIBLE"
  );
}

export function listenAudibles(file_name) {
  return axios.get(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/download_url?file_name=" +
      file_name +
      ".mp3"
  );
}

export function audioBookUrl(titleName) {
  return axios.get(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/search?bookType=AUDIBLE&book_name=" +
      titleName
  );
}

export function saveAudioCall(requestBody, requestConfig) {
  return axios.post(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/bookmarked_books",
    requestBody,
    requestConfig
  );
}

export function recentlyViewedAudioCall(requestBody, requestConfig) {
  return axios.post(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/recently_viewed_books",
    requestBody,
    requestConfig
  );
}

export function recentlyAddedAudioPage() {
  return fetch(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/recently_added_books?book_type=AUDIBLE"
  );
}

export function bookmarkedAudioPage(currentUserId) {
  return fetch(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/users/" +
      currentUserId +
      "/bookmarked_books?book_type=AUDIBLE"
  );
}

export function viewedAudioPage(currentUserId) {
  return fetch(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/users/" +
      currentUserId +
      "/recently_viewed_books?book_type=AUDIBLE"
  );
}

export function searchCall(searchBook) {
  return axios.get(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/search",
    {
      headers: { "Content-type": "application/json" },
      params: {
        any_book: searchBook,
      },
    }
  );
}

export function getAuthorList() {
  return fetch(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/authors"
  );
}

export function getCategoryList() {
  return fetch(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/book_categories?"
  );
}

export function getBulkUploadList() {
  return fetch(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/get_bulk_upload_files"
  );
}

export function postPdf(bookDetails, requestConfig) {
  return axios.post(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/books",
    bookDetails,
    requestConfig
  );
}

export function postAudioBook(bookDetailsAudio, requestConfig) {
  return axios.post(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/books",
    bookDetailsAudio,
    requestConfig
  );
}

export function editPdf(isbn, bookDetails, requestConfig) {
  return axios.put(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/books/" +
      isbn,
    bookDetails,
    requestConfig
  );
}

export function editAudibles(isbn, bookDetailsAudio, requestConfig) {
  return axios.put(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/books/" +
      isbn,
    bookDetailsAudio,
    requestConfig
  );
}

export function getSubCategories(category_id) {
  return axios.get(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/book_sub_categories/" +
      category_id
  );
}

export function getAllSubCategories() {
  return axios.get(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/book_sub_categories"
  );
}

export function getSubCategoryBooks(sub_category_id) {
  return axios.get(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/books/" +
      sub_category_id
  );
}

export function postBulkUploadFile(bulkUploadFile, requestConfig) {
  return axios.post(
    "http://ec2-52-66-201-52.ap-south-1.compute.amazonaws.com:5000/books/upload/" + bulkUploadFile,
    bulkUploadFile,
    requestConfig
  );
}
