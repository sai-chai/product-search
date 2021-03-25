import Head from 'next/head';
import { useRef, useReducer, KeyboardEvent, MouseEvent } from 'react';
import useSWR from 'swr';
import { ProductsRequestBody, Product } from './api/products';
import reducer, { initialState } from 'src/reducers/ProductSearch';
import actions from 'src/actions/ProductSearch';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function ProductSearch() {
   const [state, dispatch] = useReducer(reducer, initialState);
   const filterField = useRef(null);

   const reqParams: ProductsRequestBody = {
      query: {},
      ascending: state.isAscending,
      sortBy: state.sortBy,
      filter: state.filter,
   };
   useSWR<Product[]>(
      state.shouldFetch ? `/api/products?q=${JSON.stringify(reqParams)}` : null,
      fetcher,
      { onSuccess: newProducts => 
         dispatch(actions.updateProducts(newProducts)) },
   );

   const handleFilterEntry = (event: KeyboardEvent<HTMLInputElement> | MouseEvent<HTMLButtonElement>) => {
      if(
         event.target instanceof HTMLElement && event.target.id === "filterSubmit" || 
         'key' in event && event.key === "Enter"
      ) {
         dispatch(actions.changeFilter(filterField.current.value));
      }
   };

   const handleSwitchSortOrder = (event: KeyboardEvent<HTMLElement> | MouseEvent<HTMLElement>) => {
      if('key' in event && event.key === "Enter" || event.type === "click") {
         dispatch(actions.toggleSortOrder());
      }
   }

   const handleChangeSortField = (event: KeyboardEvent<HTMLElement> | MouseEvent<HTMLElement>) => {
      if(
         'key' in event && event.key === "Enter" || event.type === "click"
      ) {
         if(event.target instanceof HTMLElement) dispatch(actions.changeSortField(event.target.id));
      }
   }

   const headerArrow = (field: string) => 
      state.sortBy === field && (state.isAscending ? <>&#x2191;</> : <>&#x2193;</>);

   const headers = [
      ['id', 'ID'],
      ['name', 'Name'],
      ['abv', 'ABV'],
      ['vintage_year', 'Vintage']
   ];

   return (
      <div>
         <Head>
            <title>FortyFive - Product Search</title>
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <header>
            <img src="/public/wine-svgrepo-com.svg" alt="FortyFive logo" />
         </header>
         <main>
            <div>
               <input 
                  type="text" 
                  id="filter" 
                  name="filter" 
                  ref={filterField} 
                  onKeyPress={handleFilterEntry}
               />
               <button
                  type="button"
                  id="filterSubmit"
                  onClick={handleFilterEntry}
               >
                  Filter
               </button>
            </div>
            <table>
               <thead>
                  <tr>
                     {headers.map(h => (
                        <th
                           tabIndex={0}
                           key={h[0]}
                           id={h[0]}
                           onClick={ h[0] !== state.sortBy ? handleChangeSortField : handleSwitchSortOrder }
                           onKeyPress={ h[0] !== state.sortBy ? handleChangeSortField : handleSwitchSortOrder }
                        >{h[1]} {headerArrow(h[0])}</th>
                     ))}
                  </tr>
               </thead>
               {state.products.length ? (
                  <tbody>
                     {state.products.map(product => (
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

export default ProductSearch;
