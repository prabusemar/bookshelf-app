const STORAGE_KEY = "BOOKSHELF_APPS";

let books = [];

function getBookById(bookId) {
    return books.find((book) => book.id === bookId);
}

function saveChanges(updatedBook) {
    const bookIndex = books.findIndex((book) => book.id === updatedBook.id);
    books[bookIndex] = updatedBook;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    alert("Buku berhasil diubah!");
    window.location.href = "index.html";
}

function renderForm(book) {
    const form = document.getElementById("edit-book-form");
    const titleInput = document.getElementById("title");
    const authorInput = document.getElementById("author");
    const yearInput = document.getElementById("year");

    titleInput.value = book.title;
    authorInput.value = book.author;
    yearInput.value = book.year;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const updatedBook = {
            ...book,
            title: titleInput.value,
            author: authorInput.value,
            year: yearInput.value,
        };

        saveChanges(updatedBook);
    });
}

function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get("id");

    const booksData = localStorage.getItem(STORAGE_KEY);
    books = JSON.parse(booksData);

    const book = getBookById(+bookId);
    renderForm(book);
}

init();
