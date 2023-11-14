import { useEffect, type FC, useState } from "react";
import type { Product } from "../../../interfaces/product";

interface ProductCrudProps {}

const ProductCrud: FC<ProductCrudProps> = ({}) => {
  const [formTitle, setFormTitle] = useState("Product form")
  const [products, setProducts] = useState<Product[] | null>(null);

  const getProducts = async () => {
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
      <form className="border border-success-subtle rounded-2 p-5 bg-dark d-flex flex-column gap-4">
        <h1 className="display-6 fw-lighter  bg-opacity-75">{formTitle}</h1>
        <div className="mb-3 d-flex gap-5 ">
          <div className="w-50">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-control bg-light-subtle"
            />
          </div>
          <div className="w-75 ">
            <label className="form-label">URL Image</label>
            <input
              type="text"
              name="urlImage"
              className="form-control bg-light-subtle"
            />
          </div>
        </div>
        <div className="w-100">
          <label className="form-label">Description</label>
          <textarea
            rows={3}
            name="description"
            className="form-control bg-light-subtle"
          />
        </div>
        <button
          type="button"
          className="btn bg-success-subtle text-success-emphasis w-100"
          id="submit"
        >
          Registrar producto
        </button>
      </form>

      <div className="mt-5">
        <table className="table">
          <thead>
            <tr>
              <th >#</th>
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
                  <td className="text-truncate" style={{maxWidth: 500}}>{product.description}</td>
                  <td className="text-truncate" style={{maxWidth: 120}}>{product.urlImage}</td>
                  <td className="d-flex gap-2">
                    <button className="btn bg-warning-subtle text-warning-emphasis ">
                      Edit
                    </button>
                    <button className="btn bg-danger-subtle text-danger-emphasis ">
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
