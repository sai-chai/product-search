import * as qs from 'querystring';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export interface Product {
   _id: string;
   id: number;
   name: string;
   abv: string;
   vintage_year: string;
}

/**
 * @interface ProductsRequestBody
 * @property query - RestDB query object
 * @property hints - RestDB query hints, used for aggregation and projection
 * @property filter - text search query
 * @property sortBy - field to sort by
 * @property ascending - sort order
 * @property page
 * @property pageSize
 * @property groupBy - field to group documents by value
 */
export interface ProductsRequestBody {
   query: Object;
   hints?: Object;
   filter?: string;
   sortBy?: string;
   ascending?: boolean;
   page?: number;
   pageSize?: number;
   groupBy?: string;
}

const restDBUrl = 'https://sevenfiftyproducts-b8e9.restdb.io/rest';

const ProductsHandler: NextApiHandler<Product[]> = async (req, res) => {
   if (req.method === 'GET') {
      try {
         let {
            query,
            hints,
            sortBy,
            filter,
            page = 1,
            pageSize = 25,
            ascending,
            groupBy,
         } = JSON.parse(req.query.q.toString());

         const urlParams = qs.encode({
            filter,
            skip: (page - 1) * pageSize,
            max: pageSize,
            dir: ascending ? 1 : -1,
            groupBy,
            sort: sortBy,
         });
         query = JSON.stringify(query);
         hints = !!hints ? '&h=' + JSON.stringify(hints) : '';

         const fetchRes = await fetch(
            `${restDBUrl}/products?q=${query}${hints}&${urlParams}`,
            {
               headers: { 'x-apikey': process.env.API_KEY },
            },
         );

         const products = await fetchRes.json();

         res.status(200).json(products);
      } catch (error) {
         res.status(error.response?.statusCode || 404);
      }
   } else {
      res.status(405);
   }
}

export default ProductsHandler;