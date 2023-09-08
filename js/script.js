const inputBookTitle = document.getElementById('inputBookTitle');
const inputBookAuthor = document.getElementById('inputBookAuthor');
const inputBookYear = document.getElementById('inputBookYear');
const inputBookIsComplete = document.getElementById('inputBookIsComplete');
const bookSubmit = document.getElementById('bookSubmit');
const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
const completeBookshelfList = document.getElementById('completeBookshelfList');
const sapaNamaUser = document.getElementById('sapaNamaUser');
const sapaSubmit = document.getElementById('sapaSubmit');
const sapaSection = document.querySelector('.sapa_section');


const books = JSON.parse(localStorage.getItem('books')) || [];

function sapaPengguna() {
    const namaUser = sapaNamaUser.value.trim();
  
    if (namaUser !== '') {
      sessionStorage.setItem('namaUser', namaUser);
  
      const sapaH2 = document.createElement('h2');
      sapaH2.innerText = `Halo, ${namaUser}!`;
      sapaSection.replaceChild(sapaH2, sapaSection.querySelector('h2'));
  
      const form = document.getElementById('sapaUser');
      form.style.display = 'none';
    } else {
      alert('Silakan masukkan nama Anda terlebih dahulu.');
    }
  }
  
  const namaUserSession = sessionStorage.getItem('namaUser');
  if (namaUserSession) {
    const sapaH2 = document.createElement('h2');
    sapaH2.innerText = `Halo, ${namaUserSession}!`;
    sapaSection.replaceChild(sapaH2, sapaSection.querySelector('h2'));
  
    const form = document.getElementById('sapaUser');
    form.style.display = 'none';
  } else {
    sapaSubmit.addEventListener('click', function (e) {
      e.preventDefault();
      sapaPengguna();
    });
  }

function renderBook(book, isComplete) {
  const bookItem = document.createElement('div');
  bookItem.classList.add('book_item');
  const bookInfo = document.createElement('div');
  bookInfo.classList.add('book_info');
  bookInfo.innerHTML = `
    <h3>${book.title}</h3>
    <p>Penulis: ${book.author}</p>
    <p>Tahun: ${book.year}</p>
  `;
  const actionContainer = document.createElement('div');
  actionContainer.classList.add('action_container');
  
  const moveButton = document.createElement('button');
  moveButton.innerText = isComplete ? 'Pindahkan ke Belum Selesai Dibaca' : 'Pindahkan ke Selesai Dibaca';
  moveButton.classList.add('primary-button');
  moveButton.addEventListener('click', () => {
    moveBook(book);
    renderBooks();
  });
  
  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Hapus';
  deleteButton.classList.add('delete-button');
  deleteButton.addEventListener('click', () => {
    deleteBook(book);
    renderBooks();
  });
  
  actionContainer.appendChild(moveButton);
  actionContainer.appendChild(deleteButton);
  
  bookItem.appendChild(bookInfo);
  bookItem.appendChild(actionContainer);
  
  if (isComplete) {
    completeBookshelfList.appendChild(bookItem);
  } else {
    incompleteBookshelfList.appendChild(bookItem);
  }
}

function moveBook(book) {
  book.isComplete = !book.isComplete;
  saveBooks();
}

function deleteBook(book) {
  const bookIndex = books.findIndex((item) => item.id === book.id);
  if (bookIndex !== -1) {
    // Menampilkan dialog konfirmasi sebelum menghapus buku
    const confirmDelete = confirm(`Anda yakin ingin menghapus buku "${book.title}"?`);
    if (confirmDelete) {
        books.splice(bookIndex, 1);
        saveBooks();
        renderBooks();
    }
  }
}

function saveBooks() {
  localStorage.setItem('books', JSON.stringify(books));
}

function renderBooks() {
  incompleteBookshelfList.innerHTML = '';
  completeBookshelfList.innerHTML = '';
  
  for (const book of books) {
    renderBook(book, book.isComplete);
  }
}

const searchForm = document.getElementById('searchBook');
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
  filterBooksByTitle(searchTitle);
});

function filterBooksByTitle(title) {
    const filteredIncompleteBooks = books.filter((book) =>
      !book.isComplete && book.title.toLowerCase().includes(title)
    );
  
    const filteredCompleteBooks = books.filter((book) =>
      book.isComplete && book.title.toLowerCase().includes(title)
    );
  
    renderFilteredBooks(filteredIncompleteBooks, filteredCompleteBooks);
  }
  
  function renderFilteredBooks(filteredIncompleteBooks, filteredCompleteBooks) {
    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';
  
    for (const book of filteredIncompleteBooks) {
      renderBook(book, false);
    }
  
    for (const book of filteredCompleteBooks) {
      renderBook(book, true);
    }
  }
  

bookSubmit.addEventListener('click', (e) => {
  e.preventDefault();
  
  const title = inputBookTitle.value;
  const author = inputBookAuthor.value;
  const year = parseInt(inputBookYear.value);
  const isComplete = inputBookIsComplete.checked;
  
  if (title && author && year) {
    const book = {
      id: +new Date(),
      title,
      author,
      year,
      isComplete,
    };
    books.push(book);
    saveBooks();
    
    inputBookTitle.value = '';
    inputBookAuthor.value = '';
    inputBookYear.value = '';
    inputBookIsComplete.checked = false;
    
    renderBooks();
  }
});

renderBooks();