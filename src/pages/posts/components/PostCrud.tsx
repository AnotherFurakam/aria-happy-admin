import { useState, type FC, type ChangeEvent, type FormEvent, useEffect } from 'react';

interface PostCrudProps {}

const PostCrud: FC<PostCrudProps> = ({}) => {
  const [formTitle, setFormTitle] = useState("Post form");
  const [products, setProducts] = useState<Post[] | null>(null);
  const [form, setForm] = useState<PostForm>({
    title: "",
    body: "",
    urlImage: "",
  });
  const [isEditForm, setIsEditForm] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);

  const editForm = (idPost: string) => {
    const productForEdit = products?.find(
      (post) => post.idPost === idPost
    );
    if (productForEdit) {
      setForm(productForEdit);
      setIsEditForm(true);
      setFormTitle("Editing post");
      setEditProductId(idPost);
    }
  };

  const cancelEditForm = () => {
    setForm({
      title: "",
      body: "",
      urlImage: "",
    });
    setIsEditForm(false);
    setFormTitle("Post form");
    setEditProductId(null);
  };

  const clearForm = () => {
    setForm({
      title: "",
      body: "",
      urlImage: "",
    });
    setEditProductId(null);
  };

  const handleForm = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    const inputName = e.target.name;
    setForm({
      ...form,
      [inputName]: value,
    });
  };

  const handleDelete = (idPost: string) => {
    fetch(`https://samamander-api.onrender.com/api/post/${idPost}`, {
      method: "DELETE",
    })
      .then(() => getProducts())
      .catch(() => alert("Error al eliminar el producto"));
  };

  const handleSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEditForm) {
      fetch("https://samamander-api.onrender.com/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then((res) => {
          clearForm();
          getProducts();
        })
        .catch(() => alert("Error al registrar el producto"));
    } else {
      fetch(
        `https://samamander-api.onrender.com/api/post/${editProductId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      )
        .then((res) => res.json())
        .then((res) => {
          clearForm();
          cancelEditForm();
          getProducts();
        })
        .catch(() => alert("Error al registrar el producto"));
    }
  };

  const getProducts = async () => {
    setProducts(null);
    const productResponse = await fetch(
      "https://samamander-api.onrender.com/api/post?pageNumber=1&pageSize=100"
    ).then((res) => res.json());
    setProducts(productResponse.data);
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <main className="container my-5  ">
      <form
        className="border border-success-subtle rounded-2 p-5 bg-dark d-flex flex-column gap-4"
        onSubmit={(e) => handleSubmitForm(e)}
      >
        <h1 className="display-6 fw-lighter  bg-opacity-75">{formTitle}</h1>
        <div className="mb-3 d-flex gap-5 ">
          <div className="w-50">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              className="form-control bg-light-subtle"
              autoComplete="off"
              onChange={(e) => handleForm(e)}
              value={form.title}
              required
            />
          </div>
          <div className="w-75 ">
            <label className="form-label">URL Image</label>
            <input
              type="text"
              name="urlImage"
              className="form-control bg-light-subtle"
              autoComplete="off"
              onChange={(e) => handleForm(e)}
              value={form.urlImage}
              required
            />
          </div>
        </div>
        <div className="w-100">
          <label className="form-label">Body</label>
          <textarea
            rows={3}
            name="body"
            className="form-control bg-light-subtle"
            onChange={(e) => handleForm(e)}
            value={form.body}
            required
          />
        </div>
        <div className="d-flex gap-3 ">
          <button
            type="submit"
            className={
              isEditForm
                ? "btn bg-warning-subtle text-warning-emphasis w-100"
                : "btn bg-success-subtle text-success-emphasis w-100"
            }
            id="submit"
          >
            {isEditForm ? "Actualizar" : "Registrar post"}
          </button>
          {isEditForm ? (
            <button
              className="btn bg-danger-subtle text-danger-emphasis w-100"
              type="submit"
              onClick={cancelEditForm}
            >
              Cancelar
            </button>
          ) : (
            <></>
          )}
        </div>
      </form>

      <div className="mt-5">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Body</th>
              <th>URL Image</th>
              <th className="">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((post, index) => (
                <tr key={post.idPost}>
                  <th>{index + 1}</th>
                  <td>{post.title}</td>
                  <td className="text-truncate" style={{ maxWidth: 500 }}>
                    {post.body}
                  </td>
                  <td className="text-truncate" style={{ maxWidth: 120 }}>
                    {post.urlImage}
                  </td>
                  <td className="d-flex gap-2">
                    <button
                      className="btn bg-warning-subtle text-warning-emphasis "
                      onClick={() => editForm(post.idPost)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn bg-danger-subtle text-danger-emphasis "
                      onClick={() => handleDelete(post.idPost)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-center ">
          {!products && <span className="spinner-grow"></span>}
        </div>
      </div>
    </main>)
}
export default PostCrud;