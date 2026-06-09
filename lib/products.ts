/** 商品定义：服务端权威价目表，前端只传 productType，金额以此为准，防止篡改 */
export type ProductType = "project_pack" | "diagram"

export interface Product {
  type: ProductType
  name: string
  /** 金额，单位：元，字符串保留两位小数 */
  price: string
}

export const PRODUCTS: Record<ProductType, Product> = {
  project_pack: {
    type: "project_pack",
    name: "SigmaPilot 完整项目包",
    price: "299.00",
  },
  diagram: {
    type: "diagram",
    name: "SigmaPilot 论文图示生成",
    price: "9.90",
  },
}

export function getProduct(type: string): Product | null {
  if (type in PRODUCTS) return PRODUCTS[type as ProductType]
  return null
}
