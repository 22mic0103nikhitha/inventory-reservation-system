"use client";

import { useEffect, useState } from "react";

type InventoryItem = {
  id: string;
  totalStock: number;
  reservedStock: number;

  product: {
    id: string;
    name: string;
    description: string;
  };

  warehouse: {
    id: string;
    name: string;
  };
};

export default function HomePage() {
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchProducts() {
    const response = await fetch("/api/products");
    const data = await response.json();
    setProducts(data);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function reserveProduct(
    productId: string,
    warehouseId: string
  ) {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            warehouseId,
            quantity: 1,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ||
          "Reservation failed"
        );
        return;
      }

      alert("Reservation Created");

      fetchProducts();

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-10">

      <h1 className="text-3xl font-bold mb-8">
        Inventory Reservation System
      </h1>

      <div className="space-y-8">

        {products.map((item) => {

          const available =
            item.totalStock -
            item.reservedStock;

          return (

            <div
              key={item.id}
              className="border p-5 rounded-lg"
            >

              <h2 className="text-2xl font-semibold">
                {item.product.name}
              </h2>

              <p className="text-gray-500 mb-4">
                {item.product.description}
              </p>

              <div
                className="
                  flex
                  justify-between
                  items-center
                  border
                  p-3
                  rounded-md
                "
              >

                <div>

                  <p>
                    Warehouse:
                    {" "}
                    <strong>
                      {item.warehouse.name}
                    </strong>
                  </p>

                  <p>
                    Available Stock:
                    {" "}
                    <strong>
                      {available}
                    </strong>
                  </p>

                </div>

                <button
                  onClick={() =>
                    reserveProduct(
                      item.product.id,
                      item.warehouse.id
                    )
                  }
                  disabled={
                    loading ||
                    available <= 0
                  }
                  className="
                    bg-black
                    text-white
                    px-4
                    py-2
                    rounded-md
                  "
                >
                  Reserve
                </button>

              </div>

            </div>

          );
        })}

      </div>

    </main>
  );
}