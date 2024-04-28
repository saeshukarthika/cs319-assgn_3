import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import './App.css';
import "bootstrap/dist/css/bootstrap.css";


function App() {
  const Navbar = () => {
    const navigate = useNavigate();

    return(
      <div>
        <nav class="navbar navbar-expand-lg bg-dark">
          <div class="container-fluid">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link text-light" href="/products">View Products</a>
              </li>
              <li class="nav-item">
                <a class="nav-link text-light" href="/productsbyid">Search by ID</a>
              </li>
              <li class="nav-item">
                <a class="nav-link text-light" href="/createproduct">Create Product</a>
              </li>
              <li class="nav-item">
                <a class="nav-link text-light" href="/updateproduct">Update Product</a>
              </li>
              <li class="nav-item">
                <a class="nav-link text-light" href="/deleteproduct">Delete Product</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  } 

  const Products = () => {
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
      fetch("http://localhost:8081/listProducts")
      .then((response) => response.json())
      .then((data) => {
          console.log("Show Catalog of Products :", data);
          setProducts(data);
      });
    }, []);

    return (
    <div>
      <Navbar />
      <div class= "container container-margin">
        <h1>Product Catalog</h1>
        <div class="row">
        {products.map((el) => (
              <div class="col-md-3"> 
              <div class="card container-margin" key={el.id} style={{height: 350}}>
                  <img class="card-img-top" src={el.image} alt="product" style={{width: 100}}/>
                  <div class="card-body">
                    <div>Title: {el.title}</div>
                    <div>Category: {el.category}</div>
                    <div>Price: {el.price}</div>
                    <div>Rating: {el.rating.rate}</div>
                  </div>
                </div>
              </div>
          ))}
        </div>
      </div>
    </div>  
    )
  }

  const ProductsById = () => {
    const [product, setProduct] = useState([]);
    const [id, setId] = useState("");

    useEffect(() => {
      if (id) {
        fetch(`http://localhost:8081/listProducts/${id}`)
        .then((response) => response.json())
        .then((data) => {
            console.log("Show Catalog of Products :", data);
            setProduct(data);
        });
      }
    }, [id]);

    return (
      <div>
        <Navbar />
        <div class="container container-margin">
          <h1>Search by ID</h1>
          <form>
            <input class="form-control" type="text" placeholder="Enter ID" onChange={(e) => setId(e.target.value)} />
          </form>

          <div class="row">
            {product.map((el) => (
              <div class="col-md-3"> 
              <div class="card container-margin" key={el.id} style={{height: 350}}>
                  <img class="card-img-top" src={el.image} alt="product" style={{width: 100}}/>
                  <div class="card-body">
                    <div>Title: {el.title}</div>
                    <div>Category: {el.category}</div>
                    <div>Price: {el.price}</div>
                    <div>Rating: {el.rating.rate}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>  
      )

  }

  const CreateProduct = () => {
    const [product, setProduct] = useState([]);
    const [id, setId] = useState("");
    const [productData, setProductData] = useState({});
    
    useEffect(() => {
      if (id) {
        fetch(`https://fakestoreapi.com/products/${id}`)
        .then((response) => response.json())
        .then((data) => {
            console.log("Show Catalog of Products :", data);
            setProduct(data);
            setProductData(JSON.stringify(data));
        });
      }
    }, [id]);

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(e.target.value);
      fetch("http://localhost:8081/addProduct", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: productData
      })
      .then(response => {
          if (response.status != 200){
              return response.json()
      .then(errData =>{
          throw new Error(`POST response was not ok :\n Status:${response.status}. \n Error: ${errData.error}`);
      })
      }
      return response.json();})
      .then(data => {
          console.log(data);
          alert("Item added successfully!");
      })
      .catch(error => {
          console.error('Error adding item:', error);
          alert('Error adding item:'+error.message); // Display alert if there's an error
      });
    }

    return (
    <div>
      <Navbar/>
      <div class="container container-margin">
        <h1>Create a New Product by ID</h1>
        <form onSubmit={handleSubmit}>
            <input class="form-control" type="text" placeholder="Enter ID" onChange={(e) => setId(e.target.value)} />
            <button class="btn btn-success" type="submit">Submit</button>
        </form>
      
        <div class="row">
          {product.id != undefined && (
            <div class="col-md-3"> 
              <div class="card container-margin" key={product.id} style={{height: 350}}>
                  <img class="card-img-top" src={product.image} alt="product" style={{width: 100}}/>
                  <div class="card-body">
                    <div>Title: {product.title}</div>
                    <div>Category: {product.category}</div>
                    <div>Price: {product.price}</div>
                    <div>Rating: {product.rating.rate}</div>
                  </div>
                </div>
              </div>
          )}
        </div>  
      </div>  
    </div>  
    )
  }
  
  const UpdateProduct = () => {
    const [product, setProduct] = useState([]);
    const [id, setId] = useState("");
    const [price, setPrice] = useState(0);
    
    useEffect(() => {
      if (id) {
        fetch(`http://localhost:8081/listProducts/${id}`)
        .then((response) => response.json())
        .then((data) => {
            console.log("Show Catalog of Products :", data);
            setProduct(data);
        });
      }
    }, [id]);

    const handleSubmit = (e) => {
      e.preventDefault();

      console.log(e.target.value);
      fetch(`http://localhost:8081/updateProduct/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({"price": price})
      })
      .then(response => {
          if (response.status != 200){
              return response.json()
      .then(errData =>{
          throw new Error(`PUT response was not ok :\n Status:${response.status}. \n Error: ${errData.error}`);
      })
      }
      return response.json();})
      .then(data => {
          console.log(data);
          alert("Item updated successfully!");
      })
      .catch(error => {
          console.error('Error updating item:', error);
          alert('Error updating item:'+error.message); // Display alert if there's an error
      });
    }

    return (
    <div>
      <Navbar/>
      <div class="container container-margin">
        <h1>Update a Product by ID</h1>
        <form onSubmit={handleSubmit}>
            <input class="form-control" type="text" placeholder="Enter ID" onChange={(e) => setId(e.target.value)} />
            <input class="form-control" type="number" placeholder="Enter Price" onChange={(e) => setPrice(e.target.value)} />
            <button class="btn btn-success" type="submit">Submit</button>
        </form>
      
        <div class="row">
            {product.map((el) => (
              <div class="col-md-3"> 
              <div class="card container-margin" key={el.id} style={{height: 350}}>
                  <img class="card-img-top" src={el.image} alt="product" style={{width: 100}}/>
                  <div class="card-body">
                    <div>Title: {el.title}</div>
                    <div>Category: {el.category}</div>
                    <div>Price: {el.price}</div>
                    <div>Rating: {el.rating.rate}</div>
                  </div>
                </div>
              </div>
            ))}
        </div>  
      </div>  
    </div>  
    )
  }

  const DeleteProduct = () => {
    const [product, setProduct] = useState([]);
    const [id, setId] = useState("");

    
    useEffect(() => {
      if (id) {
        fetch(`http://localhost:8081/listProducts/${id}`)
        .then((response) => response.json())
        .then((data) => {
            console.log("Show Catalog of Products :", data);
            setProduct(data);
        });
      }
    }, [id]);

    const handleSubmit = (e) => {
      e.preventDefault();

      console.log(e.target.value);
      fetch(`http://localhost:8081/deleteProduct/${id}`, {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(
            { "id":id}
        )
      })
      .then(response => {
          if (response.status != 200){
              return response.json()
      .then(errData =>{
          throw new Error(`PUT response was not ok :\n Status:${response.status}. \n Error: ${errData.error}`);
      })
      }
      return response.json();})
      .then(data => {
          console.log(data);
          alert("Item deleted successfully!");
      })
      .catch(error => {
          console.error('Error deleting item:', error);
          alert('Error deleting item:'+error.message); // Display alert if there's an error
      });
    }

    return (
    <div>
      <Navbar/>
      <div class="container container-margin">
        <h1>Delete a Product by ID</h1>
        <form onSubmit={handleSubmit}>
            <input class="form-control" type="text" placeholder="Enter ID" onChange={(e) => setId(e.target.value)} />
            <button class="btn btn-success" type="submit">Submit</button>
        </form>
      
        <div class="row">
            {product.map((el) => (
              <div class="col-md-3"> 
              <div class="card container-margin" key={el.id} style={{height: 350}}>
                  <img class="card-img-top" src={el.image} alt="product" style={{width: 100}}/>
                  <div class="card-body">
                    <div>Title: {el.title}</div>
                    <div>Category: {el.category}</div>
                    <div>Price: {el.price}</div>
                    <div>Rating: {el.rating.rate}</div>
                  </div>
                </div>
              </div>
            ))}
        </div>  
      </div>  
    </div>  
    )
  }
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/products" element={<Products />} />
        <Route path="/productsbyid" element={<ProductsById />} />
        <Route path="/createproduct" element={<CreateProduct />} />
        <Route path="/updateproduct" element={<UpdateProduct />} />
        <Route path="/deleteproduct" element={<DeleteProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
