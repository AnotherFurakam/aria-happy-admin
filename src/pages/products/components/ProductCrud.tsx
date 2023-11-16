import {
  useEffect,
  type FC,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type { Product, ProductForm } from "../../../interfaces/product";

interface ProductCrudProps {}

const ProductCrud: FC<ProductCrudProps> = ({}) => {
  const [formTitle, setFormTitle] = useState("Product form");
  const [products, setProducts] = useState<Product[] | null>(null);
  const [form, setForm] = useState<ProductForm>({
    name: "",
    urlImage: "",
    description: "",
  });
  const [isEditForm, setIsEditForm] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);

  const editForm = (idProduct: string) => {
    const productForEdit = products?.find(
      (product) => product.idProduct === idProduct
    );
    if (productForEdit) {
      setForm(productForEdit);
      setIsEditForm(true);
      setFormTitle("Editing product");
      setEditProductId(idProduct);
    }
  };

  const cancelEditForm = () => {
    setForm({
      name: "",
      urlImage: "",
      description: "",
    });
    setIsEditForm(false);
    setFormTitle("Product form");
    setEditProductId(null);
  };

  const clearForm = () => {
    setForm({
      name: "",
      urlImage: "",
      description: "",
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

  const handleDelete = (idProduct: string) => {
    fetch(`https://samamander-api.onrender.com/api/product/${idProduct}`, {
      method: "DELETE",
    })
      .then(() => getProducts())
      .catch(() => alert("Error al eliminar el producto"));
  };

  const handleSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEditForm) {
      fetch("https://samamander-api.onrender.com/api/product", {
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
        `https://samamander-api.onrender.com/api/product/${editProductId}`,
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
      "https://samamander-api.onrender.com/api/product?pageNumber=1&pageSize=100"
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
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-control bg-light-subtle"
              autoComplete="off"
              onChange={(e) => handleForm(e)}
              value={form.name}
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
          <label className="form-label">Description</label>
          <textarea
            rows={3}
            name="description"
            className="form-control bg-light-subtle"
            onChange={(e) => handleForm(e)}
            value={form.description}
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
            {isEditForm ? "Actualizar" : "Registrar producto"}
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
              <th>Name</th>
              <th>Description</th>
              <th>URL Image</th>
              <th className="">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((product, index) => (
                <tr key={product.idProduct}>
                  <th>{index + 1}</th>
                  <td>{product.name}</td>
                  <td className="text-truncate" style={{ maxWidth: 500 }}>
                    {product.description}
                  </td>
                  <td className="text-truncate" style={{ maxWidth: 120 }}>
                    {product.urlImage}
                  </td>
                  <td className="d-flex gap-2">
                    <button
                      className="btn bg-warning-subtle text-warning-emphasis "
                      onClick={() => editForm(product.idProduct)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn bg-danger-subtle text-danger-emphasis "
                      onClick={() => handleDelete(product.idProduct)}
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
    </main>
  );
};
export default ProductCrud;
