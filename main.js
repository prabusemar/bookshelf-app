const STORAGE_KEY = "BOOKSHELF_APPS";

let books = [];

function renderBooks() {
    const incompleteBookshelf = document.getElementById("list-of-incomplete-books");
    const completeBookshelf = document.getElementById("list-of-complete-books");

    incompleteBookshelf.innerHTML = "";
    completeBookshelf.innerHTML = "";

    let filteredBooks = books.filter((book) => {
        return book.title.toLowerCase().includes(search.value.toLowerCase());
    });

    filteredBooks.forEach((book) => {
        const bookItem = createBookItem(book);

        if (book.isComplete) {
            completeBookshelf.append(bookItem);
        } else {
            incompleteBookshelf.append(bookItem);
        }
    });
}

function addBook() {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = document.getElementById("year").value;
    const isComplete = document.getElementById("isComplete").value === "true";
    const id = +new Date();

    const newBook = {
        id,
        title,
        author,
        year,
        isComplete,
    };

    books.push(newBook);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    renderBooks();
}

function moveBook(bookId, targetShelf) {
    const bookIndex = books.findIndex((book) => book.id === bookId);
    const book = books[bookIndex];

    const updatedBook = {
        ...book,
        isComplete: targetShelf === "complete",
    };

    books[bookIndex] = updatedBook;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    renderBooks();
}

function createMoveButton(book) {
    const button = document.createElement("button");
    button.classList.add("move-button");
    button.innerText = book.isComplete ? "Pindah ke rak belum selesai dibaca" : "Pindah ke rak selesai dibaca";
    button.addEventListener("click", () => {
        const targetShelf = book.isComplete ? "incomplete" : "complete";
        moveBook(book.id, targetShelf);
    });
    return button;
}

function createBookItem(book) {
    const bookTitle = document.createElement("h4");
    bookTitle.classList.add("book-title");
    bookTitle.innerText = book.title;

    const bookAuthor = document.createElement("p");
    bookAuthor.classList.add("book-author");
    bookAuthor.innerText = "Penulis: " + book.author;

    const bookYear = document.createElement("p");
    bookYear.classList.add("book-year");
    bookYear.innerText = "Tahun: " + book.year;

    const bookDetails = document.createElement("div");
    bookDetails.classList.add("book-details");
    bookDetails.append(bookTitle, bookAuthor, bookYear);

    const bookAction = document.createElement("div");
    bookAction.classList.add("book-action");

    const editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.innerText = "Edit";
    editButton.addEventListener("click", () => {
        window.location.replace(`edit-book.html?id=${book.id}`);
    });
    bookAction.append(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerText = "Hapus";
    deleteButton.addEventListener("click", () => {
        showDialog(book.id);
    });
    bookAction.append(deleteButton);

    const moveButton = createMoveButton(book);
    bookAction.append(moveButton);

    const bookItem = document.createElement("li");
    bookItem.classList.add("book-item");
    bookItem.dataset.id = book.id;
    bookItem.append(bookDetails, bookAction);

    return bookItem;
}



function showDialog(bookId) {
    const book = books.find((book) => book.id === bookId);
    const dialogMessage = document.getElementById("dialog-message");
    dialogMessage.innerText = `Anda yakin ingin menghapus buku '${book.title}'?`;

    const cancelButton = document.getElementById("cancel-button");
    cancelButton.addEventListener("click", hideDialog);

    const confirmButton = document.getElementById("confirm-button");
    confirmButton.addEventListener("click", () => {
        deleteBook(bookId);
        hideDialog();
    });

    const dialogContainer = document.getElementById("dialog-container");
    dialogContainer.style.display = "block";

    const overlay = document.getElementById("overlay");
    overlay.style.display = "block";
}

function hideDialog() {
    const dialogContainer = document.getElementById("dialog-container");
    dialogContainer.style.display = "none";

    const overlay = document.getElementById("overlay");
    overlay.style.display = "block";
}

function deleteBook(bookId) {
    books = books.filter((book) => book.id !== bookId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    renderBooks();
}

function editBook(bookId) {
    const book = books.find((book) => book.id === bookId);
    const title = prompt("Masukkan judul buku", book.title);
    const author = prompt("Masukkan penulis buku", book.author);
    const year = prompt("Masukkan tahun terbit buku", book.year);

    if (title && author && year) {
        const updatedBook = {
            ...book,
            title,
            author,
            year,
        };

        const bookIndex = books.findIndex((book) => book.id === bookId);
        books[bookIndex] = updatedBook;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
        renderBooks();

    }
}

function initStorage() {
    const booksData = localStorage.getItem(STORAGE_KEY);

    if (booksData) {
        books = JSON.parse(booksData);
        renderBooks();
    }
}

const search = document.getElementById("search");
search.addEventListener("input", renderBooks);

const form = document.getElementById("add-book-form");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook();
    form.reset();
});

const cancelButton = document.getElementById("cancel-button");
cancelButton.addEventListener("click", hideDialog);

initStorage();
