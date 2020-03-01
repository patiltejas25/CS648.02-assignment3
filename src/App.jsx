

class ProductTable extends React.Component {
  render() {
    const productRows = this.props.products.map(product =>
      <ProductRow key={product.id} product={product} />
    );
    return (
      <div>
        <p> Showing all available products Hee</p> <hr/>
        <table className="bordered-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {productRows}
          </tbody>
        </table>
      </div>
    );
  }
}

class ProductRow extends React.Component {
  render() {
    const product = this.props.product;
    return (
      <tr>
        <td>{product.name}</td>
        <td>${product.price}</td>
        <td>{product.category}</td>
        <td><a href={product.image} target="_blank">View</a></td>
      </tr>
    );
  }
}



class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.productAdd;
    const product = {
      category: form.category.value,
      price: form.price.value.slice(1),
      name: form.name.value,
      image: form.image.value
    }
    this.props.addProduct(product);

  }
  render() {
    return (
      <section>
      <p>Add a new product to inventory</p>
      <hr/>
      <form name = "productAdd" onSubmit={this.handleSubmit}>
        <div className="product-inventory">
          <label>Category:</label>
          <select name="category" id="category">
            <option value="Accessories">Accessories</option>
            <option value="Shirts">Shirts</option>
            <option value="Jeans">Jeans</option>
            <option value="Jackets">Jackets</option>
            <option value="Sweaters">Sweaters</option>
          </select>
        </div>
        <div className="product-inventory">
          <label>Price:</label>
          <input type="text" id="price" defaultValue="$"/>
        </div>
        <div className="product-inventory">
          <label>Product Name:</label>
          <input type="text" id="name" />
        </div>
        <div className="product-inventory">
          <label>Image URL:</label>
          <input type="text" id="image" />
        </div>

        <button>Add Product</button>
      </form>
    </section>
      
    );
  }
}


class ProductList extends React.Component {
  constructor() {
    super();
    this.state = { products: [] };
    this.addProduct = this.addProduct.bind(this);
  }

  componentDidMount(){
    this.loadData();
  }

  async loadData(){
    const query = `query {
      productList {
        id name  price category
        image 
      }
    }`;
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ query })
    });
    const result = await response.json();
    this.setState({ products: result.data.productList });
  }

  async addProduct(product) {
      // product.id = this.state.products.length + 1;
      // const newProductList = this.state.products.slice();
      // newProductList.push(product);
      // this.setState({ products: newProductList }); 

      // const query = `mutation {
      //   productAdd(product:{
      //     name: "${product.name}",
      //     price: "${product.price}",
      //     category: "${product.category}",
      //     image: "${product.image}",
      //   }) {
      //     id
      //   }
      // }`;

      const query = `mutation productAdd($product: ProductInputs!) {
        productAdd(product: $product) {
          id
        }
      }`;


      const response = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query , variables: { product }})
      });

      this.loadData();

  }

  render() {
    return (
      <React.Fragment>
        <h1>My Company Inventory</h1>
        <ProductTable products={this.state.products} />
        <ProductAdd addProduct={this.addProduct} />
      </React.Fragment>
    );
  }
}

const element = <ProductList />;
ReactDOM.render(element, document.getElementById('contents'));