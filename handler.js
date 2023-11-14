const books = require ('./books');
const {nanoid} = require ('nanoid');

const addBook = (request,h)=>{
    const{ 
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading,
    } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    if(readPage>pageCount){
        const response = h.response({
            status:'fail',
            message:'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
        return response;
    }

    const newBook ={
        id,
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading,
        finished,
        insertedAt,
        updatedAt,
    };

    if(name===undefined){
        const response = h.response({
            status: 'fail',
            message:'Gagal menambahkan buku. Mohon isi nama buku',
        })
        response.code(400);
        return response;
    }

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length>0;

    if(isSuccess){
        const response = h.response({
            status:'success',
            message:'Buku berhasil ditambahkan',
            data:{
                bookId: id,
            },
        }).code(201);
        return response;
    }

    const response = h.response({
        status:'fail',
        message:'Buku gagal ditambahkan',
    }).code(500);
    return response;
};


const getBooks=(request,h)=>{
    const{name,reading,finished}=request.query;
    let filterBooks = books;

    if(name){
        filterBooks = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (reading !== undefined) {
        filterBooks = filterBooks.filter((book) => book.reading === !!Number(reading)).splice(0, 2);
    }
    
    if (finished !== undefined) {
        filterBooks = filterBooks.filter((book) => book.finished === !!Number(finished)).splice(0, 3);
    } 
    
    else if (finished) {
        filterBooks = filterBooks.filter((book) => book.finished === false).splice(0, 1);
    }

    const response = h.response({
        status:'success',
        data: {
            books: filterBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            }))
        }
    }).code(200);
    return response;
}

const getBookById= (request,h) => {
    const {id} = request.params;
    const book = books.filter((b) => b.id === id)[0];

    if(book){
        const response = h.response({
            status:'success',
            data:{
                book,
            },
        }).code(200);
        return response;
    }

        const response = h.response({
            status:'fail',
            message: 'Buku tidak ditemukan',
        }).code(404);
        return response;
    }

    const updateBookById=(request,h) =>{
        const {id} = request.params;
        const {
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
        } = request.payload;

        if(name===undefined){
            const response = h.response({
                status:'fail',
                message:'Gagal memperbarui buku. Mohon isi nama buku',
            }).code(400);
            return response;
        }

        if(readPage > pageCount){
            const response = h.response({
                status:'fail',
                message:'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            }).code(400);
            return response;
        }
        const updatedAt = new Date().toISOString();
        const index = books.findIndex((book) => book.id===id);

        if(index!==-1){
            books[index]={
                ...books[index],
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                reading,
                updatedAt,
            };
            const response=h.response({
                status:'success',
                message:'Buku berhasil diperbarui',
            }).code(200);
            return response;
        }

        const response = h.response({
            status:'fail',
            message:'Gagal memperbarui buku. Id tidak ditemukan',
        }).code(404);
        return response;
    }

    const deleteBookById = (request,h) =>{
        const {id} = request.params;
        const index= books.findIndex((book) =>book.id === id );

        if(index !== -1){
            books.splice(index,1)
                const response = h.response({
                    status:'success',
                    message:'Buku berhasil dihapus',
                }).code(200);
                return response;
            }
        const response = h.response ({
            status: 'fail',
            message:'Buku gagal dihapus. Id tidak ditemukan',
        }).code(404);
        return response;
    };

module.exports={addBook, getBooks, getBookById, updateBookById, deleteBookById};
