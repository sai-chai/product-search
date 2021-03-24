import Head from 'next/head';
import { restedFetch } from '../utils';

function ProductSearch(props) {
   return (
      <div>
         <Head>
            <title>FortyFive - Product Search</title>
            <link rel="icon" href="/favicon.ico" />
         </Head>

         <main>
            <table>
               <thead>
                  <tr>
                     <th>ID</th>
                     <th>Name</th>
                     <th>ABV</th>
                     <th>Vintage</th>
                  </tr>
               </thead>
               {props.products.length ? (
                  <tbody>
                     {props.products.map(product => (
                        <tr key={product.id}>
                           <td>{product.id}</td>
                           <td>{product.name}</td>
                           <td>{product.abv}</td>
                           <td>{product.vintage_year}</td>
                        </tr>
                     ))}
                  </tbody>
               ) : (
                  <tfoot>
                     <tr>
                        <td>No products found.</td>
                     </tr>
                  </tfoot>
               )}
            </table>
         </main>
      </div>
   );
}

export async function getServerSideProps(context) {
   let products = null;
   try {
      const res = await restedFetch('/products', {});
      products = await res.json();
   } catch (error) {
      products = [];
   }
   return {
      props: {
         products,
      },
   };
}

export default ProductSearch;
