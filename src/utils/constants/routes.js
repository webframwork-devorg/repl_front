const routes = {
  auth: "/auth",
  home: "/",
  list: "/list/:id",
  editList: "/edit/list",
  error: "*",
  edit: "/edit",
  bookAdd: "/list/:id/book/add", 
  book: "/list/:id/book/:bookId",
};

export default routes;
