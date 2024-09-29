// Kunci untuk menyimpan data di localStorage
const STORAGE_KEY = 'BOOKSHELF_APPS';

// Fungsi untuk memeriksa dukungan localStorage
function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

// Fungsi untuk menyimpan data ke localStorage
function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
    }
}

// Fungsi untuk memuat data dari localStorage
function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        books = data;
    }

    document.dispatchEvent(new Event("ondataloaded"));
}

// Array untuk menyimpan buku
let books = [];

// Fungsi untuk menambahkan buku baru
function addBook() {
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = parseInt(document.getElementById('bookFormYear').value);
    const isComplete = document.getElementById('bookFormIsComplete').checked;

    const id = +new Date(); // Menggunakan timestamp sebagai ID
    const newBook = { id, title, author, year, isComplete };

    books.push(newBook);

    document.dispatchEvent(new Event("onbookchanged"));
    saveData();
}

// Fungsi untuk mencari buku
function findBook(bookId) {
    for (const book of books) {
        if (book.id === bookId) {
            return book;
        }
    }
    return null;
}

// Fungsi untuk menghapus buku
function removeBook(bookId) {
    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        document.dispatchEvent(new Event("onbookchanged"));
        saveData();
    }
}

// Fungsi untuk memindahkan buku antar rak
function moveBook(bookId) {
    const book = findBook(bookId);
    if (book) {
        book.isComplete = !book.isComplete;
        document.dispatchEvent(new Event("onbookchanged"));
        saveData();
    }
}

// Fungsi untuk mengedit buku
function editBook(bookId) {
    const book = findBook(bookId);
    if (book) {
        document.getElementById('editBookId').value = book.id;
        document.getElementById('editBookTitle').value = book.title;
        document.getElementById('editBookAuthor').value = book.author;
        document.getElementById('editBookYear').value = book.year;
        document.getElementById('editBookIsComplete').checked = book.isComplete;

        document.getElementById('editBookModal').style.display = 'block';
    }
}

// Fungsi untuk membuat elemen buku
// Fungsi untuk membuat elemen buku
function makeBookElement(book) {
    const bookItem = document.createElement('div');
    bookItem.setAttribute('data-bookid', book.id);
    bookItem.setAttribute('data-testid', 'bookItem');

    const title = document.createElement('h3');
    title.setAttribute('data-testid', 'bookItemTitle');
    title.innerText = book.title;

    const author = document.createElement('p');
    author.setAttribute('data-testid', 'bookItemAuthor');
    author.innerText = `Penulis: ${book.author}`;

    const year = document.createElement('p');
    year.setAttribute('data-testid', 'bookItemYear');
    year.innerText = `Tahun: ${book.year}`;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    const toggleButton = document.createElement('button');
    toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    toggleButton.innerText = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
    toggleButton.addEventListener('click', function () {
        moveBook(book.id);
    });

    // Menggunakan ikon untuk tombol hapus
    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.addEventListener('click', function () {
        removeBook(book.id);
    });

    // Menggunakan ikon untuk tombol edit
    const editButton = document.createElement('button');
    editButton.setAttribute('data-testid', 'bookItemEditButton');
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.addEventListener('click', function () {
        editBook(book.id);
    });

    // Menambahkan kelas CSS untuk menyusun ikon
    const iconButtons = document.createElement('div');
    iconButtons.classList.add('icon-buttons');
    iconButtons.append(deleteButton, editButton);

    buttonContainer.append(toggleButton, iconButtons);
    bookItem.append(title, author, year, buttonContainer);

    return bookItem;
}


// Fungsi untuk merender buku ke rak
function renderBooks(booksToRender = books) {
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');

    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    let hasIncompleteBooks = false;
    let hasCompleteBooks = false;

    for (const book of booksToRender) {
        const bookElement = makeBookElement(book);
        if (book.isComplete) {
            completeBookList.append(bookElement);
            hasCompleteBooks = true;
        } else {
            incompleteBookList.append(bookElement);
            hasIncompleteBooks = true;
        }
    }

    if (!hasIncompleteBooks) {
        const noDataMessage = document.createElement('p');
        noDataMessage.innerText = 'Tidak ada data buku';
        incompleteBookList.append(noDataMessage);
    }

    if (!hasCompleteBooks) {
        const noDataMessage = document.createElement('p');
        noDataMessage.innerText = 'Tidak ada data buku';
        completeBookList.append(noDataMessage);
    }
}


// Fungsi untuk mencari buku
function searchBooks(keyword) {
    return books.filter(book =>
        book.title.toLowerCase().includes(keyword.toLowerCase())
    );
}

// Event listener untuk form submit
document.getElementById('bookForm').addEventListener('submit', function (e) {
    e.preventDefault();
    addBook();
    this.reset();
});

// Event listener untuk form pencarian
document.getElementById('searchBook').addEventListener('submit', function (e) {
    e.preventDefault();
    const keyword = document.getElementById('searchBookTitle').value;
    const searchResult = searchBooks(keyword);
    renderBooks(searchResult);
});

// Event listener untuk form edit
document.getElementById('editBookForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const bookId = parseInt(document.getElementById('editBookId').value);
    const book = findBook(bookId);
    if (book) {
        book.title = document.getElementById('editBookTitle').value;
        book.author = document.getElementById('editBookAuthor').value;
        book.year = parseInt(document.getElementById('editBookYear').value);
        book.isComplete = document.getElementById('editBookIsComplete').checked;

        document.dispatchEvent(new Event("onbookchanged"));
        saveData();
        document.getElementById('editBookModal').style.display = 'none';
    }
});

// Event listener untuk perubahan buku
document.addEventListener("onbookchanged", () => {
    renderBooks();
});

// Event listener untuk data yang dimuat
document.addEventListener("ondataloaded", () => {
    renderBooks();
});

// Memuat data saat halaman dimuat
window.addEventListener("load", () => {
    loadDataFromStorage();
});

// Modal help
var helpModal = document.getElementById("helpModal");
var helpBtn = document.getElementById("helpButton");
var helpSpan = document.querySelector('#helpModal .close');

helpBtn.onclick = function () {
    helpModal.style.display = "block";
}

helpSpan.onclick = function () {
    helpModal.style.display = "none";
}

// Modal edit
var editModal = document.getElementById("editBookModal");
var editSpan = document.querySelector('#editBookModal .close');

editSpan.onclick = function () {
    editModal.style.display = "none";
}

// When the user clicks anywhere outside of the modals, close them
window.onclick = function (event) {
    if (event.target == helpModal) {
        helpModal.style.display = "none";
    }
    if (event.target == editModal) {
        editModal.style.display = "none";
    }
}
