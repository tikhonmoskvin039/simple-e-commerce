import {
  Badge,
  Button,
  Card,
  Image,
  List,
  message,
  Rate,
  Select,
  Spin,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addToCart,
  getAllProducts,
  getProductsByCategory,
} from "../../API/API.index";

const Products = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sortOrder, setSortOrder] = useState("az");

  const params = useParams();

  useEffect(() => {
    setLoading(true);
    (params?.categoryId
      ? getProductsByCategory(params.categoryId)
      : getAllProducts()
    ).then((res) => {
      setItems(res.products);
      setLoading(false);
    });
  }, [params]);

  if (loading) {
    return <Spin spinning />;
  }

  const getSortedItems = () => {
    const sortedItems = [...items];
    sortedItems.sort((a, b) => {
      const aLowerCaseTitle = a.title.toLowerCase()
      const bLowerCaseTitle = b.title.toLowerCase()
      if(sortOrder === 'az') {
        return aLowerCaseTitle > bLowerCaseTitle
          ? 1
          : aLowerCaseTitle === bLowerCaseTitle
          ? 0
          : -1;
      }
      else if(sortOrder === 'za') {
        return aLowerCaseTitle < bLowerCaseTitle
          ? 1
          : aLowerCaseTitle === bLowerCaseTitle
          ? 0
          : -1;
      }
      else if(sortOrder === 'lohi') {
        return a.price > b.price ? 1 : a.price === b.price ? 0 : -1;
      }
      else if(sortOrder === 'hilo') {
        return a.price < b.price ? 1 : a.price === b.price ? 0 : -1;
      }
    });
    return sortedItems
  };

  return (
    <div className="productsContainer">
      <div>
        <Typography.Text>View items sorted by: </Typography.Text>
        <Select
          defaultValue={"az"}
          onChange={(value) => {
            setSortOrder(value);
          }}
          options={[
            {
              label: "Alphabet a-z",
              value: "az",
            },
            {
              label: "Alphabet z-a",
              value: "za",
            },
            {
              label: "Price Low to High",
              value: "lohi",
            },
            {
              label: "Price High to Low",
              value: "hilo",
            },
          ]}
        ></Select>
      </div>
      <List
        grid={{ column: 3 }}
        renderItem={(product) => {
          return (
            <Badge.Ribbon
              className="itemCardBadge"
              key={product.id}
              text={`Discount ${product.discountPercentage.toFixed(0)}%`}
            >
              <Card
                className="itemCard"
                title={product.title}
                actions={[
                  <Rate value={product.rating} disabled allowHalf />,
                  <AddToCartButton item={product} />,
                ]}
                cover={
                  <Image className="itemCardImage" src={product.thumbnail} />
                }
              >
                <Card.Meta
                  title={
                    <Typography.Paragraph>
                      Price: ${product.price}{" "}
                      <Typography.Text
                        // style={{ color: "red", textDecoration: "line-through" }}
                        delete
                        type="danger"
                      >
                        $
                        {parseFloat(
                          product.price +
                            (product.price * product.discountPercentage) / 100
                        ).toFixed(0)}
                      </Typography.Text>
                    </Typography.Paragraph>
                  }
                  description={
                    <Typography.Paragraph
                      ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
                    >
                      {product.description}
                    </Typography.Paragraph>
                  }
                ></Card.Meta>
              </Card>
            </Badge.Ribbon>
          );
        }}
        dataSource={getSortedItems()}
      ></List>
    </div>
  );
};

const AddToCartButton = ({ item }) => {
  const [loading, setLoading] = useState(false);
  const addProductToCart = () => {
    setLoading(true);
    addToCart(item.id).then((res) => {
      message.success(`${item.title} has been added to cart`);
      setLoading(false);
    });
  };

  return (
    <Button loading={loading} type="link" onClick={addProductToCart}>
      Add to cart
    </Button>
  );
};

export default Products;
