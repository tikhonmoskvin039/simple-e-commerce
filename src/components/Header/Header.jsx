import { HomeFilled, ShoppingCartOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Checkbox,
  Drawer,
  Form,
  Input,
  InputNumber,
  Menu,
  message,
  Table,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart } from "../../API/API.index";

const Header = () => {
  const navigate = useNavigate();

  const onMenuClick = (item) => {
    navigate(`/${item.key}`);
  };

  return (
    <div className="appHeader">
      <Menu
        mode="horizontal"
        onClick={onMenuClick}
        items={[
          {
            label: <HomeFilled />,
            key: "",
          },
          {
            label: "Men",
            key: "men",
            children: [
              {
                label: "Men's Shirts",
                key: "mens-shirts",
              },
              {
                label: "Men's Shoes",
                key: "mens-shoes",
              },
              {
                label: "Men's Watches",
                key: "mens-watches",
              },
            ],
          },
          {
            label: "Women",
            key: "women",
            children: [
              {
                label: "Women's Dresses",
                key: "womens-dresses",
              },
              {
                label: "Women's Shoes",
                key: "womens-shoes",
              },
              {
                label: "Women's Watches",
                key: "womens-watches",
              },
              {
                label: "Women's Bags",
                key: "womens-bags",
              },
              {
                label: "Women's Jewellery",
                key: "womens-jewellery",
              },
            ],
          },
          {
            label: "Fragrances",
            key: "fragrances",
          },
        ]}
      />
      <Typography.Title>Ant D. store</Typography.Title>
      <AppCart />
    </div>
  );
};

const AppCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenNext, setIsOpenNext] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const onConfirmOrder = (values) => {
    setIsOpenNext(false)
    setIsOpen(false)
    message.success('Your order has been placed successfully')
  };

  useEffect(() => {
    getCart().then((res) => {
      setCartItems(res.products);
    });
  }, []);

  return (
    <div>
      <Badge
        style={{ cursor: "pointer" }}
        onClick={() => setIsOpen(true)}
        count={cartItems.length}
        className="shoppingCart"
      >
        <ShoppingCartOutlined style={{ cursor: "pointer" }} />
      </Badge>
      <Drawer
        onClose={() => setIsOpen(false)}
        open={isOpen}
        title="Your Cart"
        contentWrapperStyle={{ width: 500 }}
      >
        <Table
          pagination={false}
          columns={[
            {
              title: "Title",
              dataIndex: "title",
            },
            {
              title: "Price",
              dataIndex: "price",
              render: (price) => (
                <Typography key={price.id}>${price}</Typography>
              ),
            },
            {
              title: "Quantity",
              dataIndex: "quantity",
              render: (quantity, record) => (
                <InputNumber
                  key={record.id}
                  min={0}
                  onChange={(val) => {
                    setCartItems((pre) =>
                      pre.map((cart) => {
                        if (record.id === cart.id) {
                          cart.total = cart.price * val;
                        }
                        return cart;
                      })
                    );
                  }}
                  defaultValue={quantity}
                />
              ),
            },
            {
              title: "Total",
              dataIndex: "total",
              render: (total) => (
                <Typography key={total.id}>${total}</Typography>
              ),
            },
          ]}
          dataSource={cartItems}
          summary={(data) => {
            const total = data.reduce((acc, val) => {
              return acc + val.total;
            }, 0);
            return <Typography key={data.id}>Total: {total}$</Typography>;
          }}
        ></Table>
        <Button
          onClick={() => {
            setIsOpenNext(true);
          }}
          type="primary"
        >
          Checkout your cart
        </Button>
      </Drawer>
      <Drawer
        contentWrapperStyle={{ width: 500 }}
        title="Current Order"
        open={isOpenNext}
        onClose={() => setIsOpenNext(false)}
      >
        <Form onFinish={onConfirmOrder}>
          <Form.Item
            label="Full name"
            name="fullname"
            rules={[
              {
                required: true,
                message: "Please enter your full name.",
              },
            ]}
          >
            <Input placeholder="Enter your full name..." />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter your email.",
                type: "email",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter your email..." />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[
              {
                required: true,
                message: "Please enter your address.",
              },
            ]}
          >
            <Input placeholder="Enter your address..." />
          </Form.Item>
          <Form.Item>
            <Checkbox defaultChecked disabled>
              Cash on delivery
            </Checkbox>
          </Form.Item>
          <Typography.Paragraph type="secondary">
            More methods coming soon
          </Typography.Paragraph>
          <Button htmlType="submit" type="primary">
            Confirn order
          </Button>
        </Form>
      </Drawer>
    </div>
  );
};

export default Header;
