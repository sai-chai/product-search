import * as qs from 'querystring';
import { NextApiHandler } from 'next';
import Product, { ProductsRequestBody } from 'src/models/Product';

const restDBUrl = 'https://sevenfiftyproducts-b8e9.restdb.io/rest';

const ProductsHandler: NextApiHandler<Product[]> = async (req, res) => {
   /* eslint-disable prefer-const */
   if (req.method === 'GET') {
      try {
         let {
            query,
            hints,
            sortBy,
            filter,
            page = 1,
            pageSize = 25,
            isAscending,
            groupBy,
         } = JSON.parse(req.query.q.toString());

         const urlParams = qs.encode({
            filter,
            skip: (page - 1) * pageSize,
            max: pageSize,
            dir: isAscending ? 1 : -1,
            groupBy,
            sort: sortBy,
         });
         query = JSON.stringify(query);
         hints = hints ? `&h=${JSON.stringify(hints)}` : '';

         const fetchRes = await fetch(
            `${restDBUrl}/products?q=${query}${hints}&${urlParams}`,
            {
               headers: { 'x-apikey': process.env.API_KEY },
            },
         );
         const products = await fetchRes.json();

         res.status(200).json(products);
      } catch (error) {
         res.status(400).send([]);
      }
   } else {
      res.status(405).send([]);
   }
};

export default ProductsHandler;
